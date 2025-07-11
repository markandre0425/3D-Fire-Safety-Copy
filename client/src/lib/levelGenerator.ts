import { 
  HazardState, 
  InteractiveObject, 
  InteractiveObjectType, 
  HazardType,
  Vector3 
} from './types';
import { 
  getHazardFireClasses, 
  getAppropriateExtinguishers, 
  EXTINGUISHER_PROPERTIES 
} from './fireClassification';

// Configuration for dynamic level generation
export interface LevelGenerationConfig {
  extinguishersPerFireGroup: number; // How many fires one extinguisher can handle
  minExtinguishersPerType: number;   // Minimum extinguishers of each type
  maxExtinguishersPerType: number;   // Maximum extinguishers of each type
  spawnRadius: number;               // How close extinguishers spawn to fires
  randomSpawnChance: number;         // Chance for extra random extinguishers
}

export const DEFAULT_LEVEL_CONFIG: LevelGenerationConfig = {
  extinguishersPerFireGroup: 3,  // 1 extinguisher handles 3 fires
  minExtinguishersPerType: 1,    // At least 1 of each needed type
  maxExtinguishersPerType: 4,    // Max 4 of same type
  spawnRadius: 2.5,              // Spawn within 2.5 units of fires
  randomSpawnChance: 0.3         // 30% chance for bonus extinguishers
};

// Fire type groups for better organization
export interface FireTypeGroup {
  fireClass: string;
  hazards: HazardState[];
  appropriateExtinguishers: InteractiveObjectType[];
  priority: number; // Higher priority = more dangerous
}

// Generate extinguishers based on fire types in the level
export function generateDynamicExtinguishers(
  hazards: HazardState[], 
  levelBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  config: LevelGenerationConfig = DEFAULT_LEVEL_CONFIG
): InteractiveObject[] {
  
  console.log('🔥 Analyzing fires for dynamic extinguisher generation...');
  
  // Group fires by their fire classes
  const fireGroups = analyzeFireTypes(hazards);
  console.log('Fire groups found:', fireGroups);
  
  // Determine extinguisher requirements
  const extinguisherRequirements = calculateExtinguisherNeeds(fireGroups, config);
  console.log('Extinguisher requirements:', extinguisherRequirements);
  
  // Generate spawn positions
  const spawnPositions = generateSpawnPositions(hazards, levelBounds, config);
  console.log('Available spawn positions:', spawnPositions.length);
  
  // Create extinguisher objects
  const extinguishers = createExtinguisherObjects(
    extinguisherRequirements, 
    spawnPositions, 
    config
  );
  
  console.log(`✅ Generated ${extinguishers.length} dynamic extinguishers`);
  
  return extinguishers;
}

// Analyze fire types and group them by fire class
function analyzeFireTypes(hazards: HazardState[]): FireTypeGroup[] {
  const fireClassMap = new Map<string, FireTypeGroup>();
  
  hazards.forEach(hazard => {
    const fireClasses = getHazardFireClasses(hazard.type);
    const appropriateExtinguishers = getAppropriateExtinguishers(hazard.type);
    
    fireClasses.forEach(fireClass => {
      const key = fireClass;
      
      if (!fireClassMap.has(key)) {
        fireClassMap.set(key, {
          fireClass,
          hazards: [],
          appropriateExtinguishers,
          priority: getFireClassPriority(fireClass)
        });
      }
      
      fireClassMap.get(key)!.hazards.push(hazard);
    });
  });
  
  return Array.from(fireClassMap.values()).sort((a, b) => b.priority - a.priority);
}

// Get priority level for fire classes (higher = more dangerous)
function getFireClassPriority(fireClass: string): number {
  switch (fireClass) {
    case 'ClassK': return 5; // Cooking oils - highest priority
    case 'ClassC': return 4; // Electrical - high priority
    case 'ClassB': return 3; // Flammable liquids
    case 'ClassD': return 2; // Metals
    case 'ClassA': return 1; // Ordinary combustibles
    default: return 0;
  }
}

// Calculate how many extinguishers of each type are needed
function calculateExtinguisherNeeds(
  fireGroups: FireTypeGroup[], 
  config: LevelGenerationConfig
): Map<InteractiveObjectType, number> {
  
  const requirements = new Map<InteractiveObjectType, number>();
  
  fireGroups.forEach(group => {
    const fireCount = group.hazards.length;
    const extinguishersNeeded = Math.max(
      config.minExtinguishersPerType,
      Math.min(
        config.maxExtinguishersPerType,
        Math.ceil(fireCount / config.extinguishersPerFireGroup)
      )
    );
    
    // Prefer the first (most specific) extinguisher type for each fire class
    const primaryExtinguisher = group.appropriateExtinguishers[0];
    
    if (primaryExtinguisher) {
      const current = requirements.get(primaryExtinguisher) || 0;
      requirements.set(primaryExtinguisher, Math.max(current, extinguishersNeeded));
      
      console.log(`${group.fireClass}: ${fireCount} fires → ${extinguishersNeeded} ${EXTINGUISHER_PROPERTIES[primaryExtinguisher]?.name || primaryExtinguisher}`);
    }
    
    // Add secondary extinguishers for redundancy
    if (group.appropriateExtinguishers.length > 1 && Math.random() < config.randomSpawnChance) {
      const secondaryExtinguisher = group.appropriateExtinguishers[1];
      const current = requirements.get(secondaryExtinguisher) || 0;
      requirements.set(secondaryExtinguisher, current + 1);
    }
  });
  
  return requirements;
}

