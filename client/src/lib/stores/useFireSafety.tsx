import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { HazardState, InteractiveObject, Level, LevelData } from "../types";
import { LEVELS, SAFETY_TIPS, GAME_CONSTANTS } from "../constants";
import { usePlayer } from "./usePlayer";
import { useAudio } from "./useAudio";

interface FireSafetyState {
  currentLevel: Level;
  levelData: LevelData;
  completedLevels: Level[];
  levelTime: number;
  isPaused: boolean;
  hazards: HazardState[];
  interactiveObjects: InteractiveObject[];
  activeTip: string | null;
  isLevelComplete: boolean;
  
  // Actions
  startLevel: (level: Level) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeLevel: () => void;
  resetLevel: () => void;
  updateLevelTime: (delta: number) => void;
  updateHazard: (hazardId: string, updates: Partial<HazardState>) => void;
  updateInteractiveObject: (objectId: string, updates: Partial<InteractiveObject>) => void;
  showSafetyTip: (tipId: string | null) => void;
  extinguishHazard: (hazardId: string) => void;
  collectObject: (objectId: string) => void;
  activateSmokeDetector: (detectorId: string) => void;
}

export const useFireSafety = create<FireSafetyState>()(
  subscribeWithSelector((set, get) => ({
    currentLevel: Level.Kitchen,
    levelData: LEVELS[Level.Kitchen],
    completedLevels: [],
    levelTime: 0,
    isPaused: false,
    hazards: LEVELS[Level.Kitchen].hazards,
    interactiveObjects: LEVELS[Level.Kitchen].objects,
    activeTip: null,
    isLevelComplete: false,
    
    startLevel: (level: Level) => {
      const levelData = LEVELS[level];
      set({
        currentLevel: level,
        levelData,
        levelTime: levelData.timeLimit > 0 ? levelData.timeLimit : 300, // Ensure a positive time limit with fallback
        hazards: [...levelData.hazards],
        interactiveObjects: [...levelData.objects],
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
      console.log(`Starting level: ${level} with time limit: ${levelData.timeLimit}`);
    },
    
    pauseGame: () => {
      set({ isPaused: true });
      console.log("Game paused");
    },
    
    resumeGame: () => {
      set({ isPaused: false });
      console.log("Game resumed");
    },
    
    completeLevel: () => {
      const { currentLevel, completedLevels } = get();
      
      if (!completedLevels.includes(currentLevel)) {
        set({
          completedLevels: [...completedLevels, currentLevel],
          isLevelComplete: true
        });
      } else {
        set({ isLevelComplete: true });
      }
      
      useAudio.getState().playSuccess();
      console.log(`Level ${currentLevel} completed!`);
    },
    
    resetLevel: () => {
      const { currentLevel } = get();
      const levelData = LEVELS[currentLevel];
      
      set({
        levelTime: levelData.timeLimit,
        hazards: [...levelData.hazards],
        interactiveObjects: [...levelData.objects],
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
      // Reset player state
      usePlayer.getState().resetPlayer();
      
      console.log(`Level ${currentLevel} reset`);
    },
    
    updateLevelTime: (delta: number) => {
      const { levelTime, isPaused } = get();
      
      if (!isPaused && levelTime > 0) {
        set({ levelTime: Math.max(0, levelTime - delta) });
      }
    },
    
    updateHazard: (hazardId: string, updates: Partial<HazardState>) => {
      const { hazards } = get();
      const updatedHazards = hazards.map(hazard => 
        hazard.id === hazardId ? { ...hazard, ...updates } : hazard
      );
      
      set({ hazards: updatedHazards });
    },
    
    updateInteractiveObject: (objectId: string, updates: Partial<InteractiveObject>) => {
      const { interactiveObjects } = get();
      const updatedObjects = interactiveObjects.map(obj => 
        obj.id === objectId ? { ...obj, ...updates } : obj
      );
      
      set({ interactiveObjects: updatedObjects });
    },
    
    showSafetyTip: (tipId: string | null) => {
      set({ activeTip: tipId });
    },
    
    extinguishHazard: (hazardId: string) => {
      const { hazards } = get();
      const updatedHazards = hazards.map(hazard => 
        hazard.id === hazardId ? { ...hazard, isExtinguished: true, isSmoking: false } : hazard
      );
      
      // Add points for extinguishing a hazard
      usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_EXTINGUISHING);
      
      // Play sound effect
      useAudio.getState().playHit();
      
      set({ hazards: updatedHazards });
      console.log(`Hazard ${hazardId} extinguished`);
      
      // Check if all hazards are extinguished to complete level
      if (updatedHazards.every(h => h.isExtinguished)) {
        setTimeout(() => get().completeLevel(), 1500);
      }
    },
    
    collectObject: (objectId: string) => {
      const { interactiveObjects } = get();
      const object = interactiveObjects.find(obj => obj.id === objectId);
      
      if (object) {
        // Add points
        usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_PREVENTION);
        
        const updatedObjects = interactiveObjects.map(obj => 
          obj.id === objectId ? { ...obj, isCollected: true } : obj
        );
        
        set({ interactiveObjects: updatedObjects });
        
        // If it's a fire extinguisher, give it to the player with type
        if (object.type === "FireExtinguisher" || 
            object.type === "WaterExtinguisher" ||
            object.type === "FoamExtinguisher" ||
            object.type === "CO2Extinguisher" ||
            object.type === "PowderExtinguisher" ||
            object.type === "WetChemicalExtinguisher") {
          usePlayer.getState().pickupExtinguisher(object.type);
        }
        
        useAudio.getState().playSuccess();
        console.log(`Object ${objectId} collected`);
      }
    },
    
    activateSmokeDetector: (detectorId: string) => {
      const { interactiveObjects } = get();
      
      const updatedObjects = interactiveObjects.map(obj => 
        obj.id === detectorId ? { ...obj, isActive: true } : obj
      );
      
      // Add points
      usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_DETECTOR);
      
      set({ interactiveObjects: updatedObjects });
      
      useAudio.getState().playSuccess();
      console.log(`Smoke detector ${detectorId} activated`);
    }
  }))
);

