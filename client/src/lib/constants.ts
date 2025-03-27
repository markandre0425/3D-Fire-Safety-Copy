import { Level, LevelData, SafetyTip, SafetyTipCategory, HazardType, InteractiveObjectType } from "./types";

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
      }
    ],
    objects: [
      {
        id: "extinguisher1",
        type: InteractiveObjectType.FireExtinguisher,
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
    timeLimit: 180
  },
  [Level.LivingRoom]: {
    id: Level.LivingRoom,
    name: "Living Room Safety",
    description: "Identify and manage common fire hazards in the living room",
    hazards: [
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
      }
    ],
    objects: [
      {
        id: "extinguisher2",
        type: InteractiveObjectType.FireExtinguisher,
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
    timeLimit: 210
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
        type: InteractiveObjectType.FireExtinguisher,
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
    timeLimit: 240
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
