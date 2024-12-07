// Serial variables
let mSerial;
let connectButton;
let readyToReceive;

// Project variables
let ellipseX = 0; // 用电位器控制的水平位置
let currentColor = [255, 255, 255]; // 初始颜色为白色
let soundThreshold = 300; // 声音传感器的阈值

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  // 检查数据格式
  if (!line.includes(",")) {
    print("Error: ", line);
    readyToReceive = true;
    return;
  }

  // 从串口字符串解析数据，格式为 "A0:XXX,A1:XXX"
  let parts = line.split(",");
  let a0 = parseInt(parts[0].split(":")[1]); // 电位器值
  let a1 = parseInt(parts[1].split(":")[1]); // 声音传感器值

  // 更新项目变量
  ellipseX = map(a0, 0, 1023, 0, width); // 映射电位器值到画布宽度

  // 如果声音值超过阈值，改变颜色
  if (a1 > soundThreshold) {
    currentColor = [random(255), random(255), random(255)];
  }

  // Serial update
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
  // Setup project
  createCanvas(windowWidth, windowHeight);

  // Setup serial
  readyToReceive = false;

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2 - 50, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  // Project logic
  background(0);

  // 绘制圆形
  fill(currentColor);
  noStroke();
  ellipse(ellipseX, height / 2, 100, 100);

  // 更新串口：请求新数据
  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab);
  }

  // 更新串口：读取新数据
  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }
}
