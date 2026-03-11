
const macro = {}
const { exec } = require("child_process")

macro.KEYS = {

A: "a",
B: "b",
C: "c",
D: "d",
E: "e",
F: "f",
G: "g",
H: "h",
I: "i",
J: "j",
K: "k",
L: "l",
M: "m",
N: "n",
O: "o",
P: "p",
Q: "q",
R: "r",
S: "s",
T: "t",
U: "u",
V: "v",
W: "w",
X: "x",
Y: "y",
Z: "z",

NUM0: "0",
NUM1: "1",
NUM2: "2",
NUM3: "3",
NUM4: "4",
NUM5: "5",
NUM6: "6",
NUM7: "7",
NUM8: "8",
NUM9: "9",

ENTER: "Return",
ESC: "Escape",
TAB: "Tab",
SPACE: "space",
BACKSPACE: "BackSpace",

LEFT: "Left",
RIGHT: "Right",
UP: "Up",
DOWN: "Down",

HOME: "Home",
END: "End",
PAGEUP: "Page_Up",
PAGEDOWN: "Page_Down",
INSERT: "Insert",
DELETE: "Delete",

CTRL: "ctrl",
ALT: "alt",
SHIFT: "shift",

LEFTCTRL: "Control_L",
RIGHTCTRL: "Control_R",

LEFTSHIFT: "Shift_L",
RIGHTSHIFT: "Shift_R",

LEFTALT: "Alt_L",
RIGHTALT: "Alt_R",

SUPER: "Super_L",
SUPER_L: "Super_L",
SUPER_R: "Super_R",

MENU: "Menu",

CAPSLOCK: "Caps_Lock",
NUMLOCK: "Num_Lock",
SCROLLLOCK: "Scroll_Lock",

F1: "F1",
F2: "F2",
F3: "F3",
F4: "F4",
F5: "F5",
F6: "F6",
F7: "F7",
F8: "F8",
F9: "F9",
F10: "F10",
F11: "F11",
F12: "F12",

MINUS: "minus",
EQUAL: "equal",
COMMA: "comma",
PERIOD: "period",
SLASH: "slash",
BACKSLASH: "backslash",
SEMICOLON: "semicolon",
APOSTROPHE: "apostrophe",
GRAVE: "grave",
LEFTBRACKET: "bracketleft",
RIGHTBRACKET: "bracketright"

}

macro.PressKey = function(keyDelay, repeat, repeatDelay, ...keys) {
    exec(`ydotool key --key-delay ${keyDelay} --repeat ${repeat} --repeat-delay ${repeatDelay} ${keys.join("+")}`) // press A
}
macro.Delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



module.exports = macro;