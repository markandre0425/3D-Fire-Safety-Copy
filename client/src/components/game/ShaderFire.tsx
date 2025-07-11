import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderFireProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  intensity?: number;
  active?: boolean;
}

const ShaderFire: React.FC<ShaderFireProps> = ({
  position,
  scale = 1,
  color = "#ff4500",
  intensity = 1,
  active = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Vertex shader for fire animation
  const vertexShader = `
    uniform float uTime;
    uniform float uScale;
    uniform float uIntensity;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;
    
    // Noise function for fluid motion
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
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Create fluid fire motion using multiple octaves of noise
      float time = uTime * 1.5; // Faster animation
      
      // Main upward motion - more pronounced
      float displacement = snoise(vec3(pos.x * 1.5, pos.y * 0.8 - time * 3.0, pos.z * 1.5)) * 0.6;
      
      // Add turbulence - increased amplitude
      displacement += snoise(vec3(pos.x * 3.0, pos.y * 1.5 - time * 4.0, pos.z * 3.0)) * 0.3;
      
      // Add fine detail - more visible
      displacement += snoise(vec3(pos.x * 6.0, pos.y * 3.0 - time * 5.0, pos.z * 6.0)) * 0.15;
      
      // Add swirling motion
      float swirl = snoise(vec3(pos.x * 2.0 + time, pos.y * 2.0, pos.z * 2.0 - time)) * 0.4;
      
      // Reduce displacement towards the base (y = 0)
      float heightFactor = smoothstep(0.0, 1.2, pos.y + 0.5);
      displacement *= heightFactor;
      swirl *= heightFactor;
      
      // Apply displacement primarily in X and Z directions for flame flicker
      pos.x += displacement * uIntensity * 1.2;
      pos.z += displacement * uIntensity * 1.2;
      
      // Add swirling motion
      pos.x += swirl * uIntensity * 0.8;
      pos.z += swirl * uIntensity * 0.5;
      
      // Add more upward stretch and wavering
      pos.y += displacement * uIntensity * 0.5;
      pos.y += sin(time * 2.0 + pos.x * 5.0) * 0.1 * heightFactor;
      
      vDisplacement = displacement;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos * uScale, 1.0);
    }
  `;

  // Fragment shader for fire appearance
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;
    
    // Noise function for color variation
    float rand(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create fire gradient from bottom to top
      float heightGradient = smoothstep(0.0, 1.0, uv.y);
      
      // Add animated noise for flame texture
      float noise = rand(uv + uTime * 0.3) * 0.4;
      noise += rand(uv * 2.0 + uTime * 0.5) * 0.2;
      noise += rand(uv * 4.0 + uTime * 0.7) * 0.1;
      
      // Add pulsing effect
      float pulse = sin(uTime * 4.0) * 0.1 + sin(uTime * 7.0) * 0.05;
      
      // Combine displacement and noise for intensity
      float intensity = (1.0 - heightGradient) + vDisplacement + noise + pulse;
      intensity *= uIntensity;
      
      // Create fire colors
      vec3 hotColor = vec3(1.0, 1.0, 0.8);    // White hot
      vec3 mediumColor = vec3(1.0, 0.5, 0.1);  // Orange
      vec3 coolColor = vec3(0.8, 0.1, 0.0);    // Red
      
      // Interpolate colors based on intensity
      vec3 fireColor;
      if (intensity > 0.7) {
        fireColor = mix(mediumColor, hotColor, (intensity - 0.7) / 0.3);
      } else if (intensity > 0.3) {
        fireColor = mix(coolColor, mediumColor, (intensity - 0.3) / 0.4);
      } else {
        fireColor = coolColor;
      }
      
      // Mix with base color
      fireColor = mix(fireColor, uColor, 0.3);
      
      // Alpha based on intensity and height
      float alpha = intensity * (1.0 - heightGradient * 0.5);
      alpha = clamp(alpha, 0.0, 1.0);
      
      // Add rim lighting effect
      float rim = 1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)));
      fireColor += rim * 0.2;
      
      gl_FragColor = vec4(fireColor, alpha);
    }
  `;

  // Create flame geometry - a cylinder that will be deformed
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.1, 0.3, 1, 16, 20);
    
    // Modify geometry to have flame shape
    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      const normalizedY = (y + 0.5); // 0 to 1
      
      // Taper the flame
      const taper = Math.pow(1.0 - normalizedY, 0.8);
      const x = position.getX(i) * taper;
      const z = position.getZ(i) * taper;
      
      position.setXYZ(i, x, y, z);
    }
    
    position.needsUpdate = true;
    return geo;
  }, []);

  // Animation loop
  useFrame((_, delta) => {
    if (active) {
      timeRef.current += delta;
      
      // Update main flame
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.uTime.value = timeRef.current;
        }
      }
      
      // Update inner core flame
      if (innerMeshRef.current) {
        const material = innerMeshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.uTime.value = timeRef.current * 1.4; // Faster timing for variation
        }
      }
    }
  });

  if (!active) return null;

  return (
    <>
      {/* Main flame */}
      <mesh
        ref={meshRef}
        position={position}
        geometry={geometry}
      >
        <shaderMaterial
          uniforms={{
            uTime: { value: 0 },
            uScale: { value: scale },
            uIntensity: { value: intensity },
            uColor: { value: new THREE.Color(color) },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner core for more intensity */}
      <mesh
        ref={innerMeshRef}
        position={[position[0], position[1], position[2]]}
        geometry={geometry}
      >
        <shaderMaterial
          uniforms={{
            uTime: { value: 0 },
            uScale: { value: scale * 0.6 },
            uIntensity: { value: intensity * 1.5 },
            uColor: { value: new THREE.Color("#ffff00") },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Point light for illumination */}
      <pointLight
        position={[position[0], position[1] + 0.3, position[2]]}
        color={color}
        intensity={intensity * 3 + Math.sin(timeRef.current * 5) * 0.5}
        distance={5}
        decay={2}
      />
    </>
  );
};

export default ShaderFire; 