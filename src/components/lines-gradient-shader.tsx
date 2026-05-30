"use client";

import { useEffect, useRef } from "react";

const fragmentShaderSource = `
precision highp float;

uniform vec2 resolution;
uniform float u_shadow_power;
uniform float u_darken_top;

varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShaderSource = `
precision highp float;

attribute vec4 position;
attribute vec2 uv;
attribute vec2 uvNorm;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec2 resolution;
uniform float u_time;
uniform vec4 u_active_colors;
uniform struct Global {
  vec2 noiseFreq;
  float noiseSpeed;
} u_global;
uniform struct VertDeform {
  float incline;
  float offsetTop;
  float offsetBottom;
  vec2 noiseFreq;
  float noiseAmp;
  float noiseSpeed;
  float noiseFlow;
  float noiseSeed;
} u_vertDeform;
uniform vec3 u_baseColor;
uniform struct WaveLayers {
 vec3 color;
 vec2 noiseFreq;
 float noiseSpeed;
 float noiseFlow;
 float noiseSeed;
 float noiseFloor;
 float noiseCeil;
} u_waveLayers[3];

const int u_waveLayers_length = 3;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return blend * opacity + base * (1.0 - opacity);
}

varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;
  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
  noise = max(0.0, noise);

  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  if (u_active_colors[0] == 1.0) {
    v_color = u_baseColor;
  }

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.0) {
      WaveLayers layer = u_waveLayers[i];

      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );

      v_color = blendNormal(v_color, layer.color, pow(noise, 4.0));
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export function LinesGradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      depth: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    let width = 0;
    let height = 0;
    let running = true;
    let animationFrame = 0;
    let vertexCount = 0;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const uvLocation = gl.getAttribLocation(program, "uv");
    const uvNormLocation = gl.getAttribLocation(program, "uvNorm");
    const positionBuffer = gl.createBuffer();
    const uvBuffer = gl.createBuffer();
    const uvNormBuffer = gl.createBuffer();

    const uniforms = {
      projectionMatrix: gl.getUniformLocation(program, "projectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(program, "modelViewMatrix"),
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      shadowPower: gl.getUniformLocation(program, "u_shadow_power"),
      darkenTop: gl.getUniformLocation(program, "u_darken_top"),
      activeColors: gl.getUniformLocation(program, "u_active_colors"),
      globalNoiseFreq: gl.getUniformLocation(program, "u_global.noiseFreq"),
      globalNoiseSpeed: gl.getUniformLocation(program, "u_global.noiseSpeed"),
      deformIncline: gl.getUniformLocation(program, "u_vertDeform.incline"),
      deformOffsetTop: gl.getUniformLocation(program, "u_vertDeform.offsetTop"),
      deformOffsetBottom: gl.getUniformLocation(program, "u_vertDeform.offsetBottom"),
      deformNoiseFreq: gl.getUniformLocation(program, "u_vertDeform.noiseFreq"),
      deformNoiseAmp: gl.getUniformLocation(program, "u_vertDeform.noiseAmp"),
      deformNoiseSpeed: gl.getUniformLocation(program, "u_vertDeform.noiseSpeed"),
      deformNoiseFlow: gl.getUniformLocation(program, "u_vertDeform.noiseFlow"),
      deformNoiseSeed: gl.getUniformLocation(program, "u_vertDeform.noiseSeed"),
      baseColor: gl.getUniformLocation(program, "u_baseColor"),
    };

    const layerUniforms = [0, 1, 2].map((index) => ({
      color: gl.getUniformLocation(program, `u_waveLayers[${index}].color`),
      noiseFreq: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseFreq`),
      noiseSpeed: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseSpeed`),
      noiseFlow: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseFlow`),
      noiseSeed: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseSeed`),
      noiseFloor: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseFloor`),
      noiseCeil: gl.getUniformLocation(program, `u_waveLayers[${index}].noiseCeil`),
    }));

    const hexToRgb = (hex: string) => {
      const value = Number.parseInt(hex.replace("#", ""), 16);
      return [
        ((value >> 16) & 255) / 255,
        ((value >> 8) & 255) / 255,
        (value & 255) / 255,
      ] as const;
    };

    const ortho = (left: number, right: number, bottom: number, top: number) => {
      const near = -1;
      const far = 1;
      return new Float32Array([
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, -2 / (far - near), 0,
        -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1,
      ]);
    };

    const identity = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);

    const uploadMesh = () => {
      const rows = 80;
      const cols = 80;
      const positions: number[] = [];
      const uvs: number[] = [];
      const uvNorms: number[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const u = col / (cols - 1);
          const v = row / (rows - 1);
          positions.push((u - 0.5) * width, (v - 0.5) * height, 0);
          uvs.push(u, v);
          uvNorms.push(u * 2 - 1, v * 2 - 1);
        }
      }

      const expandedPositions: number[] = [];
      const expandedUvs: number[] = [];
      const expandedUvNorms: number[] = [];
      const addVertex = (index: number) => {
        expandedPositions.push(
          positions[index * 3],
          positions[index * 3 + 1],
          positions[index * 3 + 2],
        );
        expandedUvs.push(uvs[index * 2], uvs[index * 2 + 1]);
        expandedUvNorms.push(uvNorms[index * 2], uvNorms[index * 2 + 1]);
      };

      for (let row = 0; row < rows - 1; row += 1) {
        for (let col = 0; col < cols - 1; col += 1) {
          const a = row * cols + col;
          const b = a + 1;
          const c = a + cols;
          const d = c + 1;
          addVertex(a); addVertex(c); addVertex(b);
          addVertex(b); addVertex(c); addVertex(d);
        }
      }

      vertexCount = expandedPositions.length / 3;

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(expandedPositions), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(expandedUvs), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvNormBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(expandedUvNorms), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(uvNormLocation);
      gl.vertexAttribPointer(uvNormLocation, 2, gl.FLOAT, false, 0, 0);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniformMatrix4fv(uniforms.projectionMatrix, false, ortho(-width / 2, width / 2, -height / 2, height / 2));
      gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, identity);
      uploadMesh();
    };

    gl.uniform1f(uniforms.shadowPower, 6);
    gl.uniform1f(uniforms.darkenTop, 0);
    gl.uniform4f(uniforms.activeColors, 1, 1, 1, 1);
    gl.uniform2f(uniforms.globalNoiseFreq, 0.00018, 0.00024);
    gl.uniform1f(uniforms.globalNoiseSpeed, 0.62);
    gl.uniform1f(uniforms.deformIncline, -0.18);
    gl.uniform1f(uniforms.deformOffsetTop, -0.72);
    gl.uniform1f(uniforms.deformOffsetBottom, 0.1);
    gl.uniform2f(uniforms.deformNoiseFreq, 2.2, 2.8);
    gl.uniform1f(uniforms.deformNoiseAmp, 330);
    gl.uniform1f(uniforms.deformNoiseSpeed, 6.5);
    gl.uniform1f(uniforms.deformNoiseFlow, 3.1);
    gl.uniform1f(uniforms.deformNoiseSeed, 5.0);
    gl.uniform3fv(uniforms.baseColor, hexToRgb("#3b82f6"));

    const layers = [
      { color: "#8b5cf6", freq: [0.0014, 0.0022], speed: 12.0, flow: 9.0, seed: 1.0, floor: 0.18, ceil: 0.62 },
      { color: "#06b6d4", freq: [0.0018, 0.0012], speed: 9.0, flow: 7.0, seed: 8.0, floor: 0.15, ceil: 0.58 },
      { color: "#f97316", freq: [0.0012, 0.0017], speed: 7.5, flow: 6.0, seed: 19.0, floor: 0.2, ceil: 0.72 },
    ];

    layers.forEach((layer, index) => {
      const uniformsForLayer = layerUniforms[index];
      gl.uniform3fv(uniformsForLayer.color, hexToRgb(layer.color));
      gl.uniform2f(uniformsForLayer.noiseFreq, layer.freq[0], layer.freq[1]);
      gl.uniform1f(uniformsForLayer.noiseSpeed, layer.speed);
      gl.uniform1f(uniformsForLayer.noiseFlow, layer.flow);
      gl.uniform1f(uniformsForLayer.noiseSeed, layer.seed);
      gl.uniform1f(uniformsForLayer.noiseFloor, layer.floor);
      gl.uniform1f(uniformsForLayer.noiseCeil, layer.ceil);
    });

    const draw = () => {
      if (!running) return;

      gl.clearColor(0.02, 0.02, 0.04, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, performance.now() / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      running = document.visibilityState === "visible";
      if (running) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(uvNormBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
