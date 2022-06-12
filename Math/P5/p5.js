/*
 * @name Points and Lines
 * @description Points and lines can be used to draw basic geometry.
 * Change the value of the variable 'd' to scale the form. The four
 * variables set the positions based on the value of 'd'.
 */

let width = 400
let height = 400
function setup() {
  // Sets the screen to be 720 pixels wide and 400 pixels high
  createCanvas(width, height, WEBGL)
  background(0)
  // Make the points 10 pixels in size
  strokeWeight(5)
  stroke(255)
}

// Contains the elements to draw
function start() {
  let points = createPoints(20, 0.5)
  return points
}

function createPoints(number, size) {
  let radius = 360 / number
  console.log(radius)
  offset = 30
  let points = []

  let distance = width / 2 - offset
  distance = distance * size
  // the distance between the points
  console.log(distance)
  for (let i = 0; i <= number; i++) {
    // draw an arc from the center of the screen
    let x = width / 2 + cos(radians(i * radius)) * distance
    let y = height / 2 + sin(radians(i * radius)) * distance
    let point1 = point(x, y)
    points.push(point1)
  }

  console.log(points.length)
  return points
}

function calculateLocation(point) {
  return point
}
