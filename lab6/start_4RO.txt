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
			in vec3 position;
				in vec3 color;
				uniform mat4 model;
				uniform mat4 view;
				uniform mat4 proj;
				in vec2 aTexCoord;
				out vec2 TexCoord;
				out vec3 Color;

			void main(void)
			{
				TexCoord = aTexCoord;
				Color = color;
			   gl_Position = proj * view * model * vec4(position, 1.0);
			}
			`;

			const fsSource = 
			`#version 300 es
		   precision highp float;
		   in vec3 Color;
		   out vec4 frag_color;
		   in vec2 TexCoord;
			uniform sampler2D texture1;
			uniform sampler2D texture2;
		   void main(void)
	   	{
			frag_color = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.5);
			//frag_color = texture(texture1, TexCoord);
			//frag_color = texture(texture2, TexCoord);
			//  frag_color = vec4(Color, 1.0);
		   //   frag_color = vec4(1.0, 0.5, 0.25, 1.0);
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



const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


	//var n_draw = 36;
	kostka();

	
	const positionAttrib = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(positionAttrib);
	gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 8*4, 0);

	const colorAttrib = gl.getAttribLocation(program, "color");
	gl.enableVertexAttribArray(colorAttrib);
	gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT,false, 8*4, 3*4);

	const texCoord = gl.getAttribLocation(program, "aTexCoord");
	gl.enableVertexAttribArray(texCoord);
	gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8*4, 6*4);

	

	const texture1 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,width, height, border, srcFormat, srcType, pixel);
	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);
		gl.generateMipmap(gl.TEXTURE_2D);   
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);   
	};
	image.crossOrigin = ""; 
	image.src = "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg";

	const texture2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	const level1 = 0;
	const internalFormat1 = gl.RGBA;
	const width1 = 1;
	const height1 = 1;
	const border1 = 0;
	const srcFormat1 = gl.RGBA;
	const srcType1 = gl.UNSIGNED_BYTE;
	const pixel1 = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, level1, internalFormat1,width1, height1, border1, srcFormat1, srcType1, pixel1);
	const image1 = new Image();
	image1.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texImage2D(gl.TEXTURE_2D, level1, internalFormat1,srcFormat1, srcType1, image1);
		gl.generateMipmap(gl.TEXTURE_2D);   
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);   
	};
	image1.crossOrigin = ""; 
	image1.src = "38b4a7d6673ca3009f95755fd993e1f3.jpg";

	// Use the shader program
gl.useProgram(program);

// Get uniform locations for the samplers
var texture1Location = gl.getUniformLocation(program, 'texture1');
var texture2Location = gl.getUniformLocation(program, 'texture2');

// Set the samplers to the corresponding texture units
gl.uniform1i(texture1Location, 0);  // Texture unit 0 for texture1
gl.uniform1i(texture2Location, 1);  // Texture unit 1 for texture2


	const model = mat4.create();
	let rot_angle = -25 * Math.PI / 180;

		mat4.rotate(model, model, rot_angle, [0, 0, 1]);

			let uniModel = gl.getUniformLocation(program, 'model');
			gl.uniformMatrix4fv( uniModel, false, model);

	const view = mat4.create();

	mat4.lookAt(view, [0,0,5], [0,0,0], [0,1,0]);
	let uniView = gl.getUniformLocation(program, 'view');
	gl.uniformMatrix4fv( uniView, false, view);

	const proj = mat4.create();

		mat4.perspective(proj, 60 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);

		let uniProj = gl.getUniformLocation(program, 'proj');
		gl.uniformMatrix4fv(uniProj, false, proj);

	
	var uniColor_loc = gl.getUniformLocation(program, 'uniColor');
	const maincolor = [1.0, 1.0, 1.0];
	gl.uniform3fv(uniColor_loc,new Float32Array(maincolor));

