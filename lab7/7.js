"use strict";

const VSHADER_SOURCE =
    '#version 100\n' +
    'precision mediump float;\n' +
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'attribute vec4 vertColor;\n' +
    'varying vec4 fragColor;\n' +
    'void main() {\n' +
    '  fragColor = vertColor;\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 fragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = fragColor;\n' +
    '}\n';

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix

function main() {
    const canvas = document.getElementById('webgl')
    const gl = getWebGLContext(canvas)
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL')
        return
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.')
        return
    }

   // const n = initVertexBuffers(gl)  // 1
     const n = initVertexBuffers7_1(gl) // 2
    // const n = initVertexBuffers7_2(gl) // 3
    if (n < 0) {
        console.log('Failed to set the positions of the vertices')
        return
    }

    gl.clearColor(1, 1, 1, 1)

    const controls = {
        view: 'axonometry',
        perspective_method: 'perspective',
        zoom: 'in',
        perspective_effect: 'more'
    }

    gl.enable(gl.DEPTH_TEST)
   
    const gui = new dat.GUI()

    let perspectiveMatrix = mat4.create()
    mat4.ortho(perspectiveMatrix, -1, 1, -1, 1, .001, 10)
   // mat4.ortho(perspectiveMatrix,-1,1,-1,1,10,-1)  
    
    let lastView = 'axonometry'
    const projection = {
        type: "Orthographic",  
        switchCamera: function () {
            if (this.type == "Perspective") {           
                mat4.ortho(perspectiveMatrix, -10, 1, -1, 1, .001, 10)

                this.type = "Orthographic"
                gui.remove(view)

                if (perspective_method != undefined)
                    gui.remove(perspective_method)
                if (perspective_effect != undefined)
                    gui.remove(perspective_effect)
                controls.view = lastView

                view = gui.add(controls, 'view', ['left', 'right', 'top', 'bottom', 'front', 'back', 'isometry', 'axonometry'])
                zoom = gui.add(controls, 'zoom', ['in', 'out'])
            } else {
                mat4.perspective(perspectiveMatrix, 0.6*Math.PI, 1, .001, 10)
                this.type = "Perspective"
                gui.remove(view)
                gui.remove(zoom)
                
                controls.view = '3-point'
                view = gui.add(controls, 'view', ['1-point', '2-point', '3-point'])
                
                perspective_method = gui.add(controls, 'perspective_method', ['perspective', 'frustum'])
                perspective_effect = gui.add(controls, 'perspective_effect', ['more', 'less'])
            }
        }
    };
  
    gui.add(projection, 'switchCamera').listen()
    gui.add(projection, 'type').listen()
  
    let view = gui.add(controls, 'view', ['left', 'right', 'top', 'bottom', 'front', 'back', 'isometry', 'axonometry'])
    let zoom = gui.add(controls, 'zoom', ['in', 'out'])

    let perspective_method  
    let perspective_effect
  
    const vertColor = gl.getAttribLocation(gl.program, 'vertColor')
    const u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix')
  
    let eye = [0, 0, 0]
    let center = [0, 0, 0]
    let up = [0, 1, 0]
    let zoomMultiplier = 1
    let modelMatrix = mat4.create()
    let lookAtMatrix = mat4.create()
  
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        let mvpMatrix = mat4.create()

        switch (controls.zoom) {
            case 'in':
                if (projection.type == "Orthographic") {
                    mat4.ortho(perspectiveMatrix, -1, 1, -1, 1, 0.001, 10)
                }
                zoomMultiplier = 1
                break
  
            case 'out':
                if (projection.type == "Orthographic") {
                    mat4.ortho(perspectiveMatrix, -2, 2, -2, 2, .001, 10)
                }
                zoomMultiplier = 2
                break
      
        }  
    
        switch (controls.view) {
            case 'left':
                lastView = 'left'
                eye = [-zoomMultiplier, 0, 0]
                mat4.lookAt(lookAtMatrix, eye, center, up)
                break
    
            case 'right':
                lastView = 'right'
                eye = [zoomMultiplier, 0, 0]
                mat4.lookAt(lookAtMatrix, eye, center, up)
                break
    
            case 'top':
                lastView = 'top'
                eye = [0, 0.6, 0]
                mat4.lookAt(lookAtMatrix,eye,center, [0, 0, 1])
                break
    
            case 'bottom':
                lastView = 'bottom'
                eye = [0, -0.6, 0]
                mat4.lookAt(lookAtMatrix,eye,center, [0, 0, 1])
                break
    
            case 'front':
                lastView = 'front'
                eye = [0, 0, 0.6]
                mat4.lookAt(lookAtMatrix, eye, center, up)
                break
    
            case 'back':
                lastView = 'back'
                eye = [0, 0, -zoomMultiplier]
                mat4.lookAt(lookAtMatrix, eye, center, up)
                break

            case 'isometry':
                lastView = 'isometry'
                eye = [zoomMultiplier, zoomMultiplier, zoomMultiplier]   
                mat4.lookAt(lookAtMatrix,eye,center,up)
                break
        
            case 'axonometry':
                lastView = 'axonometry'        
                eye = [0.5*zoomMultiplier, 0.1*zoomMultiplier, 0.4*zoomMultiplier]
                mat4.lookAt(lookAtMatrix,eye,center,up)
                break

            case '1-point':
                switch (controls.perspective_method) {
                    case 'perspective':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [0, 0, 1]
                                mat4.lookAt(lookAtMatrix,eye,center,up)
                                mat4.perspective(perspectiveMatrix, 0.6*Math.PI, 1, .001, 10)
                                break
        
                            case 'less':
                                eye = [0, 0, 2]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.perspective(perspectiveMatrix, 0.3*Math.PI, 1, .001, 10)
                                break
        
                        }
                        break
        
                    case 'frustum':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [0, 0, 1]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix,-0.14, 0.14, -0.14, 0.14, 0.1, 500)
                                break
                
                            case 'less':
                                eye = [0, 0, 2]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix, -0.12, 0.12, -0.12, 0.12, 0.2, 500)
                                break
                
                        }
                        break
                }
                break

            case '2-point':
                switch (controls.perspective_method) {
                    case 'perspective':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [0, 0.8, 1]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.perspective(perspectiveMatrix, 0.6*Math.PI, 1, .001, 10)
                                break
        
                            case 'less':
                                eye = [0, 0.8*2, 1*2]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.perspective(perspectiveMatrix, 0.3*Math.PI, 1, .001, 10)
                                break
        
                        }
                        break
        
                    case 'frustum':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [0, 0.8, 1]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix,-0.14, 0.14, -0.14, 0.14, 0.1, 500)
                                break
            
                            case 'less':
                                eye = [0, 0.8*2, 1*2];
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix,-0.12, 0.12, -0.12, 0.12, 0.2, 500)
                                break
            
                        }
                        break
            
                }
                break
        
            case '3-point':
                switch (controls.perspective_method) {
                    case 'perspective':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [-0.5, 1, 0.3 ]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.perspective(perspectiveMatrix, 0.6*Math.PI, 1, .001, 10)
                                break
                
                            case 'less':
                                eye = [-0.5*2, 1*2, 0.3*2]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.perspective(perspectiveMatrix, 0.3*Math.PI, 1, .001, 10)
                                break
                
                        }
                        break
            
                    case 'frustum':
                        switch (controls.perspective_effect) {
                            case 'more':
                                eye = [-0.5, 1, 0.3]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix, -0.14, 0.14, -0.14, 0.14, 0.1, 500)
                                break
            
                            case 'less':
                                eye = [-0.5*2, 1*2, 0.3*2]
                                mat4.lookAt(lookAtMatrix, eye, center, up)
                                mat4.frustum(perspectiveMatrix, -0.12, 0.12, -0.12, 0.12, 0.2, 500)
                                break
            
                        }
                        break
            
                }
                break
        }

        gl.clear(gl.COLOR_BUFFER_BIT)

        mat4.multiply(mvpMatrix, perspectiveMatrix, lookAtMatrix)
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix)

        gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix)
    
        //gl.drawArrays(gl.LINE_LOOP, 0, 4)  // 1
        //gl.drawArrays(gl.LINE_LOOP, 4, 4)
        //gl.drawArrays(gl.LINES, 8, 8)

         gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0) // 2
    
        // gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)  // 3
    
        requestAnimationFrame(render)
    }

  render()
}


