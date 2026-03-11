const root = document.documentElement;
const rootStyles = getComputedStyle(root);
const CSSappWidth = Number(rootStyles.getPropertyValue('--app-width').replace("px", ""));
const CSSappHeight = Number(rootStyles.getPropertyValue('--app-height').replace("px", ""));


const baseWidth = CSSappWidth;
const baseHeight = CSSappHeight;

function scaleUI() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scale = Math.min(vw / baseWidth, vh / baseHeight);

    const scaler = document.getElementById("scaler");
    scaler.style.width = baseWidth + "px";
    scaler.style.height = baseHeight + "px";
    scaler.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleUI);
scaleUI();




const paletteItems = document.querySelectorAll(".palette-item");
const cells = document.querySelectorAll(".buttonpannel-button");

paletteItems.forEach(item => {
    item.addEventListener("dragstart", e => {
        const payload = {
            type: item.dataset.type,
            label: item.dataset.label
        };

        e.dataTransfer.setData("application/json", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "copy";
    });
});

cells.forEach(cell => {
    cell.addEventListener("dragover", e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        cell.classList.add("drag-over");
    });

    cell.addEventListener("dragleave", () => {
        cell.classList.remove("drag-over");
    });

    cell.addEventListener("drop", e => {
        e.preventDefault();
        cell.classList.remove("drag-over");

        const raw = e.dataTransfer.getData("application/json");
        if (!raw) return;

        const data = JSON.parse(raw);

        // Remove existing placed item if you only want one item per cell
        const existingPlaced = cell.querySelector(".placed-item");
        if (existingPlaced) {
            existingPlaced.remove();
        }

        const newItem = document.createElement("div");
        newItem.className = "placed-item";
        newItem.textContent = data.label;

        // Style by type
        if (data.type === "button") {
            newItem.classList.add("button-style");
        } else if (data.type === "label") {
            newItem.classList.add("label-style");
        } else if (data.type === "image") {
            newItem.classList.add("image-style");
        }

        cell.appendChild(newItem);
    });
});