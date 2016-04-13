var fileSelect;
var drawButton;
var img, img_w, img_h;

function setup() {
  var canvas = createCanvas(100, 100);
  canvas.parent('out');
  // fileSelect = createFileInput(gotFile);
  imageMode(CENTER);
}

function re_draw() {
  half_tone();
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      img = loadImage(e.target.result, img_loaded);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function resizeImg() {
  var factor = parseInt($('#resize_factor').val()) / 100;
  img.resize(floor(img_w * factor), floor(img_h * factor));
}

function img_loaded() {
  img_w = img.width;
  img_h = img.height;
  half_tone();
}

function half_tone() {

  resizeCanvas(img.width, img.height);
  var max_diam = parseInt($('#max_diam').val());
  var draw_diam = parseInt($('#draw_diam').val());
  var circles = [];

  img.loadPixels();
  var pxls = img.pixels;
  var row = 0;
  var x = floor(max_diam / 2.0);
  var y = floor(max_diam / 2.0);
  var c, diam;
  var d = pixelDensity();

  for (var i = x * 4 * d; i < pxls.length; i += max_diam * 4 * d) {
    c = color(pxls[i], pxls[i + 1], pxls[i + 2]);
    diam = draw_diam - brightness(c) / 255.0 * draw_diam;
    circles.push(new Circle(x, y, diam, color(0)));
    x += max_diam;
    if (x >= img.width) {
      row++;
      x = floor(max_diam / 2.0);
      i = x * 4 * d + img.width * 4 * d * row * max_diam;
      y += max_diam;
    }
  }

  background(255);
  for (i = 0; i < circles.length; i++) {
    circles[i].display();
  }
}

function Circle(xt, yt, dt, ct) {
  this.d = dt; //Diameter
  this.x = xt;
  this.y = yt; //Coordinates
  this.c = ct;
  this.display = function() {
    noStroke();
    fill(this.c);
    ellipse(this.x, this.y, this.d, this.d);
  };
}