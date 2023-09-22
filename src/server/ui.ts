import h from 'hyperscript';
import {Sensor} from "../esphome/sensors/sensor.ts";
import {Gfx} from "../esphome/display.ts";
import {BinarySensor} from "../esphome/sensors/binary_sensor.ts";
import {NumericSensor} from "../esphome/sensors/numeric_sensor.ts";
import {StringSensor} from "../esphome/sensors/string_sensor.ts";
import './ui.css'

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
        code = code.replace(/for \((var|const|let)/g, "for (int");

        // fix variables
        code = code.replace(/(var|const|let) (.*) =/g, "auto $2 =");

        return code;
    }

    public run() {
        let mockSensors = h("div", {className: 'controls'},
            h("h2", "Mock Sensors"),
            h("p", h("small", "Sensors registered via ui.registerSensor can be adjusted below.")),
            h("dl", this.sensors.map(s => {
                if (s instanceof BinarySensor) {
                    return [h("dt", s.name, ": "), h("dd", s.render(this))];
                }

                if (s instanceof NumericSensor) {
                    return [h("dt", s.name, ": "), h("dd", s.render(this))]
                }

                if (s instanceof StringSensor) {
                    return [h("dt", s.name, ": "), h("dd", s.render(this))];
                }
            }))
        );

        let code = h("div", {className: 'controls'},
            h("h2", "Formatted Code"),
            h("p", h("small", "The code below can be copied. Minor syntax fixes from JS to C were applied.")),
            h("textarea", {readOnly: true, rows: 20, cols: 80}, this.getCode())
        )

        this.rootElement.appendChild(h('hr'));
        this.rootElement.appendChild(mockSensors);
        this.rootElement.appendChild(code);

        this.run_loop()
    }

    public run_loop() {
        // Clear the whole display, we cannot do partial updates
        this.gfx.clear();

        // Render everything
        this.renderLoop(this.gfx);

        // Re-render every 500ms
        window.setTimeout(this.run_loop.bind(this), 500);
    }
}
