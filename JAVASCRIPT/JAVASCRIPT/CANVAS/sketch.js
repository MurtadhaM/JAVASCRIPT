// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)

function setup() {
  // put setup code here
  createCanvas(400, 400);
}

function draw() {
  // put drawing code here
  background(220);

  virtex = new p5.Vector(mouseX, mouseY);
  
  virtex.add(50, 50);
  console.log(virtex)
;
}
