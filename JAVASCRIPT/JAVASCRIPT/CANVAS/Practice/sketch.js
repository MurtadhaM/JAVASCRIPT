let ghosts = [];

function setup() {
  createCanvas(400, 400);

  // Create 10 ghosts.
  // Try changing this to 100!
  for (var i = 0; i < 10; i++) {
    ghosts.push(new Ghost());
  }

  noStroke();
}

function draw() {
  background(32);
  for (const ghost of ghosts) {
    ghost.moveAndDraw();
  }
}

// This class keeps track of all the variables and functions
// we need for one ghost. By creating multiple *instances*
// of this class, we can fill our screen with ghosts!
class Ghost {

  constructor() {

    this.tail = [];
    this.tailLength = 30;

    // Give this ghost a random size and starting position.
    this.ghostSize = random(10, 100);
    this.ghostX = random(width);
    this.ghostY = random(height);

    // These variables are used to make the ghosts
    // follow different paths.
    // Try changing these numbers!
    this.cosOffset = random(100);
    this.wiggliness = random(2, 10);
    this.floatiness = random(2, 10);


    // Give this ghost a random color.
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  moveAndDraw() {

    // Move the ghost left and right.
    this.ghostX += cos((this.cosOffset + frameCount) / 10) * this.wiggliness;
    // Move the ghost up.
    this.ghostY -= this.floatiness;
    // If this ghost goes off the top, start it back at the bottom.
    if (this.ghostY < -this.ghostSize) {
      this.ghostY = height + this.ghostSize;
    }

    // Add a point to the beginning of the array.
    this.tail.unshift({x: this.ghostX, y: this.ghostY});
    // If the array is too big, remove the last point.
    if (this.tail.length > this.tailLength) {
      this.tail.pop();
    }


    // Loop over the tail and draw the points.
    for (let index = 0; index < this.tail.length; index++) {
      const tailPoint = this.tail[index];

      // Tail gets smaller and more transparent.
      const pointSize = this.ghostSize * (this.tail.length - index) / this.tail.length;
      const pointAlpha = 255 * (this.tail.length - index) / this.tail.length;

      fill(this.r, this.g, this.b, pointAlpha);
      ellipse(tailPoint.x, tailPoint.y, pointSize);
    }

    // Draw this ghost's face. O_O
    fill(32);
    ellipse(this.ghostX - this.ghostSize * .2,
            this.ghostY - this.ghostSize * .1,
            this.ghostSize * .2);
    ellipse(this.ghostX + this.ghostSize * .2,
            this.ghostY - this.ghostSize * .1,
            this.ghostSize * .2);
    ellipse(this.ghostX,
            this.ghostY + this.ghostSize * .2,
            this.ghostSize * .2);
  }
}