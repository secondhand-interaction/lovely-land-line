// ---------------
// EXCEPTIONS LIST
// https://stackoverflow.com/questions/7802744/adding-an-img-element-to-a-div-with-javascript
// ---------------
const EXCEPTIONS = {
    rrrr: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".jpg";
        return [img];
    },

    // add more here
}

function applyException(dialInput, target) {
    const handler = EXCEPTIONS[dialInput];
    
    if (!handler) {
        return;
    }

    for (const node of handler(dialInput)) {
        target.appendChild(node);
    }

    showConsoleLog(`[exceptions.js - applyException] Applied: ${dialInput}`);
}

function clearException(target) {
    target.innerHTML = "";
    showConsoleLog(`[exceptions.js - clearException] Inner HTML cleaned: ${target}`);
}