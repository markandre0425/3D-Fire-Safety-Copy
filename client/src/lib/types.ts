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
  CloggedDryer = "CloggedDryer"
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
  WaterSource = "WaterSource"
}

export enum Level {
  Kitchen = "Kitchen",
  LivingRoom = "LivingRoom",
  Bedroom = "Bedroom"
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
