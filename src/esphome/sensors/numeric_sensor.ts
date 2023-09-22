import {Sensor} from "./sensor.ts";
import h from "hyperscript";
import {UI} from "../../server/ui.ts";

export class NumericSensor extends Sensor<number> {
    render(ui: UI): HTMLInputElement {
        return h("input", {
            type: "number",
            value: this.state,
            oninput: (e: InputEvent) => {
                // Update our state
                this.state = parseFloat((e.target as HTMLInputElement).value)

                // Force the UI to re-render
                ui.run_loop()
            },
        })
    }
}
