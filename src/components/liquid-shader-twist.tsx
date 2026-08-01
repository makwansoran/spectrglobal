"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Port of Framer "Liquid Shader Twist"
 * https://framer.com/m/Liquid-Shader-Twist-Blx3VP.js@IMW4WcWL68VGEdvUTBuc
 */
export function LiquidShaderTwist({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let frameId = 0;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_shapeStyle: { value: 3 }, // fold
        u_twistSpeed: { value: 0.35 },
        u_position: { value: new THREE.Vector2(0, 0.15) },
        u_diagThickness: { value: 1.3 },
        u_diagTwist: { value: 1 },
        u_diagReach: { value: 8 },
        u_diagRotation: { value: 0.55 },
        u_vertWidth: { value: 1.2 },
        u_vertWaveAmp: { value: 1.2 },
        u_vertTwist: { value: 1 },
        u_vertMicroFold: { value: 0.3 },
        u_corrWidth: { value: 1.5 },
        u_corrSnakeAmp: { value: 0.8 },
        u_corrPleatFreq: { value: 45 },
        u_corrPleatDepth: { value: 0.035 },
        u_foldWidth: { value: 4 },
        u_foldBillow: { value: 1.5 },
        u_foldTension: { value: 0.6 },
        u_foldRotation: { value: -0.35 },
        u_coreColor: { value: new THREE.Color("#0044ff") },
        u_blueBand: { value: new THREE.Color("#0099ff") },
        u_purpleBand: { value: new THREE.Color("#ffffff") },
        u_cyanBand: { value: new THREE.Color("#00e5ff") },
        u_orangeBand: { value: new THREE.Color("#ccff00") },
        u_highlightColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_shapeStyle;
        uniform float u_twistSpeed;
        uniform vec2 u_position;
        uniform float u_diagThickness;
        uniform float u_diagTwist;
        uniform float u_diagReach;
        uniform float u_diagRotation;
        uniform float u_vertWidth;
        uniform float u_vertWaveAmp;
        uniform float u_vertTwist;
        uniform float u_vertMicroFold;
        uniform float u_corrWidth;
        uniform float u_corrSnakeAmp;
        uniform float u_corrPleatFreq;
        uniform float u_corrPleatDepth;
        uniform float u_foldWidth;
        uniform float u_foldBillow;
        uniform float u_foldTension;
        uniform float u_foldRotation;
        uniform vec3 u_coreColor;
        uniform vec3 u_blueBand;
        uniform vec3 u_purpleBand;
        uniform vec3 u_cyanBand;
        uniform vec3 u_orangeBand;
        uniform vec3 u_highlightColor;

        #define MAX_STEPS 120
        #define MAX_DIST 15.0
        #define SURF_DIST 0.002

        mat2 rot(float a) {
          float s = sin(a), c = cos(a);
          return mat2(c, -s, s, c);
        }

        float map(vec3 p) {
          vec3 q = p;
          if (u_shapeStyle < 0.5) {
            q.xy *= rot(u_diagRotation);
            float taper = smoothstep(4.5, 0.0, abs(q.x));
            float reach = 1.0 - smoothstep(max(0.0, u_diagReach - 2.0), u_diagReach, abs(q.x));
            float twistPhase = (q.x * u_diagTwist) * reach - u_time * u_twistSpeed;
            q.yz *= rot(twistPhase);
            float w = u_diagThickness * taper;
            float t = 0.06 * taper;
            vec2 d2 = vec2(max(abs(q.y) - w, 0.0), max(abs(q.z) - t, 0.0));
            float d = length(d2) - 0.35;
            d += 0.015 * sin(q.y * 5.0 + u_time);
            return d * 0.5;
          } else if (u_shapeStyle < 1.5) {
            q.x += sin(q.y * 0.8 + u_time * 0.3) * u_vertWaveAmp;
            q.z += cos(q.y * 0.6 + u_time * 0.2) * 0.4;
            float taper = smoothstep(8.0, 0.0, abs(q.y));
            float reach = smoothstep(8.0, 0.0, abs(q.y));
            float twistPhase = (q.y * u_vertTwist) * reach - u_time * u_twistSpeed;
            q.xz *= rot(twistPhase);
            q.z += sin(q.x * 2.0) * u_vertMicroFold;
            float w = u_vertWidth * taper;
            float t = 0.12 * taper;
            vec2 d2 = vec2(max(abs(q.x) - w, 0.0), max(abs(q.z) - t, 0.0));
            float d = length(d2) - 0.45;
            return d * 0.5;
          } else if (u_shapeStyle < 2.5) {
            q.xy *= rot(0.65);
            q.y += sin(q.x * 1.5 - u_time * u_twistSpeed * 0.6) * u_corrSnakeAmp;
            q.z += cos(q.x * 1.0 - u_time * u_twistSpeed * 0.4) * (u_corrSnakeAmp * 0.75);
            float taper = smoothstep(7.0, 0.0, abs(q.x));
            float reach = smoothstep(8.0, 0.0, abs(q.x));
            float twistPhase = (q.x * 0.8) * reach - u_time * (u_twistSpeed * 0.4);
            q.yz *= rot(twistPhase);
            float pleats = (sin(q.x * u_corrPleatFreq - u_time * 2.0) * 0.5 + 0.5) * u_corrPleatDepth;
            float w = u_corrWidth * taper;
            float t = (0.04 + pleats) * taper;
            vec2 d2 = vec2(max(abs(q.y) - w, 0.0), max(abs(q.z) - t, 0.0));
            float d = length(d2) - 0.2;
            d += 0.005 * sin(q.y * 20.0);
            return d * 0.35;
          } else {
            q.xy *= rot(u_foldRotation);
            float billow = sin(q.y * 1.2 + u_time * u_twistSpeed * 0.15) * u_foldBillow;
            q.z += billow;
            float taper = smoothstep(7.0, 1.0, abs(q.y));
            float reach = smoothstep(8.0, 0.0, abs(q.y));
            float twistPhase = (q.y * 0.8) * reach - u_time * (u_twistSpeed * 0.2);
            q.xz *= rot(twistPhase);
            q.z += sin(q.x * 1.0) * u_foldTension;
            float w = u_foldWidth * taper;
            float t = 0.015 * taper;
            vec2 d2 = vec2(max(abs(q.x) - w, 0.0), max(abs(q.z) - t, 0.0));
            float d = length(d2) - 0.25;
            return d * 0.4;
          }
        }

        vec3 getNormal(vec3 p) {
          vec2 e = vec2(0.003, 0);
          vec3 n = vec3(
            map(p + e.xyy) - map(p - e.xyy),
            map(p + e.yxy) - map(p - e.yxy),
            map(p + e.yyx) - map(p - e.yyx)
          );
          return normalize(n);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
          uv /= 1.15;
          uv -= u_position;

          vec3 ro = vec3(0.0, 0.0, 6.0);
          vec3 rd = normalize(vec3(uv, -1.5));

          float d0 = 0.0;
          vec3 p;
          bool hit = false;

          for (int i = 0; i < MAX_STEPS; i++) {
            p = ro + rd * d0;
            float ds = map(p);
            d0 += ds;
            if (d0 > MAX_DIST) break;
            if (abs(ds) < SURF_DIST) {
              hit = true;
              break;
            }
          }

          vec3 color = vec3(0.0);
          if (u_shapeStyle > 2.5) {
            vec3 bg1 = vec3(0.9, 0.96, 1.0);
            vec3 bg2 = vec3(0.7, 0.88, 0.98);
            color = mix(bg1, bg2, smoothstep(0.0, 1.5, length(uv)));
          } else if (u_shapeStyle > 1.5) {
            color = mix(vec3(0.96, 0.97, 0.98), vec3(0.88, 0.89, 0.91), uv.y * 0.5 + 0.5);
          }

          if (hit) {
            vec3 n = getNormal(p);
            vec3 v = normalize(ro - p);
            float fresnel = 1.0 - max(dot(n, v), 0.0);
            float f2 = pow(fresnel, 1.4);
            float f4 = pow(fresnel, 4.0);

            color = u_coreColor;
            color = mix(color, u_blueBand, smoothstep(0.0, 0.35, f2));
            color = mix(color, u_cyanBand, smoothstep(0.35, 0.55, f2));
            color = mix(color, u_purpleBand, smoothstep(0.55, 0.75, f2));
            color = mix(color, u_orangeBand, smoothstep(0.75, 1.0, f2));

            vec3 l1 = normalize(vec3(1.5, 2.0, 2.5));
            vec3 h1 = normalize(l1 + v);
            float spec1 = pow(max(dot(n, h1), 0.0), 8.0);
            vec3 l2 = normalize(vec3(-2.0, -1.0, -1.0));
            vec3 h2 = normalize(l2 + v);
            float spec2 = pow(max(dot(n, h2), 0.0), 5.0);
            float edgeGlow = smoothstep(0.6, 1.0, f2) * 0.5;
            vec3 ref = reflect(-v, n);
            float envMap = smoothstep(-0.2, 1.0, ref.y);

            if (u_shapeStyle > 2.5) {
              spec1 = pow(max(dot(n, h1), 0.0), 12.0);
              spec2 = pow(max(dot(n, h2), 0.0), 8.0);
              color += u_blueBand * envMap * 0.5;
              color += spec1 * u_highlightColor * 1.1;
              color += spec2 * u_highlightColor * 0.7;
              color += u_orangeBand * edgeGlow * f4 * 2.5;
            } else if (u_shapeStyle > 1.5) {
              spec1 = pow(max(dot(n, h1), 0.0), 16.0);
              spec2 = pow(max(dot(n, h2), 0.0), 12.0);
              color += u_blueBand * envMap * 0.4;
              color += spec1 * u_highlightColor * 2.0;
              color += spec2 * u_highlightColor * 1.0;
              color += u_orangeBand * edgeGlow * f4 * 0.5;
            } else {
              color += u_blueBand * envMap * 0.2;
              color += spec1 * u_highlightColor * 1.5;
              color += spec2 * u_highlightColor * 0.8;
              color += u_orangeBand * edgeGlow * f4;
            }
            color = pow(color, vec3(0.9));
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
    });
    intersectionObserver.observe(container);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w === 0 || h === 0) continue;
        renderer.setSize(w, h);
        material.uniforms.u_resolution.value.set(w, h);
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      scene.clear();
      renderer.forceContextLoss();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 overflow-hidden bg-[#b3e0fa] ${className}`}
      aria-hidden
    />
  );
}
