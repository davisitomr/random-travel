

let options = ["City 1","City 2","City 3","City 4","City 5","City 6"];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let canvasStyle;

document.getElementById("spin").addEventListener("click", spin);

function colorGenerator(n) {
  let colorGeneratorCode = "0123456789ABCDEF";
  return String(colorGeneratorCode.substr((n >> 4) & 0x0F,1)) + colorGeneratorCode.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + colorGenerator(r) + colorGenerator(g) + colorGenerator(b);
}

function getColor(item, maxitem) {
  let phase = 0;
  let center = 128;
  let width = 127;
  let frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  let canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    let outsideRadius = 200;
    let textRadius = 160;
    let insideRadius = 50;

    canvasStyle = canvas.getContext("2d");
    canvasStyle.clearRect(0,0,500,500);

    canvasStyle.strokeStyle = "black";
    canvasStyle.lineWidth = 3;

    //canvasStyle.font = 'bold 15px Rubik Mono One';

    for(let i = 0; i <= options.length; i++) {
      let angle = startAngle + i * arc;
      //canvasStyle.fillStyle = colors[i];
      canvasStyle.fillStyle = getColor(i, options.length);

      canvasStyle.beginPath();
      canvasStyle.arc(250, 250, outsideRadius, angle, angle + arc, false);
      canvasStyle.arc(250, 250, insideRadius, angle + arc, angle, true);
      canvasStyle.stroke();
      canvasStyle.fill();

      canvasStyle.save();
      canvasStyle.shadowOffsetX = -1;
      canvasStyle.shadowOffsetY = -1;
      canvasStyle.shadowBlur    = 0;
      canvasStyle.shadowColor   = "rgb(220,220,220)";
      canvasStyle.fillStyle = "black";
      canvasStyle.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      canvasStyle.rotate(angle + arc / 2 + Math.PI / 2);
      let text = options[i];
      canvasStyle.fillText(text, -canvasStyle.measureText(text).width / 2, 0);
      canvasStyle.restore();
    } 

    //Arrow
    canvasStyle.fillStyle = "black";
    canvasStyle.beginPath();
    canvasStyle.moveTo(250 - 4, 250 - (outsideRadius + 5));
    canvasStyle.lineTo(250 + 4, 250 - (outsideRadius + 5));
    canvasStyle.lineTo(250 + 4, 250 - (outsideRadius - 5));
    canvasStyle.lineTo(250 + 9, 250 - (outsideRadius - 5));
    canvasStyle.lineTo(250 + 0, 250 - (outsideRadius - 13));
    canvasStyle.lineTo(250 - 9, 250 - (outsideRadius - 5));
    canvasStyle.lineTo(250 - 4, 250 - (outsideRadius - 5));
    canvasStyle.lineTo(250 - 4, 250 - (outsideRadius + 5));
    canvasStyle.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 3000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  let degrees = startAngle * 180 / Math.PI + 90;
  let arcd = arc * 180 / Math.PI;
  let index = Math.floor((360 - degrees % 360) / arcd);
  canvasStyle.save();
  canvasStyle.font = 'bold 30px Helvetica, Arial';
  let text = options[index]
  canvasStyle.fillText(text, 250 - canvasStyle.measureText(text).width / 2, 250 + 10);
  canvasStyle.restore();
}

function easeOut(t, b, c, d) {
  let ts = (t/=d)*t;
  let tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();