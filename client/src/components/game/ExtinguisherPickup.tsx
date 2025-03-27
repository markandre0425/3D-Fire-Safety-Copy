import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import FireExtinguisher from "./FireExtinguisher";
import SmokeDetector from "./SmokeDetector";
import ExitSign from "./ExitSign";
import { InteractiveObject, InteractiveObjectType } from "@/lib/types";

interface ExtinguisherPickupProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function InteractiveObjectComponent({ object, isCollected }: ExtinguisherPickupProps) {
  const { scene } = useThree();
  
  // Render the appropriate object based on type
  const renderObject = useMemo(() => {
    switch (object.type) {
      case InteractiveObjectType.FireExtinguisher:
        return <FireExtinguisher object={object} isCollected={isCollected} />;
      case InteractiveObjectType.SmokeDetector:
        return <SmokeDetector object={object} isActive={object.isActive} />;
      case InteractiveObjectType.EmergencyExit:
        return <ExitSign object={object} />;
      default:
        return null;
    }
  }, [object, isCollected]);
  
  return renderObject;
}
