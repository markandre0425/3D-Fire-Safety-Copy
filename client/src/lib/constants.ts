import { Level, LevelData, SafetyTip, SafetyTipCategory, HazardType, InteractiveObjectType, DifficultyLevel } from "./types";
import { generateDynamicExtinguishers, calculateLevelBounds } from "./levelGenerator";

// Create dynamic Kitchen level with appropriate extinguishers
function createKitchenLevel(): LevelData {
  const hazards = [
    {
      id: "stove1",
      type: HazardType.StoveTop,
      position: { x: 2, y: 0.8, z: -2 },
      isActive: true,
      severity: 2,
      isSmoking: true,
      isExtinguished: false
    },
    {
      id: "outlet1",
      type: HazardType.ElectricalOutlet,
      position: { x: -2, y: 0.4, z: -3 },
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    },
    // Stoves on red furniture pieces - spread out positions
    {
      id: "stove-furniture-1",
      type: HazardType.StoveTop,
      position: { x: -3.0, y: 1.0, z: -3.0 }, // Far left back corner
      isActive: true,
      severity: 3,
      isSmoking: true,
      isExtinguished: false
    },
    {
      id: "stove-furniture-2", 
      type: HazardType.StoveTop,
      position: { x: 2.5, y: 1.0, z: 3.5 }, // Far right front area
      isActive: true,
      severity: 2,
      isSmoking: true,
      isExtinguished: false
    },
    {
      id: "toaster-furniture-1",
      type: HazardType.SpacerHeater, // This renders as a toaster
      position: { x: -4.0, y: 1.0, z: 2.0 }, // Left side, well spaced
      isActive: true,
      severity: 2,
      isSmoking: false,
      isExtinguished: false
    },
    // Additional kitchen appliances spread throughout the kitchen
    {
      id: "microwave-1",
      type: HazardType.Microwave,
      position: { x: 1.0, y: 1.5, z: -4.0 }, // Counter height on back wall
      isActive: true,
      severity: 3,
      isSmoking: true,
      isExtinguished: false
    },
    {
      id: "coffee-maker-1",
      type: HazardType.StoveTop, // Small appliance fire
      position: { x: -1.5, y: 1.0, z: -4.2 }, // Counter on left wall
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    },
    {
      id: "electrical-outlet-2",
      type: HazardType.ElectricalOutlet,
      position: { x: 4.5, y: 0.4, z: 1.0 }, // Right wall outlet
      isActive: true,
      severity: 2,
      isSmoking: false,
      isExtinguished: false
    }
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 2,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 3,
    spawnRadius: 3.0,
    randomSpawnChance: 0.3
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.Kitchen,
    name: "Kitchen Safety",
    description: "Practice fire safety in the kitchen with dynamic color-coded extinguishers",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 300,
    timeLimit: 180,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Learn to identify common kitchen fire hazards",
      "Practice using correct fire extinguisher types for different fire classes",
      "Understand color-coded extinguisher system (RED, BLACK, YELLOW)",
      "Master PASS technique with appropriate extinguisher selection"
    ]
  };
}

// Create dynamic Living Room level with appropriate extinguishers
function createLivingRoomLevel(): LevelData {
  const hazards = [
    {
      id: "fireplace1",
      type: HazardType.Fireplace,
      position: { x: 0, y: 0.5, z: -4 },
      isActive: true,
      severity: 2,
      isSmoking: true,
      isExtinguished: false
    },
    {
      id: "candle1",
      type: HazardType.Candle,
      position: { x: 2, y: 0.8, z: 0 },
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    },
    {
      id: "heater1",
      type: HazardType.SpacerHeater,
      position: { x: -3, y: 0.5, z: 2 },
      isActive: true,
      severity: 2,
      isSmoking: false,
      isExtinguished: false
    },
    {
      id: "electrical-outlet-3",
      type: HazardType.ElectricalOutlet,
      position: { x: 4, y: 0.4, z: -2 },
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    }
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 2,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 2,
    spawnRadius: 3.5,
    randomSpawnChance: 0.25
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.LivingRoom,
    name: "Living Room Safety",
    description: "Identify and manage common fire hazards in the living room with smart extinguisher placement",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 400,
    timeLimit: 150,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Identify multiple fire sources in one room",
      "Practice proper spacing from space heaters",
      "Learn candle safety and fireplace management",
      "Apply different extinguisher types strategically"
    ]
  };
}

// Create dynamic Bedroom level with appropriate extinguishers
function createBedroomLevel(): LevelData {
  const hazards = [
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
    },
    {
      id: "electrical-outlet-4",
      type: HazardType.ElectricalOutlet,
      position: { x: -2, y: 0.4, z: 4 },
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    }
  ];

  const environmentObjects = [
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
      position: { x: -2, y: 0.3, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 0.6, z: 3 }
    },
    {
      id: "dresser",
      type: "dresser",
      position: { x: 2, y: 0.5, z: -4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 1, z: 1 }
    }
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 2,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 2,
    spawnRadius: 3.0,
    randomSpawnChance: 0.2
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.Bedroom,
    name: "Bedroom Safety",
    description: "Practice fire safety measures in the bedroom with advanced dryer fire scenarios",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 500,
    timeLimit: 240,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Handle high-severity hazards like clogged dryers",
      "Manage multiple fire sources simultaneously",
      "Practice emergency response under time pressure",
      "Apply strategic extinguisher placement knowledge"
    ]
  };
}

