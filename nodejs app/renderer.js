console.log("Renderer.js loaded");
// renderer.js
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');

    button.addEventListener('click', async () => {
        console.log('Button clicked in renderer!');
        // Call the exposed API function to trigger the main process
        const response = await window.electronAPI.triggerButtonAction({ someData: 'example data' });
        console.log('Response from main process:', response.message);
    });
});