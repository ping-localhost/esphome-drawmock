export class Sensor<T> {
    constructor(public name: string, public state: T = undefined) {
    }

    has_state(): boolean {
        return !!this.state
    }

    is_ready() {
        return true;
    }
}
