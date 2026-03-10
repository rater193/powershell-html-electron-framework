
const { app, BrowserWindow, ipcMain } = require("electron");
const streamdeck = require("./streamdeck");

ipcMain.handle('trigger-my-function', async (event, someArgument) => {
    console.log('Function triggered in main process with argument:', someArgument);
    // Perform Node.js operations here (file system access, etc.)
    const result = `Result of my function: ${someArgument.toUpperCase()}`;
    return result; // Return a result to the renderer
});

ipcMain.handle('trigger-update-button', async (event, id, txt) => {
    console.log('Function triggered in main process with argument:', id, ' txt: ', txt);
    // Perform Node.js operations here (file system access, etc.)
    await streamdeck.ClearKey(Number(id));
    const result = `Result of my function: ${txt.toUpperCase()}`;
    return result; // Return a result to the renderer
});

module.exports = {};