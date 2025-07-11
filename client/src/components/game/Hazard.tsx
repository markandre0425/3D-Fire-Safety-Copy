import { useRef } from "react";
import { Mesh } from "three";
import { HazardState, HazardType } from "@/lib/types";
import { FIRE_CLASS_COLORS } from "@/lib/constants";
import FireHazard from "./FireHazard";

interface HazardProps {
  hazard: HazardState;
}

export default function Hazard({ hazard }: HazardProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Get color based on fire class
  const fireColor = hazard.fireClass ? FIRE_CLASS_COLORS[hazard.fireClass] : "#FF6B35";
  
  // Render based on hazard type
  const renderHazardModel = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.3, 0.2, 0.1]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        );
      
      case HazardType.StoveTop:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <cylinderGeometry args={[0.4, 0.4, 0.1]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        );
      
      case HazardType.Candle:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3]} />
            <meshStandardMaterial color="#FFFFCC" />
          </mesh>
        );
      
      case HazardType.Fireplace:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[1.5, 1, 0.3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        );
      
      case HazardType.SpacerHeater:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.4, 0.6, 0.3]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
        );
      
      case HazardType.CloggedDryer:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.6, 1, 0.6]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
        );
      
      // Flammable Appliances
      case HazardType.Microwave:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.5, 0.3, 0.4]} />
            <meshStandardMaterial color="#2C2C2C" />
          </mesh>
        );
      
      case HazardType.Toaster:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.3, 0.2, 0.2]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
        );
      
      case HazardType.Television:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.8, 0.5, 0.1]} />
            <meshStandardMaterial color="#1C1C1C" />
          </mesh>
        );
      
      case HazardType.ComputerTower:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#2F2F2F" />
          </mesh>
        );
      
      case HazardType.Coffeemaker:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
            <meshStandardMaterial color="#4A4A4A" />
          </mesh>
        );
      
      case HazardType.AirConditioner:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.6, 0.4, 0.3]} />
            <meshStandardMaterial color="#E8E8E8" />
          </mesh>
        );
      
      case HazardType.WashingMachine:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.6, 0.8, 0.6]} />
            <meshStandardMaterial color="#F0F0F0" />
          </mesh>
        );
      
      case HazardType.Refrigerator:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.7, 1.8, 0.7]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        );
      
      case HazardType.BlenderMixer:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshStandardMaterial color="#FF6B6B" />
          </mesh>
        );
      
      case HazardType.ElectricHeater:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.4, 0.6, 0.3]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
        );
      
      // Generic fire types (rendered as basic shapes)
      case HazardType.ClassAFire:
      case HazardType.ClassBFire:
      case HazardType.ClassCFire:
      case HazardType.ClassDFire:
      case HazardType.ClassKFire:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#8B4513" emissive={fireColor} emissiveIntensity={0.3} />
          </mesh>
        );
      
      default:
        return (
          <mesh ref={meshRef} position={[hazard.position.x, hazard.position.y, hazard.position.z]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        );
    }
  };

  return (
    <>
      {/* Render the base hazard model */}
      {renderHazardModel()}
      
      {/* Add fire effects if the hazard is active and not extinguished */}
      {hazard.isActive && !hazard.isExtinguished && (
        <FireHazard hazard={hazard} />
      )}
      
      {/* Add visual indicator for fire class (colored ring above the hazard) */}
      {hazard.isActive && !hazard.isExtinguished && hazard.fireClass && (
        <mesh position={[hazard.position.x, hazard.position.y + 1.2, hazard.position.z]}>
          <ringGeometry args={[0.4, 0.6, 16]} />
          <meshBasicMaterial color={fireColor} transparent opacity={0.7} />
        </mesh>
      )}
    </>
  );
}
