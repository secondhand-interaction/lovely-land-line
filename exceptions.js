// ---------------
// EXCEPTIONS LIST
// https://stackoverflow.com/questions/7802744/adding-an-img-element-to-a-div-with-javascript
// ---------------
const EXCEPTIONS = {
    bygr: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".png";
        return [img];
    },

    rryy: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".png";
        return [img];
    },

    rrgr: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".png";
        return [img];
    },

    // multiple images, need to edit this asap
    rggg: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".png";
        return [img];
    },

    // multiple images, need to edit this asap
    gggg: (dialInput) => {
        const img = document.createElement("img");
        img.src = "directory/" + String(dialInput) + "/" + String(dialInput) + ".png";
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