import React, { useState, useRef, useCallback } from "react";
import { useDrag, useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { PLAYER_CONSTANTS } from "@/lib/constants";

interface EnhancedMobileControlsProps {
  enabled?: boolean;
  showDebug?: boolean;
  onCameraRotate?: (deltaX: number, deltaY: number) => void;
  onAction?: () => void;
  onPause?: () => void;
}

export default function EnhancedMobileControls({
  enabled = true,
  showDebug = false,
  onCameraRotate,
  onAction,
  onPause
}: EnhancedMobileControlsProps) {
  // Player movement functions
  const { 
    moveForward, 
    moveBackward, 
    moveLeft, 
    moveRight,
    setRunning,
    setCrouching,
    hasExtinguisher,
    isRunning
  } = usePlayer();
  
  const { isPaused } = useFireSafety();
  
  // Movement state
  const [isMoving, setIsMoving] = useState(false);
  const [movementVector, setMovementVector] = useState({ x: 0, y: 0 });
  const movementRef = useRef({ x: 0, y: 0 });
  
  // Joystick animation
  const [joystickSpring, joystickApi] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 400, friction: 30 }
  }));
  
  // Action button animation
  const [actionSpring, actionApi] = useSpring(() => ({
    scale: 1,
    opacity: hasExtinguisher ? 1 : 0.5,
    config: { tension: 300, friction: 20 }
  }));
  
  // Movement joystick gesture
  const movementBind = useDrag(
    ({ active, movement: [mx, my], velocity, cancel }) => {
      if (!enabled || isPaused) {
        cancel?.();
        return;
      }
      
      // Calculate joystick position within bounds
      const maxDistance = 60;
      const distance = Math.sqrt(mx * mx + my * my);
      
      let normalizedX = mx / maxDistance;
      let normalizedY = my / maxDistance;
      
      if (distance > maxDistance) {
        const angle = Math.atan2(my, mx);
        normalizedX = Math.cos(angle);
        normalizedY = Math.sin(angle);
        mx = normalizedX * maxDistance;
        my = normalizedY * maxDistance;
      }
      
      // Update joystick visual position
      joystickApi.start({
        x: mx,
        y: my,
        scale: active ? 1.2 : 1
      });
      
      // Handle movement
      if (active && distance > 10) {
        setIsMoving(true);
        setMovementVector({ x: normalizedX, y: -normalizedY }); // Invert Y for forward/backward
        movementRef.current = { x: normalizedX, y: -normalizedY };
        
        // Determine if player should run based on gesture velocity
        const shouldRun = velocity[0] > 5 || velocity[1] > 5;
        setRunning(shouldRun);
        
      } else {
        setIsMoving(false);
        setMovementVector({ x: 0, y: 0 });
        movementRef.current = { x: 0, y: 0 };
        setRunning(false);
        
        // Reset joystick position
        joystickApi.start({ x: 0, y: 0, scale: 1 });
      }
    },
    {
      bounds: { left: -60, right: 60, top: -60, bottom: 60 },
      rubberband: true
    }
  );
  
  // Camera rotation gesture
  const cameraRotationBind = useGesture(
    {
      onDrag: ({ delta: [dx, dy], active }) => {
        if (!enabled || isPaused || !active) return;
        
        // Call camera rotation callback
        onCameraRotate?.(dx * 0.01, dy * 0.01);
      },
      onPinch: ({ offset: [scale] }) => {
        if (!enabled || isPaused) return;
        
        // Handle zoom gesture (could be used for camera distance)
        console.log('Pinch zoom:', scale);
      }
    },
    {
      drag: { 
        threshold: 5,
        filterTaps: true 
      },
      pinch: { 
        scaleBounds: { min: 0.5, max: 2 },
        rubberband: true 
      }
    }
  );
  
  // Action button handler
  const handleActionPress = useCallback(() => {
    if (!enabled || isPaused) return;
    
    // Animate button press
    actionApi.start({
      scale: 0.9,
      immediate: false,
      config: { tension: 400, friction: 10 }
    });
    
    // Reset scale after animation
    setTimeout(() => {
      actionApi.start({ scale: 1 });
    }, 150);
    
    // Trigger action
    onAction?.();
  }, [enabled, isPaused, actionApi, onAction]);
  
  // Apply continuous movement
  React.useEffect(() => {
    if (!isMoving || isPaused) return;
    
    const interval = setInterval(() => {
      const { x, y } = movementRef.current;
      const speed = isRunning ? PLAYER_CONSTANTS.RUNNING_SPEED : PLAYER_CONSTANTS.MOVEMENT_SPEED;
      const deltaTime = 0.016; // Assume 60fps
      
      // Convert joystick input to movement
      if (Math.abs(y) > Math.abs(x)) {
        // Forward/backward movement
        if (y > 0.3) {
          moveForward(deltaTime * speed * y);
        } else if (y < -0.3) {
          moveBackward(deltaTime * speed * Math.abs(y));
        }
      } else {
        // Left/right movement
        if (x > 0.3) {
          moveRight(deltaTime * speed * x);
        } else if (x < -0.3) {
          moveLeft(deltaTime * speed * Math.abs(x));
        }
      }
    }, 16); // 60fps
    
    return () => clearInterval(interval);
  }, [isMoving, isPaused, isRunning, moveForward, moveBackward, moveLeft, moveRight]);
  
  // Update action button opacity based on extinguisher availability
  React.useEffect(() => {
    actionApi.start({
      opacity: hasExtinguisher ? 1 : 0.5
    });
  }, [hasExtinguisher, actionApi]);
  
  if (!enabled) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Movement Joystick - Bottom Left */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div className="relative w-32 h-32">
          {/* Joystick Base */}
          <div className="absolute inset-0 rounded-full bg-black/20 border-4 border-white/30 backdrop-blur-sm" />
          
          {/* Joystick Handle */}
          <animated.div
            {...movementBind()}
                         style={{
               ...joystickSpring,
               transform: joystickSpring.x.to((x: number) => `translate(${x}px, ${joystickSpring.y.get()}px) scale(${joystickSpring.scale.get()})`)
             }}
            className="absolute top-1/2 left-1/2 w-12 h-12 -mt-6 -ml-6 rounded-full bg-white/80 border-2 border-blue-500 shadow-lg cursor-pointer touch-none"
          >
            <div className="absolute inset-2 rounded-full bg-blue-500" />
          </animated.div>
          
          {/* Joystick Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
            Move
          </div>
        </div>
      </div>
      
      {/* Camera/Look Area - Center and Right */}
      <div 
        {...cameraRotationBind()}
        className="absolute top-0 right-0 w-2/3 h-full pointer-events-auto touch-none"
        style={{ touchAction: 'none' }}
      >
        {showDebug && (
          <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs">
            Camera Area - Drag to Look
          </div>
        )}
      </div>
      
      {/* Action Button - Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <animated.button
          style={actionSpring}
          onClick={handleActionPress}
          disabled={!hasExtinguisher}
          className={`
            w-20 h-20 rounded-full shadow-lg font-bold text-white text-sm
            ${hasExtinguisher 
              ? 'bg-red-600 border-4 border-red-400 active:bg-red-700' 
              : 'bg-gray-600 border-4 border-gray-400 cursor-not-allowed'
            }
            transition-colors duration-200
          `}
        >
          🧯
        </animated.button>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
          {hasExtinguisher ? "Extinguish" : "No Tool"}
        </div>
      </div>
      
      {/* Pause Button - Top Right */}
      <div className="absolute top-8 right-8 pointer-events-auto">
        <button
          onClick={onPause}
          className="w-12 h-12 rounded-full bg-black/50 border-2 border-white/30 backdrop-blur-sm text-white text-lg hover:bg-black/70 transition-colors"
        >
          ⏸️
        </button>
      </div>
      
      {/* Speed Indicator */}
      {isRunning && (
        <div className="absolute top-8 left-8 pointer-events-none">
          <div className="bg-orange-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            🏃 Running
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      {showDebug && (
        <div className="absolute top-20 left-8 bg-black/70 text-white p-2 rounded text-xs pointer-events-none">
          <div>Movement: {movementVector.x.toFixed(2)}, {movementVector.y.toFixed(2)}</div>
          <div>Moving: {isMoving ? 'Yes' : 'No'}</div>
          <div>Running: {isRunning ? 'Yes' : 'No'}</div>
          <div>Has Tool: {hasExtinguisher ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
} 