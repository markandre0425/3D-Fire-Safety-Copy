export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  bfpObjective: string;
  environment: {
    size: [number, number];
    walls: Array<{
      position: [number, number, number];
      size: [number, number, number];
    }>;
  };
  hazards: Array<{
    id: string;
    type: 'fire' | 'smoke' | 'electrical' | 'chemical';
    position: [number, number, number];
    intensity: number;
    smokeRadius?: number;
    damageRate?: number;
  }>;
  items: Array<{
    id: string;
    type: 'extinguisher' | 'gasMask' | 'smokeDetector' | 'firstAid';
    position: [number, number, number];
    extinguisherType?: string;
  }>;
  objectives: Array<{
    id: string;
    description: string;
    type: 'extinguish' | 'collect' | 'survive' | 'evacuate';
    target?: string;
    duration?: number;
  }>;
  timeLimit?: number;
  bfpEducation: {
    preLevel: string[];
    postLevel: string[];
  };
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: "BFP Training Academy - Kitchen Fire",
    description: "Basic fire safety training with a simple kitchen fire scenario",
    difficulty: 'Easy',
    bfpObjective: "Learn basic fire triangle principles and Class K fire extinguishing",
    environment: {
      size: [8, 8],
      walls: [
        { position: [0, 1, -4], size: [8, 2, 0.2] },
        { position: [0, 1, 4], size: [8, 2, 0.2] },
        { position: [-4, 1, 0], size: [0.2, 2, 8] },
        { position: [4, 1, 0], size: [0.2, 2, 8] }
      ]
    },
    hazards: [
      {
        id: 'kitchen-fire-1',
        type: 'fire',
        position: [2, 0, 2],
        intensity: 1,
        smokeRadius: 1.5,
        damageRate: 10
      }
    ],
    items: [
      {
        id: 'wet-chemical-ext-1',
        type: 'extinguisher',
        position: [-2, 0, -2],
        extinguisherType: 'WetChemical'
      },
      {
        id: 'gas-mask-1',
        type: 'gasMask',
        position: [-2, 0, 2]
      }
    ],
    objectives: [
      {
        id: 'extinguish-kitchen-fire',
        description: 'Extinguish the cooking oil fire using wet chemical extinguisher',
        type: 'extinguish',
        target: 'kitchen-fire-1'
      },
      {
        id: 'collect-mask',
        description: 'Collect BFP breathing apparatus for smoke protection',
        type: 'collect',
        target: 'gas-mask-1'
      }
    ],
    timeLimit: 120,
    bfpEducation: {
      preLevel: [
        "Class K fires involve cooking oils and fats",
        "Use wet chemical extinguishers for kitchen fires",
        "Smoke inhalation is the leading cause of fire deaths"
      ],
      postLevel: [
        "Well done! You successfully contained a Class K fire",
        "The BFP responds to over 12,000 fire incidents annually",
        "Proper ventilation and breathing apparatus save lives"
      ]
    }
  },
  {
    id: 2,
    name: "BFP Station Response - Residential Fire",
    description: "Multiple room fire with electrical hazards and heavy smoke",
    difficulty: 'Medium',
    bfpObjective: "Handle Class A and C fires while managing smoke exposure",
    environment: {
      size: [12, 10],
      walls: [
        { position: [0, 1, -5], size: [12, 2, 0.2] },
        { position: [0, 1, 5], size: [12, 2, 0.2] },
        { position: [-6, 1, 0], size: [0.2, 2, 10] },
        { position: [6, 1, 0], size: [0.2, 2, 10] },
        { position: [0, 1, 0], size: [8, 2, 0.2] }, // Room divider
        { position: [2, 1, -2], size: [0.2, 2, 4] }  // Interior wall
      ]
    },
    hazards: [
      {
        id: 'living-room-fire',
        type: 'fire',
        position: [3, 0, -2],
        intensity: 2,
        smokeRadius: 2.5,
        damageRate: 15
      },
      {
        id: 'electrical-fire',
        type: 'electrical',
        position: [-3, 0, 2],
        intensity: 1.5,
        smokeRadius: 2,
        damageRate: 12
      },
      {
        id: 'heavy-smoke-zone',
        type: 'smoke',
        position: [0, 0, -3],
        intensity: 3,
        smokeRadius: 3,
        damageRate: 8
      }
    ],
    items: [
      {
        id: 'co2-extinguisher-1',
        type: 'extinguisher',
        position: [-4, 0, -4],
        extinguisherType: 'CO2'
      },
      {
        id: 'water-extinguisher-1',
        type: 'extinguisher',
        position: [4, 0, 4],
        extinguisherType: 'Water'
      },
      {
        id: 'gas-mask-2',
        type: 'gasMask',
        position: [-5, 0, 0]
      },
      {
        id: 'smoke-detector-1',
        type: 'smokeDetector',
        position: [0, 2, 0]
      }
    ],
    objectives: [
      {
        id: 'secure-breathing-apparatus',
        description: 'Equip BFP breathing apparatus before entering smoke zones',
        type: 'collect',
        target: 'gas-mask-2'
      },
      {
        id: 'extinguish-electrical',
        description: 'Safely extinguish electrical fire with CO2',
        type: 'extinguish',
        target: 'electrical-fire'
      },
      {
        id: 'extinguish-living-room',
        description: 'Extinguish main fire with appropriate extinguisher',
        type: 'extinguish',
        target: 'living-room-fire'
      },
      {
        id: 'survive-smoke',
        description: 'Navigate through smoke without losing consciousness',
        type: 'survive',
        duration: 60
      }
    ],
    timeLimit: 180,
    bfpEducation: {
      preLevel: [
        "Class C fires involve energized electrical equipment",
        "Never use water on electrical fires - use CO2 or dry chemical",
        "Smoke rises and spreads horizontally along ceilings",
        "Breathing apparatus provides 30-45 minutes of clean air"
      ],
      postLevel: [
        "Excellent work following BFP protocols!",
        "You correctly identified fire classes and used appropriate extinguishers",
        "Smoke management is crucial in structure fires",
        "BFP responds with 4-person firefighting teams to incidents"
      ]
    }
  },
  {
    id: 3,
    name: "BFP Emergency Response - Office Building",
    description: "Multi-floor office fire with limited oxygen and time pressure",
    difficulty: 'Hard',
    bfpObjective: "Coordinate evacuation while managing multiple fire types and smoke",
    environment: {
      size: [16, 14],
      walls: [
        { position: [0, 1, -7], size: [16, 2, 0.2] },
        { position: [0, 1, 7], size: [16, 2, 0.2] },
        { position: [-8, 1, 0], size: [0.2, 2, 14] },
        { position: [8, 1, 0], size: [0.2, 2, 14] },
        // Office partitions
        { position: [-4, 1, -3], size: [0.2, 2, 8] },
        { position: [4, 1, 3], size: [0.2, 2, 8] },
        { position: [0, 1, -3], size: [8, 2, 0.2] },
        { position: [0, 1, 3], size: [8, 2, 0.2] }
      ]
    },
    hazards: [
      {
        id: 'server-room-fire',
        type: 'electrical',
        position: [6, 0, -5],
        intensity: 3,
        smokeRadius: 3,
        damageRate: 20
      },
      {
        id: 'office-fire-1',
        type: 'fire',
        position: [-6, 0, 5],
        intensity: 2.5,
        smokeRadius: 2.5,
        damageRate: 18
      },
      {
        id: 'chemical-storage-fire',
        type: 'chemical',
        position: [6, 0, 5],
        intensity: 2,
        smokeRadius: 4,
        damageRate: 25
      },
      {
        id: 'corridor-smoke-1',
        type: 'smoke',
        position: [0, 0, 0],
        intensity: 4,
        smokeRadius: 5,
        damageRate: 15
      },
      {
        id: 'stairwell-smoke',
        type: 'smoke',
        position: [-6, 0, -5],
        intensity: 3,
        smokeRadius: 3.5,
        damageRate: 12
      }
    ],
    items: [
      {
        id: 'foam-extinguisher-1',
        type: 'extinguisher',
        position: [-7, 0, -6],
        extinguisherType: 'Foam'
      },
      {
        id: 'co2-extinguisher-2',
        type: 'extinguisher',
        position: [2, 0, -6],
        extinguisherType: 'CO2'
      },
      {
        id: 'dry-chemical-ext-1',
        type: 'extinguisher',
        position: [7, 0, 0],
        extinguisherType: 'DryChemical'
      },
      {
        id: 'gas-mask-3a',
        type: 'gasMask',
        position: [-2, 0, -6]
      },
      {
        id: 'gas-mask-3b',
        type: 'gasMask',
        position: [2, 0, 6]
      },
      {
        id: 'first-aid-kit',
        type: 'firstAid',
        position: [0, 0, -6]
      }
    ],
    objectives: [
      {
        id: 'establish-breathing-protection',
        description: 'Secure breathing apparatus before entering danger zones',
        type: 'collect',
        target: 'gas-mask-3a'
      },
      {
        id: 'contain-server-fire',
        description: 'Extinguish server room fire to prevent data loss',
        type: 'extinguish',
        target: 'server-room-fire'
      },
      {
        id: 'contain-chemical-fire',
        description: 'Safely contain chemical storage fire',
        type: 'extinguish',
        target: 'chemical-storage-fire'
      },
      {
        id: 'clear-evacuation-route',
        description: 'Extinguish office fire to clear evacuation path',
        type: 'extinguish',
        target: 'office-fire-1'
      },
      {
        id: 'survive-heavy-smoke',
        description: 'Navigate through heavy smoke without mask failure',
        type: 'survive',
        duration: 90
      }
    ],
    timeLimit: 240,
    bfpEducation: {
      preLevel: [
        "Office buildings present complex fire scenarios",
        "Server rooms require CO2 extinguishers to protect equipment",
        "Chemical fires may require special dry chemical agents",
        "Evacuation routes must be kept clear at all times",
        "Breathing apparatus filters last 30-45 minutes under stress"
      ],
      postLevel: [
        "Outstanding performance under pressure!",
        "You followed BFP incident command protocols",
        "Multi-hazard environments require systematic approach",
        "BFP teams coordinate with building security systems",
        "Your actions prevented potential casualties"
      ]
    }
  },
  {
    id: 4,
    name: "BFP Crisis Response - Industrial Complex",
    description: "Large-scale industrial fire with toxic smoke and equipment failures",
    difficulty: 'Expert',
    bfpObjective: "Manage industrial emergency following full BFP response protocols",
    environment: {
      size: [20, 18],
      walls: [
        { position: [0, 1, -9], size: [20, 2, 0.2] },
        { position: [0, 1, 9], size: [20, 2, 0.2] },
        { position: [-10, 1, 0], size: [0.2, 2, 18] },
        { position: [10, 1, 0], size: [0.2, 2, 18] },
        // Industrial sections
        { position: [-5, 1, -4], size: [0.2, 2, 10] },
        { position: [5, 1, 4], size: [0.2, 2, 10] },
        { position: [0, 1, -4], size: [10, 2, 0.2] },
        { position: [0, 1, 4], size: [10, 2, 0.2] }
      ]
    },
    hazards: [
      {
        id: 'chemical-tank-fire',
        type: 'chemical',
        position: [-7, 0, -6],
        intensity: 4,
        smokeRadius: 6,
        damageRate: 35
      },
      {
        id: 'machinery-fire-1',
        type: 'electrical',
        position: [7, 0, -6],
        intensity: 3.5,
        smokeRadius: 4,
        damageRate: 30
      },
      {
        id: 'oil-fire',
        type: 'fire',
        position: [-7, 0, 6],
        intensity: 4,
        smokeRadius: 5,
        damageRate: 32
      },
      {
        id: 'machinery-fire-2',
        type: 'electrical',
        position: [7, 0, 6],
        intensity: 3,
        smokeRadius: 3.5,
        damageRate: 28
      },
      {
        id: 'toxic-smoke-main',
        type: 'smoke',
        position: [0, 0, 0],
        intensity: 5,
        smokeRadius: 8,
        damageRate: 25
      },
      {
        id: 'toxic-smoke-north',
        type: 'smoke',
        position: [0, 0, -7],
        intensity: 4,
        smokeRadius: 6,
        damageRate: 22
      },
      {
        id: 'toxic-smoke-south',
        type: 'smoke',
        position: [0, 0, 7],
        intensity: 4,
        smokeRadius: 6,
        damageRate: 22
      }
    ],
    items: [
      {
        id: 'foam-extinguisher-2',
        type: 'extinguisher',
        position: [-9, 0, -8],
        extinguisherType: 'Foam'
      },
      {
        id: 'co2-extinguisher-3',
        type: 'extinguisher',
        position: [9, 0, -8],
        extinguisherType: 'CO2'
      },
      {
        id: 'dry-chemical-ext-2',
        type: 'extinguisher',
        position: [-9, 0, 8],
        extinguisherType: 'DryChemical'
      },
      {
        id: 'co2-extinguisher-4',
        type: 'extinguisher',
        position: [9, 0, 8],
        extinguisherType: 'CO2'
      },
      {
        id: 'gas-mask-4a',
        type: 'gasMask',
        position: [-8, 0, 0]
      },
      {
        id: 'gas-mask-4b',
        type: 'gasMask',
        position: [8, 0, 0]
      },
      {
        id: 'gas-mask-4c',
        type: 'gasMask',
        position: [0, 0, -8]
      }
    ],
    objectives: [
      {
        id: 'emergency-breathing-protection',
        description: 'Immediately secure breathing apparatus - toxic environment',
        type: 'collect',
        target: 'gas-mask-4a'
      },
      {
        id: 'contain-chemical-emergency',
        description: 'Contain chemical tank fire to prevent explosion',
        type: 'extinguish',
        target: 'chemical-tank-fire'
      },
      {
        id: 'secure-electrical-systems',
        description: 'Extinguish both electrical fires to prevent cascading failures',
        type: 'extinguish',
        target: 'machinery-fire-1'
      },
      {
        id: 'secure-electrical-systems-2',
        description: 'Complete electrical fire suppression',
        type: 'extinguish',
        target: 'machinery-fire-2'
      },
      {
        id: 'prevent-oil-spread',
        description: 'Extinguish oil fire before it spreads',
        type: 'extinguish',
        target: 'oil-fire'
      },
      {
        id: 'survive-toxic-environment',
        description: 'Survive in toxic smoke environment for extended period',
        type: 'survive',
        duration: 150
      }
    ],
    timeLimit: 300,
    bfpEducation: {
      preLevel: [
        "Industrial fires are among the most dangerous scenarios",
        "Toxic smoke requires full breathing apparatus protection",
        "Chemical tank fires can cause catastrophic explosions",
        "Electrical systems must be secured to prevent cascading failures",
        "BFP industrial response teams have specialized training",
        "Breathing apparatus may need multiple filter changes"
      ],
      postLevel: [
        "EXCEPTIONAL PERFORMANCE! You've mastered BFP protocols!",
        "You successfully managed a complex industrial emergency",
        "Your systematic approach prevented catastrophic escalation",
        "This level of competency qualifies for BFP specialist training",
        "Industrial fire response requires years of experience",
        "You've demonstrated real understanding of fire science"
      ]
    }
  }
];

export function getLevelConfig(levelId: number): LevelConfig | null {
  return LEVEL_CONFIGS.find(config => config.id === levelId) || null;
}

export function getNextLevel(currentLevelId: number): LevelConfig | null {
  const nextId = currentLevelId + 1;
  return getLevelConfig(nextId);
}

export function getTotalLevels(): number {
  return LEVEL_CONFIGS.length;
} 