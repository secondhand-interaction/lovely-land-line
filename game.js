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
function displayToggle() {
    if (GAME.State === "DIAL") {
        document.getElementById("DIAL").hidden = false;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = true;
    } else if (GAME.State === "CALL") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = false;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = true;
    } else if (GAME.State === "MESSAGE") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = false;
        document.getElementById("CONTENT").hidden = true;
    } else if (GAME.State === "CONTENT") {
        document.getElementById("DIAL").hidden = true;
        document.getElementById("CALL").hidden = true;
        document.getElementById("MESSAGE").hidden = true;
        document.getElementById("CONTENT").hidden = false;
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
        // Show DIAL screen
        setIframe("interface/dial-mode/dial-mode.html");

        // Enable DIAL controls
        resetDials();
    } else if (GAME.State === "CALL") {
        // Show CALL screen
        setIframe("interface/call-mode/call-mode.html");

        // Check directory
        call();

        // State transition
        nextState();
    } else if (GAME.State === "MESSAGE") {
        // Show MESSAGE screen
        setIframe("interface/message-mode/message-mode.html");

        // Exceptions
        const extra = document.getElementById("exceptions");
        clearException(extra);
        applyException(dialInput, extra);

        // Load recordings
        loadRecordings(dialInput);
    } else if (GAME.State === "CONTENT") {
        // Show CONTENT screen
        setIframe("interface/dial-mode/content-mode.html");
        
        // Load content
        contentLocation = "directory/" + String(dialInput) + "/" + String(dialInput) + ".html";
        showConsoleLog(`[game.js - Update] Content location: ${contentLocation}`);
        setIframe(contentLocation);

    } else {
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
                setState("CONTENT");
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
