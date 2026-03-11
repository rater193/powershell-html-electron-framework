
const backend = require("./streamdeck-backend");

const streamdeck = {};

streamdeck.SetKey = async function(index, text) {
    await backend.setKey(index, text)
}

streamdeck.SetKeyImage = async function(index, text, iconFilename) {
    if(iconFilename) {
        await backend.renderKeyImageAndText(index, {
            imagePath: "./renderer/icons/"+iconFilename+".png",
            title: text
        })
    }else{
        await streamdeck.SetKey(index, text);
    }
}

streamdeck.ClearKey = async function(index) {
    await backend.clearKey(index);
}


module.exports = streamdeck;