export enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  action = "action",
  extinguish = "extinguish",
  crouch = "crouch",
  run = "run",
  pause = "pause"
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  position: Vector3;
  rotation: Vector3;
  health: number;
  hasExtinguisher: boolean;
  extinguisherType: InteractiveObjectType | null; // Track which type of extinguisher the player has
  isCrouching: boolean;
  isRunning: boolean;
  oxygen: number;
  score: number;
}

export interface HazardState {
  id: string;
  type: HazardType;
  fireClass?: FireClass; // Optional: Fire classification (defaults to Class A)
  position: Vector3;
  isActive: boolean;
  severity: number;
  isSmoking: boolean;
  isExtinguished: boolean;
}

export enum FireClass {
  A = "A", // Ordinary combustibles (wood, paper, cloth)
  B = "B", // Flammable liquids (gasoline, oil, paint) 
  C = "C", // Energized electrical equipment
  D = "D", // Combustible metals
  K = "K"  // Cooking oils and grease
}

export enum HazardType {
  ElectricalOutlet = "ElectricalOutlet",
  StoveTop = "StoveTop",
  Candle = "Candle",
  Fireplace = "Fireplace",
  SpacerHeater = "SpacerHeater",
  CloggedDryer = "CloggedDryer",
  ClassAFire = "ClassAFire",        // Ordinary combustibles (wood, paper, cloth)
  ClassBFire = "ClassBFire",        // Flammable liquids (gasoline, oil, paint)
  ClassCFire = "ClassCFire",        // Electrical equipment
  ClassDFire = "ClassDFire",        // Combustible metals
  ClassKFire = "ClassKFire",        // Cooking oils and fats
  GasLeak = "GasLeak",              // Natural gas or propane leak
  ChemicalSpill = "ChemicalSpill",   // Chemical hazards
  SmokeScreen = "SmokeScreen",       // Heavy smoke areas
  
  // Flammable Appliances
  Microwave = "Microwave",           // Kitchen appliance - Class C fire
  Toaster = "Toaster",              // Kitchen appliance - Class A/C fire
  Television = "Television",         // Electronic appliance - Class C fire
  ComputerTower = "ComputerTower",   // Electronic appliance - Class C fire
  Coffeemaker = "Coffeemaker",       // Kitchen appliance - Class C fire
  AirConditioner = "AirConditioner", // HVAC appliance - Class C fire
  WashingMachine = "WashingMachine", // Laundry appliance - Class C fire
  Refrigerator = "Refrigerator",     // Kitchen appliance - Class C fire
  BlenderMixer = "BlenderMixer",     // Kitchen appliance - Class C fire
  ElectricHeater = "ElectricHeater"  // Heating appliance - Class C fire
}

export interface InteractiveObject {
  id: string;
  type: InteractiveObjectType;
  fireClass?: FireClass; // New: Which fire class this extinguisher can handle
  position: Vector3;
  isActive: boolean;
  isCollected: boolean;
}

export enum InteractiveObjectType {
  // Fire Extinguishers by Class
  ClassAExtinguisher = "ClassAExtinguisher",   // Water - Ordinary combustibles
  ClassBExtinguisher = "ClassBExtinguisher",   // Foam - Flammable liquids
  ClassCExtinguisher = "ClassCExtinguisher",   // CO2 - Electrical equipment
  ClassDExtinguisher = "ClassDExtinguisher",   // Powder - Combustible metals
  ClassKExtinguisher = "ClassKExtinguisher",   // Wet Chemical - Cooking oils
  
  // Other Safety Equipment
  SmokeDetector = "SmokeDetector",
  EmergencyExit = "EmergencyExit",
  FireBlanket = "FireBlanket",
  EmergencyAlarm = "EmergencyAlarm",
  FirstAidKit = "FirstAidKit",
  EscapeRope = "EscapeRope"
}

export enum Level {
  Kitchen = "Kitchen",
  LivingRoom = "LivingRoom",
  Bedroom = "Bedroom",
  BasicTraining = "BasicTraining",      // Level 1: PASS technique
  FireClassification = "FireClassification", // Level 2: Different fire types
  EmergencyResponse = "EmergencyResponse",   // Level 3: Complex scenarios
  AdvancedRescue = "AdvancedRescue",        // Level 4: Multiple hazards + evacuation
  BFPCertification = "BFPCertification"     // Level 5: Master level certification
}

export interface LevelData {
  id: Level;
  name: string;
  description: string;
  hazards: HazardState[];
  objects: InteractiveObject[];
  environmentObjects: EnvironmentObject[];
  requiredScore: number;
  timeLimit: number;
  difficulty: DifficultyLevel;  // Adding difficulty tracking
  learningObjectives: string[]; // BFP learning objectives
}

export interface EnvironmentObject {
  id: string;
  type: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: SafetyTipCategory;
}

export enum SafetyTipCategory {
  Prevention = "Prevention",
  Detection = "Detection",
  Response = "Response",
  Evacuation = "Evacuation"
}

export enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate", 
  Advanced = "Advanced",
  Expert = "Expert",
  Master = "Master"
}

// Random Fire Spawning Configuration
export interface RandomFireConfig {
  minFires: number;
  maxFires: number;
  availableClasses: FireClass[];
  spawnPositions: Vector3[];
  applianceSpawnRate: number; // Percentage chance an appliance will catch fire
}

export interface ApplianceHazard extends HazardState {
  applianceType: HazardType;
  ignitionChance: number; // Probability of catching fire (0-1)
  baseFireClass: FireClass; // Default fire class for this appliance type
}
