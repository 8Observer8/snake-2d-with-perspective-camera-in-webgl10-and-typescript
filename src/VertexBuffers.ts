
export class VertexBuffers
{
    public static InitBuffers(gl: WebGLRenderingContext, program: WebGLProgram): boolean
    {
        let vertices = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]);
    
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
        var aPosition = gl.getAttribLocation(program, "aPosition");
        if (aPosition < 0)
        {
            console.log("Failed to get aPosition variable");
            return false;
        }
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        return true;
    }
}