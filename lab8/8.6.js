// 08.js

"use strict";
// Vertex shader program

const VSHADER_SOURCE =
    '#version 100\n' +
 'attribute vec3 a_Position;\n' +
  'attribute vec3 a_Norm;\n' +
  'varying vec3 Color;\n' +
  'varying vec3 LightIntensity;\n' +
  'varying vec3 Position;\n' +
  'varying vec3 Norm;\n' +
  'varying mat4 MVP;\n' +
 
  'uniform mat4 u_ModelView;\n'+
  'uniform mat4 u_Projection;\n'+
  'uniform mat3 u_NormalMat;\n'+
  'uniform mat4 u_mvp;\n'+
  
  'uniform vec3 LightPosition; \n' +
  'uniform vec3 Ld;\n' +
  'uniform vec3 La;\n' +
  'uniform vec3 Ls;\n' +
  
  'uniform vec3 Kd;\n' +
  'uniform vec3 Ka;\n' +
  'uniform vec3 Ks;\n' +
  'uniform float Shininess;\n' +
  
  'void main() {\n' +
  'u_Projection;\n' +
  'u_ModelView;\n' +
  'vec3 tnorm = normalize(u_NormalMat * a_Norm);\n' +
  'vec4 eyeCoords = u_ModelView * vec4(a_Position, 1.0);\n' +
  'vec3 s = normalize(LightPosition);\n' +
  'vec3 v = normalize(-eyeCoords.xyz);\n' +
  'vec3 r = reflect(-s, tnorm);\n' +
  'vec3 ambient = La*Ka;\n' +
  'float sDotN = max(dot(s,tnorm), 0.0);\n' +
  'vec3 diffuse = Ld*Kd*sDotN;\n' +
  'vec3 specular = vec3(0.0);\n' +
  'specular = Ls * Ks * pow(max(dot(r,v),0.0), Shininess);\n' +
  'LightIntensity = ambient + diffuse + specular;\n' +
  
  '  gl_Position = u_mvp * vec4(a_Position,1.0);\n' +
  '}\n';

  
  const FSHADER_SOURCE =
 'precision mediump float;\n' +
  'varying vec3 Color;\n' +
  'varying vec3 LightIntensity;\n' +
  
  
  'void main() {\n' +
  'gl_FragColor = vec4(LightIntensity,1.0);\n' +
  '}\n';


