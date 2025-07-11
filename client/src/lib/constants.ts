import { Level, LevelData, SafetyTip, SafetyTipCategory, HazardType, InteractiveObjectType, DifficultyLevel, FireClass, RandomFireConfig, ApplianceHazard, HazardState, InteractiveObject } from "./types";

// Fire Class Colors (Educational and Realistic)
export const FIRE_CLASS_COLORS = {
  [FireClass.A]: "#FF6B35", // Orange-Red for ordinary combustibles
  [FireClass.B]: "#FF1744", // Bright Red for flammable liquids  
  [FireClass.C]: "#3F51B5", // Blue for electrical fires
  [FireClass.D]: "#9C27B0", // Purple for combustible metals
  [FireClass.K]: "#FFA726"  // Amber for cooking oils/grease
};

// Extinguisher Colors (Matching Fire Classes)
export const EXTINGUISHER_COLORS = {
  [FireClass.A]: "#FF6B35", // Water - Orange-Red
  [FireClass.B]: "#FF1744", // Foam - Bright Red  
  [FireClass.C]: "#3F51B5", // CO2 - Blue
  [FireClass.D]: "#9C27B0", // Powder - Purple
  [FireClass.K]: "#FFA726"  // Wet Chemical - Amber
};

// Fire Class Descriptions (Educational Content)
export const FIRE_CLASS_DESCRIPTIONS = {
  [FireClass.A]: "Ordinary combustibles: wood, paper, cloth, plastic",
  [FireClass.B]: "Flammable liquids: gasoline, oil, paint, alcohol", 
  [FireClass.C]: "Electrical equipment: appliances, wiring, electronics",
  [FireClass.D]: "Combustible metals: magnesium, titanium, sodium",
  [FireClass.K]: "Cooking oils and fats: deep fryers, grease fires"
};

// Appliance Fire Configurations
export const APPLIANCE_FIRE_CONFIG = {
  [HazardType.Microwave]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.15,
    severity: 2,
    description: "Microwave electrical fire"
  },
  [HazardType.Toaster]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.25,
    severity: 2,
    description: "Toaster electrical/crumb fire"
  },
  [HazardType.Television]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.10,
    severity: 3,
    description: "Television electrical fire"
  },
  [HazardType.ComputerTower]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.12,
    severity: 2,
    description: "Computer electrical fire"
  },
  [HazardType.Coffeemaker]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.18,
    severity: 2,
    description: "Coffee maker electrical fire"
  },
  [HazardType.AirConditioner]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.08,
    severity: 3,
    description: "Air conditioner electrical fire"
  },
  [HazardType.WashingMachine]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.10,
    severity: 3,
    description: "Washing machine electrical fire"
  },
  [HazardType.Refrigerator]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.05,
    severity: 3,
    description: "Refrigerator electrical fire"
  },
  [HazardType.BlenderMixer]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.20,
    severity: 2,
    description: "Blender electrical fire"
  },
  [HazardType.ElectricHeater]: {
    baseFireClass: FireClass.C,
    ignitionChance: 0.22,
    severity: 3,
    description: "Electric heater fire"
  }
};

// Random Fire Spawning Utilities
export const getRandomFireClass = (availableClasses: FireClass[] = [FireClass.A, FireClass.B, FireClass.C, FireClass.K]): FireClass => {
  return availableClasses[Math.floor(Math.random() * availableClasses.length)];
};

export const getMatchingExtinguisherType = (fireClass: FireClass): InteractiveObjectType => {
  switch (fireClass) {
    case FireClass.A: return InteractiveObjectType.ClassAExtinguisher;
    case FireClass.B: return InteractiveObjectType.ClassBExtinguisher;
    case FireClass.C: return InteractiveObjectType.ClassCExtinguisher;
    case FireClass.D: return InteractiveObjectType.ClassDExtinguisher;
    case FireClass.K: return InteractiveObjectType.ClassKExtinguisher;
    default: return InteractiveObjectType.ClassAExtinguisher;
  }
};

