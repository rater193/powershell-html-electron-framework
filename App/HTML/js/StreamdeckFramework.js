import * as Globals from "./Globals.js";
import * as StreamdeckElementConstructor from "./StreamdeckElementConstructor.js";
import * as StreamdeckPage from "./StreamdeckPage.js"

let buttons = [];

export function OpenInspectorForButton(id) {
    try {
        StreamdeckPage.ShowInspector(id);
    }catch(e){
        alert(e);
    }
}

export function ClearInspector() {
    Globals.elementInspector.innerHTML = "";
}

let test = 0;

export function ResetButtonLayout(width, height) {
    StreamdeckElementConstructor.ClearStreamdeckButtons();
    buttons = [];
    for (let i = 0; i < width * height; i++) {
        const button = {};
        button.icon = "";
        button.text = "";
        button.id = i;
        button.executedFunction = null;
        button.element = StreamdeckElementConstructor.CreateStreamdeckButton(i);

        button.element.addEventListener('click', function () {
            if(button.executedFunction) {
                OpenInspectorForButton(i)
            }
        });

        button.element.addEventListener('dblclick', function () {
            if(button.executedFunction) {
                ClearInspector();
                button.executedFunction(button.id)
            }
        });

        button.Update = function () {
            //Clearing the element
            let btn = buttons[i];
            btn.element.innerHTML = "";

            //Setting the icon
            if (btn.icon != "") {
                const newImgIcon = document.createElement("img");
                newImgIcon.src = btn.icon
                newImgIcon.classList += "StreamdeckButton-Icon"
                btn.element.appendChild(newImgIcon);
            }
        }

        try {
        window.electron.triggerAction({ action: "clearSlot", id: i}).then(res => {});
        }catch(e){
            alert(e);
        }
        buttons[i] = button;
    }
}

export function Getbutton(id) {
    return buttons[id];
}

export function DeleteButton(id) {
    buttons[Number(id)].text = "";
    buttons[Number(id)].icon = "";
    buttons[Number(id)].executedFunction = null;
    buttons[Number(id)].element.innerHTML = "";

    window.electron.triggerAction({ action: "clearSlot", id: id}).then(res => {});
}

export function SetButton(id, icon, text, executedFunction) {
    //Updating internal references
    buttons[Number(id)].text = text;
    buttons[Number(id)].icon = icon;
    buttons[Number(id)].executedFunction = executedFunction;

    //Updating the button
    buttons[Number(id)].Update();

    return buttons[Number(id)];
}


document.addEventListener('DOMContentLoaded', () => {
    ResetButtonLayout(8, 4);
});