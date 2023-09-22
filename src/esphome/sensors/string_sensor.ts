import {Sensor} from "./sensor.ts";
import {UI} from "../../server/ui.ts";
import h from "hyperscript";

export class StringSensor extends Sensor<StringState> {
    constructor(public name: string, public input: string = undefined) {
        super(name, new StringState(input))
    }

    render(ui: UI): HTMLInputElement {
        return h("input", {
            type: "text",
            value: this.state,
            oninput: (e: InputEvent) => {
                // Update our state
                this.state = new StringState((e.target as HTMLInputElement).value);

                // Force the UI to re-render
                ui.run_loop()
            },
        })
    }
}

class StringState extends String {
    constructor(public state: string = undefined) {
        super(state);
    }

    c_str() {
        return this.state;
    }
}
