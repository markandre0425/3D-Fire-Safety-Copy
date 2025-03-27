import { useState, useEffect } from "react";
import HealthBar from "./HealthBar";
import ScoreDisplay from "./ScoreDisplay";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { SAFETY_TIPS } from "@/lib/constants";
import PauseMenu from "../screens/PauseMenu";
import { Controls } from "@/lib/types";

export default function GameUI() {
  const { 
    isPaused, 
    resumeGame, 
    resetLevel,
    activeTip, 
    levelData
  } = useFireSafety();
  
  const { hasExtinguisher } = usePlayer();
  
  const [showTip, setShowTip] = useState(false);
  const [tipContent, setTipContent] = useState<{title: string, content: string} | null>(null);
  
  // Show safety tip when active
  useEffect(() => {
    if (activeTip) {
      const tip = SAFETY_TIPS.find(t => t.id === activeTip);
      if (tip) {
        setTipContent({
          title: tip.title,
          content: tip.content
        });
        setShowTip(true);
        
        // Hide tip after 5 seconds
        const tipTimeout = setTimeout(() => {
          setShowTip(false);
        }, 5000);
        
        return () => clearTimeout(tipTimeout);
      }
    } else {
      setShowTip(false);
    }
  }, [activeTip]);
  
  return (
    <>
      {/* Health and Oxygen Bars */}
      <HealthBar />
      
      {/* Score and Time */}
      <ScoreDisplay />
      
      {/* Controls Guide */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-3 rounded-md text-white">
        <h3 className="text-lg font-bold mb-2">Controls</h3>
        <ul className="text-sm space-y-1">
          <li>WASD / Arrows: Move</li>
          <li>Shift: Run</li>
          <li>C: Crouch</li>
          <li>E: Interact</li>
          {hasExtinguisher && <li>F: Use Extinguisher</li>}
          <li>Esc: Pause</li>
          <li>M: Toggle Sound</li>
        </ul>
      </div>
      
      {/* Level Info */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-3 rounded-md text-white">
        <h2 className="text-xl font-bold">{levelData.name}</h2>
        <p className="text-sm mt-1">{levelData.description}</p>
      </div>
      
      {/* Safety Tip */}
      {showTip && tipContent && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-600 bg-opacity-90 p-4 rounded-md text-white max-w-md">
          <h3 className="text-xl font-bold mb-2">{tipContent.title}</h3>
          <p className="text-md">{tipContent.content}</p>
        </div>
      )}
      
      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu onResume={resumeGame} onRestart={resetLevel} />
      )}
    </>
  );
}