function initVertexBuffers(gl) {
    const n = 4
    const vertices = new Float32Array(
    [
         0.4,  0.4, 0.4, 1.0, 1, 0, 0, 1,
        -0.4,  0.4, 0.4, 1.0, 1, 0, 0, 1,
        -0.4, -0.4, 0.4, 1.0, 0, 1, 0, 1,
         0.4, -0.4, 0.4, 1.0, 0, 1, 0, 1,

         0.4,  0.4, -0.4, 1.0, 0, 0, 1, 1,
        -0.4,  0.4, -0.4, 1.0, 0, 0, 1, 1,
        -0.4, -0.4, -0.4, 1.0, 1, 0, 1, 1,
         0.4, -0.4, -0.4, 1.0, 1, 0, 1, 1,

         0.4, 0.4,  0.4, 1.0, 1, 0, 0, 1,
         0.4, 0.4, -0.4, 1.0, 0, 0, 1, 1,
        -0.4, 0.4,  0.4, 1.0, 1, 0, 0, 1,
        -0.4, 0.4, -0.4, 1.0, 0, 0, 1, 1,

        -0.4, -0.4,  0.4, 1.0, 0, 1, 0, 1,
        -0.4, -0.4, -0.4, 1.0, 1, 0, 1, 1,
         0.4, -0.4,  0.4, 1.0, 0, 1, 0, 1,
         0.4, -0.4, -0.4, 1.0, 1, 0, 1, 1,
    ])

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const FSIZE = vertices.BYTES_PER_ELEMENT
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position')
        return -1
    }

    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE *8, 0);
    gl.enableVertexAttribArray(a_Position);

    const vertColor = gl.getAttribLocation(gl.program, 'vertColor');

    gl.vertexAttribPointer(vertColor, 4, gl.FLOAT, false, FSIZE*8, 4*FSIZE);
    gl.enableVertexAttribArray(vertColor);

    return n
}

