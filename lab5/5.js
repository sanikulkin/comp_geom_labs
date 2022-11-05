// 05.js

"use strict";

// Vertex shader program
const VSHADER_SOURCE =
  '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' + 
  'attribute vec4 a_FragColor;\n' +
  'varying vec4 v_FragColor;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '  v_FragColor = a_FragColor;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_FragColor;\n' +
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
  const n = task10(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.TRIANGLES, 0, n);
  //  gl.drawArrays(gl.POINTS, 0, n);
}

function task10(gl) {
  const n = 3; // The number of vertices

  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const sizes = new Float32Array([10.0, 5.0, 2.0]);
  const colors = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);
  const FSIZE = vertices.BYTES_PER_ELEMENT;
  const bufferSize = FSIZE*(vertices.length+sizes.length+colors.length);

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, sizes);
  gl.bufferSubData(gl.ARRAY_BUFFER, FSIZE*3, colors);
  gl.bufferSubData(gl.ARRAY_BUFFER, FSIZE*12, vertices);

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



  function draw(timestamp) {
    M_anim = mat4.create();
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (now == undefined) now = timestamp;

    const elapsed = now - g_last;
    console.log(elapsed/1000);

    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    mat4.fromRotation(M_anim, newAngle, [0.0, 0.0, 1.0]);
    gl.uniformMatrix4fv(u_Mat, false, M_anim);
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    
    g_last = timestamp;
    requestAnimationFrame(draw);
  }

  function initVertexBuffers(gl) {
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

    return n;
  }   
  
  const a_FragColor = gl.getAttribLocation(gl.program, 'a_FragColor');
  if (a_FragColor < 0) {
    console.log('Failed to get the storage location of a_FragColor');
    return -1;
  }
  
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(a_FragColor, 3, gl.FLOAT, false, 0, FSIZE*3);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, FSIZE*12);
  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_FragColor);
  gl.enableVertexAttribArray(a_Position);
  
  return n;
}
