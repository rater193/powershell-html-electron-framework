
const registry = require("./lib/registry");
require("./lib/events");
require("./lib/pages");
require("./lib/electron");

/*
const backend = require("./lib/streamdeck-backend")

async function derp() {
    await backend.initStreamDeck();
    await backend.setKey(1, "TEST")
}

derp()
*/