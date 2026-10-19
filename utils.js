// shared variables
const dials = []
let current = 0;
let dialInput = "";

// console log with toggle
function showConsoleLog( message ) {
    if (debug) {
        console.log(message);
    }
}

//const iframe = document.getElementById('display');

function readyGame() {

    //IFRAME
    //iframe.addEventListener('load', () => {
    //    showConsoleLog("iframe loaded");
    //});

    // dials
    for (let i = 1; i <= DIAL_COUNT; i++) {
        const canvas = document.getElementById('dial' + String(i));
        const context = canvas.getContext('2d');
        dials.push({ canvas, context });
    }
    resetDials();
    window.addEventListener('keydown', handleInput); // The event listener should only be initialized once ok
    Update();
}

function drawDial({ canvas, context }, color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function setDialedColor( combo ) {
    showConsoleLog("Set Dialed Color: ");
    dialedColor = String(combo);
    showConsoleLog(dialedColor);
}

function resetDials() {
    dials.forEach(d => drawDial(d, 'black'));
    current = 0;
    dialInput = "";
    setDialedColor("");
}

// Single input addEventListener
function handleInput(event) {
    if (event.repeat) return;
    const key = event.key.toLowerCase();

    if (GAME.State === "DIAL") {
        handleDial(key);
    } else if (GAME.State === "CALL") {
        handleCall(key);
    } else {
        // how did you get here
        showConsoleLog("[state input error]");
    }
}

// ---------------
// DIAL MODE
// ---------------
function handleDial(key) {
    if (key === 'e') {
        showConsoleLog('reset');
        resetDials();
        return;
    }

    const color = COLORS[key];
    if (!color || current >= DIAL_COUNT) return;
    showConsoleLog(color);

    drawDial(dials[current], color);
    dialInput = dialInput + String(color)[0];
    showConsoleLog(dialInput);
    showConsoleLog(current);
    current++;

    if (current === DIAL_COUNT) {
        showConsoleLog("RINGRINGRING");
        setDialedColor(dialInput);
        nextState();
    }
}



// ---------------
// CALL MODE
// ---------------
function handleCall(key) {
    if (key === 'e') {
        showConsoleLog('back to call mode');
        setFlag("NONE");
        nextState();
        return;
    }
}
