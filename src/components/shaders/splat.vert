// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
varying vec2 _uv;
uniform float displacementBias;
uniform float displacementScale;
uniform sampler2D displacementMap;

// attribute vec2 uv;
void main() {
    vec4 h = texture2D(displacementMap, uv);
    vec3 np = vec3(position.x, position.y, position.z + h.r * displacementScale + displacementBias);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(np, 1.0);
    _uv = uv;
}