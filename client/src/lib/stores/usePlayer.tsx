import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlayerState } from "../types";
import { PLAYER_CONSTANTS } from "../constants";

interface PlayerStateStore extends PlayerState {
  // Actions
  moveForward: (distance: number) => void;
  moveBackward: (distance: number) => void;
  moveLeft: (distance: number) => void;
  moveRight: (distance: number) => void;
  rotate: (angle: number) => void;
  setCrouching: (isCrouching: boolean) => void;
  setRunning: (isRunning: boolean) => void;
  takeDamage: (amount: number) => void;
  depleteOxygen: (amount: number) => void;
  replenishOxygen: (amount: number) => void;
  resetPlayer: () => void;
  pickupExtinguisher: () => void;
  useExtinguisher: () => void;
  addScore: (points: number) => void;
  getMovementSpeed: () => number;
}

export const usePlayer = create<PlayerStateStore>()(
  subscribeWithSelector((set, get) => ({
    position: { ...PLAYER_CONSTANTS.STARTING_POSITION },
    rotation: { x: 0, y: 0, z: 0 },
    health: PLAYER_CONSTANTS.MAX_HEALTH,
    hasExtinguisher: false,
    isCrouching: false,
    isRunning: false,
    oxygen: PLAYER_CONSTANTS.MAX_OXYGEN,
    score: 0,
    
    moveForward: (distance: number) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;
      
      // Calculate new position based on rotation
      const angle = rotation.y;
      const newX = position.x - Math.sin(angle) * actualDistance;
      const newZ = position.z - Math.cos(angle) * actualDistance;
      
      set({ position: { ...position, x: newX, z: newZ } });
    },
    
    moveBackward: (distance: number) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;
      
      // Calculate new position based on rotation
      const angle = rotation.y;
      const newX = position.x + Math.sin(angle) * actualDistance;
      const newZ = position.z + Math.cos(angle) * actualDistance;
      
      set({ position: { ...position, x: newX, z: newZ } });
    },
    
    moveLeft: (distance: number) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;
      
      // Calculate new position based on rotation (90 degrees left from forward)
      const angle = rotation.y - Math.PI / 2;
      const newX = position.x - Math.sin(angle) * actualDistance;
      const newZ = position.z - Math.cos(angle) * actualDistance;
      
      set({ position: { ...position, x: newX, z: newZ } });
    },
    
    moveRight: (distance: number) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;
      
      // Calculate new position based on rotation (90 degrees right from forward)
      const angle = rotation.y + Math.PI / 2;
      const newX = position.x - Math.sin(angle) * actualDistance;
      const newZ = position.z - Math.cos(angle) * actualDistance;
      
      set({ position: { ...position, x: newX, z: newZ } });
    },
    
    rotate: (angle: number) => {
      const { rotation } = get();
      set({ rotation: { ...rotation, y: rotation.y + angle } });
    },
    
    setCrouching: (isCrouching: boolean) => {
      set({ isCrouching });
      
      // Adjust height when crouching
      if (isCrouching) {
        set(state => ({ position: { ...state.position, y: 0.5 } }));
      } else {
        set(state => ({ position: { ...state.position, y: 1 } }));
      }
    },
    
    setRunning: (isRunning: boolean) => {
      set({ isRunning });
    },
    
    takeDamage: (amount: number) => {
      set(state => ({ 
        health: Math.max(0, state.health - amount) 
      }));
    },
    
    depleteOxygen: (amount: number) => {
      set(state => ({ 
        oxygen: Math.max(0, state.oxygen - amount) 
      }));
      
      // If oxygen is depleted, start taking damage
      if (get().oxygen <= 0) {
        get().takeDamage(amount / 2);
      }
    },
    
    replenishOxygen: (amount: number) => {
      set(state => ({ 
        oxygen: Math.min(PLAYER_CONSTANTS.MAX_OXYGEN, state.oxygen + amount) 
      }));
    },
    
    resetPlayer: () => {
      set({
        position: { ...PLAYER_CONSTANTS.STARTING_POSITION },
        rotation: { x: 0, y: 0, z: 0 },
        health: PLAYER_CONSTANTS.MAX_HEALTH,
        hasExtinguisher: false,
        isCrouching: false,
        isRunning: false,
        oxygen: PLAYER_CONSTANTS.MAX_OXYGEN
      });
    },
    
    pickupExtinguisher: () => {
      set({ hasExtinguisher: true });
      console.log("Fire extinguisher picked up");
    },
    
    useExtinguisher: () => {
      // Logic for using the extinguisher
      // This is just a placeholder - the actual extinguishing is handled in FireSafety store
      console.log("Using fire extinguisher");
    },
    
    addScore: (points: number) => {
      set(state => ({ score: state.score + points }));
    },
    
    getMovementSpeed: () => {
      const { isCrouching, isRunning } = get();
      
      if (isCrouching) {
        return PLAYER_CONSTANTS.CROUCH_SPEED;
      } else if (isRunning) {
        return PLAYER_CONSTANTS.RUNNING_SPEED;
      } else {
        return PLAYER_CONSTANTS.MOVEMENT_SPEED;
      }
    }
  }))
);
