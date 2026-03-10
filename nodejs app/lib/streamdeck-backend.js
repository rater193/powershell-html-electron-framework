
const { listStreamDecks, openStreamDeck } = require("@elgato-stream-deck/node")
const { createCanvas, loadImage } = require("@napi-rs/canvas")
const { PNG } = require("pngjs");
const registry = require("./registry")
const fs = require("fs");
const path = require("path");

let deck = null
let keyWidth = 96
let keyHeight = 96

const backend = {};



async function loadImageAsCanvas(imagePath) {
  const abs = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
  const bytes = fs.readFileSync(abs);

  // If PNG, decode via pngjs to guarantee RGBA (handles palette PNGs like your folder.png)
  if (abs.toLowerCase().endsWith(".png")) {
    const png = PNG.sync.read(bytes); // { width, height, data: RGBA }
    const c = createCanvas(png.width, png.height);
    const ctx = c.getContext("2d");
    const imgData = ctx.createImageData(png.width, png.height);
    imgData.data.set(png.data);
    ctx.putImageData(imgData, 0, 0);
    return c; // canvas is a valid drawImage source
  }

  // Non-PNG: let canvas decode it (jpg/webp/etc.)
  return await loadImage(bytes);
}


// Single function: render optional image + text onto a Stream Deck key
// - imagePath: optional file path to a PNG/JPG
// - title: optional string (drawn at bottom)
// - options: tweak layout/colors/font
backend.renderKeyImageAndText = async function (
  keyIndex,
  {
    imagePath = null,
    title = "",
    // styling / layout
    background = "#0f1621",
    titleColor = "#ffffff",
    fontFamily = "Sans",
    fontWeight = "bold",
    titleMaxLines = 2,
    titleAreaRatio = 0.38, // portion of key height reserved for title area at bottom
    imagePadding = 6,
    borderRadius = 14,     // rounded corners for image clip
    shadow = true,
    fontSize = 24,
    yOffset = 0
  } = {}
) {
  if (!deck) throw new Error("Stream Deck not initialized. Call backend.initStreamDeck() first.");

  // Validate key index (XL = 0..31)
  const idx = Number(keyIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx > 31) {
    throw new TypeError(`Expected a valid keyIndex (0..31). Got: ${keyIndex}`);
  }

  const canvas = createCanvas(keyWidth, keyHeight);
  const ctx = canvas.getContext("2d");

  // ---- background ----
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, keyWidth, keyHeight);

  // ---- compute regions ----
  const titleAreaH = Math.floor(keyHeight * titleAreaRatio);
  const imgAreaH = keyHeight - titleAreaH;
  const imgFontSize = fontSize;
  const imgX = imagePadding;
  const imgY = imagePadding;
  const imgW = keyWidth - imagePadding * 2;
  const imgH = imgAreaH - imagePadding * 2;
  const verticalOffset = yOffset;

  // ---- draw image (optional) ----
  if (imagePath) {
    // Load image bytes and decode using @napi-rs/canvas Image
    const abs = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
    const bytes = fs.readFileSync(abs);

    // @napi-rs/canvas supports loadImage via Image object
    
    const imgSource = await loadImageAsCanvas(imagePath);

    // Clip to rounded rect
    const r = Math.max(0, Math.min(borderRadius, Math.floor(Math.min(imgW, imgH) / 2)));
    ctx.save();
    ctx.beginPath();
    roundRectPath(ctx, imgX, imgY, imgW, imgH, r);
    //ctx.clip();

    // cover scaling using width/height from the source
    const srcW = imgSource.width;
    const srcH = imgSource.height;

    if (srcW > 0 && srcH > 0) {
      const scale = Math.max(imgW / srcW, imgH / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const dx = imgX + (imgW - drawW) / 2;
      const dy = imgY + (imgH - drawH) / 2;
      ctx.drawImage(imgSource, 0, 0, 96, 96);
    }

    ctx.restore();
  }

  // ---- title (optional) ----
  const safeTitle = String(title ?? "").trim();
  if (safeTitle.length > 0) {
    let titleBoxX = 0;
    let titleBoxY = imgAreaH + verticalOffset;
    let titleBoxW = keyWidth;
    let titleBoxH = titleAreaH;
    titleBoxY -= titleBoxH/2

    // subtle fade behind text for readability
    const grad = ctx.createLinearGradient(0, titleBoxY, 0, titleBoxY + titleBoxH);
    grad.addColorStop(0, "rgba(0,0,0,0.00)");
    grad.addColorStop(0.35, "rgba(0,0,0,0.35)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 96, 96);

    ctx.fillStyle = titleColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxTextW = Math.floor(keyWidth * 0.92);

    // Pick font size based on available height and lines
    // Start high, then shrink until text fits wrapped lines.
    let fontSize = imgFontSize;

    const lines = [];
    while (fontSize >= 10) {
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      lines.length = 0;
      wrapTextIntoLines(ctx, safeTitle, maxTextW, titleMaxLines, lines);

      // measure max line width
      const widest = lines.reduce((m, line) => Math.max(m, ctx.measureText(line).width), 0);
      if (widest <= maxTextW) break;

      fontSize -= 1;
    }

    // Shadow for readability
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.70)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw lines centered in title area
    const lineH = Math.floor(fontSize * 1.15);
    const totalH = lines.length * lineH;
    let y = titleBoxY + (titleBoxH / 2) - (totalH / 2) + (lineH / 2);

    for (const line of lines) {
      ctx.fillText(line, 48, y);
      y += lineH;
    }

    // reset shadow to avoid affecting future draws
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // ---- send to device ----
  const imageData = ctx.getImageData(0, 0, keyWidth, keyHeight);
  await deck.fillKeyBuffer(idx, imageData.data, { format: "rgba" });
};

/* ---------------------------
   Helpers (kept local to file)
--------------------------- */

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, Math.floor(Math.min(w, h) / 2)));
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapTextIntoLines(ctx, text, maxWidth, maxLines, outLines) {
  // Simple word wrap with ellipsis on overflow
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    outLines.push("");
    return;
  }

  let line = "";
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }

    // push current line
    if (line) outLines.push(line);
    else outLines.push(words[i]); // single long word

    line = words[i];

    // Stop if we reached max lines
    if (outLines.length >= maxLines) {
      outLines[maxLines - 1] = ellipsize(ctx, outLines[maxLines - 1], maxWidth);
      return;
    }
  }

  if (outLines.length < maxLines && line) outLines.push(line);

  // If too many lines, ellipsize last
  if (outLines.length > maxLines) {
    outLines.length = maxLines;
    outLines[maxLines - 1] = ellipsize(ctx, outLines[maxLines - 1], maxWidth);
  }

  // If last line still too wide (e.g., long word), ellipsize
  outLines[outLines.length - 1] = ellipsize(ctx, outLines[outLines.length - 1], maxWidth);
}

