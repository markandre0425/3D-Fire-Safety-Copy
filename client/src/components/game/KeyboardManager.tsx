import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useGame } from "@/lib/stores/useGame";

export default function KeyboardManager() {
  const { isPaused, pauseGame, resumeGame } = useFireSafety();
  const { phase } = useGame();
  
  // Get pause key state
  const isPausePressed = useKeyboardControls<Controls>(state => state.pause);
  
  // Handle pause key
  useEffect(() => {
    if (isPausePressed && phase === "playing") {
      if (isPaused) {
        resumeGame();
        console.log("Game resumed via keyboard");
      } else {
        pauseGame();
        console.log("Game paused via keyboard");
      }
    }
  }, [isPausePressed, isPaused, pauseGame, resumeGame, phase]);
  
  // Log key states in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const controls = [
        "forward", "backward", "leftward", "rightward", 
        "action", "extinguish", "crouch", "run", "pause"
      ];
      
      console.log("Keyboard controls registered:", controls);
    }
  }, []);
  
  return null;
}
