import {COLOR_OFF, COLOR_ON, Font, TextAlign} from "./esphome/constants.ts";
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
const mdi: Font = "10px Material Icons"

// mock the sensor values / variables  registered in esphome, use the variable name as id
// the label and default state are only used in the mock gui.
const esp_wifi_rssi = new NumericSensor("Wifi Rssi", -60);
const outdoor_temperature = new NumericSensor("Outdoor", 21);
const outdoor_humidity = new NumericSensor("Outdoor", 82);
const downstairs_temperature = new NumericSensor("Indoor", 22);
const downstairs_humidity = new NumericSensor("Outdoor", 61);
const config_version = new StringSensor("Version", 'v23.09.01');
const homeassistant_time = new TimeSensor("Time");
const initial_data_received = true;

// initialize the gui, set the screen size
const ui = new UI(document.getElementById("app"), 296, 128);

// add controls for the sensors to the mock gui
ui.registerSensor(esp_wifi_rssi);
ui.registerSensor(outdoor_temperature);
ui.registerSensor(downstairs_temperature);
ui.registerSensor(config_version);

// this is the render loop. Enter the code for the esphome display lambda function here.
ui.registerRenderLoop(it => {
    const xcenter = it.get_width() / 2, ycenter = it.get_height() / 2

    // Show loading screen before data is received.
    if (id(initial_data_received) == false) {
        // Paint it all black
        it.fill(COLOR_ON);

        // Make it nice
        it.rectangle(3, 20, it.get_width() - 6, 80, COLOR_OFF);

        // Show we are loading
        it.print(xcenter, it.get_height() / 2 - 12, id(roboto), COLOR_OFF, TextAlign.CENTER, "Awaiting data....");

        return;
    }

    // Setup information box
    it.rectangle(0, 0, it.get_width(), it.get_height(), COLOR_ON);
    it.rectangle(3, 20, it.get_width() - 6, 80, COLOR_ON);

    // Draw config version
    it.printf(it.get_width() / 2 - 20, 5, id(roboto10), "%s", id(config_version).state.c_str());

    // Setup last update info
    if (id(homeassistant_time).is_ready()) {
        it.strftime(210, it.get_height() - 20, id(roboto10), "Updated: %H:%M:%S", id(homeassistant_time).now());
    }

    // Setup Wi-Fi
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2 * (i + 1); j++) {
            if (id(esp_wifi_rssi).state / -1.2 > i * 25 || j == 0) {
                const x1 = 6 + 4 * i, y1 = 10 - j;

                it.line(x1, y1, x1, y1 + 4, COLOR_ON);
                it.line(x1 + 1, y1, x1 + 1, y1 + 4, COLOR_ON);
            }
        }
    }

    it.print(10, 26, id(roboto12), "Indoors");
    it.printf(15, 40, id(roboto12), "%.1f°C", id(downstairs_temperature).state);
    it.printf(15, 55, id(roboto12), "%.1f%%", id(downstairs_humidity).state);

    it.vertical_line(xcenter, 20, it.get_height() - 48)

    it.print(xcenter + 10, 26, id(roboto12), "Outside");
    it.printf(xcenter + 15, 40, id(roboto12), "%.1f°C", id(outdoor_temperature).state);
    it.printf(xcenter + 15, 55, id(roboto12), "%.1f%%", id(outdoor_humidity).state);

    it.print(60, 80, id(mdi), TextAlign.LEFT, "U000F1C4D");
});

// render the ui
ui.run();
