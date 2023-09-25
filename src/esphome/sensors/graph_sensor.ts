import {Sensor} from "./sensor.ts";
import h from "hyperscript";
import {UI} from "../../server/ui.ts";

export class GraphSensor extends Sensor<Array<string>> {
    constructor(public name: string, public width: number, public height: number, public state: Array<string> = undefined) {
        super(name, state);
    }
}
