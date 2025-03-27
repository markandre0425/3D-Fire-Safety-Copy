import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function SoundManager() {
  const { 
    backgroundMusic, 
    isMuted, 
    toggleMute 
  } = useAudio();
  const { phase } = useGame();
  const { isPaused } = useFireSafety();
  const hasStartedMusic = useRef(false);
  
  // Start background music when game starts
  useEffect(() => {
    if (phase === "playing" && !isPaused && backgroundMusic && !hasStartedMusic.current) {
      if (!isMuted) {
        backgroundMusic.play();
      }
      hasStartedMusic.current = true;
      console.log("Background music started");
    }
    
    // Pause music when game is paused or ended
    if ((isPaused || phase !== "playing") && backgroundMusic) {
      backgroundMusic.pause();
      console.log("Background music paused");
    }
    
    // Resume music when game is resumed
    if (phase === "playing" && !isPaused && backgroundMusic && hasStartedMusic.current) {
      if (!isMuted) {
        backgroundMusic.play();
      }
      console.log("Background music resumed");
    }
    
    // Clean up
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        console.log("Background music cleaned up");
      }
    };
  }, [phase, isPaused, backgroundMusic, isMuted]);
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    toggleMute();
    
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.play();
      } else {
        backgroundMusic.pause();
      }
    }
  };
  
  // Add event listener for 'M' key to toggle mute
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        handleMuteToggle();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMuted]);
  
  return null;
}
