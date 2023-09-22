import h from 'hyperscript';
import {sprintf} from 'printj';

/* glue code */
export type Font = string;
export type Color = string;

export enum TextAlign {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center",
}

export class Bitmap {
    public img = new Image;

    constructor(src: string) {
        this.img.src = src;
    }
}

module strftime {
    const currentDate: Date = new Date();

    const days: Array<string> = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const months: Array<string> = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];

    // source: https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    function helper_dayOfYear(date: any) {
        const start: any = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // source: http://weeknumber.net/how-to/javascript
    function helper_weekOfYear(date_: Date): number {
        const date = new Date(date_.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    function helper_englishWeekOfYear(date: Date): number {
        let nr: number = helper_weekOfYear(date);
        if (date.getDay() === 0) {
            nr = nr - 1;
        }

        return nr;
    }

    export function parse(format: string, date?: Date) {
        if (!date) {
            date = currentDate;
        }

        const re = new RegExp("%[a-z]", "gi");
        let ret = format;

        let match;
        while (match = re.exec(format)) {
            ret = ret.replace(match[0], parse_segment(match[0], date));
        }

        return ret;
    }

    function parse_segment(segment: string, date?: Date) {
        if (!date) {
            date = currentDate;
        }
        const hm_segments = {
            "%a": function () {
                return days[date.getDay()].slice(0, 3);
            },
            "%A": function () {
                return days[date.getDay()];
            },
            "%b": function () {
                return days[date.getMonth()].slice(0, 3);
            },
            "%B": function () {
                return days[date.getMonth()];
            },
            "%c": function () {
                return date.toLocaleString();
            },
            "%C": function () {
                return Math.floor((date.getFullYear()) / 100).toString();
            },
            "%d": function () {
                return sprintf("%02d", [date.getDate()]);
            },
            "%D": function () {
                return parse("%m/%d/%y", date);
            },
            "%e": function () {
                return sprintf("%2d", [date.getDate()]);
            },
            "%F": function () {
                return parse("%Y-%m-%d", date);
            },
            "%g": function () {
                return sprintf("%02d", [date.getFullYear() % 1000]);
            },
            "%G": function () {
                return date.getFullYear().toString();
            },
            "%h": function () {
                return parse("%b", date);
            },
            "%H": function () {
                return sprintf("%02d", [date.getHours()]);
            },
            "%I": function () {
                return sprintf("%02d", [
                    (date.getHours() > 12 ? date.getHours() - 12 : date.getHours())
                ]);
            },
            "%j": function () {
                return sprintf("%03d", [helper_dayOfYear(date)]);
            },
            "%m": function () {
                return sprintf("%02d", [date.getMonth() + 1]);
            },
            "%M": function () {
                return sprintf("%02d", [date.getMinutes()]);
            },
            "%n": function () {
                return "\n";
            },
            "%p": function () {
                return (date.getHours() > 12 ? "PM" : "AM");
            },
            "%r": function () {
                return parse("%I:%M:%S %p", date);
            },
            "%R": function () {
                return parse("%H:%M", date);
            },
            "%S": function () {
                return date.getSeconds().toString();
            },
            "%t": function () {
                return "\t";
            },
            "%T": function () {
                return parse("%H:%M:%S", date);
            },
            "%u": function () {
                return sprintf("%02d", [(date.getDay() === 0 ? 7 : date.getDay())]);
            },
            "%U": function () {
                return sprintf("%02d", [helper_englishWeekOfYear(date)])
            },
            "%V": function () {
                return sprintf("%02d", [helper_weekOfYear(date)])
            },
            "%w": function () {
                return sprintf("%02d", [date.getDay().toString()]);
            },
            "%W": function () {
                return parse("%w", date);
            },
            "%x": function () {
                return parse("%m/%d/%G", date);
            },
            "%X": function () {
                return parse("%T", date);
            },
            "%y": function () {
                return parse("%g", date);
            },
            "%Y": function () {
                return parse("%G", date);
            },
            "%z": function () {
                return date.getTimezoneOffset().toString();
            },
            "%Z": function () {
                return date.toUTCString().split(' ').pop();
            }, //hack
            "%%": function () {
                return "%";
            }
        };

        if (!(segment in hm_segments)) {
            throw "unknown format argument '" + segment + "'";
        }
        return hm_segments[segment]();
    }
}

export class Gfx {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement, width = 296, height = 128) {
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        canvas.height = this.height;
        canvas.width = this.width;
        canvas.style.height = this.height + "px";
        canvas.style.width = this.width + "px";

        this.ctx.textBaseline = "top";
    }


    public print(x: number, y: number, font: Font, align: TextAlign, text: string) {
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    public printf(x: number, y: number, font: Font, text: string, ...args) {
        this.print(x, y, font, TextAlign.LEFT, sprintf(text, ...args))
    }

    public strftime(x: number, y: number, font: Font, text: string, date?: Date) {
        this.print(x, y, font, TextAlign.LEFT, strftime.parse(text, date))
    }

    public fill(color: Color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public draw_pixel_at(x: number, y: number, color: Color) {
        this.ctx.fillRect(x, y, 1, 1);
    }

    public rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x1, y1, width, height);
    }

    public filled_rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, width, height);
    }

    public image(x: number, y: number, image: Bitmap) {
        this.ctx.drawImage(image.img, x, y);
    }

    public line(x1: number, y1: number, x2: number, y2: number, color: Color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    public horizontal_line(x: number, y: number, width: number, color: Color = COLOR_ON) {
        this.line(x, y, x + width, y, color)
    }

    public verical_line(x: number, y: number, height: number, color: Color = COLOR_ON) {
        this.line(x, y, x, y + height, color)
    }

    public circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = color;
        this.ctx.stroke()
    }

    public filled_circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }


    public get_width(): number {
        return this.width
    }

    public get_height(): number {
        return this.height
    }

}

