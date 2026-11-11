// ---------------
// EXCEPTIONS LIST
// https://stackoverflow.com/questions/7802744/adding-an-img-element-to-a-div-with-javascript
// ---------------
function buildImages(dialInput, count) {
    const EXTENSIONS = ["png", "jpg", "jpeg", "gif"];
    const elements = [];

    for (let i = 1; i <= count; i++) {
        const img = document.createElement("img");
        img.alt = `${dialInput} ${i}`;
        img.className = "exception-img";

        let attempt = 0;
        const ggGoNext = () => {
            if (attempt < EXTENSIONS.length) {
                img.src = `directory/${dialInput}/${dialInput}-${i}.${EXTENSIONS[attempt]}`;
                attempt++;
            } else {
                img.remove();
            }
        };

        img.onerror = ggGoNext;
        ggGoNext();
        elements.push(img);
    }

    return elements;
}

const EXCEPTIONS = {
    bbbb: (dialInput) => buildImages(dialInput, 1),
    brrr: (dialInput) => buildImages(dialInput, 1),
    bygr: (dialInput) => buildImages(dialInput, 1),
    byyb: (dialInput) => buildImages(dialInput, 1),
    gggg: (dialInput) => buildImages(dialInput, 2),
    grrr: (dialInput) => buildImages(dialInput, 1),
    rggg: (dialInput) => buildImages(dialInput, 3),
    rrgr: (dialInput) => buildImages(dialInput, 1),
    rryy: (dialInput) => buildImages(dialInput, 1),
    ybrb: (dialInput) => buildImages(dialInput, 1),
    ygrr: (dialInput) => buildImages(dialInput, 1),

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