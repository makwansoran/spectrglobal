"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  v += a * noise(p); p = p * 2.02 + 13.5; a *= 0.5;
  v += a * noise(p); p = p * 2.03 + 8.1; a *= 0.5;
  v += a * noise(p); p = p * 2.01 + 3.7; a *= 0.5;
  v += a * noise(p); p = p * 2.04 + 19.2; a *= 0.5;
  v += a * noise(p);
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  uv.x *= u_res.x / u_res.y;
  float t = u_time * 0.11;

  vec2 q = vec2(
    fbm(uv * 1.35 + vec2(0.0, t)),
    fbm(uv * 1.35 + vec2(5.2, -t * 0.85))
  );
  vec2 r = vec2(
    fbm(uv * 1.55 + 4.0 * q + vec2(1.7, t * 0.6)),
    fbm(uv * 1.55 + 4.0 * q + vec2(8.3, 2.8 - t * 0.4))
  );
  float n = fbm(uv * 1.8 + 4.0 * r);

  vec3 col = mix(u_c1, u_c2, clamp(q.x * 1.15, 0.0, 1.0));
  col = mix(col, u_c3, clamp(r.y * 0.95, 0.0, 1.0));
  col = mix(col, u_c4, smoothstep(0.28, 0.82, n));
  col = mix(col, vec3(1.0), 0.1);

  gl_FragColor = vec4(col, 1.0);
}
`;

const COLORS = ["#ef008f", "#6ec3f4", "#7038ff", "#ffba27"] as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AuthMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");
    const uC4 = gl.getUniformLocation(program, "u_c4");
    const rgb = COLORS.map(hexToRgb);
    gl.uniform3fv(uC1, rgb[0]);
    gl.uniform3fv(uC2, rgb[1]);
    gl.uniform3fv(uC3, rgb[2]);
    gl.uniform3fv(uC4, rgb[3]);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = true;
    const started = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uRes, width, height);
    };

    const draw = (now: number) => {
      if (!running) return;
      resize();
      gl.uniform1f(uTime, (now - started) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw(performance.now());
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="auth-mesh" aria-hidden="true">
      <canvas ref={canvasRef} className="auth-mesh__canvas" />
    </div>
  );
}