export class Sensor<T> {
    constructor(public name: string, public state: T = undefined) {
    }
}


export class BinarySensor extends Sensor<boolean> {
}

export class NumericSensor extends Sensor<number> {
}

class StringState extends String {
    constructor(public state: string = undefined) {
        super(state);
    }

    c_str() {
        return this.state;
    }
}

export class StringSensor extends Sensor<StringState> {
    constructor(public name: string, public input: string = undefined) {
        super(name, new StringState(input))
    }
}

export class TimeSensor extends Sensor<Date> {
    now() {
        return this.state
    }
}

export class UI {
    sensors: Sensor<any>[] = [];
    renderLoop: (i: Gfx) => void;
    gfx: Gfx;

    constructor(private rootElement: HTMLElement, height: number = 296, width: number = 128) {
        let canvas = rootElement.appendChild(document.createElement("canvas"));
        this.gfx = new Gfx(canvas, height, width);
    }

    public registerSensor(sensor: Sensor<any>) {
        this.sensors.push(sensor)
    }

    public registerRenderLoop(loop: (i: Gfx) => void) {
        this.renderLoop = loop;

    }

    public getCode(): string {
        let code = this.renderLoop.toString();

        // remove first and last line
        code = code.substring(code.indexOf("\n") + 1);
        code = code.substring(code.lastIndexOf("\n") + 1, -1)
        // fix text enum
        code = code.replace(/TextAlign\./g, "TextAlign::");
        // fix loop vars
        code = code.replace(/for \(var/g, "for (int");
        return code;

    }

    public run() {
        let mockSensors = h("div", {className: 'controls'},
            h("h2", "Mock Sensors"),
            h("p", h("small", "Sensors registered via ui.registerSensor can be adjusted below.")),
            h("dl",
                this.sensors.map(s => {

                    if (s instanceof BinarySensor) {
                        return [
                            h("dt", s.name, ": "),
                            h("dd", h("input", {
                                type: "checkbox", oninput:
                                    (e: InputEvent) => {
                                        s.state = (e.target as HTMLInputElement).checked
                                    }, checked: s.state
                            }))
                        ];
                    } else if (s instanceof NumericSensor) {
                        return [
                            h("dt", s.name, ": "),
                            h("dd", h("input", {
                                type: "number", oninput:
                                    (e: InputEvent) => {
                                        s.state = parseFloat((e.target as HTMLInputElement).value)
                                    }, value: s.state
                            }))
                        ]
                    }
                })));


        let code = h("div", {className: 'controls'},
            h("h2", "Formatted Code"),
            h("p", h("small", "The code below can be copied. Minor syntax fixes from JS to C were applied.")),
            h("textarea", {readOnly: true}, this.getCode())
        )

        this.rootElement.appendChild(mockSensors);
        this.rootElement.appendChild(code);

        this.run_loop()
    }

    public run_loop() {
        this.renderLoop(this.gfx);
        window.setTimeout(this.run_loop.bind(this), 500);
    }
}

export function id<T>(el: T): T {
    return el;
}

export const COLOR_OFF = "white"
export const COLOR_ON = "black"
