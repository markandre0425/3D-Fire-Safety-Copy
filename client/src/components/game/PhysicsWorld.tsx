import { ReactNode } from "react";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

interface PhysicsWorldProps {
  children: ReactNode;
  enabled?: boolean;
  showDebug?: boolean;
  gravity?: [number, number, number];
}

export default function PhysicsWorld({ 
  children, 
  enabled = false, 
  showDebug = false,
  gravity = [0, -9.81, 0] 
}: PhysicsWorldProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Physics 
      debug={showDebug}
      gravity={gravity}
      paused={false}
      timeStep={1/60}
    >
      {/* Ground plane for realistic physics */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh 
          position={[0, -0.5, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </RigidBody>

      {/* Invisible boundary walls to prevent falling off */}
      <RigidBody type="fixed" colliders="cuboid">
        <CuboidCollider 
          args={[0.1, 5, 25]} 
          position={[25, 0, 0]} 
        />
        <CuboidCollider 
          args={[0.1, 5, 25]} 
          position={[-25, 0, 0]} 
        />
        <CuboidCollider 
          args={[25, 5, 0.1]} 
          position={[0, 0, 25]} 
        />
        <CuboidCollider 
          args={[25, 5, 0.1]} 
          position={[0, 0, -25]} 
        />
      </RigidBody>

      {children}
    </Physics>
  );
}

// Enhanced collision component for environmental objects
interface PhysicsObjectProps {
  children: ReactNode;
  type?: "fixed" | "dynamic" | "kinematicPosition";
  position?: [number, number, number];
  rotation?: [number, number, number];
  mass?: number;
  onCollisionEnter?: (event: any) => void;
  restitution?: number;
  friction?: number;
  cuboidArgs?: [number, number, number];
}

export function PhysicsObject({
  children,
  type = "fixed",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  mass = 1,
  onCollisionEnter,
  restitution = 0.2,
  friction = 0.8,
  cuboidArgs = [1, 1, 1]
}: PhysicsObjectProps) {
  return (
    <RigidBody
      type={type}
      position={position}
      rotation={rotation}
      mass={mass}
      restitution={restitution}
      friction={friction}
      onCollisionEnter={onCollisionEnter}
    >
      <CuboidCollider args={cuboidArgs} />
      {children}
    </RigidBody>
  );
}

// Enhanced character physics controller
interface PhysicsCharacterProps {
  children: ReactNode;
  position?: [number, number, number];
  enabledPhysics?: boolean;
  onGroundStateChange?: (isGrounded: boolean) => void;
}

export function PhysicsCharacter({
  children,
  position = [0, 1, 0],
  enabledPhysics = true,
  onGroundStateChange
}: PhysicsCharacterProps) {
  if (!enabledPhysics) {
    return <group position={position}>{children}</group>;
  }

  return (
    <RigidBody
      type="dynamic"
      position={position}
      mass={1}
      friction={1}
      restitution={0.0}
      gravityScale={1}
      lockRotations={true}
      enabledRotations={[false, true, false]}
    >
      <CuboidCollider args={[0.3, 0.8, 0.3]} />
      {children}
    </RigidBody>
  );
} 