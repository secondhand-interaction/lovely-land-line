// Setting variables below
var debug = true; // set to false to make it less verbose
var gameLoop = true;

const COLORS = { q: 'red', w: 'green', a:'blue', s:'yellow'}
const DIAL_COUNT = 4;

var dialedColor;

function init() {
    showConsoleLog("[init]");
    readyGame();
}
