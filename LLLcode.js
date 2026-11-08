// ---------------
// SHARED VARIABLES
// ---------------
var debug = true; // set to false to make it less verbose

const COLORS = { q: 'red', w: 'green', a:'blue', s:'yellow'}
const DIAL_COUNT = 4;

var dialedColor;

// ---------------
// INITIALIZATION
// ---------------
function init() {
    showConsoleLog("[LLLcode.js - init] Lovely Land Line");
    readyGame();
}