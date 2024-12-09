
let mSerial;
let connectButton;
let readyToReceive;

let ellipseX = 0; 
let currentColor = [255, 255, 255]; 
let soundThreshold = 300; 

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  if (!line.includes(",")) {
    print("Error: ", line);
    readyToReceive = true;
    return;
  }

  let parts = line.split(",");
  let a0 = parseInt(parts[0].split(":")[1]); 
  let a1 = parseInt(parts[1].split(":")[1]);

  ellipseX = map(a0, 0, 1023, 0, width); 

  if (a1 > soundThreshold) {
    currentColor = [random(255), random(255), random(255)];
  }


  readyToReceive = true;
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);

    readyToReceive = true;
    connectButton.hide();
  }
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  readyToReceive = false;

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2 - 50, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {

  background(0);

  fill(currentColor);
  noStroke();
  ellipse(ellipseX, height / 2, 100, 100);

  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab);
  }

  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }
}
