// ---------------
// MESSAGE VISUALIZATION p5.js SCRIPT
// https://github.com/Ronik22/Audio-Visualizer/blob/main/examples/linear%20waveform%201/app.js */
// ---------------

let analyzer = null;

function setup() {
  const element = document.getElementById("message-visualizer");
  const canvas = createCanvas(element.clientWidth, element.clientHeight);
  canvas.parent("message-visualizer");

  analyzer = getAudioContext().createAnalyser();
  analyzer.fftSize = 1024;
  getTap().connect(analyzer);
}

function windowResized() {
  const element = document.getElementById("message-visualizer");
  resizeCanvas(element.clientWidth, element.clientHeight);
}
function draw() {
    clear();
    stroke(0, 0, 255); 
    strokeWeight(2);
    noFill();

    const wave = new Float32Array(analyzer.fftSize);
  analyzer.getFloatTimeDomainData(wave);

    beginShape();
    for (let x = 0; x < width; x += 10) {
        const index = floor(map(x, 0, width, 0, wave.length));
        const y = wave[index] * 200 + height / 1.85;
        vertex(x, y);
    }
    endShape();
}