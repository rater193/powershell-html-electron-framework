import * as Globals from "./Globals.js";
import { CreateStreamdeckButton } from "./StreamdeckElementConstructor.js";
import * as StreamdeckFramework from "./StreamdeckFramework.js";

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
    console.log("Right click menu action:", action);

    switch (action) {
        case "CreateGroup":
            Globals.GetSelectedStreamdeckButton().innerHTML = "";

            const newImgIcon = document.createElement("img");
            newImgIcon.src = "./img/icons/folder.png"
            newImgIcon.classList += "StreamdeckButton-Icon"
            Globals.GetSelectedStreamdeckButton().appendChild(newImgIcon);
            //alert("Delete clicked - ");
            break;
    }

    if (action === "edit") {
        alert("Edit clicked");
    } else if (action === "duplicate") {
        alert("Duplicate clicked");
    } else if (action === "delete") {
        Globals.GetSelectedStreamdeckButton().innerHTML = ""
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
