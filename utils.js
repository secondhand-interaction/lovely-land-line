// ---------------
// SHARED VARIABLES
// https://stackoverflow.com/questions/67378379/how-to-get-the-sample-rate-from-a-mediadevices-getusermedia-stream
// ---------------
const dials = []
let current = 0;
let dialInput = "";
let directory = null;
var dialedColor;

let pendingEntry = null;

let flavortextIndex = 0;

let recording = false;
let mediaRecorder = null;
let recordingStream = null;
let audioChunks = [];

let recordingItems = [];
let recordingIndex = 0;

let loadGuard = 0;

let holdTimer = null;

let holdIndicatorInterval = null;
let holdIndicatorStep = 0;

let isRecording = false;
let inTransition = false;

const audioSources = new WeakMap();
let audioTap = null;

let recordingLimitTimer = null;
let limitReached = false;

let slideIndex = 0;

// ---------------
// HELPER FUNCTIONS
// https://community.shopify.com/t/how-to-set-iframe-src-from-javascript/10672
// https://stackoverflow.com/questions/7346563/loading-local-json-file
// https://stackoverflow.com/questions/34789321/js-read-json-file-and-use-as-an-object
// ---------------
function showConsoleLog( message ) {
    if (debug) {
        console.log(message);
    }
}

function startSlideshow() {
    const slides = document.querySelectorAll("#slideshow .slide");
    if (slides.length === 0) return;

    slides[0].classList.add("active");

    setInterval(() => {
        slides[slideIndex].classList.remove("active");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active");
    }, 3000);
}


function setIframe ( setSrc ) {
    document.getElementById('display').setAttribute("src", setSrc);
    // HOLY SHIT THE SHOPIFY SOLUTION WORKS WHAT THE FUCK???
    // ok so...
    // you need to write "setAttribute" in order to access the iframe...
    // that's fucked up
}

async function getJSON() {
    const response = await fetch("directory/directory.json");
    directory = await response.json();
    showConsoleLog(`[utils.js - getJSON] Fetched JSON: ${directory}`);
}

function readyGame() {
    getJSON();
    startSlideshow();
    setIframe("about:blank")

    for (let i = 1; i <= DIAL_COUNT; i++) {
        const canvas = document.getElementById('dial' + String(i));
        const context = canvas.getContext('2d');
        dials.push({ canvas, context });
    }
    resetDials();

    // ALL INPUT EVENT LISTENERS HERE OK!!!!!!!!!!!
    // INITIALIZE THEM ONCE, ON READYGAME
    // OK!!!!!!!!!!!!!!!!!!!!!!!
    window.addEventListener('keydown', handleInput); 
    window.addEventListener('keyup', handleKeyUp);

    Update();
}

