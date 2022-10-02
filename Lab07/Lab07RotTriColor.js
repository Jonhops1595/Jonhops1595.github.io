"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var color = vec4(0.0, 0.0, 1.0, 1.0);
var colorLoc;

var delay = 100;
var rotation = true;
var direction = true;

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

    var vertices = [ //Starting vetices 
        vec2(1,0),
        vec2(-Math.sqrt(2)/2,Math.sqrt(2)/2),
        vec2(-Math.sqrt(2)/2,-Math.sqrt(2)/2)
    ];


    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation( program, "uTheta" );

    //define the uniform variable in the shader, aColor



   // button listener here, toggle rotation



   // keyboard listener here
    window.onkeydown = (event) => {
        var key = String.fromCharCode(event.keyCode);
        switch(key){
            case '1':   // '1' = toggle rotation
                rotation = !rotation;
                break;
            case '2':   // '2' = triangle is red (use the variable named color)
                color = vec4(1.0,0.0,0.0,1.0); //red
                break;
            case '3':   // '3' = triangle is green (use the variable named color)
                color = vec4(0.0,1.0,0.0,1.0); //green
                break;
        }
    }

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += (rotation ? 0.1 : 0.0);
    gl.uniform1f(thetaLoc, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}
