import { 
  HazardType, 
  InteractiveObjectType, 
  FireClass, 
  ExtinguisherColor, 
  ExtinguisherInfo 
} from './types';

// Mapping of extinguisher types to their properties
export const EXTINGUISHER_PROPERTIES: Record<InteractiveObjectType, ExtinguisherInfo> = {
  [InteractiveObjectType.WaterExtinguisher]: {
    color: ExtinguisherColor.RED,
    fireClasses: [FireClass.ClassA],
    name: "Water Extinguisher",
    description: "For ordinary combustibles like wood, paper, cloth, and fabric"
  },
  [InteractiveObjectType.FoamExtinguisher]: {
    color: ExtinguisherColor.CREAM,
    fireClasses: [FireClass.ClassA, FireClass.ClassB],
    name: "Foam Extinguisher", 
    description: "For flammable liquids and ordinary combustibles"
  },
  [InteractiveObjectType.CO2Extinguisher]: {
    color: ExtinguisherColor.BLACK,
    fireClasses: [FireClass.ClassB, FireClass.ClassC],
    name: "CO2 Extinguisher",
    description: "For electrical fires and flammable liquids"
  },
  [InteractiveObjectType.PowderExtinguisher]: {
    color: ExtinguisherColor.BLUE,
    fireClasses: [FireClass.ClassA, FireClass.ClassB, FireClass.ClassC, FireClass.ClassD],
    name: "Dry Powder Extinguisher",
    description: "Multi-purpose for most fire types including combustible metals"
  },
  [InteractiveObjectType.WetChemicalExtinguisher]: {
    color: ExtinguisherColor.YELLOW,
    fireClasses: [FireClass.ClassA, FireClass.ClassK],
    name: "Wet Chemical Extinguisher",
    description: "For cooking oils, fats, and ordinary combustibles"
  },
  // Default fire extinguisher (generic red)
  [InteractiveObjectType.FireExtinguisher]: {
    color: ExtinguisherColor.RED,
    fireClasses: [FireClass.ClassA],
    name: "Fire Extinguisher",
    description: "General purpose extinguisher"
  },
  // Non-extinguisher types (won't be used but needed for completeness)
  [InteractiveObjectType.SmokeDetector]: {
    color: ExtinguisherColor.RED,
    fireClasses: [],
    name: "Smoke Detector",
    description: "Fire detection device"
  },
  [InteractiveObjectType.EmergencyExit]: {
    color: ExtinguisherColor.RED,
    fireClasses: [],
    name: "Emergency Exit",
    description: "Emergency evacuation route"
  },
  [InteractiveObjectType.FireBlanket]: {
    color: ExtinguisherColor.RED,
    fireClasses: [FireClass.ClassA, FireClass.ClassK],
    name: "Fire Blanket",
    description: "For smothering small fires"
  },
  [InteractiveObjectType.WaterSource]: {
    color: ExtinguisherColor.RED,
    fireClasses: [FireClass.ClassA],
    name: "Water Source",
    description: "Water for firefighting"
  },
  [InteractiveObjectType.EmergencyAlarm]: {
    color: ExtinguisherColor.RED,
    fireClasses: [],
    name: "Emergency Alarm",
    description: "Fire alarm system"
  },
  [InteractiveObjectType.FirstAidKit]: {
    color: ExtinguisherColor.RED,
    fireClasses: [],
    name: "First Aid Kit",
    description: "Medical emergency supplies"
  },
  [InteractiveObjectType.EscapeRope]: {
    color: ExtinguisherColor.RED,
    fireClasses: [],
    name: "Escape Rope",
    description: "Emergency evacuation equipment"
  }
};