const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function main() {
	const canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	const gl = getWebGLContext(canvas);
	if (!gl) {
	console.log('Failed to get the rendering context for WebGL');
	return;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	console.log('Failed to intialize shaders.');
	return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(0, 0, 0, 1);

	gl.enable(gl.DEPTH_TEST); ////////////////////////////////////////////////////////////////////////

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let eye = vec3.create();
	let center = vec3.create();
	let up = vec3.create();

	var Mprojection = mat4.create();

	mat4.perspective(Mprojection, Math.PI/2, 1.0, 0.1, 5.0);

	let mvp = mat4.create();
	let view = mat4.create();
		
	eye = vec3.fromValues(1.0, 0.0, 1.0);
	center = vec3.fromValues(0.0,0.0,0.0);
	up = vec3.fromValues(0.0,1.0,0.0);
	mat4.lookAt(view,eye,center,up);
	mat4.multiply(mvp, Mprojection, view);
	let N = initSphere(gl, 0.5, 50, 50);
			
			
	 const u_ModelView = gl.getUniformLocation(gl.program, 'u_ModelView');
	if (!u_ModelView) {
	  console.log('Failed to get the storage location of u_ModelView');
	  return;
	}

	const u_NormalMat = gl.getUniformLocation(gl.program, 'u_NormalMat');
	if (!u_NormalMat) {
	  console.log('Failed to get the storage location of u_NormalMat');
	  return;
	}

	const u_Projection = gl.getUniformLocation(gl.program, 'u_Projection');
	if (!u_Projection) {
	  console.log('Failed to get the storage location of u_Projection');
	  return;
	}

	const u_mvp = gl.getUniformLocation(gl.program, 'u_mvp');
	if (!u_mvp) {
	  console.log('Failed to get the storage location of u_mvp');
	  return;
	}

	const LightPosition = gl.getUniformLocation(gl.program, 'LightPosition');
	if (!LightPosition) {
	  console.log('Failed to get the storage location of LightPosition');
	  return;
	}


	const m = gl.getUniformLocation(gl.program, 'Shininess');
	if (!m) {
	  console.log('Failed to get the storage location of Shininess');
	  return;
	}

	const Ka = gl.getUniformLocation(gl.program, 'Ka');
	if (!Ka) {
	  console.log('Failed to get the storage location of Ka');
	  return;
	}

	const Kd = gl.getUniformLocation(gl.program, 'Kd');
	if (!Kd) {
	  console.log('Failed to get the storage location of Kd');
	  return;
	}

	const Ks = gl.getUniformLocation(gl.program, 'Ks');
	if (!Ks) {
	  console.log('Failed to get the storage location of Ks');
	  return;
	}

	const La = gl.getUniformLocation(gl.program, 'La');
	if (!La) {
	  console.log('Failed to get the storage location of La');
	  return;
	}

	const Ld = gl.getUniformLocation(gl.program, 'Ld');
	if (!Ld) {
	  console.log('Failed to get the storage location of Ld');
	  return;
	}

	const Ls = gl.getUniformLocation(gl.program, 'Ls');
	if (!Ls) {
	  console.log('Failed to get the storage location of Ls');
	  return;
	}

	let NormalMatrix = mat3.transpose(mat3.create(), mat3.invert(mat3.create(), mat3.fromMat4(mat3.create(), view)))

	gl.uniformMatrix4fv(u_Projection, false, Mprojection);
	gl.uniformMatrix3fv(u_NormalMat, false, NormalMatrix);
	gl.uniformMatrix4fv(u_ModelView, false, view);
	gl.uniformMatrix4fv(u_mvp, false, mvp);
	
	let LP = vec4.create();
	vec4.transformMat4(LP, vec4.fromValues(0, 1, 1, 0), view);
	gl.uniform3f(LightPosition, LP[0],LP[1],LP[2]);

	gl.uniform3f(La, 0.2, 0.2, 0.2);
	gl.uniform3f(Ld, 0.8, 0.8, 0.8);
	gl.uniform3f(Ls, 0.6, 0.6, 0.6);

	gl.uniform1f(m, 51);
	gl.uniform3f(Ka, 0.1923, 0.1923, 0.1923);
	gl.uniform3f(Kd, 0.5075, 0.5075, 0.5075);
	gl.uniform3f(Ks, 0.5083, 0.5083, 0.5083);

	gl.drawElements(gl.TRIANGLES, N, gl.UNSIGNED_SHORT, 0);		
}

function initSphere(gl, radius, slices, stacks)
{
	const n = (stacks - 1)*slices + 2; // The number of vertices

	let teta = 0;	//teta angle
	let phi = 0;	//phi angle

	const zStep = Math.PI/stacks;	//teta angle step
	const aStep = 2*Math.PI/slices;	//phi angle step

	let indArr = new Array();	//index array
	let indIter = 0; //index iterator

	//Making coord, norm and color arrays

	let coordArr = new Array();
	let normArr = new Array();

	 //top vertice to first stack

	for (let sl = 0; sl < slices - 1; sl++)
	{
	   indArr[indIter] = 0;
	   indArr[indIter + 1] = sl + 1;
	   indArr[indIter + 2] = sl + 2;
	   indIter += 3;
	}

	indArr[indIter] = 0;
	indArr[indIter + 1] = slices;
	indArr[indIter + 2] = 1;
	indIter += 3;

	//initializing vertices coordinates

	//initializing top vertice
	coordArr[0] = 0;
	coordArr[1] = radius;
	coordArr[2] = 0;

	normArr[0] = 0;	
	normArr[1] = 1;
	normArr[2] = 0;

	for (let st = 1; st < stacks; st++)
	{
		teta = teta + zStep;	//change teta angle
		
		for (let sl = 0; sl < slices; sl++)
		{
			let at = (st - 1) * slices + sl + 1;	//calculate vertice index
			
			coordArr[at*3] = radius * Math.sin(teta) * Math.sin(phi);	//calculate vertice coords
			coordArr[at*3 + 1] = radius * Math.cos(teta);
			coordArr[at*3 + 2] = radius * Math.sin(teta) * Math.cos(phi);
			
			normArr[at*3] = Math.sin(teta) * Math.sin(phi);	
			normArr[at*3 + 1] = Math.cos(teta);
			normArr[at*3 + 2] = Math.sin(teta) * Math.cos(phi);
			
			if ((st != stacks - 1) && (sl != slices - 1))
			{
				indArr[indIter] = (st - 1) * slices + sl + 1;
				indArr[indIter + 1] = st * slices + sl + 1;
				indArr[indIter + 2] = (st - 1) * slices + sl + 2;
				indArr[indIter + 3] = (st - 1) * slices + sl + 2;
				indArr[indIter + 4] = st * slices + sl + 1;
				indArr[indIter + 5] = st * slices + sl + 2;
			
				indIter += 6;
			}			
			phi = phi + aStep;		//change phi angle	
		}

		if (st != stacks - 1)
		{
			indArr[indIter] = st * slices;
			indArr[indIter + 1] = (st + 1) * slices;
			indArr[indIter + 2] = (st - 1) * slices + 1;
			indArr[indIter + 3] = (st - 1) * slices + 1;
			indArr[indIter + 4] = (st + 1) * slices;
			indArr[indIter + 5] = st * slices + 1;
		
			indIter += 6;
		}
		
		phi = 0;	//reset phi angle
	}

	//initializing bottom vertice
	coordArr[(n - 1)*3] = 0;
	coordArr[(n - 1)*3 + 1] = -radius;
	coordArr[(n - 1)*3 + 2] = 0;

	normArr[(n - 1)*3] = 0;	
	normArr[(n - 1)*3 + 1] = -1;
	normArr[(n - 1)*3 + 2] = 0;

	//bottom vertice to last stack
	for (let sl = 0; sl < slices - 1; sl++)
	{
	   indArr[indIter] = n - 1;
	   indArr[indIter + 1] = (stacks - 2)*slices + sl + 2;
	   indArr[indIter + 2] = (stacks - 2)*slices + sl + 1;
	   indIter += 3;
	}

	indArr[indIter] = n - 1;
	indArr[indIter + 1] = (stacks - 2)*slices + 1;
	indArr[indIter + 2] = (stacks - 1)*slices;
	indIter += 3;

	var tCoordArr = Float32Array.from(coordArr)
	var tIndArr = Uint16Array.from(indArr);
	var tnormArr = Float32Array.from(normArr);

	var PSize = tnormArr.BYTES_PER_ELEMENT;

	//Create a buffer object for props
	const PropBuffer = gl.createBuffer();
	if (!PropBuffer) {
		console.log('Failed to create a buffer object for properties');
		return -1;  
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, PropBuffer);
	// Allocate memory for buffer
	gl.bufferData(gl.ARRAY_BUFFER, (tCoordArr.length + tnormArr.length)*PSize, gl.STATIC_DRAW);

	//Write data to buffer
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, tCoordArr);
	gl.bufferSubData(gl.ARRAY_BUFFER, (tCoordArr.length)*PSize, tnormArr);


	//Create a buffer object for indexes
	const indexBuffer = gl.createBuffer();
	if (!indexBuffer) {
		console.log('Failed to create a buffer object for indexes');
		return -1;  
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tIndArr, gl.STATIC_DRAW);

	const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}

	const a_Norm = gl.getAttribLocation(gl.program, 'a_Norm');
	if (a_Norm < 0) {
		console.log('Failed to get the storage location of a_Norm');
		return -1;
	}

	// Assign buffer objects to variables
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.vertexAttribPointer(a_Norm, 3, gl.FLOAT, false, 0, (tCoordArr.length)*PSize);

	// Enable the assignment to variables
	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_Norm);

	return tIndArr.length;
}