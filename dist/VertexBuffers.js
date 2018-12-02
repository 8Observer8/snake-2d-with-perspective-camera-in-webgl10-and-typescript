define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VertexBuffers = /** @class */ (function () {
        function VertexBuffers() {
        }
        VertexBuffers.InitBuffers = function (gl, program) {
            var vertices = new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ]);
            var vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            var aPosition = gl.getAttribLocation(program, "aPosition");
            if (aPosition < 0) {
                console.log("Failed to get aPosition variable");
                return false;
            }
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPosition);
            return true;
        };
        return VertexBuffers;
    }());
    exports.VertexBuffers = VertexBuffers;
});
//# sourceMappingURL=VertexBuffers.js.map