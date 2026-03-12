const { app, BrowserWindow, ipcMain } = require("electron");
const macro = require("../macro/macro.js");
const KeyCodes = require("../KeyCodes.js");

const sharp = require("sharp");
const { listStreamDecks, openStreamDeck } = require("@elgato-stream-deck/node");

//const registry = require("./registry")
//const backend = require("./streamdeck-backend")
const path = require("path");

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 480,
        backgroundColor: "#0f1115",
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });


    const win2 = new BrowserWindow({
        width: 80,
        height: 80,
        backgroundColor: "#0f1115",
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win2.hide();

    win2.capturePage()



    win.loadFile(path.join(__dirname, "../../HTML", "index.html"));

    //await backend.initStreamDeck();
    // Helpful during development:
    //win.webContents.openDevTools({ mode: "detach" });
}

/*
ipcMain.handle("streamdeck:set-key-image", async (_event, payload) => {
    if (!streamDeck) {
        throw new Error("Stream Deck is not initialized.");
    }

    const { keyIndex, dataUrl } = payload;

    if (typeof keyIndex !== "number") {
        throw new Error("Invalid keyIndex.");
    }

    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
        throw new Error("Invalid image data URL.");
    }

    // Strip data URL prefix
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64, "base64");

    // Convert image -> exact Stream Deck raw RGB buffer
    const rawBuffer = await sharp(imageBuffer)
        .resize(streamDeck.iconSize, streamDeck.iconSize, {
            fit: "cover"
        })
        .flatten()
        .raw()
        .toBuffer();

    await streamDeck.fillImage(keyIndex, rawBuffer);

    return { success: true };
});
*/

async function setupStreamDeck() {
    const devices = await listStreamDecks();

    if (!devices || devices.length === 0) {
        throw new Error("No Stream Deck devices found.");
    }

    streamDeck = await openStreamDeck(devices[0].path);
    console.log("Opened Stream Deck:", devices[0].model);
    console.log("Icon size: " + streamDeck.iconSize);
}

ipcMain.handle('trigger-action', async (inst, data) => {
    console.log("Triggered!");
    //console.log(inst);
    //console.log(data);
    //macro.pressKey(KeyCodes.W);

    switch (data.action) {
        case "setImage":
            slot = data.id;
            let image = data.image;

            const base64 = image.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64, "base64");

            const rgbaBuffer = await sharp(imageBuffer)
                .resize(96, 96) // or your actual target size
                .ensureAlpha()
                .raw()
                .toBuffer();

            await streamDeck.fillKeyBuffer(slot, rgbaBuffer, { format: "rgba" });

            //await streamDeck.fillImage(slot, rawBuffer);

            break;

        case "clearSlot":
            slot = data.id;
            await streamDeck.fillKeyColor(slot, 0, 0, 0);
            break;
    }
    return { success: true };
});

app.whenReady().then(async () => {
    await setupStreamDeck();
    await createWindow();
    //await registry.OnAppStart.invoke()
});

app.once('before-quit', () => {
    console.log(`${app.getName()} is closing, cleaning up`);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});