function drawDial({ canvas, context }, color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function setDialColor( combo ) {
    dialedColor = String(combo);

    showConsoleLog(`[utils.js - setDialColor] Set dial color: ${dialedColor}`);
}

function resetDials() {
    dials.forEach(d => drawDial(d, 'black'));
    current = 0;
    dialInput = "";
    setDialColor("");
}

function handleInput( event ) {
    if (inTransition) return;

    if (event.repeat) return;
    const key = event.key.toLowerCase();

    if (GAME.State === "DIAL") {
        handleDial(key);
    } else if (GAME.State === "MESSAGE") {
        handleMessage(key);
    } else if (GAME.State === "CONTENT") {
        handleContent(key);
    } else {
        // how to fuck did you get here
        showConsoleLog(`[utils.js - handleInput] State input error: ${GAME.State}`);
    }
}

// ---------------
// DIAL MODE
// ---------------
function handleDial( key ) {
    playDialSound(key);
    if (key === 'e') {
        showConsoleLog(`[utils.js - handleDial] Reset dials`);
        resetDials();

        return;
    }

    const color = COLORS[key];
    if (!color || current >= DIAL_COUNT) return;
    showConsoleLog(`[utils.js - handleDial] Dial color: ${color}`);

    drawDial(dials[current], color);
    dialInput = dialInput + String(color)[0];
    showConsoleLog(`[utils.js - handleDial] Dial input: ${dialInput}`);
    showConsoleLog(`[utils.js - handleDial] Current input index: ${current}`);
    current++;

    if (current === DIAL_COUNT) {
        showConsoleLog(`[utils.js - handleDial] Calling: ${dialInput}`);
        setDialColor(dialInput);
        nextState();
    }
}

// ---------------
// CALL MODE
// https://stackoverflow.blog/2022/06/02/a-beginners-guide-to-json-the-data-format-for-the-internet/
// https://stackoverflow.com/questions/28780485/parsing-json-object-to-get-filelocation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
// ---------------
function call() {
    if (directory == null) {
        showConsoleLog(`[utils.js - call] Directory not loaded`);
        setFlag("NONE");
        return;
    }

    if (!Object.hasOwn(directory, dialInput)) {
        showConsoleLog(`[utils.js - call] Empty slot, add first recording`);
        pendingEntry = dialInput;
        setFlag("MESSAGE_FLAG");
        return;
    }

    const flagValue = directory[dialInput]

    if (flagValue === "message") {
        showConsoleLog(`[utils.js - call] Existing message detected`);
        pendingEntry = dialInput;
        setFlag("MESSAGE_FLAG");
    } else {
        showConsoleLog(`[utils.js - call] Content detected`);
        pendingEntry = null;
        setFlag("CONTENT_FLAG");
    }

    return;
}

// ---------------
// CONTENT MODE
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur
// https://stackoverflow.com/questions/27550415/tabindex-doesnt-make-a-label-focusable-using-tab-key
// https://stackoverflow.com/questions/5076409/return-focus-from-iframe-to-parent
// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
// ---------------
function handleContent( key ) {
    // copy-paste this in the content html

    // at the very beginning
    // -----------------
    //<script>
    //window.focus();
    //</script>
    // -----------------

    // just before </head>
    // -----------------
    //<script>
    //document.addEventListener("keydown", e => {
        //if (e.key.toLowerCase() === "e") {
            //playDialSound(key);
            //parent.regainFocus();
        //}
    //});
    //</script>
    // -----------------
}

function regainFocus() {
    setIframe("about:blank");
    window.focus();
    document.body.focus();
    setFlag("NONE");
    nextState();

    return;
}

// ---------------
// MESSAGE MODE
// ---------------
function handleKeyUp( event ) {
    if (event.key.toLowerCase() !== 'q') return;
    if (GAME.State !== "MESSAGE") return;
    if (holdTimer) {
        showConsoleLog('[utils.js - handleKeyUp] q released early');
        cancelHoldRecord();
    }
}

function handleMessage( key ) {
    if (key === 'e') {
        if (isRecording) return;
        playDialSound(key);
        showConsoleLog('[utils.js - handleMessage] e, back to DIAL mode');
        stopRecording();
        stopMessage();
        setFlag("NONE");
        nextState();

        return;
    }

    if (key === 'q') {
        if (isRecording) return;
        showConsoleLog('[utils.js - handleMessage] q, starting to record...');
        startHoldRecord();
    }

    if (key === 'w') {
        showConsoleLog('[utils.js - handleMessage] w, stop recording');
        stopRecording();
    }

    if (key === 'a') {
        if (isRecording) return;
        showConsoleLog('[utils.js - handleMessage] a, previous recording');
        chooseMessage(-1);
        stopMessage();
    }

    if (key === 's') {
        if (isRecording) return;
        showConsoleLog('[utils.js - handleMessage] s, next recording');
        chooseMessage(1);
        stopMessage();
    }

    if (key === 'd') {
        if (isRecording) return;
        showConsoleLog('[utils.js - handleMessage] d, play recording');
        playMessage();
    }
}

function chooseMessage( step ) {
    if (recordingItems.length === 0) {
        return;
    }

    highlightMessage(false);
    recordingIndex = (recordingIndex + step + recordingItems.length) % recordingItems.length;
    highlightMessage(true);
}

function playMessage() {
    playMessageSound("start");

    if (recordingItems.length === 0) {
        return;
    }

    recordingItems.forEach(a => { if (a !== recordingItems[recordingIndex]) a.pause(); });
    const audio = recordingItems[recordingIndex];

    userStartAudio().then(() => {
        routeToVisualizer(audio);
        audio.currentTime = 0;
        audio.play();
    });
    
}

function stopMessage() {
    playMessageSound("stop");

    if (recordingItems.length === 0) {
        return;
    }

    recordingItems.forEach(a => a.pause());
    recordingItems[recordingIndex].currentTime = 0;
}

function highlightMessage( toggle ) {
    const audio = recordingItems[recordingIndex];
    
    if (!audio) {
        return;
    }

    audio.style.outline = toggle ? "5px dotted blue" : "none";

    if (toggle) {
        // ohmygod may scrollintoview
        audio.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}

// ---------------
// RECORDING AUDIO UTILS
// https://anwaarulislaam.medium.com/build-a-voice-recorder-app-using-only-javascript-and-html-212114a468ca
// ---------------
function startHoldRecord() {
    if (holdTimer) return;

    const indicator = document.getElementById("message-indicator");
    const frameTime = HOLD_TO_RECORD_TIME / 4;
    holdIndicatorStep = 0;
    indicator.textContent = "Hold to record";

    holdIndicatorInterval = setInterval(() => {
        holdIndicatorStep = (holdIndicatorStep % 3) + 1;
        indicator.textContent += ".";
    }, frameTime);

    holdTimer = setTimeout(() => {
        holdTimer = null;
        indicator.textContent = "⋆｡˚ ☁︎ ˚｡⋆｡˚☽˚｡⋆ ";
        stopHoldIndicator();
        startRecording();
    }, HOLD_TO_RECORD_TIME);
}

function stopHoldIndicator() {
    if (holdIndicatorInterval) {
        clearInterval(holdIndicatorInterval);
        holdIndicatorInterval = null;
    }
}

function restoreIndicatorText() {
    document.getElementById("message-indicator").textContent =
        recordingItems.length === 0 ? "Leave a message!" : "Leave a reply!";
}

function cancelHoldRecord() {
    if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
    }
    stopHoldIndicator();
    restoreIndicatorText();
}

function startRecording() {
    limitReached = false;
    stopMessage();

    showConsoleLog("[utils.js - startRecording] Recording started!");

    if (recording || !pendingEntry) {
        return;
    }

    isRecording = true;
    document.getElementById("RECORDING").hidden = false;
    playMessageSound("record");
    recording = true; // big lock 1
    const entry = pendingEntry; // big lock 2

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recordingStream = stream;
            const options = MediaRecorder.isTypeSupported(OGG_TYPE) ? { mimeType: OGG_TYPE } : {};
            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", x => audioChunks.push(x.data));

            mediaRecorder.addEventListener("stop", () => {
                recordingStream.getTracks().forEach(i => i.stop()); // release the mic by default
                const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

                // non-blocking stuff you love to see it
                saveRecording(entry, blob);
                addRecording(blob);
            });

            mediaRecorder.start();

            recordingLimitTimer = setTimeout(() => {
                showConsoleLog("[utils.js - startRecording] Time limit reached");
                limitReached = true;
                document.getElementById("message-indicator").textContent = "Record time limit reached...";
                stopRecording();
            }, MAX_RECORDING_TIME);
        })
        .catch(error => {
            recording = false;
            isRecording = false;
            document.getElementById("RECORDING").hidden = true;
            showConsoleLog(`[utils.js - startRecording] Error: ${error}`);
        });
}

