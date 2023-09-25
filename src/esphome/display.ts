import {sprintf} from 'printj';
import {Bitmap, Color, COLOR_ON, Font, TextAlign} from "./constants.ts";
import {strftime} from "./modules/strftime.ts";
import {GraphSensor} from "./sensors/graph_sensor.ts";

export class Gfx {
    private ctx: CanvasRenderingContext2D;
    private readonly width: number;
    private readonly height: number;

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

    private getFontSizeToFit(text: string, fontFace: string, maxWidth: number) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = `1px ${fontFace}`;
        return maxWidth / ctx.measureText(text).width;
    }

    print(x: number, y: number, font: Font, color: Color, align: TextAlign, text: string): void
    print(x: number, y: number, font: Font, color: Color, text: string): void;
    print(x: number, y: number, font: Font, align: TextAlign, text: string): void;
    print(x: number, y: number, font: Font, text: string): void;
    print(x: number, y: number, font: Font, option1: Color | TextAlign | string, option2?: Color | TextAlign | string, text?: string): void {
        this.ctx.save();

        // Set the font and alignment based on the arguments
        this.ctx.font = font;

        // Set defaults
        this.ctx.textAlign = TextAlign.LEFT;
        this.ctx.fillStyle = COLOR_ON;

        // Magic to ensure overloading works
        if (Object.values(Color).includes(option1 as Color)) {
            this.ctx.fillStyle = option1;
        } else if (Object.values(TextAlign).includes(option1 as TextAlign)) {
            this.ctx.textAlign = option1 as TextAlign;
        } else if (typeof option1 === 'string') {
            text = option1;
        }
        if (option2 !== undefined) {
            if (Object.values(Color).includes(option2 as Color)) {
                this.ctx.fillStyle = option2;
            } else if (Object.values(TextAlign).includes(option2 as TextAlign)) {
                this.ctx.textAlign = option2 as TextAlign;
            } else if (typeof option2 === 'string') {
                text = option2;
            }
        }

        // Replace codepoints
        text = text.replace(/U([0-9A-Fa-f]{8})/g, function (_, hex) {
            return String.fromCodePoint(parseInt(hex, 16));
        });

        // Draw the text
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    public printf(x: number, y: number, font: Font, text: string, ...args: any[]) {
        this.print(x, y, font, sprintf(text, ...args))
    }

    public strftime(x: number, y: number, font: Font, text: string, date?: Date) {
        this.print(x, y, font, strftime.parse(text, date))
    }

    public fill(color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    public clear() {
        this.ctx.save()

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    public draw_pixel_at(x: number, y: number, color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);

        this.ctx.restore()
    }

    public rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.save()

        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x1, y1, width, height);

        this.ctx.restore()
    }

    public filled_rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, width, height);

        this.ctx.restore()
    }

    public image(x: number, y: number, image: Bitmap) {
        this.ctx.drawImage(image.img, x, y);
    }


    public graph(x1: number, y1: number, sensor: GraphSensor, color: Color = COLOR_ON) {
        this.ctx.save();

        // Calculate centers
        const y1center = (y1 + sensor.height / 2);
        const x1center = (x1 + sensor.width / 2);

        // Draw the rectangle
        this.rectangle(x1, y1, sensor.width, sensor.height, color)

        // Add x-axis
        this.horizontal_line(x1, y1center - sensor.height / 4, sensor.width)
        this.horizontal_line(x1, y1center, sensor.width)
        this.horizontal_line(x1, y1center + sensor.height / 4, sensor.width)

        // Add y-axis
        this.vertical_line(x1center - sensor.width / 4, y1, sensor.height)
        this.vertical_line(x1center, y1, sensor.height)
        this.vertical_line(x1center + sensor.width / 4, y1, sensor.height)

        // Add simple text
        this.ctx.translate(x1center, y1center);
        this.ctx.rotate(-Math.PI / 6);
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Example', 2, 0);

        this.ctx.restore();
    }

    public line(x1: number, y1: number, x2: number, y2: number, color: Color) {
        this.ctx.save()

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.restore()
    }

    public horizontal_line(x: number, y: number, width: number, color: Color = COLOR_ON) {
        this.line(x, y, x + width, y, color)
    }

    public vertical_line(x: number, y: number, height: number, color: Color = COLOR_ON) {
        this.line(x, y, x, y + height, color)
    }

    public circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.save()

        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = color;
        this.ctx.stroke()

        this.ctx.restore()
    }

    public filled_circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.save()

        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        this.ctx.restore()
    }

    public get_width(): number {
        return this.width
    }

    public get_height(): number {
        return this.height
    }

}

export function id<Sensor>(el: Sensor): Sensor {
    return el;
}
