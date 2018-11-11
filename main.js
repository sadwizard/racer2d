var carImage = new Image();
carImage.src = './car.png';

// function Vec(x, y) {
//   this.x = x;
//   this.y = y;
// }

// Vec.prototype = {
//   add: function(vec) {
//     this.x += vec.x;
//     this.y += vec.y;
//   }
// };

var el = document.getElementById('canvas'),
    ctx = el.getContext('2d');
    el.width = window.innerWidth;
    el.height = window.innerHeight;
var wh = window.innerWidth / 2,
    hh = window.innerHeight / 2;

ctx.fillStyle = '#923432';
ctx.globalAlpha = 1;

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function draw(x, y, deg, objectDraw) {
  ctx.save();
  
  ctx.translate(x, y);
  ctx.rotate(deg ? deg * (Math.PI / 180) : 0);
  if (objectDraw) {
    objectDraw(ctx);
  }
  
  ctx.restore();
}


function Player() {
  this.position = { x: wh,
                   y: hh };
  this.deg = 0;
  this.speed = { x: 0, y: 0 };
}

Player.prototype.draw = function() {
  draw(this.position.x, this.position.y, this.deg, function(ctx) {
    ctx.drawImage(carImage, -100, -50, 200, 100);
  });
}
  
Player.prototype.update = function() {
  var angle = (this.deg) * (Math.PI / 180);
  this.position.x += this.speed.x * Math.cos(angle);
  this.position.y += this.speed.y * Math.sin(angle);
  
  // var out = -1;
  // if (this.position.x >= window.innerWidth - 50) {
  //   this.speed.x *= out;
  //   this.speed.y *= out;
  // }
  
  // if (this.position.y >= window.innerHeight - 50) {
  //   this.speed.x *= out;
  //   this.speed.y *= out;
  // }
  
  // if (this.position.x <= 50) {
  //   this.speed.x *= out;
  //   this.speed.y *= out;
  // }
  
  // if (this.position.y <=  50) {
  //   this.speed.x *= out;
  //   this.speed.y *= out;
  // }
  
  
  var speedout = 0.05;
  if (this.speed.x > 0 || this.speed.y > 0) {
    this.speed.x -= speedout;
    this.speed.y -= speedout;
  }
  
  if (this.speed.x < 0 || this.speed.y < 0) {
    this.speed.x += speedout;
    this.speed.y += speedout;
  }
}

function MapObjects(amount) {
  this.objects = [];

  for(var i=0; i < amount; i++) {
    this.add();
  }
}

MapObjects.prototype.add = function() {
  var x = random(0, 5000);
  var y = random(0, 5000);
  var size = random(50, 500);
  var angle = random(0, 360);
  var color = '#fd4987';

  this.objects.push({
    draw: function() {
      draw(x, y, angle, function(ctx) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = color;
        ctx.fillRect(-(size / 2), -(size / 2), size, size);
        ctx.globalAlpha = 1;
      });
    }
  })
}

MapObjects.prototype.draw = function () {
  if (this.objects.length > 0) {
    for(var key in this.objects) {
      if (this.objects[key].draw) {
        this.objects[key].draw();
      }
    }
  }
}

function Camera(x, y, width, height) {
  this.position = { x: x, y: y };
  this.resolution = { width: width, height: height };
  this.scale = 1;
  this.speed = 1;
}

Camera.prototype = {
  draw: function(cb) {
    ctx.save();
    var x = (this.position.x - ((this.resolution.width / this.scale) / 2)) * -1;
    var y = (this.position.y - ((this.resolution.height / this.scale) / 2)) * -1;

    ctx.scale(this.scale, this.scale);
    ctx.translate(x, y);

    if (cb) {
      cb();
    }

    ctx.scale(-this.scale, -this.scale);
    ctx.translate(-x, -y);
    ctx.restore();
  }
};

var mapObjects = new MapObjects(100);
var player = new Player();
var camera = new Camera(0, 0, window.innerWidth, window.innerHeight);

var map = {};
function keyHandle(e) {
  map[e.keyCode] = e.type == 'keydown';
}


document.addEventListener('keyup', keyHandle);

document.addEventListener('keydown', keyHandle);
var maxCarAngle = 3;
function engine() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  camera.draw(function() {

    mapObjects.draw();
    player.draw();
    player.update();
  });



  if (map[65]) {
    //left
    var angleX = player.speed.x * 0.5;
    player.deg -= angleX > 2 ? maxCarAngle : angleX;
  }
  
  if (map[68]) {
    //right
    var angleY = player.speed.y * 0.5;
    player.deg += angleY > 2 ? maxCarAngle : angleY;
  }

  if (map[87]) {
    //up
    player.speed.x += 0.1;
    player.speed.y += 0.1;
  }
  
  if (map[83]) {
    //down
    player.speed.x -= 0.1;
    player.speed.y -= 0.1;
  }

  var cameraScale = player.speed.x * 0.1;
  var cameraScaleOut = 1;

  if (cameraScale >= 1) {
    cameraScaleOut = cameraScale;
  }

  if (cameraScale >= 1.5) {
    cameraScaleOut = 1.5;
  }

  camera.scale = 2 - cameraScaleOut;

  // camera
  // if (map[37]) {
  //   camera.position.x += camera.speed;
  // }

  // if (map[39]) {
  //   camera.position.x -= camera.speed;
  // }

  // if (map[40]) {
  //   camera.position.y -= camera.speed;
  // }

  // if (map[38]) {
  //   camera.position.y += camera.speed;
  // }

  camera.position.x = player.position.x;
  camera.position.y = player.position.y;

  requestAnimationFrame(engine);
}

requestAnimationFrame(engine);
