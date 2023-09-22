import {Sensor} from "./sensor.ts";
import h from "hyperscript";
import {UI} from "../../server/ui.ts";

export class BinarySensor extends Sensor<boolean> {
    render(ui: UI): HTMLInputElement {
        return h("input", {
            type: "checkbox",
            checked: this.state,
            oninput: (e: InputEvent) => {
                // Update our state
                this.state = (e.target as HTMLInputElement).checked

                // Force the UI to re-render
                ui.run_loop()
            }
        })
    }
}