function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  const ell = "…";
  let t = text;

  while (t.length > 0 && ctx.measureText(t + ell).width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t.length ? (t + ell) : ell;
}




backend.getButtonPixelSize = function(streamDeck) {
  // Find a button control that has an LCD (has pixelSize)
  const btn = streamDeck.CONTROLS.find(
    (c) => c.type === "button" && c.feedbackType === "lcd" && c.pixelSize
  );
  if (!btn) throw new Error("No LCD button controls found on this Stream Deck");
  return btn.pixelSize; // { width, height }
}

backend.renderKeyTextRGBA = function({ width, height }, text) {
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


backend.clearKey = async function(keyIndex) {
  await deck.fillKeyColor(keyIndex, 0, 0, 0);
}


/* ---------------------------
   Connect to Stream Deck
--------------------------- */
backend.initStreamDeck = async function() {
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
    registry.OnKeyPress.invoke(keyIndex.index);
  })

  deck.on("error", (err) => {
    console.error("StreamDeck error:", err)
  })
}

/* ---------------------------
   Render text to button
--------------------------- */

backend.renderKey = function(text) {
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

backend.setKey = async function(index, text) {
  if (!deck) return

  const buffer = backend.renderKey(text)

  await deck.fillKeyBuffer(index, buffer, {
    format: "rgba"
  })
}

// Initialize the streamdeck


module.exports = backend;