// Mapping of hazard types to fire classes
export const HAZARD_FIRE_CLASS_MAPPING: Record<HazardType, FireClass[]> = {
  // Kitchen appliances - mostly electrical (Class C) or cooking oils (Class K)
  [HazardType.StoveTop]: [FireClass.ClassK], // Cooking oils and fats
  [HazardType.Microwave]: [FireClass.ClassC], // Electrical equipment
  [HazardType.CoffeeMaker]: [FireClass.ClassC], // Electrical equipment
  [HazardType.DeepFryer]: [FireClass.ClassK], // Cooking oils
  [HazardType.ElectricKettle]: [FireClass.ClassC], // Electrical equipment
  [HazardType.RiceCooker]: [FireClass.ClassC], // Electrical equipment
  [HazardType.Blender]: [FireClass.ClassC], // Electrical equipment
  [HazardType.Dishwasher]: [FireClass.ClassC], // Electrical equipment
  
  // General hazards
  [HazardType.ElectricalOutlet]: [FireClass.ClassC], // Electrical fires
  [HazardType.Candle]: [FireClass.ClassA], // Ordinary combustibles (wax, wick)
  [HazardType.Fireplace]: [FireClass.ClassA], // Wood and combustibles
  [HazardType.SpacerHeater]: [FireClass.ClassC], // Electrical equipment
  [HazardType.CloggedDryer]: [FireClass.ClassC], // Electrical equipment
  
  // Direct fire classifications
  [HazardType.ClassAFire]: [FireClass.ClassA], // Ordinary combustibles
  [HazardType.ClassBFire]: [FireClass.ClassB], // Flammable liquids
  [HazardType.ClassCFire]: [FireClass.ClassC], // Electrical equipment
  [HazardType.ClassDFire]: [FireClass.ClassD], // Combustible metals
  [HazardType.ClassKFire]: [FireClass.ClassK], // Cooking oils and fats
  
  // Special hazards
  [HazardType.GasLeak]: [FireClass.ClassB], // Flammable gas
  [HazardType.ChemicalSpill]: [FireClass.ClassB], // Depends on chemical, assume flammable liquid
  [HazardType.SmokeScreen]: [FireClass.ClassA] // Usually from ordinary combustibles
};

// Get the appropriate extinguisher types for a given hazard
export function getAppropriateExtinguishers(hazardType: HazardType): InteractiveObjectType[] {
  const fireClasses = HAZARD_FIRE_CLASS_MAPPING[hazardType] || [];
  const appropriateExtinguishers: InteractiveObjectType[] = [];
  
  // Check each extinguisher type to see if it can handle any of the fire classes
  Object.entries(EXTINGUISHER_PROPERTIES).forEach(([extType, info]) => {
    const extinguisherType = extType as InteractiveObjectType;
    
    // Skip non-extinguisher types
    if (!extType.includes('Extinguisher')) return;
    
    // Check if this extinguisher can handle any of the fire classes
    const canHandle = fireClasses.some(fireClass => 
      info.fireClasses.includes(fireClass)
    );
    
    if (canHandle) {
      appropriateExtinguishers.push(extinguisherType);
    }
  });
  
  return appropriateExtinguishers;
}

// Get the fire classes for a given hazard
export function getHazardFireClasses(hazardType: HazardType): FireClass[] {
  return HAZARD_FIRE_CLASS_MAPPING[hazardType] || [];
}

// Check if an extinguisher is effective against a hazard
export function isExtinguisherEffective(
  extinguisherType: InteractiveObjectType, 
  hazardType: HazardType
): boolean {
  const hazardFireClasses = getHazardFireClasses(hazardType);
  const extinguisherInfo = EXTINGUISHER_PROPERTIES[extinguisherType];
  
  if (!extinguisherInfo) return false;
  
  return hazardFireClasses.some(fireClass => 
    extinguisherInfo.fireClasses.includes(fireClass)
  );
}

// Get extinguisher color based on type
export function getExtinguisherColor(extinguisherType: InteractiveObjectType): string {
  return EXTINGUISHER_PROPERTIES[extinguisherType]?.color || ExtinguisherColor.RED;
}

// Get extinguisher info
export function getExtinguisherInfo(extinguisherType: InteractiveObjectType): ExtinguisherInfo | null {
  return EXTINGUISHER_PROPERTIES[extinguisherType] || null;
} 