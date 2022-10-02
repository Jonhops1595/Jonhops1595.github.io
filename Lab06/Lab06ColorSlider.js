"use strict";
var gl;
var points;
var colors;
var sliderNum = 1;
init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec2(  -0.5 , -0.4  ),
    vec2(  -0.25 , .6  ),
    vec2(  0.0 , 1  ),
    vec2(  0.25 , .65  ),
    vec2(  0.5 ,  -.35 ),
    vec2(  -0.35 ,  .8 ),
    vec2(  0.35 ,  -.9 ),
    vec2(  -1 ,  0.4 ),
    vec2(  1 , 0.2  )
    ];

    colors=[
    vec4(.4, 0.0, .7, 1.0 ),
    vec4(.2, 1.0, .2, 1.0 ),
    vec4(1.0,1.0,1.0, 1.0 ),
    vec4(.3,0.0,0.0, 1.0 ),
    vec4(0.0,1,0.0, 1.0 ),
    vec4(0.0,0.0,1.0, 1.0 ),
    vec4(.8,.2,0.0, 1.0 ),
    vec4(0.0,.4 ,0.8, 1.0 ),
    vec4(0.2,0.9,0.2, 1.0 )
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    // a color buffer is created and attached
    var cbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    // slider event listener
    
    document.getElementById("slider").onchange = function (event) {
        sliderNum = parseInt(event.target.value);
        render();
    }


    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, sliderNum);
}