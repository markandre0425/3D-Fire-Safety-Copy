import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import Wall from "./Wall";
import Floor from "./Floor";
import Furniture from "./Furniture";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function HomeEnvironment() {
  const { scene } = useThree();
  const { levelData } = useFireSafety();
  
  // Create walls and furniture based on level data
  const environmentObjects = useMemo(() => {
    return levelData.environmentObjects.map(obj => {
      const position: [number, number, number] = [
        obj.position.x,
        obj.position.y,
        obj.position.z
      ];
      
      const rotation: [number, number, number] = [
        obj.rotation.x,
        obj.rotation.y,
        obj.rotation.z
      ];
      
      const scale: [number, number, number] = [
        obj.scale.x,
        obj.scale.y,
        obj.scale.z
      ];
      
      if (obj.type === "wall") {
        return (
          <Wall 
            key={obj.id}
            position={position}
            rotation={rotation}
            scale={scale}
          />
        );
      } else if (obj.type === "floor") {
        return <Floor key={obj.id} />;
      } else {
        return (
          <Furniture
            key={obj.id}
            type={obj.type}
            position={position}
            rotation={rotation}
            scale={scale}
          />
        );
      }
    });
  }, [levelData.environmentObjects]);
  
  return (
    <group>
      {environmentObjects}
    </group>
  );
}