function stopRecording() {
    if (!recording || !mediaRecorder || mediaRecorder.state === "inactive") {
        document.getElementById("RECORDING").hidden = true;
        return;
    }

    clearTimeout(recordingLimitTimer);
    recordingLimitTimer = null;

    playMessageSound("record");
    recording = false; // big unlock
    document.getElementById("RECORDING").hidden = true;
    mediaRecorder.stop(); // release the mic

    isRecording = false;
}

function addRecording( blob, select=true ) {
    const list = document.getElementById("recordings-list");

    if (!list) {
        return;
    }

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(blob);
    audio.controls = true;
    audio.addEventListener("ended", () => playMessageSound("stop"));
    
    const flavortext = document.createElement("p");
    flavortext.textContent = FLAVORTEXTS[flavortextIndex];
    flavortextIndex = (flavortextIndex + 1) % FLAVORTEXTS.length;

    list.appendChild(audio);
    list.appendChild(flavortext);
    recordingItems.push(audio);

    if (select) {
        highlightMessage(false);
        recordingIndex = recordingItems.length - 1;
        highlightMessage(true);
    }

    if (!limitReached) {
        restoreIndicatorText();
    }
}

function extFor( mimeType ) {
    return mimeType.includes("ogg") ? "ogg" : "webm";
}

