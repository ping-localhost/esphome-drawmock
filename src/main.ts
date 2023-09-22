import {COLOR_ON, Font, id, NumericSensor, StringSensor, TextAlign, TimeSensor, UI} from './display.ts';

// mock the fonts registered in esphome, use the variable name as id
const roboto: Font = "20px Roboto"
const roboto16: Font = "16px Roboto"
const roboto12: Font = "12px Roboto"
const roboto10: Font = "10px Roboto"

// mock the sensor values / variables  registered in esphome, use the variable name as id
// the label and default state are only used in the mock gui.
const esp_wifi_rssi = new NumericSensor("Wifi Rssi", -90);
const temp_outdoor = new NumericSensor("Outdoor", 16);
const downstairs_temp = new NumericSensor("Indoor", 21);
const config_version = new StringSensor("Version", 'v23.09.01');
const ntp = new TimeSensor("Time", new Date());

// initialize the gui, set the screen size
let ui = new UI(document.getElementById("app"), 296, 128);

// add controls for the sensors to the mock gui
ui.registerSensor(esp_wifi_rssi);
ui.registerSensor(temp_outdoor);
ui.registerSensor(downstairs_temp);

// this is the render loop. Enter the code for the esphome display lambda function here.
ui.registerRenderLoop(it => {
    it.clear();

    it.printf(it.get_width() / 2 - 20, 4, id(roboto12), "%s", id(config_version).state.c_str());
    it.rectangle(3, it.get_height() / 2 - 40, it.get_width() - 6, 80, COLOR_ON);
    it.printf(8, 30, id(roboto12), "Outside: %.1f°C", id(temp_outdoor).state);
    it.printf(8, 45, id(roboto12), "Indoors: %.1f°C", id(downstairs_temp).state);
    it.strftime(it.get_width() - 115, it.get_height() - 15, id(roboto12), "Updated: %I:%M:%S%p", id(ntp).now());

    // Note: Not all syntax is equivalent between C<->Typescript
    // replace the int with var in the loops and reverse
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2 * (i + 1); j++) {
            if (id(esp_wifi_rssi).state / -1.2 > i * 25 || j == 0) {
                it.draw_pixel_at(5 + 2 * i, 10 - j, COLOR_ON);
            }
        }
    }
});


// render the ui
ui.run();


