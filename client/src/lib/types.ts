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
  position: Vector3;
  isActive: boolean;
  severity: number;
  isSmoking: boolean;
  isExtinguished: boolean;
}

export enum HazardType {
  ElectricalOutlet = "ElectricalOutlet",
  StoveTop = "StoveTop",
  Candle = "Candle",
  Fireplace = "Fireplace",
  SpacerHeater = "SpacerHeater",
  CloggedDryer = "CloggedDryer",
  // Kitchen Appliances
  Microwave = "Microwave",
  CoffeeMaker = "CoffeeMaker", 
  DeepFryer = "DeepFryer",
  ElectricKettle = "ElectricKettle",
  RiceCooker = "RiceCooker",
  Blender = "Blender",
  Dishwasher = "Dishwasher",
  // Fire Classifications
  ClassAFire = "ClassAFire",        // Ordinary combustibles (wood, paper, cloth)
  ClassBFire = "ClassBFire",        // Flammable liquids (gasoline, oil, paint)
  ClassCFire = "ClassCFire",        // Electrical equipment
  ClassDFire = "ClassDFire",        // Combustible metals
  ClassKFire = "ClassKFire",        // Cooking oils and fats
  GasLeak = "GasLeak",              // Natural gas or propane leak
  ChemicalSpill = "ChemicalSpill",   // Chemical hazards
  SmokeScreen = "SmokeScreen"        // Heavy smoke areas
}

export interface InteractiveObject {
  id: string;
  type: InteractiveObjectType;
  position: Vector3;
  isActive: boolean;
  isCollected: boolean;
}

export enum InteractiveObjectType {
  FireExtinguisher = "FireExtinguisher",
  SmokeDetector = "SmokeDetector",
  EmergencyExit = "EmergencyExit",
  FireBlanket = "FireBlanket",
  WaterSource = "WaterSource",
  WaterExtinguisher = "WaterExtinguisher",     // For Class A fires
  FoamExtinguisher = "FoamExtinguisher",       // For Class B fires
  CO2Extinguisher = "CO2Extinguisher",         // For Class C fires
  PowderExtinguisher = "PowderExtinguisher",   // For Class D fires
  WetChemicalExtinguisher = "WetChemicalExtinguisher", // For Class K fires
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

// Fire Classification System (Classes A-K)
export enum FireClass {
  ClassA = "ClassA",  // Ordinary combustibles (wood, paper, cloth, fabric)
  ClassB = "ClassB",  // Flammable liquids (gasoline, oil, paint, grease)
  ClassC = "ClassC",  // Electrical equipment (live electrical fires)
  ClassD = "ClassD",  // Combustible metals (magnesium, sodium, titanium)
  ClassK = "ClassK"   // Cooking oils and fats (commercial cooking equipment)
}

// Extinguisher Color Coding (International Standards)
export enum ExtinguisherColor {
  RED = "#DC143C",        // Water extinguishers (Class A)
  CREAM = "#F5F5DC",      // Foam extinguishers (Class B)
  BLACK = "#2C2C2C",      // CO2 extinguishers (Class C)
  BLUE = "#1E90FF",       // Dry powder extinguishers (Class D)
  YELLOW = "#FFD700"      // Wet chemical extinguishers (Class K)
}

// Mapping extinguisher types to colors and fire classes
export interface ExtinguisherInfo {
  color: ExtinguisherColor;
  fireClasses: FireClass[];
  name: string;
  description: string;
}
