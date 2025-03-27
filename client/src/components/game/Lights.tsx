import { useEffect, useRef } from "react";
import { DirectionalLight, DirectionalLightHelper, SpotLight, SpotLightHelper } from "three";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function Lights() {
  const directionalLightRef = useRef<DirectionalLight>(null);
  const spotlightRef = useRef<SpotLight>(null);
  const { hazards } = useFireSafety();
  
  // Debug helpers
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (directionalLightRef.current) {
        const helper = new DirectionalLightHelper(directionalLightRef.current, 5);
        directionalLightRef.current.parent?.add(helper);
        
        return () => {
          directionalLightRef.current?.parent?.remove(helper);
        };
      }
      
      if (spotlightRef.current) {
        const helper = new SpotLightHelper(spotlightRef.current);
        spotlightRef.current.parent?.add(helper);
        
        return () => {
          spotlightRef.current?.parent?.remove(helper);
        };
      }
    }
  }, []);
  
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light - simulates sunlight or ceiling lights */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Spotlight to highlight important areas */}
      <spotLight 
        ref={spotlightRef}
        position={[-5, 8, 0]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={0.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Dynamic lights for hazards that are on fire */}
      {hazards
        .filter(hazard => hazard.isActive && !hazard.isExtinguished)
        .map(hazard => (
          <pointLight
            key={hazard.id}
            position={[
              hazard.position.x,
              hazard.position.y + 0.5,
              hazard.position.z
            ]}
            intensity={hazard.severity * 0.15}
            distance={3 + hazard.severity}
            color="#ff7700"
            castShadow={false}
          />
        ))}
      
      {/* Hemisphere light for better ambient lighting from sky/ground */}
      <hemisphereLight args={["#87CEEB", "#8B4513", 0.3]} />
    </>
  );
}
