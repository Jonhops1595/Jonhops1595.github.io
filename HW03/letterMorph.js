"use strict";

var gl;

var morphPoint = 0.0;
    //0.0 = U
    //1.0 = I
var morphPointLoc;

var color = vec4(0.0, 0.0, 1.0, 1.0);
var colorLoc;

var delay = 100;
var morphToggle = true;
    //True: Moving 
    //False: Stopped

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var U_vertices = [ //Starting vetices 
        vec2(-.5,.8),
        vec2(-.35,.8),
        vec2(-.35,-.25),
        vec2(0,-.25),
        vec2(.35,-.25),
        vec2(.35,.8),
        vec2(.5,.8),
        vec2(.5,0),
        vec2(.5,-.5),
        vec2(0,-.5),
        vec2(-.5,-.5),
        vec2(-.5,0)
    ];

    var I_vertices = [
        vec2(-.75,.65),
        vec2(.75,.65),
        vec2(.75,.55),
        vec2(.25,.55),
        vec2(.25,-.55),
        vec2(.75,-.55),
        vec2(.75,-.65),
        vec2(-.75,-.65),
        vec2(-.75,-.55),
        vec2(-.25,-.55),
        vec2(-.25,.55),
        vec2(-.75,.55)
    ]


    // Load the data into the GPU

    //U Buffer
    var uBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(U_vertices), gl.STATIC_DRAW);

    //I Buffer
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(I_vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    morphPointLoc = gl.getUniformLocation( program, "uMorphPoint" );

    //define the uniform variable in the shader, aColor
    colorLoc = gl.getUniformLocation( program, "aColor");


   // button listener here, toggle rotation
    document.getElementById("morphButton").onclick = () => morphToggle = !morphToggle;

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(thetaLoc, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.LINES, 0, 8);

    setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}
