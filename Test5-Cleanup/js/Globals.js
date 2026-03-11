

export const elementContextMenu = document.getElementById("contextMenu");
export const elementBtnPanelPage = document.getElementById("page-buttonpanel");
export const elmentContextMenu = document.getElementById("page-buttonpanel");
export const elementSidebarBtnConfigureStreamdeck = document.getElementById("Btn-Sidebar-ConfigureStreamdeck");
export const elementSidebarBtnEditActions = document.getElementById("Btn-Sidebar-EditActions");
export const elementSidebarBtnSettings = document.getElementById("Btn-Sidebar-Settings");
export const elementInspector = document.getElementById("inspector");


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