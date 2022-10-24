"use strict";

var canvas;
var gl;


var colors = []
var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var flag = false;
//var numElements = 8


   /* var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  0.5)
    ]*/

    var vertices = [
        vec3(-0.55, -0.5,  0.25), //0
        vec3(-0.55,-0.2,0.25), //1
        vec3(-0.55,-0.2,-0.25), //2 
        vec3(-0.55,-0.5,-0.25), //3
        vec3(0.25,-0.5,.25), //4 
        vec3(0.25,-0.2,0.25), //5
        vec3(0.25,-0.5,-0.25), //6 
        vec3(0.25,-0.2,-0.25), //7

        vec3(.25,-.2,-.25), //8
        vec3(.25,.5,-.25), //9
        vec3(-.15,.5,-.25), //10
        vec3(-.15, -.2, .25), //11
        vec3(.25, .5, .25), //12
        vec3(-.15,.5,.25), //13
        vec3(-.15,-.2,-.25) //14
    ];

    var vertexColors = [
        vec4(1.0, 0.0, 0.0, 1.0), // red
        //vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        //vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        //vec4(1.0, 1.0, 1.0, 1.0),  // white
        //vec4(0.0, 1.0, 1.0, 1.0)   // cyan */
    ];


var indices = [
    //Bottom of J
    0, 1, 2, 3, 255, //Left bottom
    0, 4, 5, 1, 255, //Front bottom
    3, 2, 7, 6, 255, //Back bottom
    0, 4, 6, 3, 255, //Bottom bottom
    2, 1, 5, 7, 255, //Top bottom
    4, 6, 7, 5, 255,//Right bottom
    
    //Middle of J
    5,12,13,11, 255, //Front middle
    5,7,9,12, 255,  //Right middle
    14,7,9,10, 255,   //Back middle
    11,13,10,14         //Left middle
    //Top of J

];

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.PRIMITIVE_RESTART_FIXED_INDEX);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    for(var i = 0; i < indices.length; i++){
        colors.push(vertexColors[i % vertexColors.length])
    }

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    console.log(indices.length);
    gl.drawElements(gl.TRIANGLE_FAN,indices.length, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(render);
}
