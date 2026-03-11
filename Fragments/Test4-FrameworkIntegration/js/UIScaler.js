

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