// Generate strategic spawn positions around fires
function generateSpawnPositions(
  hazards: HazardState[], 
  levelBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  config: LevelGenerationConfig
): Vector3[] {
  
  const positions: Vector3[] = [];
  const usedPositions = new Set<string>();
  
  // Generate positions near each fire hazard
  hazards.forEach(hazard => {
    const nearbyPositions = generatePositionsAroundPoint(
      hazard.position,
      config.spawnRadius,
      3 // Generate 3 positions per fire
    );
    
    nearbyPositions.forEach(pos => {
      // Make sure position is within level bounds
      if (pos.x >= levelBounds.minX && pos.x <= levelBounds.maxX &&
          pos.z >= levelBounds.minZ && pos.z <= levelBounds.maxZ) {
        
        const key = `${Math.round(pos.x * 2) / 2},${Math.round(pos.z * 2) / 2}`;
        if (!usedPositions.has(key)) {
          positions.push(pos);
          usedPositions.add(key);
        }
      }
    });
  });
  
  // Add some random positions for variety
  const randomPositions = generateRandomPositions(levelBounds, 5);
  randomPositions.forEach(pos => {
    const key = `${Math.round(pos.x * 2) / 2},${Math.round(pos.z * 2) / 2}`;
    if (!usedPositions.has(key)) {
      positions.push(pos);
      usedPositions.add(key);
    }
  });
  
  return positions;
}

// Generate positions in a circle around a point
function generatePositionsAroundPoint(center: Vector3, radius: number, count: number): Vector3[] {
  const positions: Vector3[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = radius * (0.5 + Math.random() * 0.5);
    
    positions.push({
      x: center.x + Math.cos(angle) * distance,
      y: 0, // Ground level
      z: center.z + Math.sin(angle) * distance
    });
  }
  
  return positions;
}

// Generate random positions within level bounds
function generateRandomPositions(
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }, 
  count: number
): Vector3[] {
  
  const positions: Vector3[] = [];
  
  for (let i = 0; i < count; i++) {
    positions.push({
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: 0,
      z: bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ)
    });
  }
  
  return positions;
}

// Create extinguisher objects from requirements and positions
function createExtinguisherObjects(
  requirements: Map<InteractiveObjectType, number>,
  spawnPositions: Vector3[],
  config: LevelGenerationConfig
): InteractiveObject[] {
  
  const extinguishers: InteractiveObject[] = [];
  let positionIndex = 0;
  
  // Shuffle positions for randomness
  const shuffledPositions = [...spawnPositions].sort(() => Math.random() - 0.5);
  
  requirements.forEach((count, extinguisherType) => {
    for (let i = 0; i < count; i++) {
      if (positionIndex >= shuffledPositions.length) {
        console.warn('Ran out of spawn positions for extinguishers');
        break;
      }
      
      const position = shuffledPositions[positionIndex++];
      const extinguisherInfo = EXTINGUISHER_PROPERTIES[extinguisherType];
      
      extinguishers.push({
        id: `dynamic-extinguisher-${extinguisherType}-${i + 1}`,
        type: extinguisherType,
        position,
        isActive: true,
        isCollected: false
      });
      
      console.log(`Spawned ${extinguisherInfo?.name || extinguisherType} at (${position.x.toFixed(1)}, ${position.z.toFixed(1)})`);
    }
  });
  
  return extinguishers;
}

// Utility function to get level bounds from environment objects
export function calculateLevelBounds(environmentObjects: any[]): { minX: number; maxX: number; minZ: number; maxZ: number } {
  let minX = -5, maxX = 5, minZ = -5, maxZ = 5;
  
  environmentObjects.forEach(obj => {
    if (obj.type === 'floor') {
      const halfScaleX = obj.scale.x / 2;
      const halfScaleZ = obj.scale.z / 2;
      minX = obj.position.x - halfScaleX;
      maxX = obj.position.x + halfScaleX;
      minZ = obj.position.z - halfScaleZ;
      maxZ = obj.position.z + halfScaleZ;
    }
  });
  
  // Add some padding
  return {
    minX: minX + 1,
    maxX: maxX - 1,
    minZ: minZ + 1,
    maxZ: maxZ - 1
  };
} 