// Create dynamic Basic Training level with appropriate extinguishers
function createBasicTrainingLevel(): LevelData {
  const hazards = [
    {
      id: "classA1",
      type: HazardType.ClassAFire,
      position: { x: 0, y: 0.5, z: -2 },
      isActive: true,
      severity: 1,
      isSmoking: false,
      isExtinguished: false
    }
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 1,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 1,
    spawnRadius: 3.0,
    randomSpawnChance: 0.0
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.BasicTraining,
    name: "BFP Basic Training",
    description: "Learn the fundamentals with Captain Apoy! Master the PASS technique and basic fire safety principles.",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 150,
    timeLimit: 120,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Master the PASS technique (Pull, Aim, Squeeze, Sweep)",
      "Identify Class A fires (ordinary combustibles)",
      "Use water extinguisher safely and effectively"
    ]
  };
}

// Create dynamic Fire Classification level with appropriate extinguishers
function createFireClassificationLevel(): LevelData {
  const hazards = [
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
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 1,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 1,
    spawnRadius: 4.0,
    randomSpawnChance: 0.0
  });

  // Add static objects
  const staticObjects = [
    {
      id: "classDetector",
      type: InteractiveObjectType.SmokeDetector,
      position: { x: 0, y: 2.5, z: 0 },
      isActive: false,
      isCollected: false
    }
  ];

  return {
    id: Level.FireClassification,
    name: "Fire Classification Challenge",
    description: "Test your knowledge of different fire types! Match the right extinguisher to each fire class.",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 600,
    timeLimit: 180,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Classify fire types: A (solids), B (liquids), C (electrical)",
      "Select appropriate extinguisher for each fire class",
      "Understand fire triangle principles"
    ]
  };
}

// Create dynamic Emergency Response level with appropriate extinguishers
function createEmergencyResponseLevel(): LevelData {
  const hazards = [
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
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 1,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 2,
    spawnRadius: 4.0,
    randomSpawnChance: 0.1
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.EmergencyResponse,
    name: "Emergency Response Drill",
    description: "Handle multiple hazards and emergency scenarios like a true fire safety hero!",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 800,
    timeLimit: 240,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Manage Class K fires (cooking oils) with wet chemical extinguisher",
      "Recognize and respond to gas leaks safely",
      "Navigate through smoke using proper techniques",
      "Activate emergency alarm systems"
    ]
  };
}

// Create dynamic Advanced Rescue level with appropriate extinguishers
function createAdvancedRescueLevel(): LevelData {
  const hazards = [
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
  ];

  const environmentObjects = [
    {
      id: "floor",
      type: "floor",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 14, y: 0.1, z: 14 }
    }
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 1,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 2,
    spawnRadius: 5.0,
    randomSpawnChance: 0.15
  });

  // Add static objects
  const staticObjects = [
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
  ];

  return {
    id: Level.AdvancedRescue,
    name: "Advanced Rescue Operations",
    description: "Complex multi-hazard scenario requiring expert coordination and rescue techniques.",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 1000,
    timeLimit: 300,
    difficulty: DifficultyLevel.Expert,
    learningObjectives: [
      "Handle Class D fires (metals) with powder extinguisher",
      "Manage chemical spills safely",
      "Navigate complex smoke-filled environments",
      "Use escape ropes for emergency evacuation"
    ]
  };
}

// Create dynamic BFP Certification level with appropriate extinguishers
function createBFPCertificationLevel(): LevelData {
  const hazards = [
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
  ];

  const environmentObjects = [
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
  ];

  // Calculate level bounds for extinguisher spawning
  const levelBounds = calculateLevelBounds(environmentObjects);
  
  // Generate dynamic extinguishers based on fire hazards
  const dynamicExtinguishers = generateDynamicExtinguishers(hazards, levelBounds, {
    extinguishersPerFireGroup: 1,
    minExtinguishersPerType: 1,
    maxExtinguishersPerType: 2,
    spawnRadius: 6.0,
    randomSpawnChance: 0.2
  });

  // Add static objects
  const staticObjects = [
    {
      id: "masterAlarm",
      type: InteractiveObjectType.EmergencyAlarm,
      position: { x: 6, y: 1.8, z: 5 },
      isActive: false,
      isCollected: false
    }
  ];

  return {
    id: Level.BFPCertification,
    name: "BFP Master Certification",
    description: "Ultimate fire safety challenge! Prove you're ready for BFP certification with Captain Apoy's master test.",
    hazards,
    objects: [...dynamicExtinguishers, ...staticObjects],
    environmentObjects,
    requiredScore: 1500,
    timeLimit: 360,
    difficulty: DifficultyLevel.Master,
    learningObjectives: [
      "Demonstrate mastery of all fire classes and extinguisher types",
      "Coordinate complex multi-hazard emergency response",
      "Apply strategic thinking in high-pressure scenarios",
      "Achieve BFP certification standards"
    ]
  };
}

// Level data for the game
export const LEVELS: Record<Level, LevelData> = {
  [Level.Kitchen]: createKitchenLevel(),
  [Level.LivingRoom]: createLivingRoomLevel(),
  [Level.Bedroom]: createBedroomLevel(),
  [Level.BasicTraining]: createBasicTrainingLevel(),
  [Level.FireClassification]: createFireClassificationLevel(),
  [Level.EmergencyResponse]: createEmergencyResponseLevel(),
  [Level.AdvancedRescue]: createAdvancedRescueLevel(),
  [Level.BFPCertification]: createBFPCertificationLevel()
};

// Safety tips to display in the game
export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: "extinguisher-mismatch",
    title: "Wrong Extinguisher Type!",
    content: "Different fires require different extinguishers! RED=Class A (wood/paper), CREAM=Class B (liquids), BLACK=Class C (electrical), BLUE=Class D (metals), YELLOW=Class K (cooking oils). Using the wrong type can spread the fire!",
    category: SafetyTipCategory.Response
  },
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
