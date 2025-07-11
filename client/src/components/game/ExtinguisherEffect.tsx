import { useRef } from "react";
import { Group } from "three";
import { usePlayer } from "@/lib/stores/usePlayer";
import StableParticleSystem from "./ParticleSystem";

interface ExtinguisherEffectProps {
  isActive: boolean;
}

export default function ExtinguisherEffect({ isActive }: ExtinguisherEffectProps) {
  const groupRef = useRef<Group>(null);
  const playerState = usePlayer();

  if (!isActive || !playerState.hasExtinguisher) {
    return null;
  }

  // Position spray slightly in front of player
  const sprayPosition: [number, number, number] = [
    playerState.position.x + Math.sin(playerState.rotation.y) * 0.5,
    playerState.position.y + 0.5,
    playerState.position.z + Math.cos(playerState.rotation.y) * 0.5
  ];

  return (
    <group ref={groupRef}>
      {/* Main extinguisher spray */}
      <StableParticleSystem
        count={40}
        position={sprayPosition}
        scale={1.5}
        type="extinguish"
        active={isActive}
      />
      
      {/* Add a point light for the spray effect */}
      <pointLight
        position={sprayPosition}
        color="#AACCFF"
        intensity={0.5}
        distance={2}
        decay={2}
      />
    </group>
  );
} 