"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
var Camera = /** @class */ (function () {
    function Camera(gl, program, center, target) {
        this._orientation = [0, 1, 0];
        this._nearPlane = 0.1;
        this._farPlane = 1000;
        this._gl = gl;
        this._center = center;
        this._target = target;
        // Transformation matrices
        this._projMatrix = gl_matrix_1.mat4.create();
        this._viewMatrix = gl_matrix_1.mat4.create();
        this._uProjMatrix = this._gl.getUniformLocation(program, "uProjMatrix");
        this._uViewMatrix = this._gl.getUniformLocation(program, "uViewMatrix");
        if (this._uProjMatrix === null || this._uViewMatrix === null) {
            console.log("Failed to get uViewMatrix location");
            return;
        }
        this.setViewProjection();
    }
    Camera.prototype.setViewProjection = function () {
        gl_matrix_1.mat4.lookAt(this._viewMatrix, [this._center[0], this._center[1], this._center[2]], [this._target[0], this._target[1], this._target[2]], this._orientation);
        gl_matrix_1.mat4.perspective(this._projMatrix, 60.0 * (Math.PI / 180.0), 1, this._nearPlane, this._farPlane);
        this._gl.uniformMatrix4fv(this._uProjMatrix, false, this._projMatrix);
        this._gl.uniformMatrix4fv(this._uViewMatrix, false, this._viewMatrix);
    };
    return Camera;
}());
exports.Camera = Camera;
