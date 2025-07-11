import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { HazardState, InteractiveObject, Level, LevelData, FireClass, RandomFireConfig, ApplianceHazard } from "../types";
import { LEVELS, SAFETY_TIPS, GAME_CONSTANTS, generateRandomFireHazards, generateMatchingExtinguishers, generateFlammableAppliances } from "../constants";
import { usePlayer } from "./usePlayer";
import { useAudio } from "./useAudio";
import { InteractiveObjectType } from "../types";

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
  // New: Random fire management
  currentFireClasses: FireClass[]; // Track the randomly spawned fire classes
  spawnedAppliances: ApplianceHazard[]; // Track spawned flammable appliances
  
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
  // New: Random fire actions
  generateRandomLevelContent: (level: Level) => void;
}

// Level-specific random fire configurations
const LEVEL_RANDOM_CONFIGS: Record<Level, RandomFireConfig> = {
  [Level.Kitchen]: {
    minFires: 2,
    maxFires: 4,
    availableClasses: [FireClass.K, FireClass.C, FireClass.A],
    spawnPositions: [
      { x: 2, y: 0.8, z: -2 },   // Stove area
      { x: -2, y: 0.4, z: -3 },  // Outlet area  
      { x: 1, y: 0.5, z: -4 },   // Counter
      { x: -1, y: 0.5, z: -4 }   // Counter
    ],
    applianceSpawnRate: 0.6 // 60% chance appliances catch fire
  },
  [Level.LivingRoom]: {
    minFires: 2,
    maxFires: 3,
    availableClasses: [FireClass.A, FireClass.C],
    spawnPositions: [
      { x: 0, y: 0.5, z: -4 },   // Fireplace area
      { x: 2, y: 0.8, z: 0 },    // Table/candle area
      { x: -3, y: 0.5, z: 2 }    // Heater area
    ],
    applianceSpawnRate: 0.4
  },
  [Level.Bedroom]: {
    minFires: 2,
    maxFires: 3,
    availableClasses: [FireClass.C, FireClass.A],
    spawnPositions: [
      { x: -4, y: 0.4, z: -2 },  // Outlet
      { x: 3, y: 0.5, z: -3 },   // Heater
      { x: 4, y: 0.5, z: 3 }     // Dryer area
    ],
    applianceSpawnRate: 0.5
  },
  [Level.BasicTraining]: {
    minFires: 1,
    maxFires: 2,
    availableClasses: [FireClass.A],
    spawnPositions: [
      { x: 0, y: 0.5, z: -2 },
      { x: 2, y: 0.5, z: -2 }
    ],
    applianceSpawnRate: 0.3
  },
  [Level.FireClassification]: {
    minFires: 3,
    maxFires: 3, // Exactly 3 for educational purposes
    availableClasses: [FireClass.A, FireClass.B, FireClass.C],
    spawnPositions: [
      { x: -3, y: 0.5, z: -2 },
      { x: 0, y: 0.5, z: -2 },
      { x: 3, y: 0.5, z: -2 }
    ],
    applianceSpawnRate: 0.2
  },
  [Level.EmergencyResponse]: {
    minFires: 3,
    maxFires: 5,
    availableClasses: [FireClass.K, FireClass.A, FireClass.C],
    spawnPositions: [
      { x: -2, y: 0.8, z: -3 },
      { x: 2, y: 0.5, z: -3 },
      { x: 0, y: 1, z: 0 },
      { x: -3, y: 0.5, z: 2 },
      { x: 3, y: 0.5, z: 2 }
    ],
    applianceSpawnRate: 0.8
  },
  [Level.AdvancedRescue]: {
    minFires: 4,
    maxFires: 6,
    availableClasses: [FireClass.D, FireClass.A, FireClass.C],
    spawnPositions: [
      { x: -3, y: 0.5, z: -2 },
      { x: 3, y: 0.1, z: -2 },
      { x: -1, y: 1.5, z: 1 },
      { x: 1, y: 1.5, z: 1 },
      { x: 0, y: 0.5, z: -4 },
      { x: 0, y: 0.5, z: 4 }
    ],
    applianceSpawnRate: 0.7
  },
  [Level.BFPCertification]: {
    minFires: 5,
    maxFires: 7,
    availableClasses: [FireClass.A, FireClass.B, FireClass.C, FireClass.K, FireClass.D],
    spawnPositions: [
      { x: -4, y: 0.5, z: -4 },
      { x: 0, y: 0.5, z: -4 },
      { x: 4, y: 0.5, z: -4 },
      { x: -2, y: 0.8, z: 0 },
      { x: 2, y: 0.5, z: 0 },
      { x: -2, y: 1.5, z: 2 },
      { x: 2, y: 1.5, z: 2 }
    ],
    applianceSpawnRate: 0.9
  }
};

