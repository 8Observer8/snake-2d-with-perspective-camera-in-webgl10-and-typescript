
import { mat4, vec3 } from 'gl-matrix';
import { VertexBuffers } from './VertexBuffers'

export class ShaderProgram
{
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;
    public fieldWidth = 10;
    public fieldHeight = 10;

    private _vertexShaderSource: string;
    private _fragmentShaderSource: string;
    private _uModelMatrix: WebGLUniformLocation;
    private _uColor: WebGLUniformLocation;
    private _color = [0.5, 0.5, 0.5];

    public constructor(
        canvas: HTMLCanvasElement)
    {
        this._vertexShaderSource = [
            "attribute vec2 aPosition;",
            
            "uniform mat4 uProjMatrix;",
            "uniform mat4 uViewMatrix;",
            "uniform mat4 uModelMatrix;",

            "void main()",
            "{",
            "    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 0.0, 1.0);",
            "}"].join('\n');

        this._fragmentShaderSource = [
            "precision mediump float;",

            "uniform vec3 uColor;",

            "void main()",
            "{",
            "    gl_FragColor = vec4(uColor, 1.0);",
            "}"].join('\n');

        this.gl = canvas.getContext("webgl");
        this.program = this.GetShaderProgram(this.gl);

        this._uModelMatrix = this.gl.getUniformLocation(this.program, "uModelMatrix");
        this._uColor = this.gl.getUniformLocation(this.program, "uColor");
        if (this._uModelMatrix === null || this._uColor === null)
        {
            console.log("Failed to get a uniform location");
            return;
        }

        this.Color = this._color;

        if (!VertexBuffers.InitBuffers(this.gl, this.program)) return;
    }

    public get Color(): number[]
    {
        return this._color;
    }

    public set Color(color: number[])
    {
        this.gl.uniform3f(this._uColor, color[0], color[1], color[2]);
        this._color = color;
    }

    public DrawRect(x: number, y: number, width: number, height: number)
    {
        this.SetTransforms(x, y, width, height);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    public SetTransforms(x: number, y: number, width: number, height: number)
    {
        let modelMatrix = mat4.create();

        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(x, y, 0.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(width, height, 1.0));

        this.gl.uniformMatrix4fv(this._uModelMatrix, false, modelMatrix);
    }

    private GetShaderProgram = (gl: WebGLRenderingContext): WebGLProgram =>
    {
        let program = this.gl.createProgram();

        let vShader: WebGLShader;
        let fShader: WebGLShader;
        try
        {
            vShader = this.CompileShader(this.gl, this._vertexShaderSource, gl.VERTEX_SHADER);
            fShader = this.CompileShader(this.gl, this._fragmentShaderSource, gl.FRAGMENT_SHADER);
        }
        catch(err)
        {
            console.log(err);
            return;
        }

        program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        return program;
    }

    private CompileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader
    {
        // Create the shader object
        let shader = gl.createShader(shaderType);

        // Set the shader source code
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success)
        {
            // Something went wrong during compilation; get the error
            throw "Could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    }
}
