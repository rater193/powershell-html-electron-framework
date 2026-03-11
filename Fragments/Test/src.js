
const elementStreamDeckButtonSelection = document.getElementById("StreamdeckButtonSelection");

function CreateButtonElement() {
    const btn = {}
    const elementButton = document.createElement("div");
    const elementButtonText = document.createElement("div");

    elementButton.classList += "StreamdeckButton"
    elementButtonText.classList += "StreamDeckButtonText text-align-center"

    elementButtonText.innerHTML = "UNDEFINED"

    elementButton.appendChild(elementButtonText)
    elementStreamDeckButtonSelection.appendChild(elementButton);

    btn.SetText = function(txt) {
        elementButtonText.innerHTML = txt
    }

    return btn
}

let test = CreateButtonElement();
test.SetText("hello")