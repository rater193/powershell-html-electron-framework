let {randomUUID} = require("crypto");
const streamdeck = require("./streamdeck");
const registry = require("./registry");
const macro = require("./macro");
const { register } = require("module");
const pages = {}
const pageStorage = []
pages.selectedPage = null;
pages.size = 32


pages.CreatePage = function() {
    let page = {};
    page.ID = randomUUID();
    page.Name = "UNDEFINED";
    page.buttonConfig = [];

    page.SetButton = function(index, text, buttonFunction, icon) {
        page.buttonConfig[index] = {
            "text": text,
            "func": buttonFunction,
            "icon": icon
        }
    }

    page.Render = async function() {
        for(let i = 0; i < pages.size; i++) {
            if(page.buttonConfig[i]) {
                //await streamdeck.SetKey(i, page.buttonConfig[i].text)
                await streamdeck.SetKeyImage(i, page.buttonConfig[i].text, page.buttonConfig[i].icon)
            }else{
                await streamdeck.ClearKey(Number(i));
            }
        } 
    }

    pageStorage.push(page);

    return page;
}

pages.OpenPage = function(guid) {
    console.log("Open page: " + guid)
    for(let page in pageStorage) {
        if(page.ID == guid) {
            pages.selectedPage = page
            page.Render();
            break;
        }
    }
}



//Creating a test page that we can navigate to
let testPage = pages.CreatePage()
//Create a button to go back to the other page
testPage.SetButton(2, "Back", () => {
    pages.selectedPage = pages.defaultPage;
    pages.defaultPage.Render();
}, "Folder")



//Creating a test page that we can navigate to
let pageCleanfall = pages.CreatePage()
//Create a button to go back to the other page
pageCleanfall.SetButton(31, "Back", () => {
    pages.selectedPage = pages.defaultPage;
    pages.defaultPage.Render();
}, "Folder")


// Creating the hello world button
pageCleanfall.SetButton(0, "F\nWay\nFinder", async function(key) {
    console.log("Button pressed: " + key)
},"KeyCap")

// Creating the hello world button
pageCleanfall.SetButton(1, "TAB\nWeapon Wheel", async function(key) {
    console.log("Button pressed: " + key)
},"KeyCap")








pages.defaultPage = pages.CreatePage();

// Creating the hello world button
pages.defaultPage.SetButton(0, "Hello\nWorld", async function(key) {
    console.log("Button pressed: " + key)
    macro.PressKey(500,5,850,macro.KEYS.A,macro.KEYS.CTRL,macro.KEYS.D)
},"KeyCap")

// Creating the hello world button
pages.defaultPage.SetButton(1, "clear", async function(key) {
    console.log("Button pressed: " + key)
    streamdeck.ClearKey(0)
    streamdeck.ClearKey(1)
    streamdeck.ClearKey(3)
})

// Creating the test button to goto another folder
pages.defaultPage.SetButton(3, "test", function(key) {
    pages.selectedPage = testPage;
    testPage.Render();
},"Folder")

// Creating the test button to goto another folder
pages.defaultPage.SetButton(4, "CleanFall", function(key) {
    pages.selectedPage = pageCleanfall;
    pageCleanfall.Render();
},"Folder")







registry.OnAppStart.register(() => {
    console.log("App started, rendering stream deck")
    pages.selectedPage = pages.defaultPage;
    pages.defaultPage.Render();
})

registry.OnKeyPress.register((index) => {
    if(pages.selectedPage.buttonConfig[index]) {
        if(pages.selectedPage.buttonConfig[index].func) {
            pages.selectedPage.buttonConfig[index].func(index)
        }
    }
})

module.exports = pages;