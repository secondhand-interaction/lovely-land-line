const GAME = {};
GAME.State = "DIAL"; // DIAL, CALL, MESSAGE, CONTENT
GAME.Flag = "NONE"; // NONE, MESSAGE_FLAG, CONTENT_FLAG

function Update() {
    showConsoleLog("[UPDATE] " + GAME.State);
    if (GAME.State === "DIAL") {
        // Show DIAL screen
        iframe.src = "about:blank"

        // Enable DIAL controls
        resetDials();

    } else if (GAME.State === "CALL") {
        iframe.src = "message/message.html"
    } else if (GAME.State === "MESSAGE") {
        // ...
    } else if (GAME.State === "CONTENT") {
        // ...
    } else {
        // how the fuck did you get here
        showConsoleLog("[STATE ERROR] how the fuck did you get here");
        showConsoleLog(GAME.State);
    }
}

function setState(state) {
    GAME.State = state;
    showConsoleLog(state);
    Update();
}

function setFlag(flag) {
    GAME.Flag = flag;
    showConsoleLog(flag);
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
            } else if (GAME.Flag === "NONE") {
                setState("DIAL");
            }
            else {
                // how the fuck did you get here
                showConsoleLog("[FLAG ERROR] how the fuck did you get here");
                showConsoleLog(flag);
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
