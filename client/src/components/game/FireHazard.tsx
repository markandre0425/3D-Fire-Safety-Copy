import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HazardState, HazardType, FireClass } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { 
  getHazardFireClasses, 
  getAppropriateExtinguishers, 
  getExtinguisherColor,
  getExtinguisherInfo 
} from "@/lib/fireClassification";

interface FireHazardProps {
  hazard: HazardState;
}

export default function FireHazard({ hazard }: FireHazardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fireRef = useRef<THREE.Group>(null);
  const sparkParticles = useRef<THREE.Mesh[]>([]);
  
  const { updateHazard } = useFireSafety();
  
  // Get fire classification for this hazard
  const fireClasses = getHazardFireClasses(hazard.type);
  const appropriateExtinguishers = getAppropriateExtinguishers(hazard.type);
  
  // Get fire colors based on fire class
  const getFireColors = () => {
    const primaryFireClass = fireClasses[0]; // Use the first fire class for primary color
    
    switch (primaryFireClass) {
      case FireClass.ClassA: // Ordinary combustibles - Orange/Red flames
        return {
          base: { r: 255, g: 100, b: 0 },    // Orange base
          mid: { r: 255, g: 150, b: 0 },     // Yellow-orange
          tip: { r: 255, g: 200, b: 50 },    // Yellow tip
          spark: { r: 255, g: 150, b: 0 },   // Orange sparks
          extinguisherColor: "#DC143C"        // RED extinguisher needed
        };
      
      case FireClass.ClassB: // Flammable liquids - Blue/Yellow flames
        return {
          base: { r: 50, g: 100, b: 255 },   // Blue base
          mid: { r: 100, g: 200, b: 255 },   // Light blue
          tip: { r: 255, g: 255, b: 100 },   // Yellow tip
          spark: { r: 0, g: 150, b: 255 },   // Blue sparks
          extinguisherColor: "#F5F5DC"        // CREAM extinguisher needed
        };
      
      case FireClass.ClassC: // Electrical - Blue/White with sparks
        return {
          base: { r: 150, g: 200, b: 255 },  // Light blue base
          mid: { r: 200, g: 230, b: 255 },   // Pale blue
          tip: { r: 255, g: 255, b: 255 },   // White tip
          spark: { r: 255, g: 255, b: 255 }, // White sparks
          extinguisherColor: "#2C2C2C"        // BLACK extinguisher needed
        };
      
      case FireClass.ClassD: // Metals - Bright white/silver
        return {
          base: { r: 255, g: 255, b: 255 },  // Bright white
          mid: { r: 255, g: 255, b: 255 },   // White
          tip: { r: 200, g: 220, b: 255 },   // Slight blue tint
          spark: { r: 255, g: 255, b: 255 }, // Bright white sparks
          extinguisherColor: "#1E90FF"        // BLUE extinguisher needed
        };
      
      case FireClass.ClassK: // Cooking oils - Yellow/Orange flames
        return {
          base: { r: 255, g: 200, b: 0 },    // Golden yellow base
          mid: { r: 255, g: 220, b: 50 },    // Light yellow
          tip: { r: 255, g: 255, b: 150 },   // Pale yellow tip
          spark: { r: 255, g: 180, b: 0 },   // Golden sparks
          extinguisherColor: "#FFD700"        // YELLOW extinguisher needed
        };
      
      default: // Default to Class A colors
        return {
          base: { r: 255, g: 100, b: 0 },
          mid: { r: 255, g: 150, b: 0 },
          tip: { r: 255, g: 200, b: 50 },
          spark: { r: 255, g: 150, b: 0 },
          extinguisherColor: "#DC143C"
        };
    }
  };
  
  const fireColors = getFireColors();
  
  // Log fire classification info for educational purposes
  useEffect(() => {
    if (hazard.isActive && !hazard.isExtinguished) {
      const primaryExtinguisher = appropriateExtinguishers[0];
      const extinguisherInfo = primaryExtinguisher ? getExtinguisherInfo(primaryExtinguisher) : null;
      
      console.log(`🔥 Fire Classification Alert for ${hazard.type}:`);
      console.log(`   Fire Class(es): ${fireClasses.join(', ')}`);
      console.log(`   Required Extinguisher: ${extinguisherInfo?.name || 'Unknown'} (${fireColors.extinguisherColor})`);
      console.log(`   Fire Color: ${fireClasses[0]} - Look for ${fireColors.extinguisherColor} extinguisher!`);
      
      if (appropriateExtinguishers.length > 1) {
        console.log(`   Alternative Extinguishers: ${appropriateExtinguishers.slice(1).map(e => getExtinguisherInfo(e)?.name).join(', ')}`);
      }
    }
  }, [hazard.isActive, hazard.isExtinguished, fireClasses, appropriateExtinguishers, fireColors.extinguisherColor, hazard.type]);
  
  // State for animated fire texture
  const [fireTexture, setFireTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Create animated fire texture using canvas
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvasRef.current = canvas;
    ctxRef.current = ctx;
    
    // Create canvas texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    
    setFireTexture(texture);
    
    return () => {
      canvasRef.current = null;
      ctxRef.current = null;
    };
  }, []);
  
  // Fire animation parameters
  const fireAnimationRef = useRef({
    time: 0,
    fireParticles: [] as Array<{
      x: number;
      y: number;
      size: number;
      intensity: number;
      speed: number;
    }>
  });
  
  // Initialize fire particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * 128,
        y: 128 + Math.random() * 20,
        size: Math.random() * 30 + 10,
        intensity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 2 + 1
      });
    }
    fireAnimationRef.current.fireParticles = particles;
  }, []);
  
  // Create spark particles - ensure it's a positive integer
  const numParticles = useMemo(() => {
    // Ensure we have a positive integer for array creation
    const count = Math.max(0, Math.floor(Math.min(10, hazard.severity * 3)));
    return isNaN(count) ? 0 : count;
  }, [hazard.severity]);
  
  // Initialize particles
  useEffect(() => {
    if (numParticles > 0) {
      sparkParticles.current = Array(numParticles)
        .fill(null)
        .map(() => {
          const particle = new THREE.Mesh();
          particle.position.set(
            Math.random() * 0.4 - 0.2,
            Math.random() * 0.5,
            Math.random() * 0.4 - 0.2
          );
          particle.userData = {
            velocity: new THREE.Vector3(
              Math.random() * 0.04 - 0.02,
              Math.random() * 0.1 + 0.05,
              Math.random() * 0.04 - 0.02
            ),
            lifespan: Math.random() * 2 + 1
          };
          return particle;
        });
    } else {
      sparkParticles.current = [];
    }
  }, [numParticles]);
  
  // Animate fire and particles
  useFrame((_, delta) => {
    if (hazard.isExtinguished) return;
    
    // Animate canvas fire texture
    if (fireTexture && canvasRef.current && ctxRef.current) {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const anim = fireAnimationRef.current;
      
      anim.time += delta * 60; // 60 FPS equivalent
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background for heat distortion using fire class colors
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, `rgba(${fireColors.base.r}, ${fireColors.base.g}, ${fireColors.base.b}, ${0.8 * hazard.severity})`);
      gradient.addColorStop(0.3, `rgba(${fireColors.mid.r}, ${fireColors.mid.g}, ${fireColors.mid.b}, ${0.6 * hazard.severity})`);
      gradient.addColorStop(0.6, `rgba(${fireColors.tip.r}, ${fireColors.tip.g}, ${fireColors.tip.b}, ${0.4 * hazard.severity})`);
      gradient.addColorStop(1, `rgba(${fireColors.tip.r}, ${fireColors.tip.g}, ${fireColors.tip.b}, 0)`);
      
      // Draw base fire shape
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Animate fire particles
      anim.fireParticles.forEach((particle, index) => {
        // Move particle up with slight wobble
        particle.y -= particle.speed;
        particle.x += Math.sin(anim.time * 0.05 + index) * 0.5;
        
        // Reset particle when it goes off screen
        if (particle.y < -particle.size) {
          particle.y = canvas.height + particle.size;
          particle.x = Math.random() * canvas.width;
          particle.intensity = Math.random() * 0.8 + 0.2;
        }
        
        // Draw fire particle with varying intensity
        const opacity = particle.intensity * (1 - particle.y / canvas.height);
        const size = particle.size * (1 + Math.sin(anim.time * 0.1 + index) * 0.2);
        
        // Create radial gradient for particle using fire class colors
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size
        );
        particleGradient.addColorStop(0, `rgba(${fireColors.tip.r}, ${fireColors.tip.g}, ${fireColors.tip.b}, ${opacity})`);
        particleGradient.addColorStop(0.4, `rgba(${fireColors.mid.r}, ${fireColors.mid.g}, ${fireColors.mid.b}, ${opacity * 0.8})`);
        particleGradient.addColorStop(1, `rgba(${fireColors.base.r}, ${fireColors.base.g}, ${fireColors.base.b}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Update texture
      fireTexture.needsUpdate = true;
    }
    
    // Animate fire group
    if (fireRef.current) {
      // Pulsate fire size
      const scale = 0.2 + Math.sin(Date.now() * 0.005) * 0.05;
      fireRef.current.scale.set(
        hazard.severity * (1 + scale),
        hazard.severity * (1 + scale * 0.8),
        hazard.severity * (1 + scale)
      );
    }
    
    // Animate particles
    sparkParticles.current.forEach(particle => {
      const velocityData = particle.userData.velocity as THREE.Vector3;
      
      // Move particle
      particle.position.add(
        new THREE.Vector3(
          velocityData.x,
          velocityData.y,
          velocityData.z
        )
      );
      
      // Reduce lifespan
      particle.userData.lifespan -= delta;
      
      // Reset particle if it's reached the end of its life
      if (particle.userData.lifespan <= 0) {
        particle.position.set(
          Math.random() * 0.4 - 0.2,
          Math.random() * 0.2,
          Math.random() * 0.4 - 0.2
        );
        particle.userData.lifespan = Math.random() * 2 + 1;
      }
    });
    
    // Chance for fire to spread (increase severity)
    if (hazard.isActive && !hazard.isExtinguished && hazard.severity < 3) {
      const spreadChance = GAME_CONSTANTS.FIRE_SPREAD_RATE * delta;
      
      if (Math.random() < spreadChance) {
        updateHazard(hazard.id, { 
          severity: hazard.severity + 0.1,
          isSmoking: true 
        });
      }
    }
  });
  
  // Get hazard color based on type
  const getHazardBaseColor = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return "#7F8C8D"; // Gray
      case HazardType.StoveTop:
        return "#BDC3C7"; // Silver
      case HazardType.Candle:
        return "#FFFDD0"; // Cream for candle wax
      case HazardType.Fireplace:
        return "#E74C3C"; // Red
      case HazardType.SpacerHeater:
        return "#E67E22"; // Orange
      case HazardType.CloggedDryer:
        return "#95A5A6"; // Light gray
      case HazardType.Microwave:
        return "#F8F8F8"; // White
      case HazardType.CoffeeMaker:
        return "#2C2C2C"; // Dark gray
      case HazardType.DeepFryer:
        return "#C0C0C0"; // Silver
      case HazardType.ElectricKettle:
        return "#E8E8E8"; // Light gray
      case HazardType.RiceCooker:
        return "#F0F0F0"; // Off-white
      case HazardType.Blender:
        return "#2C2C2C"; // Dark gray
      case HazardType.Dishwasher:
        return "#F5F5F5"; // Very light gray
      default:
        return "#FFFFFF"; // White
    }
  };
  
  // Determine the size of the hazard base
  const getHazardDimensions = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return [0.2, 0.3, 0.1] as [number, number, number];
      case HazardType.StoveTop:
        return [0.8, 0.2, 0.6] as [number, number, number];
      case HazardType.Candle:
        return [0.15, 0.3, 0.15] as [number, number, number];
      case HazardType.Fireplace:
        return [1.2, 1, 0.4] as [number, number, number];
      case HazardType.SpacerHeater:
        return [0.6, 0.4, 0.3] as [number, number, number];
      case HazardType.CloggedDryer:
        return [0.8, 1, 0.6] as [number, number, number];
      case HazardType.Microwave:
        return [0.6, 0.35, 0.4] as [number, number, number];
      case HazardType.CoffeeMaker:
        return [0.25, 0.15, 0.35] as [number, number, number];
      case HazardType.DeepFryer:
        return [0.4, 0.25, 0.3] as [number, number, number];
      case HazardType.ElectricKettle:
        return [0.16, 0.2, 0.16] as [number, number, number];
      case HazardType.RiceCooker:
        return [0.3, 0.2, 0.3] as [number, number, number];
      case HazardType.Blender:
        return [0.16, 0.35, 0.16] as [number, number, number];
      case HazardType.Dishwasher:
        return [0.6, 0.85, 0.6] as [number, number, number];
      default:
        return [0.5, 0.3, 0.5] as [number, number, number];
    }
  };
  
  // Render realistic kitchen appliances based on hazard type
  const renderRealisticAppliance = () => {
    switch (hazard.type) {
      case HazardType.StoveTop:
        return renderStove();
      case HazardType.SpacerHeater:
        return renderToaster(); // Space heater repurposed as toaster for kitchen theme
      case HazardType.Microwave:
        return renderMicrowave();
      case HazardType.CoffeeMaker:
        return renderCoffeeMaker();
      case HazardType.DeepFryer:
        return renderDeepFryer();
      case HazardType.ElectricKettle:
        return renderElectricKettle();
      case HazardType.RiceCooker:
        return renderRiceCooker();
      case HazardType.Blender:
        return renderBlender();
      case HazardType.Dishwasher:
        return renderDishwasher();
      default:
        return null;
    }
  };

  // Render realistic stove
  const renderStove = () => {
    
    return (
      <group>
        {/* Main stove body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.6]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Stove top surface */}
        <mesh castShadow receiveShadow position={[0, 0.11, 0]}>
          <boxGeometry args={[0.78, 0.02, 0.58]} />
          <meshStandardMaterial color="#F5F5F5" metalness={0.1} roughness={0.2} />
        </mesh>
        
        {/* Front burner (left) */}
        <mesh castShadow receiveShadow position={[-0.2, 0.12, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Front burner (right) */}
        <mesh castShadow receiveShadow position={[0.2, 0.12, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Back burner (left) */}
        <mesh castShadow receiveShadow position={[-0.2, 0.12, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Back burner (right) */}
        <mesh castShadow receiveShadow position={[0.2, 0.12, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Control knobs */}
        <mesh castShadow position={[-0.3, 0.05, 0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.2} />
        </mesh>
        
        <mesh castShadow position={[-0.1, 0.05, 0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.2} />
        </mesh>
        
        <mesh castShadow position={[0.1, 0.05, 0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.2} />
        </mesh>
        
        <mesh castShadow position={[0.3, 0.05, 0.25]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Oven handle */}
        <mesh castShadow position={[0, -0.05, 0.31]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.1} />
        </mesh>
        
        {/* Oven door */}
        <mesh castShadow receiveShadow position={[0, -0.05, 0.29]}>
          <boxGeometry args={[0.6, 0.25, 0.02]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.2} roughness={0.3} />
        </mesh>
        
        {/* Oven window */}
        <mesh position={[0, -0.02, 0.3]}>
          <boxGeometry args={[0.4, 0.15, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            transparent 
            opacity={0.8} 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
      </group>
    );
  };

  // Render realistic toaster
  const renderToaster = () => {
    return (
      <group>
        {/* Main toaster body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.25]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.4} roughness={0.3} />
        </mesh>
        
        {/* Toaster slots */}
        <mesh position={[-0.06, 0.09, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.2]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        <mesh position={[0.06, 0.09, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.2]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Control lever */}
        <mesh castShadow position={[0.12, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Control dial */}
        <mesh castShadow position={[0.1, 0.02, 0.08]}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Power cord area */}
        <mesh position={[-0.15, -0.05, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    );
  };

  // Render realistic microwave
  const renderMicrowave = () => {
    return (
      <group>
        {/* Main microwave body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.4]} />
          <meshStandardMaterial color="#F8F8F8" metalness={0.1} roughness={0.2} />
        </mesh>
        
        {/* Door */}
        <mesh castShadow receiveShadow position={[0, 0, 0.21]}>
          <boxGeometry args={[0.55, 0.3, 0.02]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.2} roughness={0.3} />
        </mesh>
        
        {/* Door window */}
        <mesh position={[0, 0.05, 0.22]}>
          <boxGeometry args={[0.4, 0.2, 0.01]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.8} />
        </mesh>
        
        {/* Handle */}
        <mesh castShadow position={[0.2, 0, 0.25]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.2} />
        </mesh>
        
        {/* Control panel */}
        <mesh position={[0.2, -0.1, 0.21]}>
          <boxGeometry args={[0.15, 0.1, 0.01]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Display */}
        <mesh position={[0.2, -0.05, 0.22]}>
          <boxGeometry args={[0.08, 0.03, 0.005]} />
          <meshStandardMaterial color="#00FF00" emissive="#003300" />
        </mesh>
      </group>
    );
  };

  // Render realistic coffee maker
  const renderCoffeeMaker = () => {
    return (
      <group>
        {/* Base */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.35]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Water reservoir */}
        <mesh castShadow receiveShadow position={[-0.08, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.25, 0.3]} />
          <meshStandardMaterial color="#E0E0E0" transparent opacity={0.7} />
        </mesh>
        
        {/* Coffee pot */}
        <mesh castShadow receiveShadow position={[0.08, -0.02, 0.1]}>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.1} />
        </mesh>
        
        {/* Coffee pot handle */}
        <mesh castShadow position={[0.15, 0.03, 0.1]}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        
        {/* Heating plate */}
        <mesh position={[0.08, -0.06, 0.1]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 16]} />
          <meshStandardMaterial color="#666666" metalness={0.6} />
        </mesh>
        
        {/* Control buttons */}
        <mesh castShadow position={[0.08, 0.05, 0.18]}>
          <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
          <meshStandardMaterial color="#FF0000" emissive="#330000" />
        </mesh>
      </group>
    );
  };

  // Render realistic deep fryer
  const renderDeepFryer = () => {
    return (
      <group>
        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.25, 0.3]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.4} roughness={0.3} />
        </mesh>
        
        {/* Oil reservoir */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.35, 0.15, 0.25]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
        
        {/* Basket */}
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.25, 0.08, 0.15]} />
          <meshStandardMaterial color="#888888" metalness={0.6} />
        </mesh>
        
        {/* Basket handle */}
        <mesh castShadow position={[0.15, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Temperature control */}
        <mesh castShadow position={[-0.15, 0, 0.16]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* Power indicator */}
        <mesh position={[-0.1, 0.05, 0.16]}>
          <cylinderGeometry args={[0.01, 0.01, 0.005, 8]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={1} />
        </mesh>
      </group>
    );
  };

  // Render realistic electric kettle
  const renderElectricKettle = () => {
    return (
      <group>
        {/* Base station */}
        <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Kettle body */}
        <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Spout */}
        <mesh castShadow position={[0.1, 0.1, 0.08]}>
          <cylinderGeometry args={[0.015, 0.025, 0.08, 8]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Handle */}
        <mesh castShadow position={[-0.08, 0.12, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Lid */}
        <mesh castShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Power switch */}
        <mesh castShadow position={[-0.05, 0.02, 0.1]}>
          <boxGeometry args={[0.02, 0.03, 0.01]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
      </group>
    );
  };

  // Render realistic rice cooker
  const renderRiceCooker = () => {
    return (
      <group>
        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.1} roughness={0.3} />
        </mesh>
        
        {/* Lid */}
        <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.2} roughness={0.2} />
        </mesh>
        
        {/* Handle on lid */}
        <mesh castShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Control panel */}
        <mesh position={[0.12, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.01]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Indicator lights */}
        <mesh position={[0.13, 0.08, 0.005]}>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 8]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[0.13, 0.02, 0.005]}>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 8]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  };

  // Render realistic blender
  const renderBlender = () => {
    return (
      <group>
        {/* Base motor */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Pitcher */}
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 0.25, 8]} />
          <meshStandardMaterial color="#E0E0E0" transparent opacity={0.8} />
        </mesh>
        
        {/* Lid */}
        <mesh castShadow position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.2} roughness={0.3} />
        </mesh>
        
        {/* Control buttons */}
        <mesh castShadow position={[0.06, 0.03, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        <mesh castShadow position={[0.06, 0.06, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
          <meshStandardMaterial color="#00AA00" />
        </mesh>
        
        {/* Blades (simplified) */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.01]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.1} />
        </mesh>
      </group>
    );
  };

  // Render realistic dishwasher
  const renderDishwasher = () => {
    return (
      <group>
        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.85, 0.6]} />
          <meshStandardMaterial color="#F5F5F5" metalness={0.1} roughness={0.2} />
        </mesh>
        
        {/* Door */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0.31]}>
          <boxGeometry args={[0.55, 0.4, 0.02]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.2} roughness={0.3} />
        </mesh>
        
        {/* Handle */}
        <mesh castShadow position={[0, -0.15, 0.35]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.2} />
        </mesh>
        
        {/* Control panel */}
        <mesh position={[0, 0.35, 0.31]}>
          <boxGeometry args={[0.4, 0.08, 0.01]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Status lights */}
        <mesh position={[-0.1, 0.35, 0.32]}>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 8]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[0, 0.35, 0.32]}>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 8]} />
          <meshStandardMaterial color="#0080FF" emissive="#0080FF" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[0.1, 0.35, 0.32]}>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 8]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  };

  return (
    <group 
      ref={groupRef}
      position={[hazard.position.x, hazard.position.y, hazard.position.z]}
    >
      {/* Render realistic appliance or generic hazard base */}
      {renderRealisticAppliance() || (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[
            getHazardDimensions()[0], 
            getHazardDimensions()[1], 
            getHazardDimensions()[2]
          ]} />
          <meshStandardMaterial color={getHazardBaseColor()} />
        </mesh>
      )}
      
      {/* 3D Fire with canvas animation - Cross pattern for 3D effect */}
      {hazard.isActive && !hazard.isExtinguished && fireTexture && (
        <group 
          ref={fireRef}
          position={[0, getHazardDimensions()[1] / 2 + 0.2, 0]}
        >
          {/* First plane - facing forward/backward */}
          <mesh rotation={[0, 0, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial 
              map={fireTexture}
              transparent={true}
              alphaTest={0.1}
              side={THREE.DoubleSide}
              emissive={`rgb(${fireColors.mid.r}, ${fireColors.mid.g}, ${fireColors.mid.b})`}
              emissiveIntensity={0.3}
              toneMapped={false}
            />
          </mesh>
          
          {/* Second plane - facing left/right */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial 
              map={fireTexture}
              transparent={true}
              alphaTest={0.1}
              side={THREE.DoubleSide}
              emissive={`rgb(${fireColors.mid.r}, ${fireColors.mid.g}, ${fireColors.mid.b})`}
              emissiveIntensity={0.3}
              toneMapped={false}
            />
          </mesh>
          
          {/* Third plane - diagonal for more volume */}
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial 
              map={fireTexture}
              transparent={true}
              alphaTest={0.1}
              side={THREE.DoubleSide}
              emissive={`rgb(${fireColors.base.r}, ${fireColors.base.g}, ${fireColors.base.b})`}
              emissiveIntensity={0.2}
              toneMapped={false}
            />
          </mesh>
          
          {/* Fourth plane - opposite diagonal */}
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial 
              map={fireTexture}
              transparent={true}
              alphaTest={0.1}
              side={THREE.DoubleSide}
              emissive={`rgb(${fireColors.base.r}, ${fireColors.base.g}, ${fireColors.base.b})`}
              emissiveIntensity={0.2}
              toneMapped={false}
            />
          </mesh>
          
          {/* Invisible damage zone for smoke collision detection */}
          <mesh 
            position={[0, 0, 0]} 
            visible={false}
            userData={{ type: 'smoke-damage-zone', hazardId: hazard.id }}
          >
            <cylinderGeometry args={[2.5, 3.0, 3.0, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      )}
      
      {/* Spark particles with fire class colors */}
      {hazard.isActive && !hazard.isExtinguished && sparkParticles.current.map((_, i) => (
        <mesh 
          key={`spark-${hazard.id}-${i}`}
          position={[
            Math.random() * 0.4 - 0.2,
            getHazardDimensions()[1] / 2 + 0.2,
            Math.random() * 0.4 - 0.2
          ]}
          scale={[0.05, 0.05, 0.05]}
        >
          <sphereGeometry args={[1, 4, 4]} />
          <meshStandardMaterial 
            color={`rgb(${fireColors.spark.r}, ${fireColors.spark.g}, ${fireColors.spark.b})`}
            emissive={`rgb(${fireColors.spark.r}, ${fireColors.spark.g}, ${fireColors.spark.b})`}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
      
      {/* Extinguisher type indicator rings around the fire */}
      {hazard.isActive && !hazard.isExtinguished && (
        <group position={[0, getHazardDimensions()[1] / 2 + 0.1, 0]}>
          {/* Primary extinguisher indicator */}
          {appropriateExtinguishers.length > 0 && (
            <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.8, 1.0, 16]} />
              <meshBasicMaterial 
                color={fireColors.extinguisherColor}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          
          {/* Secondary indicator for multiple compatible extinguishers */}
          {appropriateExtinguishers.length > 1 && (
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.8, 16]} />
              <meshBasicMaterial 
                color={getExtinguisherColor(appropriateExtinguishers[1])}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          
          {/* Fire class indicator text (as floating spheres) */}
          {fireClasses.map((fireClass, index) => {
            const angle = (index / fireClasses.length) * Math.PI * 2;
            const radius = 1.2;
            return (
              <mesh 
                key={fireClass}
                position={[
                  Math.cos(angle) * radius,
                  0.7,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial 
                  color="#FFFFFF"
                  emissive="#FFFFFF"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            );
          })}
          
          {/* Pulsating danger indicator */}
          <mesh 
            position={[0, 1.0, 0]} 
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              1 + Math.sin(Date.now() * 0.01) * 0.3,
              1 + Math.sin(Date.now() * 0.01) * 0.3,
              1
            ]}
          >
            <ringGeometry args={[1.2, 1.4, 16]} />
            <meshBasicMaterial 
              color={fireColors.extinguisherColor}
              transparent
              opacity={0.4 + Math.sin(Date.now() * 0.01) * 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
