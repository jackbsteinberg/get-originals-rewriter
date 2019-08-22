import { setTimeout as Window_setTimeout, parseFloat as Window_parseFloat, alert as Window_alert, closed_get as Window_closed_get, status_set as Window_status_set, status_get as Window_status_get, navigator_get as Window_navigator_get } from "std:global/Window";
import { apply as Reflect_apply } from "std:global/Reflect";
Window_setTimeout(() => {
}, 3000);
const f = Window_parseFloat('5.5');
const a = Reflect_apply(Window_closed_get, window);
Reflect_apply(Window_status_set, window, ['open']);
Reflect_apply(Window_status_set, window, ['closed']);
const s = Reflect_apply(Window_status_get, window);
const bat = Reflect_apply(Window_navigator_get, window).getBattery();
Window_alert(Reflect_apply(Window_status_get, window));
