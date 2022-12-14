"use strict";

var canvas;
var gl;

var j_positions = [];
var h_positions = [];

var colors = [];
var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var flag = false;

var morphPoint = 0.0;
    //0.0 = J
    //1.0 = H
var morphPointLoc;
var morphBy = 0.1;
var morphToggle = false;


var j_vertices = [
    vec4(-0.55, -0.5,  0.25,1.0), //0
    vec4(-0.55,-0.25,0.25,1.0), //1
    vec4(-0.55,-0.25,-0.25,1.0), //2 
    vec4(-0.55,-0.5,-0.25,1.0), //3
    vec4(0.25,-0.5,.25,1.0), //4 
    vec4(0.25,-0.25,0.25,1.0), //5
    vec4(0.25,-0.5,-0.25,1.0), //6 
    vec4(0.25,-0.25,-0.25,1.0), //7

    vec4(-.15, -.25, .25,1.0), //8
    vec4(0.25,-0.25,0.25,1.0), //9
    vec4(.25, .5, .25,1.0), //10
    vec4(-.15,.5,.25,1.0), //11
    vec4(-.15,-.25,-.25,1.0), //12
    vec4(.25,-.25,-.25,1.0), //13
    vec4(.25,.5,-.25,1.0), //14
    vec4(-.15,.5,-.25,1.0), //15

    vec4(-.65,.5,.25,1.0), //16
    vec4(.65,.5,.25,1.0), //17
    vec4(.65,.75,.25,1.0), //18
    vec4(-.65,.75,.25,1.0),//19
    vec4(-.65,.5,-.25,1.0), //20
    vec4(.65,.5,-.25,1.0), //21
    vec4(.65,.75,-.25,1.0), //22
    vec4(-.65,.75,-.25,1.0) //23

];

var h_vertices = [
    vec4(-.35,-.5,.25,1.0), //0
    vec4(-.7,-.5,.25,1.0), //1
    vec4(-.7,-.5,-.25,1.0), //2
    vec4(-.35,-.5,-.25,1.0), //3
    vec4(-.35,.75,.25,1.0), //4
    vec4(-.7,.75,.25,1.0), //5
    vec4(-.35,.75,-.25,1.0), //6
    vec4(-.7,.75,-.25,1.0), //7

    vec4(-.35,.25,.25,1.0), //8
    vec4(-.35,0,.25,1.0), //9
    vec4(.35,0,.25,1.0), //11
    vec4(.35,.25,.25,1.0), //10
    vec4(-.35,.25,-.25,1.0), //12
    vec4(-.35,0,-.25,1.0), //13
    vec4(.35,0,-.25,1.0), //14
    vec4(.35,.25,-.25,1.0), //15

    vec4(.35,.75,.25,1.0), //16
    vec4(.35,-.5,.25,1.0), //17
    vec4(.7,-.5,.25,1.0), //18
    vec4(.7,.75,.25,1.0), //19
    vec4(.35,.75,-.25,1.0), //20
    vec4(.35,-.5,-.25,1.0), //21
    vec4(.7,-.5,-.25,1.0), //22
    vec4(.7,.75,-.25,1.0), //23
]

var vertexColors = [
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    //vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0), // cyan 
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(1.0, 0.0, 0.0, 1.0)
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

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //Call draw function
    draw();
    // vertex array attribute buffer

    //J Buffer
    var jBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, jBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(j_positions), gl.STATIC_DRAW);

    //Push J Positions to shader
    var positionLoc = gl.getAttribLocation( program, "jPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    //H Buffer

    var hBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(h_positions), gl.STATIC_DRAW);

    //Push J Positions to shader
    var positionLoc = gl.getAttribLocation( program, "hPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );
    


    morphPointLoc = gl.getUniformLocation( program, "uMorphPoint" );
    thetaLoc = gl.getUniformLocation(program, "uTheta");   


    // color array atrribute buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

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

    // button listener here, toggle morph
    document.getElementById("morphButton").onclick = () => morphToggle = !morphToggle;
    render();
}

function drawFace(a,b,c,d,colorCode){
    let indices = [a, b, c, a, c, d];
    for(var i = 0; i < indices.length; i++){
        h_positions.push(h_vertices[indices[i]]);
        j_positions.push(j_vertices[indices[i]]);
        colors.push(vertexColors[colorCode]);
        //colors.push(vec4(1.0, 0.0, 0.0, 1.0));
    }
}

function draw(){

    //Bottom of J
    drawFace(0, 1, 2, 3, 0); //Left bottom
    drawFace(0, 4, 5, 1,1); //Front bottom
    drawFace(3, 2, 7, 6,2); //Back bottom
    drawFace(0, 4, 6, 3,3); //Bottom bottom
    drawFace(2, 1, 5, 7,4); //Top bottom
    drawFace(4, 6, 7, 5,5);//Right bottom
    
    //Middle of J
    drawFace(8,9,10,11,1); //Front middle
    drawFace(9,13,14,10,5);  //Right middle
    drawFace(12,13,14,15,2);   //Back middle
    drawFace(12,15,11,8,0);   //Left middle
    drawFace(15,14,10,11,4); //Top of middle
    drawFace(8,9,13,12,3,5); //Bottom of middle

    //Top of J
    drawFace(16,17,18,19,1); //Front top
    drawFace(17,21,22,18,5); //Right top
    drawFace(20,21,22,23,2); //Back top
    drawFace(20,16,19,23,0);  //Left top
    drawFace(18,22,23,19,4); //Top Top
    drawFace(17,21,20,16,3);   //Bottom top

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //Change direction of morph
    if(morphPoint >= 1.0)  morphBy = -0.007;

    else if (morphPoint <= 0.0) morphBy = 0.007;

    morphPoint += (morphToggle ? morphBy : 0.0);

    gl.uniform1f(morphPointLoc, morphPoint);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES,0, h_positions.length);
    requestAnimationFrame(render);
}
