

export const elementContextMenu = document.getElementById("contextMenu");
export const elementBtnPanelPage = document.getElementById("page-buttonpanel");
export const elmentContextMenu = document.getElementById("page-buttonpanel");


let targetStreamdeckButton = null;
let targetStreamdeckButtonID = null;

export function SelectStreamdeckButton(elem, id) {
    targetStreamdeckButton = elem;
    targetStreamdeckButtonID = id;
}

export function GetSelectedStreamdeckButton() {
    return targetStreamdeckButton;
}

export function GetSelectedStreamdeckButtonID() {
    return targetStreamdeckButtonID;
}