define(["require", "exports", "gl-matrix", "./VertexBuffers"], function (require, exports, gl_matrix_1, VertexBuffers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShaderProgram = /** @class */ (function () {
        function ShaderProgram(canvas) {
            var _this = this;
            this.fieldWidth = 10;
            this.fieldHeight = 10;
            this._color = [0.5, 0.5, 0.5];
            this.GetShaderProgram = function (gl) {
                var program = _this.gl.createProgram();
                var vShader;
                var fShader;
                try {
                    vShader = _this.CompileShader(_this.gl, _this._vertexShaderSource, gl.VERTEX_SHADER);
                    fShader = _this.CompileShader(_this.gl, _this._fragmentShaderSource, gl.FRAGMENT_SHADER);
                }
                catch (err) {
                    console.log(err);
                    return;
                }
                program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.useProgram(program);
                return program;
            };
            this._vertexShaderSource = [
                "attribute vec2 aPosition;",
                "uniform mat4 uProjMatrix;",
                "uniform mat4 uViewMatrix;",
                "uniform mat4 uModelMatrix;",
                "void main()",
                "{",
                "    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 0.0, 1.0);",
                "}"
            ].join('\n');
            this._fragmentShaderSource = [
                "precision mediump float;",
                "uniform vec3 uColor;",
                "void main()",
                "{",
                "    gl_FragColor = vec4(uColor, 1.0);",
                "}"
            ].join('\n');
            this.gl = canvas.getContext("webgl");
            this.program = this.GetShaderProgram(this.gl);
            this._uModelMatrix = this.gl.getUniformLocation(this.program, "uModelMatrix");
            this._uColor = this.gl.getUniformLocation(this.program, "uColor");
            if (this._uModelMatrix === null || this._uColor === null) {
                console.log("Failed to get a uniform location");
                return;
            }
            this.Color = this._color;
            if (!VertexBuffers_1.VertexBuffers.InitBuffers(this.gl, this.program))
                return;
        }
        Object.defineProperty(ShaderProgram.prototype, "Color", {
            get: function () {
                return this._color;
            },
            set: function (color) {
                this.gl.uniform3f(this._uColor, color[0], color[1], color[2]);
                this._color = color;
            },
            enumerable: true,
            configurable: true
        });
        ShaderProgram.prototype.DrawRect = function (x, y, width, height) {
            this.SetTransforms(x, y, width, height);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        };
        ShaderProgram.prototype.SetTransforms = function (x, y, width, height) {
            var modelMatrix = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.translate(modelMatrix, modelMatrix, gl_matrix_1.vec3.fromValues(x, y, 0.0));
            gl_matrix_1.mat4.scale(modelMatrix, modelMatrix, gl_matrix_1.vec3.fromValues(width, height, 1.0));
            this.gl.uniformMatrix4fv(this._uModelMatrix, false, modelMatrix);
        };
        ShaderProgram.prototype.CompileShader = function (gl, shaderSource, shaderType) {
            // Create the shader object
            var shader = gl.createShader(shaderType);
            // Set the shader source code
            gl.shaderSource(shader, shaderSource);
            // Compile the shader
            gl.compileShader(shader);
            // Check if it compiled
            var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!success) {
                // Something went wrong during compilation; get the error
                throw "Could not compile shader:" + gl.getShaderInfoLog(shader);
            }
            return shader;
        };
        return ShaderProgram;
    }());
    exports.ShaderProgram = ShaderProgram;
});
//# sourceMappingURL=ShaderProgram.js.map