import { setTimeout as Window_setTimeout, parseFloat as Window_parseFloat, alert as Window_alert, closed_get as Window_closed_get, status_set as Window_status_set, status_get as Window_status_get, navigator_get as Window_navigator_get } from "std:global/Window";
Window_setTimeout(() => {
}, 3000);
const f = Window_parseFloat('5.5');
const a = Window_closed_get();
Window_status_set('open');
Window_status_set('closed');
const s = Window_status_get();
const bat = Window_navigator_get().getBattery();
Window_alert(Window_status_get());
