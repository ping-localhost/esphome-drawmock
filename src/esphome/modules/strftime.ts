import {sprintf} from "printj";

export module strftime {
    const days: Array<string> = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const months: Array<string> = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];

    function _dayOfYear(date: any): number {
        const start: any = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function _weekOfYear(date_: Date): number {
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

    function _englishWeekOfYear(date: Date): number {
        let nr: number = this._weekOfYear(date);
        if (date.getDay() === 0) {
            nr = nr - 1;
        }

        return nr;
    }

    function _parse_segment(segment: string, date?: Date) {
        if (!date) {
            date = new Date();
        }

        const hm_segments = {
            "%a": () => {
                return this.days[date.getDay()].slice(0, 3);
            },
            "%A": () => {
                return this.days[date.getDay()];
            },
            "%b": () => {
                return this.months[date.getMonth()].slice(0, 3);
            },
            "%B": () => {
                return this.months[date.getMonth()];
            },
            "%c": () => {
                return date.toLocaleString();
            },
            "%C": () => {
                return Math.floor((date.getFullYear()) / 100).toString();
            },
            "%d": () => {
                return sprintf("%02d", [date.getDate()]);
            },
            "%D": () => {
                return this.parse("%m/%d/%y", date);
            },
            "%e": () => {
                return sprintf("%2d", [date.getDate()]);
            },
            "%F": () => {
                return this.parse("%Y-%m-%d", date);
            },
            "%g": () => {
                return sprintf("%02d", [date.getFullYear() % 1000]);
            },
            "%G": () => {
                return date.getFullYear().toString();
            },
            "%h": () => {
                return this.parse("%b", date);
            },
            "%H": () => {
                return sprintf("%02d", [date.getHours()]);
            },
            "%I": () => {
                return sprintf("%02d", [
                    (date.getHours() > 12 ? date.getHours() - 12 : date.getHours())
                ]);
            },
            "%j": () => {
                return sprintf("%03d", [this._dayOfYear(date)]);
            },
            "%m": () => {
                return sprintf("%02d", [date.getMonth() + 1]);
            },
            "%M": () => {
                return sprintf("%02d", [date.getMinutes()]);
            },
            "%n": () => {
                return "\n";
            },
            "%p": () => {
                return (date.getHours() > 12 ? "PM" : "AM");
            },
            "%r": () => {
                return this.parse("%I:%M:%S %p", date);
            },
            "%R": () => {
                return this.parse("%H:%M", date);
            },
            "%S": () => {
                return sprintf("%02d", [date.getSeconds()]);
            },
            "%t": () => {
                return "\t";
            },
            "%T": () => {
                return this.parse("%H:%M:%S", date);
            },
            "%u": () => {
                return sprintf("%02d", [(date.getDay() === 0 ? 7 : date.getDay())]);
            },
            "%U": () => {
                return sprintf("%02d", [this._englishWeekOfYear(date)])
            },
            "%V": () => {
                return sprintf("%02d", [this._weekOfYear(date)])
            },
            "%w": () => {
                return sprintf("%02d", [date.getDay().toString()]);
            },
            "%W": () => {
                return this.parse("%w", date);
            },
            "%x": () => {
                return this.parse("%m/%d/%G", date);
            },
            "%X": () => {
                return this.parse("%T", date);
            },
            "%y": () => {
                return this.parse("%g", date);
            },
            "%Y": () => {
                return this.parse("%G", date);
            },
            "%z": () => {
                return date.getTimezoneOffset().toString();
            },
            "%Z": () => {
                return date.toUTCString().split(' ').pop();
            },
            "%%": () => {
                return "%";
            }
        };

        if (!(segment in hm_segments)) {
            throw "unknown format argument '" + segment + "'";
        }

        return hm_segments[segment]();
    }

    export function parse(format: string, date?: Date) {
        if (!date) {
            date = new Date();
        }

        const re = new RegExp("%[a-z]", "gi");
        let ret = format;

        let match: string[];
        while (match = re.exec(format)) {
            ret = ret.replace(match[0], _parse_segment(match[0], date));
        }

        return ret;
    }
}
