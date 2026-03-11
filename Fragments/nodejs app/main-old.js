const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { listStreamDecks, openStreamDeck } = require("@elgato-stream-deck/node")
const { createCanvas } = require("@napi-rs/canvas")

let deck = null
let keyWidth = 96
let keyHeight = 96







function getButtonPixelSize(streamDeck) {
  // Find a button control that has an LCD (has pixelSize)
  const btn = streamDeck.CONTROLS.find(
    (c) => c.type === "button" && c.feedbackType === "lcd" && c.pixelSize
  );
  if (!btn) throw new Error("No LCD button controls found on this Stream Deck");
  return btn.pixelSize; // { width, height }
}

function renderKeyTextRGBA({ width, height }, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, width, height);

  // simple auto-fit font
  let fontSize = Math.floor(height * 0.32);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";

  const maxWidth = Math.floor(width * 0.90);

  while (fontSize > 8) {
    ctx.font = `bold ${fontSize}px Sans`;
    const metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth) break;
    fontSize -= 2;
  }

  // optional: shadow for readability
  ctx.shadowColor = "rgba(0,0,0,0.75)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // draw
  ctx.font = `bold ${fontSize}px Sans`;
  ctx.fillText(text, width / 2, height / 2);

  // RGBA bytes (Uint8ClampedArray) length = width*height*4
  const imageData = ctx.getImageData(0, 0, width, height);
  return imageData.data;
}








/* ---------------------------
   Connect to Stream Deck
--------------------------- */

async function initStreamDeck() {
  const devices = await listStreamDecks()

  if (!devices.length) {
    console.log("No Stream Deck detected")
    return
  }

  deck = await openStreamDeck(devices[0].path)

  console.log("Stream Deck connected")

  const btn = deck.CONTROLS.find(
    (c) => c.type === "button" && c.feedbackType === "lcd"
  )

  if (btn?.pixelSize) {
    keyWidth = btn.pixelSize.width
    keyHeight = btn.pixelSize.height
  }

  deck.on("down", (keyIndex) => {
    console.log("Key pressed:", keyIndex)
  })

  deck.on("error", (err) => {
    console.error("StreamDeck error:", err)
  })
}

/* ---------------------------
   Render text to button
--------------------------- */

function renderKey(text) {
  const canvas = createCanvas(keyWidth, keyHeight)
  const ctx = canvas.getContext("2d")

  // background
  ctx.fillStyle = "#0f1621"
  ctx.fillRect(0, 0, keyWidth, keyHeight)

  // border glow
  ctx.strokeStyle = "#5a7cff"
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, keyWidth - 4, keyHeight - 4)

  // text
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 18px Sans"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  ctx.fillText(text, keyWidth / 2, keyHeight / 2)

  const img = ctx.getImageData(0, 0, keyWidth, keyHeight)

  return img.data
}

/* ---------------------------
   Update a specific key
--------------------------- */

async function setKey(index, text) {
  if (!deck) return

  const buffer = renderKey(text)

  await deck.fillKeyBuffer(index, buffer, {
    format: "rgba"
  })
}


function createWindow() {
  const win = new BrowserWindow({
    width: 720,
    height: 480,
    backgroundColor: "#0f1115",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));

  // Helpful during development:
  //win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(async () => {
  await initStreamDeck()
  ipcMain.handle('trigger-my-function', async (event, someArgument) => {
    console.log('Function triggered in main process with argument:', someArgument);
    // Perform Node.js operations here (file system access, etc.)
    const result = `Result of my function: ${someArgument.toUpperCase()}`;
    return result; // Return a result to the renderer
  });

  ipcMain.handle('trigger-update-button', async (event, id, txt) => {
    console.log('Function triggered in main process with argument:', id, ' txt: ', txt);

    //await setKey(Number(id), "A");

    const devices = await listStreamDecks();

    if (!devices.length) throw new Error("No Stream Decks found");

    const deck = await openStreamDeck(devices[0].path);

    deck.on("error", (e) => console.error("StreamDeck error:", e));

    const pixelSize = getButtonPixelSize(deck);

    const keyIndex = 0; // change this to whichever key you want
    const rgba = renderKeyTextRGBA(pixelSize, txt);

    await deck.fillKeyBuffer(Number(id), rgba, { format: "rgba" });



    //await setKey(16, "A");



    // Perform Node.js operations here (file system access, etc.)
    const result = `Result of my function: ${txt.toUpperCase()}`;
    return result; // Return a result to the renderer
  });
  createWindow();
}
);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Example IPC endpoint (renderer -> main)
ipcMain.handle("app:ping", async () => {
  return { ok: true, message: "pong from main.js" };
});