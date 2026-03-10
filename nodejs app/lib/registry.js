
const registry = {};

function CreateEvent() {
    let event = {};
    let eventStorage = [];
    event.register = function(func) {
        eventStorage.push(func);
    }
    event.unregister = function(func) {
        const index = arr.indexOf(func);

        if (index !== -1) {
            arr.splice(index, 1);
        }
    }
    event.invoke = async function(...args) {
        await eventStorage.forEach(async(fn) => {
            await fn(...args);
        })
    }
    return event;
}

registry.OnKeyPress = CreateEvent()
registry.OnPageSelect = CreateEvent()
registry.OnPageEnter = CreateEvent()
registry.OnPageExit = CreateEvent()
registry.OnAppStart = CreateEvent()

//App specific functions
registry.OnAppUpdateButton = CreateEvent()

module.exports = registry;

console.log("REGISTRY REQUIRED AND LOADED")