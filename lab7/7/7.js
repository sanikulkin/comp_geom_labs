"use strict";

const VSHADER_SOURCE =
    '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

const FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function main() {
  const canvas = document.getElementById('webgl');

  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  gl.clearColor(0, 0, 0, 1);

  const controls = {
    view: 'axonometry',
    perspective_method: 'perspective',
    zoom: 'in',
    perspective_effect: 'more'
  };

  const gui = new dat.GUI();

  const projection = {
      type: "Orthographic",
      switchCamera: function () {
          if (this.type == "Perspective") {           
              // TODO: настроить матрицу ортогонального проецирования

              this.type = "Orthographic";
              gui.remove(view);
              if (perspective_method != undefined)
                gui.remove(perspective_method);
              if (perspective_effect != undefined)
                gui.remove(perspective_effect);
              controls.view = 'axonometry';
              view = gui.add(controls, 'view', ['left', 'right', 'top', 'bottom', 'front', 'back', 'isometry', 'axonometry']);
              zoom = gui.add(controls, 'zoom', ['in', 'out']);
          } else {
              // TODO: настроить матрицу перспективной проекции

              this.type = "Perspective";

              gui.remove(view);
              gui.remove(zoom);
              controls.view = '3-point';
              view = gui.add(controls, 'view', ['1-point', '2-point', '3-point']);
              perspective_method = gui.add(controls, 'perspective_method', ['perspective', 'frustum']);
              perspective_effect = gui.add(controls, 'perspective_effect', ['more', 'less']);
          }
      }
  };

  gui.add(projection, 'switchCamera');
  gui.add(projection, 'type').listen();
  let view = gui.add(controls, 'view', ['left', 'right', 'top', 'bottom', 'front', 'back', 'isometry', 'axonometry']);
  let zoom = gui.add(controls, 'zoom', ['in', 'out']);
  let perspective_method;
  let perspective_effect;

  let eye = vec3.create();

  function render() {

    switch (controls.view) {
        case 'left':
            // vec3.set(eye, x, y, z)
        break;
        case 'right':
            // vec3.set(eye, x, y, z)
        break;
        case 'top':
            // vec3.set(eye, x, y, z)
        break;
        case 'bottom':
            // vec3.set(eye, x, y, z)
        break;
        case 'front':
            // vec3.set(eye, x, y, z)
        break;
        case 'back':
            // vec3.set(eye, x, y, z)
        break;
        case 'isometry':
            // vec3.set(eye, x, y, z)
        break;
        case 'axonometry':
            // vec3.set(eye, x, y, z)
            switch (controls.zoom) {
              case 'in':
                // ortho
                break;
              case 'out':
                // ortho
                break;
            }
        break;
        case '1-point':
            switch (controls.perspective_method) {
              case 'perspective':
                switch (controls.perspective_effect) {
                case 'more':
                  // vec3.set(eye, x, y, z)
                  // perspective
                  break;
                case 'less':
                  // vec3.set(eye, x, y, z)
                  // perspective
                  break;
                }
                break;
              case 'frustum':
                
                switch (controls.perspective_effect) {
                  case 'more':
                    // frustum
                    break;
                  case 'less':
                    // frustum
                    break;
                  }
                break;
            }
        break;
        case '2-point':
            // vec3.set(eye, x, y, z)
            switch (controls.perspective_method) {
              case 'perspective':
                // perspective
                break;
              case 'frustum':
                // frustum
                break;
            }
        break;
        case '3-point':
            // vec3.set(eye, x, y, z)
            switch (controls.perspective_method) {
              case 'perspective':
                // perspective
                break;
              case 'frustum':
                // frustum
                break;
            }
        break;
    }

    // point the camera to the center of the scene
    // mat4.lookAt(viewMatrix, eye, center,	up);

        // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);

    // render using requestAnimationFrame
    requestAnimationFrame(render);
  }

  // call the render function
  render();

}

function initVertexBuffers(gl) {
    const n = 3; // The number of vertices

    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

    //const vertices = new Float32Array(2 * n);

    //vertices[0] = 0.0;
    //vertices[1] = 0.5;
    //vertices[2] = -0.5;
    //vertices[3] = -0.5;
    //vertices[4] = 0.5;
    //vertices[5] = -0.5;

  // Create a buffer object
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}
