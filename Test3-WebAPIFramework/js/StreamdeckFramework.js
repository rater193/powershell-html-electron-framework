import * as Globals from "./Globals.js";
import * as StreamdeckElementConstructor from "./StreamdeckElementConstructor.js";

let buttons = [];

export function ResetButtonLayout(width, height) {
    buttons = [];
    for (let i = 0; i < width * height; i++) {
        let button = {};
        button.icon = "";
        button.text = "";
        button.id = i;
        button.executedFunction = null;
        button.element = StreamdeckElementConstructor.CreateStreamdeckButton(i);
        button.Update = function () {
            //Clearing the element
            button.element.innerHTML = "";

            //Setting the icon
            if(button.icon != "") {
                const newImgIcon = document.createElement("img");
                newImgIcon.src = button.icon
                newImgIcon.classList += "StreamdeckButton-Icon"
                button.element.appendChild(newImgIcon);
            }
        }

        buttons[i] = button;
    }
}

export function Getbutton(id) {
    return buttons[id];
}

export function DeleteButton(id) {
    buttons[id].text = "";
    buttons[id].icon = "";
    buttons[id].executedFunction = "";
    buttons[id].element.innerHTML = "";
}

export function SetButton(id, icon, text, executedFunction) {

    //Updating internal references
    buttons[id].text = text;
    buttons[id].icon = icon;
    buttons[id].executedFunction = executedFunction;

    //Updating the button
    buttons[id].Update();

    return buttons[id];
}

ResetButtonLayout(8, 4);