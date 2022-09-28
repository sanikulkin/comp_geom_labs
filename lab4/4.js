// 04.js

"use strict";

// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' + 
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
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

  // Write the positions of vertices to a vertex shader
  const n = taskthree(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function taskone(gl) {
  const n = 3; // The number of vertices

  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  
  const sizes = new Float32Array([10.0, 5.0, 2.0]);
  
  const sizeBuffer = gl.createBuffer();
  if (!sizeBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return -1;
  }
  
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);
  
  return n;
}

function tasktwo(gl) {
   const n = 3; // The number of vertices

  const points = new Float32Array([10.0, 0.0, 0.5, 5.0, -0.5, -0.5, 2.0, 0.5, -0.5]);
  
  const pointBuffer = gl.createBuffer();
  if (!pointBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return -1;
  }
  
  const FSIZE = points.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*3, FSIZE*1);
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_PointSize);
  
  return n;
}

function taskthree(gl) {
  const n = 3; // The number of vertices

  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const sizes = new Float32Array([10.0, 5.0, 2.0]);
  const FSIZE = vertices.BYTES_PER_ELEMENT;
  const bufferSize = FSIZE*(vertices.length+sizes.length);

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  gl.bufferSubData(gl.ARRAY_BUFFER, FSIZE*6, sizes);
  
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return -1;
  }
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, FSIZE*6);
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_PointSize);
  
  return n;
}
