var img, img_w, img_h, circles, row;

function setup() {
    var canvas = createCanvas(50, 50);
    canvas.parent('out');
    imageMode(CENTER);
}

function table() {
    resizeCanvas(0, 0);

    load_circles();

    background(255);
    var table = $("#diam_table");
    table.empty();
    table.show();
    var rowLength = circles.length / row;
    table.append("<tr></tr>");
    activeRow = table.children().children().last();

    activeRow.append("<td>" + floor(circles[0].d) + "</td>");
    for (i = 1; i < circles.length; i++) {
        if (i % rowLength == 0) {
            table.append("<tr></tr>");
            activeRow = table.children().children().last();
        }
        activeRow.append("<td>" + floor(circles[i].d) + "</td>");
    }
}

function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            img = loadImage(e.target.result, img_loaded);
            $("#file_name").empty().append("" + input.files[0].name)
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
    $("#diam_table").hide();

    resizeCanvas(img.width, img.height);

    load_circles();

    background(255);
    for (i = 0; i < circles.length; i++) {
        circles[i].display();
    }
}

function load_circles(){
    var max_diam = parseInt($('#max_diam').val());
    var draw_diam = parseInt($('#draw_diam').val());

    var numcircles = 4;
    var minsize = 1;
    var maxsize = 4;
    circles = [];

    img.loadPixels();
    var pxls = img.pixels;
    row = 0;
    var x = floor(max_diam / 2.0);
    var y = floor(max_diam / 2.0);
    var c, darkness, diam;
    var d = pixelDensity();

    for (var i = x * 4 * d; i < pxls.length; i += max_diam * 4 * d) {
        c = color(pxls[i], pxls[i + 1], pxls[i + 2]);

        // Value from 0 to 1 (1 being the darkest)
        darkness = 1 - brightness(c) / 256.0 ;

        var diff;
        for (var j = 0; j <= 1; j += 1/(numcircles-1)) {
            diff = abs(j - darkness)
            if (diff <= (1/(numcircles-1))/2) {
                darkness = j;
            }
        }

        diam = map(darkness, 0, 1, minsize, maxsize);

        circles.push(new Circle(x, y, diam, color(0)));
        x += max_diam;
        if (x >= img.width) {
            row++;
            x = floor(max_diam / 2.0);
            i = x * 4 * d + img.width * 4 * d * row * max_diam;
            y += max_diam;
        }
    }
}

function Circle(xt, yt, dt, ct) {
    this.d = dt; //Diameter
    this.x = xt;
    this.y = yt; //Coordinates
    this.c = ct;

    this.display = function () {
        noStroke();
        fill(this.c);
        ellipse(this.x, this.y, this.d, this.d);
    };

    this.displayNum = function () {
        text("" + this.d, this.x, this.y, 100, 100);
    };
}