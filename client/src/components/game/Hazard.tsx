import { useEffect } from "react";
import FireHazard from "./FireHazard";
import { HazardState } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { SAFETY_TIPS } from "@/lib/constants";

interface HazardProps {
  hazard: HazardState;
}

export default function Hazard({ hazard }: HazardProps) {
  const { showSafetyTip } = useFireSafety();
  
  // Show a relevant safety tip for this hazard when active
  useEffect(() => {
    let tipTimeoutId: NodeJS.Timeout;
    
    // Only show tips for active, non-extinguished hazards
    if (hazard.isActive && !hazard.isExtinguished) {
      // Find a relevant safety tip based on hazard type
      let relevantTipId = "";
      
      switch (hazard.type) {
        case "StoveTop":
          relevantTipId = "tip1"; // Keep an eye on the stove
          break;
        case "ElectricalOutlet":
          relevantTipId = "tip9"; // Don't overload outlets
          break;
        case "Candle":
          relevantTipId = "tip7"; // Avoid candle hazards
          break;
        case "Fireplace":
          relevantTipId = "tip5"; // Keep space heaters away (also applies to fireplaces)
          break;
        case "SpacerHeater":
          relevantTipId = "tip5"; // Keep space heaters away
          break;
        case "CloggedDryer":
          relevantTipId = "tip8"; // Clean dryer lint
          break;
        default:
          // Find a random prevention tip
          const preventionTips = SAFETY_TIPS.filter(tip => 
            tip.category === "Prevention"
          );
          if (preventionTips.length > 0) {
            relevantTipId = preventionTips[
              Math.floor(Math.random() * preventionTips.length)
            ].id;
          }
      }
      
      // Show tip after a delay
      tipTimeoutId = setTimeout(() => {
        showSafetyTip(relevantTipId);
        
        // Hide tip after 5 seconds
        setTimeout(() => {
          showSafetyTip(null);
        }, 5000);
      }, 2000);
    }
    
    return () => {
      clearTimeout(tipTimeoutId);
    };
  }, [hazard.isActive, hazard.isExtinguished, hazard.type, showSafetyTip]);
  
  return <FireHazard hazard={hazard} />;
}
