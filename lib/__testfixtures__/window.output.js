import { setTimeout as Window_setTimeout, parseFloat as Window_parseFloat, closed_get as Window_closed_get } from "std:global/Window";
import { apply as Reflect_apply } from "std:global/Reflect";
Window_setTimeout(() => {
}, 3000);
const f = Window_parseFloat('5.5');
const a = Reflect_apply(Window_closed_get, window);
const b = Reflect_apply(Window_closed_get, window);
