import {COLOR_ON, Font} from "./esphome/constants.ts";
import {NumericSensor} from "./esphome/sensors/numeric_sensor.ts";
import {StringSensor} from "./esphome/sensors/string_sensor.ts";
import {TimeSensor} from "./esphome/sensors/time_sensor.ts";
import {UI} from "./server/ui.ts";
import {id} from "./esphome/display.ts";

// mock the fonts registered in esphome, use the variable name as id
const roboto: Font = "20px Roboto"
const roboto16: Font = "16px Roboto"
const roboto12: Font = "12px Roboto"
const roboto10: Font = "10px Roboto"

// mock the sensor values / variables  registered in esphome, use the variable name as id
// the label and default state are only used in the mock gui.
const esp_wifi_rssi = new NumericSensor("Wifi Rssi", -60);
const outdoor_temperature = new NumericSensor("Outdoor", 21);
const downstairs_temperature = new NumericSensor("Indoor");
const config_version = new StringSensor("Version", 'v23.09.01');
const ntp = new TimeSensor("Time");

// initialize the gui, set the screen size
let ui = new UI(document.getElementById("app"), 296, 128);

// add controls for the sensors to the mock gui
ui.registerSensor(esp_wifi_rssi);
ui.registerSensor(outdoor_temperature);
ui.registerSensor(downstairs_temperature);
ui.registerSensor(config_version);

// this is the render loop. Enter the code for the esphome display lambda function here.
ui.registerRenderLoop(it => {
    // Draw config version
    it.printf(it.get_width() / 2 - 20, 4, id(roboto12), "%s", id(config_version).state.c_str());

    // Setup information box
    it.rectangle(3, it.get_height() / 2 - 40, it.get_width() - 6, 80, COLOR_ON);

    // Setup last update info
    it.strftime(195, it.get_height() - 15, id(roboto12), "Updated: %H:%M:%S", id(ntp).now());

    // Setup Wi-Fi
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2 * (i + 1); j++) {
            if (id(esp_wifi_rssi).state / -1.2 > i * 25 || j == 0) {
                it.line(5 + 4 * i, 10 - j, 5 + 4 * i, (10 - j) + 4, COLOR_ON);
                it.line((5 + 4 * i) + 1, 10 - j, (5 + 4 * i) + 1, (10 - j) + 4, COLOR_ON);
            }
        }
    }

    // Actually show some useful stuff
    if (id(outdoor_temperature).has_state()) {
        it.printf(8, 30, id(roboto12), "Outside: %.1f°C", id(outdoor_temperature).state);
    } else {
        it.printf(8, 30, id(roboto12), "Outside: ...");
    }

    if (id(downstairs_temperature).has_state()) {
        it.printf(8, 45, id(roboto12), "Indoors: %.1f°C", id(downstairs_temperature).state);
    } else {
        it.printf(8, 45, id(roboto12), "Indoors: ...");
    }

});

// render the ui
ui.run();