export const generateRandomFireHazards = (config: RandomFireConfig): HazardState[] => {
  const fireCount = Math.floor(Math.random() * (config.maxFires - config.minFires + 1)) + config.minFires;
  const hazards: HazardState[] = [];
  const usedPositions = new Set<string>();
  
  for (let i = 0; i < fireCount && i < config.spawnPositions.length; i++) {
    // Select random position that hasn't been used
    let positionIndex: number;
    let positionKey: string;
    let attempts = 0;
    
    do {
      positionIndex = Math.floor(Math.random() * config.spawnPositions.length);
      positionKey = `${positionIndex}`;
      attempts++;
    } while (usedPositions.has(positionKey) && attempts < 50);
    
    if (attempts >= 50) break; // Prevent infinite loop
    
    usedPositions.add(positionKey);
    const position = config.spawnPositions[positionIndex];
    const fireClass = getRandomFireClass(config.availableClasses);
    
    // Determine hazard type based on fire class
    let hazardType: HazardType;
    switch (fireClass) {
      case FireClass.A:
        hazardType = HazardType.ClassAFire;
        break;
      case FireClass.B:
        hazardType = HazardType.ClassBFire;
        break;
      case FireClass.C:
        hazardType = HazardType.ClassCFire;
        break;
      case FireClass.D:
        hazardType = HazardType.ClassDFire;
        break;
      case FireClass.K:
        hazardType = HazardType.ClassKFire;
        break;
      default:
        hazardType = HazardType.ClassAFire;
    }
    
    hazards.push({
      id: `random_fire_${i}`,
      type: hazardType,
      fireClass: fireClass,
      position: position,
      isActive: true,
      severity: Math.floor(Math.random() * 3) + 1, // Random severity 1-3
      isSmoking: Math.random() > 0.5, // 50% chance of smoking
      isExtinguished: false
    });
  }
  
  return hazards;
};

export const generateMatchingExtinguishers = (fires: HazardState[], spawnPositions: Array<{x: number, y: number, z: number}>): InteractiveObject[] => {
  const extinguishers: InteractiveObject[] = [];
  const fireClasses = fires.map(fire => fire.fireClass || FireClass.A);
  const uniqueClasses = Array.from(new Set(fireClasses)); // Fix: Convert Set to Array
  
  uniqueClasses.forEach((fireClass, index) => {
    if (index < spawnPositions.length) {
      const position = spawnPositions[index];
      extinguishers.push({
        id: `matching_extinguisher_${index}`,
        type: getMatchingExtinguisherType(fireClass),
        fireClass: fireClass,
        position: position,
        isActive: true,
        isCollected: false
      });
    }
  });
  
  return extinguishers;
};

export const generateFlammableAppliances = (roomType: string, count: number, positions: Array<{x: number, y: number, z: number}>): ApplianceHazard[] => {
  const appliances: ApplianceHazard[] = [];
  let availableAppliances: HazardType[] = [];
  
  // Select appliances based on room type
  switch (roomType.toLowerCase()) {
    case 'kitchen':
      availableAppliances = [HazardType.Microwave, HazardType.Toaster, HazardType.Coffeemaker, HazardType.BlenderMixer, HazardType.Refrigerator];
      break;
    case 'livingroom':
    case 'living room':
      availableAppliances = [HazardType.Television, HazardType.ComputerTower, HazardType.AirConditioner, HazardType.ElectricHeater];
      break;
    case 'bedroom':
      availableAppliances = [HazardType.Television, HazardType.ComputerTower, HazardType.AirConditioner, HazardType.ElectricHeater];
      break;
    case 'laundry':
      availableAppliances = [HazardType.WashingMachine, HazardType.ElectricHeater];
      break;
    default:
      availableAppliances = Object.keys(APPLIANCE_FIRE_CONFIG) as HazardType[];
  }
  
  for (let i = 0; i < Math.min(count, positions.length, availableAppliances.length); i++) {
    const applianceType = availableAppliances[i % availableAppliances.length];
    
    // Fix: Add type safety check for appliance config
    if (!(applianceType in APPLIANCE_FIRE_CONFIG)) {
      continue; // Skip if config doesn't exist for this appliance type
    }
    
    const config = APPLIANCE_FIRE_CONFIG[applianceType as keyof typeof APPLIANCE_FIRE_CONFIG];
    const position = positions[i];
    
    // Random chance this appliance will catch fire
    const willCatchFire = Math.random() < config.ignitionChance;
    
    if (willCatchFire) {
      appliances.push({
        id: `appliance_${applianceType}_${i}`,
        type: applianceType,
        fireClass: config.baseFireClass,
        applianceType: applianceType,
        ignitionChance: config.ignitionChance,
        baseFireClass: config.baseFireClass,
        position: position,
        isActive: true,
        severity: config.severity,
        isSmoking: Math.random() > 0.7, // 30% chance of smoking
        isExtinguished: false
      });
    }
  }
  
  return appliances;
};

