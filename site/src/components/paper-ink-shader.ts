// Raw WebGL fragment shader — paper-grain + ink-glow trail
// Palette: base hsl(240 8% 5%), grain ±4% luminance, ink glow capped at accent/0.14

export const vertexSrc = `#version 100
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const fragmentSrc = `#version 100
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec4 uTrail[16];
uniform int uTrailCount;
uniform float uDpr;

// ── 2D Simplex noise ──────────────────────────────────────
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = 1.0;
  float total = 0.0;
  for (int i = 0; i < 3; i++) {
    value += amp * snoise(p * freq);
    total += amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return value / total;
}

void main() {
  // Paper-grain base
  vec3 paper = vec3(0.043, 0.043, 0.051); // base bg in linear sRGB
  float grain = fbm(vUv * uResolution * 0.5 / uDpr + uTime * 0.03);
  grain = grain * 0.16 - 0.08;
  vec3 color = paper * (1.0 + grain);

  // Ink-glow trail from pointer history
  vec3 inkColor = vec3(1.0, 0.361, 0.102); // hsl(17 100% 55%)
  float inkGlow = 0.0;
  float maxGlow = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= uTrailCount) break;
    vec4 t = uTrail[i];
    if (t.z <= 0.0) continue;
    // t.z = age [0..1], older = dimmer
    float dist = length(vUv - t.xy) * uDpr;
    float influence = exp(-dist * 9.14) * t.z * t.w;
    inkGlow += influence;
    maxGlow = max(maxGlow, influence);
  }
  inkGlow = clamp(inkGlow, 0.0, 0.35);
  color = mix(color, inkColor, inkGlow);

  // Subtle vignette from pointer
  if (maxGlow > 0.001) {
    float ptrDist = length(vUv - uPointer);
    float vignette = smoothstep(0.5, 0.1, ptrDist) * 0.04;
    color = mix(color, inkColor, vignette);
  }

  // Subtle edge darkening
  float edgeDist = length(vUv - 0.5) * 2.0;
  float edgeFade = smoothstep(0.7, 1.0, edgeDist) * 0.06;
  color *= 1.0 - edgeFade;

  gl_FragColor = vec4(color, 1.0);
}`;
