// ---------------
// SHARED VARIABLES
// ---------------
const GAME = {};
GAME.State = "DIAL"; // DIAL, CALL, MESSAGE, CONTENT
GAME.Flag = "NONE"; // NONE, MESSAGE_FLAG, CONTENT_FLAG

// ---------------
// UI TOGGLE
// https://www.scaler.com/topics/javascript-hide-element/
// ---------------
function endTransition() {
    inTransition = false;
    displayToggle();
}

function displayToggle() {
    if (inTransition) return;
    if (GAME.State === "DIAL") {
        document.getElementById("DIAL").hidden = false;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = true;

        document.getElementById("DIAL-ICON").hidden = false;
        document.getElementById("CALL-ICON").hidden = true;
        document.getElementById("MESSAGE-ICON").hidden = true;
        document.getElementById("CONTENT-ICON").hidden = true;
    } else if (GAME.State === "CALL") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = false;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = true;

        document.getElementById("DIAL-ICON").hidden = true;
        document.getElementById("CALL-ICON").hidden = false;
        document.getElementById("MESSAGE-ICON").hidden = true;
        document.getElementById("CONTENT-ICON").hidden = true;
    } else if (GAME.State === "MESSAGE") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = false;
        document.getElementById("CONTENT").hidden = true;

        document.getElementById("DIAL-ICON").hidden = true;
        document.getElementById("CALL-ICON").hidden = true;
        document.getElementById("MESSAGE-ICON").hidden = false;
        document.getElementById("CONTENT-ICON").hidden = true;
    } else if (GAME.State === "CONTENT") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = false;

        document.getElementById("DIAL-ICON").hidden = true;
        document.getElementById("CALL-ICON").hidden = true;
        document.getElementById("MESSAGE-ICON").hidden = true;
        document.getElementById("CONTENT-ICON").hidden = false;
    } else {
        // how the fuck did you get here
        showConsoleLog(`[game.js - displayToggle] How the fuck did you get here: ${GAME.State}`);
    }
}

// ---------------
// STATE MACHINE
// https://gist.github.com/erkobridee/e567d22180b9118229441f71791f6ec7
// ---------------
function Update() {
    displayToggle();
    if (GAME.State === "DIAL") {
        resetDials();
    } else if (GAME.State === "CALL") {
        playTransitionSound();

        call();

        nextState();
    } else if (GAME.State === "MESSAGE") {
        const extra = document.getElementById("exceptions");
        clearException(extra);
        applyException(dialInput, extra);

        loadRecordings(dialInput);
    } else if (GAME.State === "CONTENT") {
        showConsoleLog(`[game.js - Update] NO CONTENT YET`);
        
        // contentLocation = "directory/" + String(dialInput) + "/" + String(dialInput) + ".html";
        // showConsoleLog(`[game.js - Update] Content location: ${contentLocation}`);
        // setIframe(contentLocation);
    } else {
        // how the fuck did you get here
        showConsoleLog(`[game.js - Update] How the fuck did you get here: ${GAME.State}`);
    }
}

function setState(state) {
    GAME.State = state;

    showConsoleLog(`[game.js - setState] ${GAME.State}`);
    
    Update();
}

function setFlag(flag) {
    GAME.Flag = flag;

    showConsoleLog(`[game.js - setFlag] ${GAME.Flag}`);
}

function nextState() {
    switch(GAME.State) {
        case "DIAL":
            setState("CALL");
            break;
        case "CALL":
            if (GAME.Flag === "MESSAGE_FLAG") {
                setState("MESSAGE");
            } else if (GAME.Flag === "CONTENT_FLAG") {
                setState("DIAL");
                setFlag("NONE");

                showConsoleLog(`[game.js - nextState] NO CONTENT YET`);
                // setState("CONTENT");
            } else {
                setState("DIAL");
            }
            break;
        case "MESSAGE":
            setState("DIAL");
            setFlag("NONE");
            break;
        case "CONTENT":
            setState("DIAL");
            setFlag("NONE");
            break;
        default:
            setState("DIAL");
            setFlag("NONE");
            break;
    }
}