function initVertexBuffers7_2(gl) {
    const n = 4
    const vertices = new Float32Array(
    [
         0.4,  0.4, 0.4, 1, 1, 0, 0, 1,
        -0.4,  0.4, 0.4, 1, 1, 0, 0, 1,
        -0.4, -0.4, 0.4, 1, 0, 1, 0, 1,
         0.4, -0.4, 0.4, 1, 0, 1, 0, 1,

         0.4,  0.4, -0.4, 1, 0, 0, 1, 1,
        -0.4,  0.4, -0.4, 1, 0, 0, 1, 1,
        -0.4, -0.4, -0.4, 1, 1, 0, 1, 1,
         0.4, -0.4, -0.4, 1, 1, 0, 1, 1,
    ])

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,    // front
        0, 3, 7, 0, 7, 4,    // right
        0, 4, 5, 0, 5, 1,    // up
        1, 5, 6, 1, 6, 2,    // left
        7, 6, 5, 7, 5, 4,    // down
        3, 2, 6, 3, 6, 7     // back
    ]);

  
    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const vertColor = gl.getAttribLocation(gl.program, 'vertColor')
    const FSIZE = vertices.BYTES_PER_ELEMENT
  
    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE*8, 0)
    gl.vertexAttribPointer(vertColor, 4, gl.FLOAT, false, FSIZE*8, 4*FSIZE)

    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(vertColor)

    return n
}


function initVertexBuffers7_1(gl) {
    const n = 4 
    const vertices = new Float32Array(
    [ 
         0.4,  0.4, 0.4, 1, 1, 0, 0, 1,
        -0.4,  0.4, 0.4, 1, 1, 0, 0, 1,
        -0.4, -0.4, 0.4, 1, 0, 1, 0, 1,
         0.4, -0.4, 0.4, 1, 0, 1, 0, 1,

         0.4,  0.4, -0.4, 1, 0, 0, 1, 1,
        -0.4,  0.4, -0.4, 1, 0, 0, 1, 1,
        -0.4, -0.4, -0.4, 1, 1, 0, 1, 1,
         0.4, -0.4, -0.4, 1, 1, 0, 1, 1,
    ])

    const indices = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 0,
        4, 5, 5, 6, 6, 7, 7, 4,
        0, 4, 1, 5, 2, 6, 3, 7
    ])

  
    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object')
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const vertColor = gl.getAttribLocation(gl.program, 'vertColor')
    const FSIZE = vertices.BYTES_PER_ELEMENT
  
    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE*8, 0)
    gl.vertexAttribPointer(vertColor, 4, gl.FLOAT, false, FSIZE*8, 4*FSIZE)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(vertColor)        

    return n
}
