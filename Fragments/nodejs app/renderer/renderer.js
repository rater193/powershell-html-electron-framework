// renderer.js
document.getElementById('my-button').addEventListener('click', async () => {
  const argumentToSend = 'hello world';
  // Call the exposed function and get the result
  const result = await window.electronAPI.triggerFunction(argumentToSend); 
  document.getElementById('result').innerText = result;
});

// VARIABLES
let streamdeckButtons = document.getElementById("StreamDeckButtons");
let data = {};

data.selectedButtonIndex = 0;
data.buttons = [];

streamdeckButtons.innerHTML = ""


function CreateButton(id) {
    const button = document.createElement("div");
    button.className = "StreamDeckButton"
    button.dataset.id = id;

    const content = document.createElement("div");
    content.className = "StreamDeckButtonContent";

    data.buttons[id] = button;

    button.appendChild(content);

    button.addEventListener("click", function(e) {
        console.log("Clicked button: ", this.dataset.id);
        data.selectedButtonIndex = this.dataset.id;
        //document.getElementById("ConfigureButtonTextContent").style.display = "block";
        document.getElementById("ConfigureButtonTextContent").classList.add("active");
        document.getElementById("ConfigureButtonTextContent").style.pointerEvents = "all";
    });

    streamdeckButtons.appendChild(button);

    return button;
}

function CreateRow() {
    const row = document.createElement("div");
    row.className = "ButtonAreaRow";
    streamdeckButtons.appendChild(row);
    return row;
}

let row1 = CreateRow();
let row2 = CreateRow();
let row3 = CreateRow();
let row4 = CreateRow();

for(let i = 0; i < 8; i+=1) { CreateButton(i, row1); }
for(let i = 0; i < 8; i+=1) { CreateButton(i+8, row2); }
for(let i = 0; i < 8; i+=1) { CreateButton(i+16, row3); }
for(let i = 0; i < 8; i+=1) { CreateButton(i+24, row4); }

document.getElementById("ConfigureButtonTestClose").addEventListener("click", function(e) {
    console.log("Clicked button: ");
    document.getElementById("ConfigureButtonTextContent").classList.remove("active");
});
document.getElementById("ConfigureButtonTestSave").addEventListener("click", async function(e) {
    console.log("Clicked button: ");
    document.getElementById("ConfigureButtonTextContent").classList.remove("active");
    console.log("Updating button: " + data.selectedButtonIndex);
    result = await window.electronAPI.UpdateButton(data.selectedButtonIndex, "T"); 
});