// Extinguisher spawn positions for each level
const EXTINGUISHER_SPAWN_POSITIONS: Record<Level, Array<{x: number, y: number, z: number}>> = {
  [Level.Kitchen]: [
    { x: -3, y: 0, z: 3 },
    { x: 3, y: 0, z: 3 },
    { x: 0, y: 0, z: 4 }
  ],
  [Level.LivingRoom]: [
    { x: 4, y: 0, z: 4 },
    { x: -4, y: 0, z: 4 },
    { x: 0, y: 0, z: 4 }
  ],
  [Level.Bedroom]: [
    { x: -4, y: 0, z: 4 },
    { x: 4, y: 0, z: 4 },
    { x: 0, y: 0, z: 4.5 }
  ],
  [Level.BasicTraining]: [
    { x: -2, y: 0, z: 3 },
    { x: 2, y: 0, z: 3 }
  ],
  [Level.FireClassification]: [
    { x: -3, y: 0, z: 3 },
    { x: 0, y: 0, z: 3 },
    { x: 3, y: 0, z: 3 }
  ],
  [Level.EmergencyResponse]: [
    { x: -4, y: 0, z: 4 },
    { x: 0, y: 0, z: 4.5 },
    { x: 4, y: 0, z: 4 }
  ],
  [Level.AdvancedRescue]: [
    { x: -5, y: 0, z: 4 },
    { x: 0, y: 0, z: 5 },
    { x: 5, y: 0, z: 4 }
  ],
  [Level.BFPCertification]: [
    { x: -6, y: 0, z: 5 },
    { x: -3, y: 0, z: 5 },
    { x: 0, y: 0, z: 5 },
    { x: 3, y: 0, z: 5 },
    { x: 6, y: 0, z: 5 }
  ]
};

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
    currentFireClasses: [],
    spawnedAppliances: [],
    
    startLevel: (level: Level) => {
      const levelData = LEVELS[level];
      
      // Generate random content for this level
      get().generateRandomLevelContent(level);
      
      set({
        currentLevel: level,
        levelData,
        levelTime: levelData.timeLimit > 0 ? levelData.timeLimit : 300,
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
      console.log(`Starting level: ${level} with time limit: ${levelData.timeLimit}`);
      console.log(`Random fire classes spawned:`, get().currentFireClasses);
    },

    generateRandomLevelContent: (level: Level) => {
      const config = LEVEL_RANDOM_CONFIGS[level];
      const extinguisherPositions = EXTINGUISHER_SPAWN_POSITIONS[level];
      
      // Generate random fire hazards
      const randomFires = generateRandomFireHazards(config);
      
      // Generate flammable appliances
      const roomType = level.toLowerCase();
      const appliancePositions = config.spawnPositions.slice(randomFires.length); // Use remaining positions
      const appliances = generateFlammableAppliances(roomType, 2, appliancePositions);
      
      // Combine base level hazards with random fires and appliances
      const baseHazards = LEVELS[level].hazards;
      const allHazards = [...baseHazards, ...randomFires, ...appliances];
      
      // Generate matching extinguishers
      const matchingExtinguishers = generateMatchingExtinguishers(randomFires, extinguisherPositions);
      
      // Combine base level objects with matching extinguishers
      const baseObjects = LEVELS[level].objects.filter(obj => 
        !obj.type.includes('Extinguisher') // Remove predefined extinguishers
      );
      const allObjects = [...baseObjects, ...matchingExtinguishers];
      
      // Store fire classes for tracking
      const fireClasses = randomFires.map(fire => fire.fireClass || FireClass.A);
      
      set({
        hazards: allHazards,
        interactiveObjects: allObjects,
        currentFireClasses: fireClasses,
        spawnedAppliances: appliances
      });
      
      console.log(`Generated ${randomFires.length} random fires and ${appliances.length} flammable appliances for ${level}`);
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
      
      // Generate new random content for the reset
      get().generateRandomLevelContent(currentLevel);
      
      set({
        levelTime: levelData.timeLimit,
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
      // Reset player state
      usePlayer.getState().resetPlayer();
      
      console.log(`Level ${currentLevel} reset with new random content`);
      console.log(`New random fire classes:`, get().currentFireClasses);
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
        if (object.type === InteractiveObjectType.ClassAExtinguisher || 
            object.type === InteractiveObjectType.ClassBExtinguisher ||
            object.type === InteractiveObjectType.ClassCExtinguisher ||
            object.type === InteractiveObjectType.ClassDExtinguisher ||
            object.type === InteractiveObjectType.ClassKExtinguisher) {
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

