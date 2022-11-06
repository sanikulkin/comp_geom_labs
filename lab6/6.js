"use strict";

const VSHADER_SOURCE =
  '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_Mat;\n' +
  'void main() {\n' +
  '  gl_Position = u_Mat * a_Position;\n' +
  '}\n';

const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
const angle = 0;

var gl; 
var u_Mat;

function main() {
  const canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  const n = 3;
  const points = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
              
  const pointsBuffer = gl.createBuffer();
  if (!pointsBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }

  const FSIZE = points.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  u_Mat = gl.getUniformLocation(gl.program, 'u_Mat');
  if (!u_Mat) {
    console.log('Failed to get the storage location of u_Mat');
    return;
  }

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  Task6(gl, u_FragColor, u_Mat, n)
}


function Task1(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();
  mat4.fromTranslation(m, [0, 0, 0]);

  let M = mat4.create()
  mat4.fromTranslation(M, [0.3, 0.3, 0]);

  gl.uniformMatrix4fv(u_Mat, false, m);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M);
  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function Task2(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();
  mat4.fromTranslation(m, [0, 0, 0]);

  let M = mat4.create()
  mat4.fromRotation(M, Math.PI/4, [0.0, 0.0, 1.0]);

  gl.uniformMatrix4fv(u_Mat, false, m);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M);
  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function Task3(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();
  mat4.fromTranslation(m, [0, 0, 0]);

  let M = mat4.create()
  mat4.fromScaling(M, [1.0, 1.5, 1.0]);

  gl.uniformMatrix4fv(u_Mat, false, m);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M);
  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function Task4(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();
  mat4.fromTranslation(m, [0, 0, 0]);

  let M = mat4.create();
  mat4.fromTranslation(M, [0.4, 0.0, 0.0]);
  mat4.fromRotation(M, Math.PI/2, [0.0, 0.0, 1.0]);

  let M2 = mat4.create();
  mat4.fromTranslation(M2, [0.4, 0.0, 0.0]);

  gl.uniformMatrix4fv(u_Mat, false, m);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M);
  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M2);
  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function Task5(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();
  mat4.fromTranslation(m, [0, 0, 0]);

  let M = mat4.create();
  mat4.fromTranslation(M, [0.4, 0.0, 0.0]);
  mat4.rotate(M, M,  Math.PI/2, [0.0, 0.0, 1.0]);

  let M2 = mat4.create();
  mat4.fromRotation(M2, Math.PI/2, [0.0, 0.0, 1.0]);

  gl.uniformMatrix4fv(u_Mat, false, M_standart);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M);
  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);

  gl.uniformMatrix4fv(u_Mat, false, M2);
  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function Task6(gl, u_FragColor, u_Mat, n) {
  let m = mat4.create();

  mat4.fromRotation(m, angle, [0.0, 0.0, 1.0]);

  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  draw()
}

var ANGLE_STEP = Math.PI / 4;
var g_last;
var now;

function draw(timestamp) {
  let m = mat4.create();
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (now == undefined) {
    now = timestamp;
  }

  const elapsed = now - g_last;

  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
  mat4.fromRotation(m, newAngle, [0.0, 0.0, 1.0]);
  gl.uniformMatrix4fv(u_Mat, false, m);
  gl.drawArrays(gl.LINE_LOOP, 0, 3);
  
  g_last = timestamp;
  requestAnimationFrame(draw);
}
