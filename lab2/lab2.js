// Vertex shader program
const VSHADER_SOURCE =
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function main() {
  const canvas = document.getElementById('canvas');

  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('intialize shaders error');
      return;
    }

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
      console.log('get a_Position attribute error');
      return;
  }

  const a_PointSize= gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
      console.log('get a_PointSize attribute error');
      return;
  }

  count_of_points = getRandomInt(100);

  for (var i = 0; i < count_of_points; i++) {
    gl.vertexAttrib1f(a_PointSize, getRandomInt(20));
    gl.vertexAttrib2f(a_Position, Math.random(), Math.random());
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
