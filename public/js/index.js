function setup() {
  const smallerDimension =
    windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smallerDimension, smallerDimension);
}

function draw() {
  background(0);
}
