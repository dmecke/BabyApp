var u = [];
var v = [];
var zoom = null;
var canvas = null;
var ctx = null;
var fpsCount = 0;
var fpsTime = new Date();
var ship = null;

function init() {
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      su(x, y, 0);
      sv(x, y, 0);
    }
  }

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  zoom = canvasSize / size;
  ship = { x: size / 2, y: size / 2, velX: 0, velY: 0 };

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  $(canvas).mousedown(function(e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    spill(Math.floor(x / zoom), Math.floor(y / zoom), depth);
  });
}

function process() {
  var uTemp = cloneArray(u);
  var vTemp = cloneArray(v);
  var uVar = null;
  var vVar = null;

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      vVar = gv(x, y);
      vVar += (gu(x - 1, y) + gu(x + 1, y) + gu(x, y - 1) + gu(x, y + 1)) / 4;
      vVar -= gu(x, y);
      vVar *= friction;

      uVar = gu(x, y);
      uVar += vVar;

      if (uVar > 128) {
        uVar = 128;
      }
      if (uVar < -128) {
        uVar = -128;
      }

      uTemp[x + y * size] = uVar;
      vTemp[x + y * size] = vVar;
    }
  }

  u = uTemp;
  v = vTemp;
}

function processShip() {
    var shipU = gu(ship.x, ship.y);
    ship.velX += acceleration * (gu(ship.x - 1, ship.y) - shipU);
    ship.velX -= acceleration * (gu(ship.x + 1, ship.y) - shipU);
    ship.velY += acceleration * (gu(ship.x, ship.y - 1) - shipU);
    ship.velY -= acceleration * (gu(ship.x, ship.y + 1) - shipU);

    ship.x += Math.round(ship.velX);
    ship.y += Math.round(ship.velY);

    ship.velX *= shipFriction;
    ship.velY *= shipFriction;
}

function render() {
  var imageData = ctx.getImageData(0, 0, size, size);
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      ctx.fillStyle = 'rgb(0, 0, ' + Math.floor(gu(x, y) + 128) + ')';
      ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
    }
  }
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(ship.x * zoom, ship.y * zoom, zoom, zoom);
}

function spill(x, y, depth) {
  su(x,  y, depth);
}

function gu(x, y) {
  if (u[x + y * size]) {
    return u[x + y * size];
  } else {
    return 0;
  }
}

function su(x, y, value) {
  u[x + y * size] = value;
}

function gv(x, y) {
  if (v[x + y * size]) {
    return v[x + y * size];
  } else {
    return 0;
  }
}

function sv(x, y, value) {
  v[x + y * size] = value;
}

function cloneArray(a) {
  var b = [];
  for (var i = 0; i < a.length; a++) {
    b[i] = a[i];
  }

  return b;
}

function loop() {
    process();
    processShip();
    render();
    fpsCount++;
}

function fps() {
  var date = new Date();
  var timediff = date.getTime() - fpsTime.getTime();
  $('#fps').html(Math.round(fpsCount * 1000 / timediff) + ' fps');
  fpsCount = 0;
  fpsTime = date;
}
