import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InteractiveObject, InteractiveObjectType } from "@/lib/types";
import { getExtinguisherColor, getExtinguisherInfo } from "@/lib/fireClassification";

interface FireExtinguisherProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function FireExtinguisher({ object, isCollected }: FireExtinguisherProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [extinguisherTexture, setExtinguisherTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Get extinguisher properties based on type
  const extinguisherType = object.type as InteractiveObjectType;
  const extinguisherColor = getExtinguisherColor(extinguisherType);
  const extinguisherInfo = getExtinguisherInfo(extinguisherType);
  
  // Create canvas-based extinguisher texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvasRef.current = canvas;
    ctxRef.current = ctx;
    
    // Create canvas texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    
    setExtinguisherTexture(texture);
    
    // Draw the extinguisher design
    drawExtinguisher(ctx, extinguisherColor, extinguisherInfo?.name || 'Fire Extinguisher');
    texture.needsUpdate = true;
    
    return () => {
      canvasRef.current = null;
      ctxRef.current = null;
    };
  }, [extinguisherColor, extinguisherInfo]);
  
  // Function to draw extinguisher on canvas
  const drawExtinguisher = (ctx: CanvasRenderingContext2D, color: string, type: string) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Parse color
    const colorRGB = hexToRgb(color);
    
    // Enhanced color saturation for better visibility
    const enhancedR = Math.min(255, colorRGB.r * 1.2);
    const enhancedG = Math.min(255, colorRGB.g * 1.2);
    const enhancedB = Math.min(255, colorRGB.b * 1.2);
    const enhancedColor = `rgb(${enhancedR}, ${enhancedG}, ${enhancedB})`;
    
    // Background glow effect for high visibility
    const glowGradient = ctx.createRadialGradient(64, 128, 0, 64, 128, 80);
    glowGradient.addColorStop(0, `rgba(${enhancedR}, ${enhancedG}, ${enhancedB}, 0.3)`);
    glowGradient.addColorStop(0.7, `rgba(${enhancedR}, ${enhancedG}, ${enhancedB}, 0.1)`);
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Main body with enhanced colors
    const bodyGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    bodyGradient.addColorStop(0, `rgba(${enhancedR * 0.8}, ${enhancedG * 0.8}, ${enhancedB * 0.8}, 1)`);
    bodyGradient.addColorStop(0.3, enhancedColor);
    bodyGradient.addColorStop(0.7, enhancedColor);
    bodyGradient.addColorStop(1, `rgba(${enhancedR * 1.1}, ${enhancedG * 1.1}, ${enhancedB * 1.1}, 1)`);
    
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(20, 35, 88, 190);
    
    // High-contrast border for visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 35, 88, 190);
    
    // Large prominent color band (international identification)
    ctx.fillStyle = enhancedColor;
    ctx.fillRect(15, 55, 98, 45);
    
    // Color band border for extra prominence
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 55, 98, 45);
    
    // Inner highlight on color band
    ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
    ctx.fillRect(18, 58, 92, 8);
    
    // Top cap with metallic finish
    const capGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    capGradient.addColorStop(0, '#AAAAAA');
    capGradient.addColorStop(0.5, '#FFFFFF');
    capGradient.addColorStop(1, '#CCCCCC');
    
    ctx.fillStyle = capGradient;
    ctx.fillRect(15, 15, 98, 25);
    
    // Cap border
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 98, 25);
    
    // Handle with better visibility
    ctx.fillStyle = '#111111';
    ctx.fillRect(30, 8, 20, 12);
    ctx.fillRect(78, 8, 20, 12);
    ctx.fillRect(30, 5, 68, 8);
    
    // Handle highlights
    ctx.fillStyle = '#444444';
    ctx.fillRect(32, 10, 16, 4);
    ctx.fillRect(80, 10, 16, 4);
    ctx.fillRect(32, 7, 64, 4);
    
    // Large pressure gauge for visibility
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(64, 45, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(64, 45, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(64, 45, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Nozzle with better contrast
    ctx.fillStyle = '#111111';
    ctx.fillRect(108, 75, 18, 8);
    ctx.fillRect(114, 83, 6, 30);
    
    // Nozzle highlights
    ctx.fillStyle = '#333333';
    ctx.fillRect(110, 77, 14, 4);
    ctx.fillRect(116, 85, 2, 26);
    
    // Large prominent label area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(25, 110, 78, 50);
    
    // Label border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 110, 78, 50);
    
    // Bold type text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FIRE', 64, 128);
    ctx.fillText('EXTINGUISHER', 64, 143);
    
    // Large class indicator with enhanced color
    ctx.fillStyle = enhancedColor;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(getClassText(type), 64, 158);
    
    // Instruction text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 8px Arial';
    ctx.fillText('PASS TECHNIQUE', 64, 170);
    ctx.font = '6px Arial';
    ctx.fillText('Pull • Aim • Squeeze • Sweep', 64, 180);
    
    // Bottom identification ring
    ctx.fillStyle = enhancedColor;
    ctx.fillRect(15, 225, 98, 12);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 225, 98, 12);
    
    // Enhanced metallic shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, canvas.width * 0.4, canvas.height);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    shineGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = shineGradient;
    ctx.fillRect(20, 35, 35, 190);
  };
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 0, b: 0 };
  };
  
  // Helper function to get class text
  const getClassText = (type: string) => {
    if (type.includes('Water')) return 'CLASS A';
    if (type.includes('Foam')) return 'CLASS A/B';
    if (type.includes('CO2')) return 'CLASS B/C';
    if (type.includes('Powder')) return 'MULTI-CLASS';
    if (type.includes('Wet Chemical')) return 'CLASS K';
    return 'CLASS A';
  };
  
  // Simple animation for the fire extinguisher
  useFrame((_, delta) => {
    if (!isCollected && groupRef.current) {
      // Make it hover slightly
      groupRef.current.position.y = object.position.y + Math.sin(Date.now() * 0.002) * 0.05;
      
      // Rotate slowly
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Don't render if already collected
  if (isCollected) return null;
  
  return (
    <group 
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      scale={[1.5, 1.5, 1.5]} // Larger size for better visibility
    >
      {/* Outer glow effect for high visibility */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color={extinguisherColor}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      
      {/* Pulsating visibility ring */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        scale={[
          1 + Math.sin(Date.now() * 0.005) * 0.2,
          1 + Math.sin(Date.now() * 0.005) * 0.2,
          1
        ]}
      >
        <ringGeometry args={[0.6, 0.8, 16]} />
        <meshBasicMaterial 
          color={extinguisherColor}
          transparent
          opacity={0.4 + Math.sin(Date.now() * 0.005) * 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Canvas-based fire extinguisher */}
      {extinguisherTexture && (
        <group>
          {/* Main extinguisher body with enhanced visibility */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial 
              map={extinguisherTexture}
              color={extinguisherColor}
              metalness={0.3} 
              roughness={0.2}
              emissive={extinguisherColor}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Secondary cylindrical body for 360-degree visibility */}
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial 
              map={extinguisherTexture}
              color={extinguisherColor}
              metalness={0.3} 
              roughness={0.2}
              emissive={extinguisherColor}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Bright reflective top cap */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              metalness={0.8} 
              roughness={0.1}
              emissive="#FFFFFF"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* High-contrast handle */}
          <mesh position={[0, 0.37, 0]} castShadow>
            <boxGeometry args={[0.25, 0.04, 0.04]} />
            <meshStandardMaterial 
              color="#000000" 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          
          {/* Prominent nozzle */}
          <mesh position={[0.2, 0.1, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.025, 0.18, 8]} />
            <meshStandardMaterial 
              color="#111111" 
              metalness={0.9} 
              roughness={0.05}
            />
          </mesh>
          
          {/* Glowing pressure gauge */}
          <mesh position={[0, 0.05, 0.16]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
            <meshStandardMaterial 
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          <mesh position={[0, 0.05, 0.175]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
            <meshStandardMaterial 
              color="#00FF00" 
              emissive="#00FF00" 
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Large prominent color identification band */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial 
              color={extinguisherColor}
              metalness={0.1}
              roughness={0.2}
              emissive={extinguisherColor}
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Bottom color ring for 360-degree identification */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial 
              color={extinguisherColor}
              metalness={0.2}
              roughness={0.3}
              emissive={extinguisherColor}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      )}
      
      {/* Enhanced floating indicators */}
      {extinguisherInfo && (
        <group position={[0, 1.0, 0]}>
          {/* Main identification ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.3, 16]} />
            <meshBasicMaterial 
              color={extinguisherColor}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Animated outer ring */}
          <mesh 
            rotation={[Math.PI / 2, 0, Date.now() * 0.001]}
            scale={[
              1.2 + Math.sin(Date.now() * 0.003) * 0.1,
              1.2 + Math.sin(Date.now() * 0.003) * 0.1,
              1
            ]}
          >
            <ringGeometry args={[0.35, 0.4, 16]} />
            <meshBasicMaterial 
              color={extinguisherColor}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Fire class indicators with enhanced visibility */}
          {extinguisherInfo.fireClasses.map((fireClass, index) => {
            const angle = (index / extinguisherInfo.fireClasses.length) * Math.PI * 2;
            const radius = 0.25;
            return (
              <mesh 
                key={fireClass}
                position={[
                  Math.cos(angle) * radius,
                  0.1,
                  Math.sin(angle) * radius
                ]}
                scale={[
                  1 + Math.sin(Date.now() * 0.008 + index) * 0.2,
                  1 + Math.sin(Date.now() * 0.008 + index) * 0.2,
                  1 + Math.sin(Date.now() * 0.008 + index) * 0.2
                ]}
              >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial 
                  color="#FFFFFF"
                  emissive="#FFFFFF"
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            );
          })}
          
          {/* Vertical beam for long-distance visibility */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
            <meshBasicMaterial 
              color={extinguisherColor}
              transparent
              opacity={0.6}
            />
          </mesh>
          
          {/* Top beacon */}
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color={extinguisherColor}
              emissive={extinguisherColor}
              emissiveIntensity={1.0}
              metalness={0}
              roughness={1}
            />
        </mesh>
        </group>
      )}
      
      {/* Ground-level identification circle */}
      <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 16]} />
        <meshBasicMaterial 
          color={extinguisherColor}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