var pressedKey = {};
window.onkeyup = function(e) { pressedKey[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKey[e.keyCode] = true; }

//window.requestAnimationFrame(draw);
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

canvas.onclick = function()
{
	canvas.requestPointerLock();
};
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
function lockChangeAlert()
{
	if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas)
	{
		console.log('The pointer lock status is now locked');
		document.addEventListener("mousemove", set_camera_mouse, false);
	} 
	else
	{
		console.log('The pointer lock status is now unlocked');
		document.removeEventListener("mousemove", set_camera_mouse, false);
	}
}
licznik = 0;
fpsElem = document.querySelector("#fps");
startTime = 0;
elapsedTime = 0;
let cameraSpeed = 0.02;//*elapsedTime
	let cameraPos = vec3.fromValues(0, 0, 3); 
	let cameraFront = vec3.fromValues(0, 0, -1);  
	let cameraUp = vec3.fromValues(0, 1, 0);
	//let cameraRight = vec3.fromValues(1,0,0);
	  
	let obrot = 0;

	//let cameraSpeed = 0.05;

function set_camera() {
    // Update camera position for forward and backward movement
    if (pressedKey["38"]) {  // Move forward
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, cameraSpeed);
    }
    if (pressedKey["40"]) {  // Move backward
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, -cameraSpeed);
    }

    // Calculate the right vector for left and right movement
    let cameraRight = vec3.create();
    vec3.cross(cameraRight, cameraFront, cameraUp);
    vec3.normalize(cameraRight, cameraRight);

    // Update camera position for left and right movement
    if (pressedKey["37"]) {  // Move left
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraRight, -cameraSpeed);
    }
    if (pressedKey["39"]) {  // Move right
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraRight, cameraSpeed);
    }

    // Update the view matrix
    let cameraTarget = vec3.create();
    vec3.add(cameraTarget, cameraPos, cameraFront);
    let view = mat4.create();
    mat4.lookAt(view, cameraPos, cameraTarget, cameraUp);
    gl.uniformMatrix4fv(uniView, false, view);
}

let prymityw = gl.TRIANGLES;
gl.enable(gl.DEPTH_TEST);



function kostka() {

	let punkty_ = 36;

	var vertices = [
	-0.5, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0,
	 0.5, -0.5, -0.5,  0.0, 0.0, 1.0, 1.0, 0.0,
	 0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, 1.0,
	 0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, 1.0,
	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0,

	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 0.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 0.0,
	 0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 1.0,
	-0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 0.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 0.0,

	-0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,
	-0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
	-0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,

	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,
	 0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
	 0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
	 0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
	 0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,

	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,
	 0.5, -0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,

	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,
	 0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
	-0.5,  0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	
	n_draw=punkty_;
}


function draw() {
	
	elapsedTime = performance.now() - startTime;
	startTime = performance.now();
	licznik++;

	let fFps = 1000 / elapsedTime;

	if(licznik>fFps)
	{
		fpsElem.textContent = fFps.toFixed(1);
		licznik = 0;
	}
    console.log('Drawing frame'); 
    set_camera();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   // gl.drawArrays(prymityw, 0, n_draw);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.drawArrays(prymityw,0,12);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.drawArrays(prymityw,12,24);

	rot_angle += 0.01; 

    const model = mat4.create(); 
    mat4.rotate(model, model, rot_angle, [1, 0, 0]);
	mat4.rotate(model, model, rot_angle, [0, 1, 0]); 

    let uniModel = gl.getUniformLocation(program, 'model');
    gl.uniformMatrix4fv(uniModel, false, model);

setTimeout(() => {window.requestAnimationFrame(draw);}, 1000/100);
    //window.requestAnimationFrame(draw);
}
let x= 50;
let y = 50;
let yaw = -90;
let pitch =0;
function set_camera_mouse(e) {
    let xoffset = e.movementX;
    let yoffset = e.movementY;

    let sensitivity = 0.1;
    xoffset *= sensitivity;
    yoffset *= sensitivity;

    yaw += xoffset;
    pitch -= yoffset;

    if (pitch > 89.0) pitch = 89.0;
    if (pitch < -89.0) pitch = -89.0;

    let front = vec3.create();
    front[0] = Math.cos(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));
    front[1] = Math.sin(glMatrix.toRadian(pitch));
    front[2] = Math.sin(glMatrix.toRadian(yaw)) * Math.cos(glMatrix.toRadian(pitch));
    vec3.normalize(cameraFront, front);  // Normalize the front vector
}


window.requestAnimationFrame(draw);	

	

/*window.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
   alert("x ="+x+ " y ="+y);
});*/

window.addEventListener('keydown', function (event) {
	if (event.keyCode === 27) { 
		if (confirm("Do you want to close the tab?")) {
			window.close();
		}
	}
});




}
