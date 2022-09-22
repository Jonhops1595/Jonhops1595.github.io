
var canvas;
var gl;

var positions;

var numTimesToSubdivide = 0;

var bufferId;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW);



    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

        document.getElementById("slider").onchange = function(event) {
        numTimesToSubdivide = parseInt(event.target.value);
        render();
    };


    render();
};

function basicLine(a,b){
    positions.push(a,b);
}

function createMountain(a, b, count)
{
    console.log("A" + a);
    console.log("B" + b);
    // check for end of recursion
    if (count == 0) {
        positions.push(a,b);
    }   
    
    // check if area is already a mountain
    else if (a[1] != 0 || b[1] != 0){
        positions.push(a,b);
    }

    else {

        //Bisect the the line into 1/3s
        var a_start = mix(a, b, 0.33);
        var b_end = mix(a, b, 0.66);

        //Get the middle raised loc
        var len = b_end[0] - a_start[0];
        var c_x = a_start[0] + len/2;
        var c_y = len * (Math.sqrt(3)/2) 
        var c = vec2(c_x,c_y);
        console.log("x: " + c_x)
        console.log("y: " + c_y);


        --count;

        //Four new lines
        createMountain(a, a_start, count);
        createMountain(a_start, c, count);
        createMountain(c, b_end, count);
        createMountain(b_end, b, count);
    }
}

function render()
{
    var vertices = [
        vec2(-1.00, 0.00),
        vec2( 1.00, 0.00)
    ];
    positions = [];
    createMountain( vertices[0], vertices[1], numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(positions));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, positions.length );
    positions = [];
}
