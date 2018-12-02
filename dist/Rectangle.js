define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rectangle = /** @class */ (function () {
        function Rectangle(gl, shaderProgram) {
            this.gl = gl;
            this.program = shaderProgram;
            this.vertices = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            var vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            var aPosition = gl.getAttribLocation(this.program, "aPosition");
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPosition);
        }
        Rectangle.prototype.Draw = function () {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 4);
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
//# sourceMappingURL=Rectangle.js.map