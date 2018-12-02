import { mat4 } from 'gl-matrix';

export class Camera
{
    private _gl: WebGLRenderingContext;
    private _center: number[];
    private _target: number[];
    private _projMatrix: mat4;
    private _viewMatrix: mat4;
    private _uProjMatrix: WebGLUniformLocation;
    private _uViewMatrix: WebGLUniformLocation;
    private _orientation = [0, 1, 0];
    private _nearPlane = 0.1;
    private _farPlane = 1000;

    public constructor(gl: WebGLRenderingContext, program: WebGLProgram, center: number[], target: number[])
    {
        this._gl = gl;
        this._center = center;
        this._target = target;

        // Transformation matrices
        this._projMatrix = mat4.create();
        this._viewMatrix = mat4.create();

        this._uProjMatrix = this._gl.getUniformLocation(program, "uProjMatrix");
        this._uViewMatrix = this._gl.getUniformLocation(program, "uViewMatrix");
        if (this._uProjMatrix === null || this._uViewMatrix === null)
        {
            console.log("Failed to get uViewMatrix location");
            return;
        }

        this.setViewProjection();
    }

    private setViewProjection(): void
    {
        mat4.lookAt(this._viewMatrix, 
            [this._center[0], this._center[1], this._center[2]],
            [this._target[0], this._target[1], this._target[2]],
            this._orientation);

        mat4.perspective(this._projMatrix, 60.0 * (Math.PI / 180.0), 1, this._nearPlane, this._farPlane);

        this._gl.uniformMatrix4fv(this._uProjMatrix, false, this._projMatrix);
        this._gl.uniformMatrix4fv(this._uViewMatrix, false, this._viewMatrix);
    }
}