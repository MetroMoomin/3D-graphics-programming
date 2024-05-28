function start() {
	const canvas = document.getElementById("my_canvas");
//Inicialize the GL contex
	const gl = canvas.getContext("webgl2");
	if (gl === null) {
	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	return;
}

console.log("WebGL version: " + gl.getParameter(gl.VERSION));
console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
console.log("Vendor: " + gl.getParameter(gl.VENDOR));

const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();


	const vsSource = 
			`#version 300 es
			precision highp float;
			in vec2 position;
			void main(void)
			{
			   gl_Position = vec4(position, 0.0, 1.0);
			}
			`;

			const fsSource = 
			`#version 300 es
		   precision highp float;
		   out vec4 frag_color;
		   uniform vec3 uni_color;
		   void main(void)
	   	{
		      //frag_color = vec4(1.0, 0.5, 0.25, 1.0);
			  frag_color = vec4(uni_color, 1.0);
	   	}
			`;


//compilation vs
		gl.shaderSource(vs, vsSource);		
		gl.compileShader(vs);
		if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(vs));
                }

//compilation fs
		gl.shaderSource(fs, fsSource);     
		gl.compileShader(fs);
		if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(fs));
                }


	gl.attachShader(program,vs);
	gl.attachShader(program,fs);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(program));
	}

   gl.useProgram(program);

const vertices =
[
	0.0, 0.5,     
    0.3535, 0.3535, 
    0.5, 0.0,     
    0.3535, -0.3535, 
    0.0, -0.5,    
    -0.3535, -0.3535, 
    -0.5, 0.0,    
    -0.3535, 0.3535, 
    0.0, 0.5   
];

var uni_color_Loc = gl.getUniformLocation(program, 'uni_color');
var maincolor = [1.0,1.0,1.0];
gl.uniform3fv(uni_color_Loc, new Float32Array(maincolor));
let primitiveType = gl.TRIANGLE;

const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const position = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);


function draw(){
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(primitiveType, 0, 9);
	window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);

// Add the event listeners for mousedown, mousemove, and mouseup
window.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
   alert("x ="+x+ " y ="+y);
});

// Add the event listeners for keydown, keyup
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      alert('Lewo');
    break;
    case 38: // Up
      alert('Góra');
    break;
    case 39: // Right
      alert('Prawo');
    break;
    case 40: // Down
      alert('Dół');
    break;
	case 82:
		maincolor = [1.0, 0.0 , 0.0];
		gl.uniform3fv(uni_color_Loc, new Float32Array(maincolor));
	break;
	case 71:
		maincolor = [0.0, 1.0, 0.0];
		gl.uniform3fv(uni_color_Loc, new Float32Array(maincolor));
	break;
	case 66:
		maincolor = [0.0, 0.0, 1.0];
		gl.uniform3fv(uni_color_Loc, new Float32Array(maincolor));
	break;
	case 49: // 1: LINES
                primitiveType = gl.LINES;
                break;
            case 50: 
                primitiveType = gl.LINE_LOOP;
                break;
            case 51: 
                primitiveType = gl.LINE_STRIP;
                break;
            case 52: 
                primitiveType = gl.TRIANGLES;
                break;
            case 53: 
                primitiveType = gl.TRIANGLE_STRIP;
                break;
            case 54: 
                primitiveType = gl.TRIANGLE_FAN;
                break;
  }
}, false);




}
