var img, img_w, img_h, circles, row, min_diam, max_diam, analyzed_diam, num_circles;

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

    var circle_num = map(circles[0].d, min_diam, max_diam, 0, 1);
    var count = 0;
    for (var j = 0; j <= 1; j += 1/(num_circles-1)) {
        if (circle_num <= j) {
            circle_num = count;
            break;
        }
        count++;
    }

    activeRow.append("<td>" + circle_num + "</td>");
    for (var i = 1; i < circles.length; i++) {
        if (i % rowLength == 0) {
            table.append("<tr></tr>");
            activeRow = table.children().children().last();
        }

        circle_num = map(circles[i].d, min_diam, max_diam, 0, 1);
        count = 0;
        for (j = 0; j <= 1; j += 1/(num_circles-1)) {
            if (circle_num <= j) {
                circle_num = count;
                break;
            }
            count++;
        }

        activeRow.append("<td>" + circle_num + "</td>");
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

    num_circles = parseInt($('#num_circles').val()) + 1;
    min_diam = parseInt($('#min_diam').val());
    max_diam = parseInt($('#max_diam').val());
    analyzed_diam = parseInt($('#analyzed_diam').val());

    circles = [];

    img.loadPixels();
    var pxls = img.pixels;
    row = 0;
    var x = floor(max_diam / 2.0);
    var y = floor(max_diam / 2.0);
    var c, darkness, diam;
    var d = pixelDensity();

    for (var i = x * 4 * d; i < pxls.length; i += analyzed_diam * 4 * d) {
        c = color(pxls[i], pxls[i + 1], pxls[i + 2]);

        // Value from 0 to 1 (1 being the darkest)
        darkness = 1 - brightness(c) / 256.0 ;

        var diff;
        for (var j = 0; j <= 1; j += 1/(num_circles-1)) {
            diff = abs(j - darkness);
            if (diff <= (1/(num_circles-1))/2) {
                darkness = j;
                break;
            }
        }

        diam = map(darkness, 0, 1, min_diam, max_diam);

        circles.push(new Circle(x, y, diam, color(0)));
        x += analyzed_diam;
        if (x >= img.width) {
            row++;
            x = floor(analyzed_diam / 2.0);
            i = x * 4 * d + img.width * 4 * d * row * analyzed_diam;
            y += analyzed_diam;
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