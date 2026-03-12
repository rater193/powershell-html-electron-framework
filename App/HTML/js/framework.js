import * as Globals from "./Globals.js";
import * as StreamdeckPage from "./StreamdeckPage.js";
import * as InspectorConstructor from "./InspectorConstructor.js";

// Hide menu if clicking elsewhere
document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu") && !e.target.closest(".button")) {
        hideMenu();
    }
});

Globals.elementContextMenu.addEventListener("click", function (e) {
    const item = e.target.closest(".menu-item");
    if (!item) return;

    const action = item.dataset.action;
    const buttonID = Globals.GetSelectedStreamdeckButtonID();
    console.log("Right click menu action:", action);
    switch (action.toLocaleLowerCase()) {
        case "creategroup":
            StreamdeckPage.GetSelectedPage().SetPage(buttonID)

            /*
            StreamdeckFramework.SetButton(Globals.GetSelectedStreamdeckButtonID(), "./img/icons/folder.png", "", function () {

            })*/
            break;

        case "setkeybind":
            StreamdeckPage.GetSelectedPage().SetButton(buttonID);
            break;

        case "copy":
            break;

        case "paste":
            break;

        case "delete":
            StreamdeckPage.GetSelectedPage().DeleteNode(buttonID);
            InspectorConstructor.inspector.Clear()
            break;
    }

    hideMenu();
});


// Hide menu on escape
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        hideMenu();
    }
});

function hideMenu() {
    Globals.elementContextMenu.style.display = "none";
}

//
import "./dndFramework.js";
