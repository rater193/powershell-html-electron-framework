import * as Globals from "./Globals.js";

export let inspector = {};

inspector.Clear = function() {
    Globals.elementInspector.innerHTML = "";
}

inspector.AddInputField = function(title) {
    let inputStorage = document.createElement("div");
    inputStorage.classList += "inspector-row";

    let titleStorage = document.createElement("div");
    titleStorage.classList += "inspector-title";
    titleStorage.innerHTML = title;
    inputStorage.appendChild(titleStorage);

    let inputField = document.createElement("input");
    inputStorage.classList += "inspector-inputfield-text"
    inputStorage.appendChild(inputField);

    Globals.elementInspector.appendChild(inputStorage);
};