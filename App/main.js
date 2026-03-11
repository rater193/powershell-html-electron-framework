const { app, BrowserWindow } = require("electron");
//const registry = require("./registry")
//const backend = require("./streamdeck-backend")
const path = require("path");

async function createWindow() {
    const win = new BrowserWindow({
        width: 720,
        height: 480,
        backgroundColor: "#0f1115",
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, "./HTML", "index.html"));

    //await backend.initStreamDeck();
    // Helpful during development:
    //win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then( async () => {
    await createWindow()
    //await registry.OnAppStart.invoke()
} );

app.once('before-quit', () => {
  console.log(`${app.getName()} is closing, cleaning up`);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});