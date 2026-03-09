import * as Globals from "./Globals.js";

export function CreateStreamdeckButton(id) {
    const newElem = document.createElement("Div");

    newElem.classList += "buttonpannel-button unselectable";
    newElem.id = "Btn-" + id;

    newElem.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // stops browser default right-click menu

        Globals.SelectStreamdeckButton(newElem, id);

        Globals.elementContextMenu.style.display = "block";
        Globals.elementContextMenu.style.left = e.clientX + "px";
        Globals.elementContextMenu.style.top = e.clientY + "px";
    })

    Globals.elementBtnPanelPage.appendChild(newElem);
}