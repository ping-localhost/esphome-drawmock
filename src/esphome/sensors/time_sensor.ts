import {Sensor} from "./sensor.ts";

export class TimeSensor extends Sensor<Date> {
    constructor(public name: string) {
        super(name);
    }

    now() {
        return new Date()
    }
}
