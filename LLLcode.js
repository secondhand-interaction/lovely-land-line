// ---------------
// PROJECT CONSTANTS
// ---------------
var debug = true; // set to false to make it less verbose

const COLORS = { q: 'red', w: 'green', a:'blue', s:'yellow'}
const DIAL_COUNT = 4;

const FLAVORTEXTS = [
    "・♪ ☎︎ ♪・",
    ". ₊˚ ☎︎₊˚✧",
    "彡‧₊˚☎︎彡‧₊˚",
    "‧‿₊⊱·☏·⊰₊‿"
];

const MESSAGE_SERVER = "http://localhost:3000";
const OGG_TYPE = "audio/ogg; codecs=opus";
const HOLD_TO_RECORD_TIME = 1000;
const MAX_RECORDING_TIME = 300000; // 5 minutes

// ---------------
// INITIALIZATION
// ---------------
function init() {
    showConsoleLog("[LLLcode.js - init] Lovely Land Line");
    readyGame();
}