// Level data for the game
export const LEVELS: Record<Level, LevelData> = {
  [Level.Kitchen]: {
    id: Level.Kitchen,
    name: "Kitchen Safety",
    description: "Learn how to prevent and respond to kitchen fires",
    hazards: [
      {
        id: "stove1",
        type: HazardType.StoveTop,
        fireClass: FireClass.K, // Cooking oils/grease fire
        position: { x: 2, y: 0.8, z: -2 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "outlet1",
        type: HazardType.ElectricalOutlet,
        fireClass: FireClass.C, // Electrical equipment fire
        position: { x: -2, y: 0.4, z: -3 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher1",
        type: InteractiveObjectType.ClassKExtinguisher, // Fix: Use correct enum value
        fireClass: FireClass.K,
        position: { x: -3, y: 0, z: 3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "detector1",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "exit1",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1, z: 4.5 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 0.1, z: 10 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "counter1",
        type: "counter",
        position: { x: 2, y: 0.5, z: -4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 1, z: 1 }
      },
      {
        id: "counter2",
        type: "counter",
        position: { x: -2, y: 0.5, z: -4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 1, z: 1 }
      },
      {
        id: "table",
        type: "table",
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 1, z: 3 }
      }
    ],
    requiredScore: 300,
    timeLimit: 180,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Learn to identify common kitchen fire hazards",
      "Practice using fire extinguisher with PASS technique",
      "Understand importance of smoke detector activation"
    ]
  },
  [Level.LivingRoom]: {
    id: Level.LivingRoom,
    name: "Living Room Safety",
    description: "Identify and manage common fire hazards in the living room",
    hazards: [
      {
        id: "fireplace1",
        type: HazardType.Fireplace,
        fireClass: FireClass.A, // Wood burning
        position: { x: 0, y: 0.5, z: -4 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "candle1",
        type: HazardType.Candle,
        fireClass: FireClass.A, // Wax and wick
        position: { x: 2, y: 0.8, z: 0 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "heater1",
        type: HazardType.SpacerHeater,
        fireClass: FireClass.C, // Electrical equipment
        position: { x: -3, y: 0.5, z: 2 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher2",
        type: InteractiveObjectType.ClassAExtinguisher, // Fix: Use correct enum value
        position: { x: 4, y: 0, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "detector2",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "exit2",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1, z: 4.5 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 0.1, z: 10 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "sofa",
        type: "sofa",
        position: { x: -2, y: 0.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 3, y: 1, z: 1 }
      },
      {
        id: "coffeeTable",
        type: "table",
        position: { x: 0, y: 0.3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 0.6, z: 1 }
      }
    ],
    requiredScore: 400,
    timeLimit: 210,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Identify multiple fire sources in one room",
      "Practice proper spacing from space heaters",
      "Learn candle safety and fireplace management"
    ]
  },
  [Level.Bedroom]: {
    id: Level.Bedroom,
    name: "Bedroom Safety",
    description: "Practice fire safety measures in the bedroom",
    hazards: [
      {
        id: "outlet2",
        type: HazardType.ElectricalOutlet,
        position: { x: -4, y: 0.4, z: -2 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "heater2",
        type: HazardType.SpacerHeater,
        position: { x: 3, y: 0.5, z: -3 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "dryer1",
        type: HazardType.CloggedDryer,
        position: { x: 4, y: 0.5, z: 3 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher3",
        type: InteractiveObjectType.ClassCExtinguisher,
        position: { x: -4, y: 0, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "detector3",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "exit3",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1, z: 4.5 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 0.1, z: 10 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "bed",
        type: "bed",
        position: { x: -2, y: 0.4, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 0.8, z: 3 }
      },
      {
        id: "dresser",
        type: "dresser",
        position: { x: -4, y: 0.8, z: -4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 1.6, z: 0.8 }
      }
    ],
    requiredScore: 500,
    timeLimit: 240,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Handle high-severity hazards like clogged dryers",
      "Manage multiple fire sources simultaneously",
      "Practice emergency response under time pressure"
    ]
  },
  // New BFP-based training levels
  [Level.BasicTraining]: {
    id: Level.BasicTraining,
    name: "BFP Basic Training",
    description: "Learn the fundamentals with Captain Apoy! Master the PASS technique and basic fire safety principles.",
    hazards: [
      {
        id: "classA1",
        type: HazardType.ClassAFire,
        position: { x: 0, y: 0.5, z: -2 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "waterExt1",
        type: InteractiveObjectType.ClassAExtinguisher,
        position: { x: -2, y: 0, z: 3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "basicDetector",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "basicExit",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1, z: 4.5 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 0.1, z: 10 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 5, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 10, y: 3, z: 0.1 }
      }
    ],
    requiredScore: 150,
    timeLimit: 120,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Master the PASS technique (Pull, Aim, Squeeze, Sweep)",
      "Identify Class A fires (ordinary combustibles)",
      "Use water extinguisher safely and effectively"
    ]
  },
  [Level.FireClassification]: {
    id: Level.FireClassification,
    name: "Fire Classification Challenge",
    description: "Test your knowledge of different fire types! Match the right extinguisher to each fire class.",
    hazards: [
      {
        id: "classA2",
        type: HazardType.ClassAFire,
        position: { x: -3, y: 0.5, z: -2 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "classB1",
        type: HazardType.ClassBFire,
        position: { x: 0, y: 0.5, z: -2 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "classC1",
        type: HazardType.ClassCFire,
        position: { x: 3, y: 0.5, z: -2 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "waterExt2",
        type: InteractiveObjectType.ClassAExtinguisher,
        position: { x: -3, y: 0, z: 3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "foamExt1",
        type: InteractiveObjectType.ClassBExtinguisher,
        position: { x: 0, y: 0, z: 3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "co2Ext1",
        type: InteractiveObjectType.ClassCExtinguisher,
        position: { x: 3, y: 0, z: 3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "classDetector",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 0.1, z: 12 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -6, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 6, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      }
    ],
    requiredScore: 600,
    timeLimit: 180,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Classify fire types: A (solids), B (liquids), C (electrical)",
      "Select appropriate extinguisher for each fire class",
      "Understand fire triangle principles"
    ]
  },
  [Level.EmergencyResponse]: {
    id: Level.EmergencyResponse,
    name: "Emergency Response Drill",
    description: "Handle multiple hazards and emergency scenarios like a true fire safety hero!",
    hazards: [
      {
        id: "classK1",
        type: HazardType.ClassKFire,
        position: { x: -2, y: 0.8, z: -3 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "gasLeak1",
        type: HazardType.GasLeak,
        position: { x: 2, y: 0.5, z: -3 },
        isActive: true,
        severity: 3,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "smokeArea1",
        type: HazardType.SmokeScreen,
        position: { x: 0, y: 1, z: 0 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "wetChemExt1",
        type: InteractiveObjectType.ClassKExtinguisher,
        position: { x: -4, y: 0, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergencyAlarm1",
        type: InteractiveObjectType.EmergencyAlarm,
        position: { x: 4, y: 1.8, z: 4 },
        isActive: false,
        isCollected: false
      },
      {
        id: "firstAid1",
        type: InteractiveObjectType.FirstAidKit,
        position: { x: 0, y: 0, z: 4.5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergExit1",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: -4.5, y: 1, z: 0 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergExit2",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 4.5, y: 1, z: 0 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 0.1, z: 12 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12, y: 3, z: 0.1 }
      }
    ],
    requiredScore: 800,
    timeLimit: 240,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Manage Class K fires (cooking oils) with wet chemical extinguisher",
      "Recognize and respond to gas leaks safely",
      "Navigate through smoke using proper techniques",
      "Activate emergency alarm systems"
    ]
  },
  [Level.AdvancedRescue]: {
    id: Level.AdvancedRescue,
    name: "Advanced Rescue Operations",
    description: "Complex multi-hazard scenario requiring expert coordination and rescue techniques.",
    hazards: [
      {
        id: "classD1",
        type: HazardType.ClassDFire,
        position: { x: -3, y: 0.5, z: -2 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "chemSpill1",
        type: HazardType.ChemicalSpill,
        position: { x: 3, y: 0.1, z: -2 },
        isActive: true,
        severity: 4,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "multiSmoke1",
        type: HazardType.SmokeScreen,
        position: { x: -1, y: 1.5, z: 1 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "multiSmoke2",
        type: HazardType.SmokeScreen,
        position: { x: 1, y: 1.5, z: 1 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "powderExt1",
        type: InteractiveObjectType.ClassDExtinguisher,
        position: { x: -5, y: 0, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "escapeRope1",
        type: InteractiveObjectType.EscapeRope,
        position: { x: 5, y: 0, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "firstAid2",
        type: InteractiveObjectType.FirstAidKit,
        position: { x: 0, y: 0, z: 5 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14, y: 0.1, z: 14 }
      }
    ],
    requiredScore: 1000,
    timeLimit: 300,
    difficulty: DifficultyLevel.Expert,
    learningObjectives: [
      "Handle Class D fires (metals) with powder extinguisher",
      "Manage chemical spills safely",
      "Navigate complex smoke-filled environments",
      "Use escape ropes for emergency evacuation"
    ]
  },
  [Level.BFPCertification]: {
    id: Level.BFPCertification,
    name: "BFP Master Certification",
    description: "Ultimate fire safety challenge! Prove you're ready for BFP certification with Captain Apoy's master test.",
    hazards: [
      {
        id: "masterClassA",
        type: HazardType.ClassAFire,
        position: { x: -4, y: 0.5, z: -4 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterClassB",
        type: HazardType.ClassBFire,
        position: { x: 0, y: 0.5, z: -4 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterClassC",
        type: HazardType.ClassCFire,
        position: { x: 4, y: 0.5, z: -4 },
        isActive: true,
        severity: 3,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "masterClassK",
        type: HazardType.ClassKFire,
        position: { x: -2, y: 0.8, z: 0 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterGas",
        type: HazardType.GasLeak,
        position: { x: 2, y: 0.5, z: 0 },
        isActive: true,
        severity: 4,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "masterSmoke1",
        type: HazardType.SmokeScreen,
        position: { x: -2, y: 1.5, z: 2 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterSmoke2",
        type: HazardType.SmokeScreen,
        position: { x: 2, y: 1.5, z: 2 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "masterWater",
        type: InteractiveObjectType.ClassAExtinguisher,
        position: { x: -6, y: 0, z: 5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterFoam",
        type: InteractiveObjectType.ClassBExtinguisher,
        position: { x: -3, y: 0, z: 5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterCO2",
        type: InteractiveObjectType.ClassCExtinguisher,
        position: { x: 0, y: 0, z: 5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterWetChem",
        type: InteractiveObjectType.ClassKExtinguisher,
        position: { x: 3, y: 0, z: 5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterAlarm",
        type: InteractiveObjectType.EmergencyAlarm,
        position: { x: 6, y: 1.8, z: 5 },
        isActive: false,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16, y: 0.1, z: 16 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -8, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 16, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 8, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 16, y: 3, z: 0.1 }
      }
    ],
    requiredScore: 1500,
    timeLimit: 420,
    difficulty: DifficultyLevel.Master,
    learningObjectives: [
      "Master all fire classes and appropriate extinguisher types",
      "Demonstrate expert PASS technique under pressure",
      "Coordinate complex emergency response procedures",
      "Achieve BFP fire safety certification standards"
    ]
  }
};

// Safety tips to display in the game
export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: "tip1",
    title: "Keep an Eye on the Stove",
    content: "Never leave cooking food unattended. Stay in the kitchen while frying, grilling, or broiling food.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip2",
    title: "Check Smoke Detectors",
    content: "Test your smoke alarms monthly and replace batteries at least once a year.",
    category: SafetyTipCategory.Detection
  },
  {
    id: "tip3",
    title: "Fire Extinguisher Basics: PASS",
    content: "Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep from side to side.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip4",
    title: "Create an Escape Plan",
    content: "Develop and practice a home fire escape plan with all family members. Know two ways out of every room.",
    category: SafetyTipCategory.Evacuation
  },
  {
    id: "tip5",
    title: "Keep Space Heaters Away",
    content: "Keep space heaters at least 3 feet away from anything that can burn.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip6",
    title: "Stop, Drop, and Roll",
    content: "If your clothes catch fire, stop, drop to the ground, and roll to smother the flames.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip7",
    title: "Avoid Candle Hazards",
    content: "Keep candles at least 12 inches away from anything flammable and never leave them unattended.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip8",
    title: "Clean Dryer Lint",
    content: "Clean the lint filter in your dryer before and after each load of laundry to prevent fires.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip9",
    title: "Don't Overload Outlets",
    content: "Avoid plugging too many devices into a single outlet or extension cord.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip10",
    title: "Stay Low in Smoke",
    content: "If there's smoke, get low and crawl under it to reach your exit. Smoke rises, so the air is clearer near the floor.",
    category: SafetyTipCategory.Evacuation
  },
  // New BFP-certified safety tips
  {
    id: "tip11",
    title: "BFP Fire Classification System",
    content: "Class A: Ordinary combustibles (wood, paper, cloth). Class B: Flammable liquids. Class C: Electrical equipment. Class D: Metals. Class K: Cooking oils.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip12",
    title: "PASS Technique Mastery",
    content: "Pull the pin, Aim at the base of the fire, Squeeze the handle steadily, Sweep from side to side. Remember: Never turn your back on a fire!",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip13",
    title: "Emergency Response Priority",
    content: "BFP Standard: 1) Alert others and call for help, 2) Evacuate if fire is too large, 3) Fight small fires only if safe to do so, 4) Use correct extinguisher type.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip14",
    title: "Gas Leak Safety Protocol",
    content: "If you smell gas: Don't use electrical switches, open windows for ventilation, evacuate immediately, and call emergency services from a safe location.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip15",
    title: "Chemical Fire Safety",
    content: "Never use water on chemical fires. Use appropriate extinguisher type, evacuate if uncertain, and always report chemical incidents to authorities.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip16",
    title: "Fire Triangle Knowledge",
    content: "Fire needs three elements: Heat, Fuel, and Oxygen. Remove any one element to extinguish the fire. This is the foundation of BFP fire safety training.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip17",
    title: "Captain Apoy's Golden Rule",
    content: "When in doubt, get out! Your safety is more important than property. Follow your evacuation plan and let trained firefighters handle dangerous situations.",
    category: SafetyTipCategory.Evacuation
  }
];

// Player constants
export const PLAYER_CONSTANTS = {
  MOVEMENT_SPEED: 3,
  RUNNING_SPEED: 6,
  CROUCH_SPEED: 1.5,
  TURNING_SPEED: 2,
  MAX_HEALTH: 100,
  MAX_OXYGEN: 100,
  OXYGEN_DEPLETION_RATE: 5, // Per second in smoke
  HEALTH_DEPLETION_RATE: 10, // Per second in fire
  STARTING_POSITION: { x: 0, y: 1, z: 3 }
};

// Game constants
export const GAME_CONSTANTS = {
  INTERACTION_DISTANCE: 2,
  FIRE_SPREAD_RATE: 0.05,
  EXTINGUISHER_RANGE: 3,
  POINTS_FOR_EXTINGUISHING: 100,
  POINTS_FOR_PREVENTION: 50,
  POINTS_FOR_DETECTOR: 75,
  DAMAGE_DISTANCE: 1.2
};

// Collision groups
export const COLLISION_GROUPS = {
  PLAYER: 1,
  ENVIRONMENT: 2,
  HAZARDS: 4,
  INTERACTIVE: 8
};