async function saveRecording(name, blob) {
    showConsoleLog(`[utils.js - saveRecording] Uploading ${blob.size} bytes, type ${blob.type}`);
    highlightMessage(false);

    if (blob.size === 0) {
        showConsoleLog(`[utils.js - saveRecording] Blob size is 0`);
        return;
    };

    const ext = extFor(blob.type);
    const res = await fetch(
        `${MESSAGE_SERVER}/recording?name=${encodeURIComponent(name)}&ext=${ext}`,
        { method: "POST", body: blob }
    );

    if (!res.ok) {
        showConsoleLog(`[utils.js - saveRecording] Recording upload failed: ${res.status}`);
    }

    const file = await res.text();

    if (!Object.hasOwn(directory, name)) {
        await addDirectoryEntry(name);
    }

    recordingIndex = recordingItems.length - 1;
    highlightMessage(true);
    showConsoleLog(`[utils.js - saveRecording] Saved: ${name}/${file}`);
}

async function loadRecordings( name ) {
    const token = ++loadGuard;

    const list = document.getElementById("recordings-list");
    list.innerHTML = "";
    recordingItems = [];
    recordingIndex = 0;

    const res = await fetch(`${MESSAGE_SERVER}/list?name=${encodeURIComponent(name)}`);

    if (!res.ok) {
        showConsoleLog(`[utils.js - loadRecordings] List failed: ${res.status}`);
    }

    const files = await res.json();

    for (const file of files) {
        if (token !== loadGuard) {
            return; // newer load started, stop doing stuff for now
        }

        const fileRes = await fetch(
            `${MESSAGE_SERVER}/file?name=${encodeURIComponent(name)}&file=${encodeURIComponent(file)}`
        );

        if (!fileRes.ok) {
            showConsoleLog(`[utils.js - loadRecordings] Could not load: ${file}: ${fileRes.status}`);
            continue;
        }

        addRecording(await fileRes.blob(), false);
    }

    if (token === loadGuard) {
        highlightMessage(true);
    }

    if (recordingItems.length === 0) {
        document.getElementById("message-indicator").textContent = "Leave a message!";
    } else {
        document.getElementById("message-indicator").textContent = "Leave a reply!";
    }

    showConsoleLog(`[utils.js - loadRecordings] Loaded ${files.length} recordings for ${name}`);
}

async function addDirectoryEntry( name ) {
    directory[name] = "message";

    const res = await fetch(`${MESSAGE_SERVER}/directory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(directory, null, 2)
    });

    if (!res.ok) {
        showConsoleLog(`[utils.js - addDirectoryEntry] Directory save failed: ${res.status}`);
    }

    showConsoleLog(`[utils.js - addDirectoryEntry] Added directory entry: ${name}`);
}