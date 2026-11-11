// https://stackoverflow.com/questions/12578379/play-a-sound-when-a-key-is-pressed

const DIAL_SOUNDS = {
    q: "assets/sfx/input/q.wav",
    w: "assets/sfx/input/w.wav",
    a: "assets/sfx/input/a.wav",
    s: "assets/sfx/input/s.wav",
    e: "assets/sfx/input/e.wav"
}

const LOADED_DIAL_SOUNDS = {};
for (const [key, path] of Object.entries(DIAL_SOUNDS)) {
    LOADED_DIAL_SOUNDS[key] = new Audio(path);
}

function playDialSound(index) {
    const sfx = LOADED_DIAL_SOUNDS[index];

    if (!sfx) {
        showConsoleLog(`[sfx-handler.js - playDialSound] No sound for: ${index}`);
    }

    sfx.currentTime = 0;
    sfx.play().catch(error => showConsoleLog(`[sfx-handler.js - playDialSound] Play failed: ${error}`));
}

const MESSAGE_SOUNDS = {
    start: "assets/sfx/message/start.wav",
    stop: "assets/sfx/message/stop.wav",
    record: "assets/sfx/message/record.wav"
}

const LOADED_MESSAGE_SOUNDS = {};
for (const [key, path] of Object.entries(MESSAGE_SOUNDS)) {
    LOADED_MESSAGE_SOUNDS[key] = new Audio(path);
}

function playMessageSound(index) {
    const sfx = LOADED_MESSAGE_SOUNDS[index];

    if (!sfx) {
        showConsoleLog(`[sfx-handler.js - playMessageSound] No sound for: ${index}`);
    }

    sfx.currentTime = 0;
    sfx.play().catch(error => showConsoleLog(`[sfx-handler.js - playMessageSound] Play failed: ${error}`));
}

const TRANSITION_SOUNDS = {
    1: "assets/sfx/transitions/1.wav",
    2: "assets/sfx/transitions/2.wav",
    3: "assets/sfx/transitions/3.wav",
    4: "assets/sfx/transitions/4.wav",
    5: "assets/sfx/transitions/5.wav",
    6: "assets/sfx/transitions/6.wav",
    7: "assets/sfx/transitions/7.wav",
    8: "assets/sfx/transitions/8.wav",
    9: "assets/sfx/transitions/9.wav",
    10: "assets/sfx/transitions/10.wav",
    11: "assets/sfx/transitions/11.wav",
    12: "assets/sfx/transitions/12.wav",
    13: "assets/sfx/transitions/13.wav"
}

var currentTransition = null;

const LOADED_TRANSITION_SOUNDS = {};
for (const [key, path] of Object.entries(TRANSITION_SOUNDS)) {
    const sfx = new Audio(path);
    sfx.addEventListener("ended", () => {
        endTransition();
    })
    LOADED_TRANSITION_SOUNDS[key] = sfx;
}

function playTransitionSound() {
    const index = Math.floor(Math.random() * 13) + 1;
    const sfx = LOADED_TRANSITION_SOUNDS[index];

    if (!sfx) {
        showConsoleLog(`[sfx-handler.js - playTransitionSound] No sound for: ${index}`);
    }

    if (currentTransition) {
        currentTransition.pause();
        currentTransition.currentTime = 0;
    }

    inTransition = true;
    sfx.currentTime = 0;
    currentTransition = sfx;
    sfx.play().catch(error => {
        endTransition();
        showConsoleLog(`[sfx-handler.js - playTransitionSound] Play failed: ${error}`);
    });
}
