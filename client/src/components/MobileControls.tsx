import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

interface MobileControlsProps {
  onMove?: (deltaX: number, deltaY: number) => void;
  onRotate?: (deltaX: number, deltaY: number) => void;
  onAction?: () => void;
  onPause?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onRotate,
  onAction,
  onPause
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  // Virtual joystick for movement
  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setJoystickActive(true);
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setJoystickPosition({
      x: touch.clientX - centerX,
      y: touch.clientY - centerY
    });
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickActive) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    
    // Limit joystick range
    const maxDistance = 40;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x: deltaX, y: deltaY });
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      setJoystickPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    }
    
    // Send movement data
    const normalizedX = joystickPosition.x / maxDistance;
    const normalizedY = joystickPosition.y / maxDistance;
    onMove?.(normalizedX, normalizedY);
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
    onMove?.(0, 0);
  };

  // Touch controls for camera rotation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouch.x;
    const deltaY = touch.clientY - lastTouch.y;
    
    onRotate?.(deltaX * 0.01, deltaY * 0.01);
    
    setLastTouch({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Camera rotation area (upper half) */}
      <div 
        className="absolute top-0 left-0 w-full h-1/2 pointer-events-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute top-4 left-4 text-white text-sm opacity-50">
          👆 Look Around
        </div>
      </div>

      {/* Movement joystick (bottom left) */}
      <div className="absolute bottom-20 left-6 pointer-events-auto">
        <div 
          className="relative w-20 h-20 bg-black/30 rounded-full border-2 border-white/50"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          style={{ touchAction: 'none' }}
        >
          <div 
            className="absolute w-8 h-8 bg-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`
            }}
          />
        </div>
        <div className="text-white text-xs text-center mt-1 opacity-50">Move</div>
      </div>

      {/* Action buttons (bottom right) */}
      <div className="absolute bottom-20 right-6 flex flex-col gap-3 pointer-events-auto">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onAction?.();
          }}
          className="w-14 h-14 bg-red-500/80 rounded-full flex items-center justify-center text-white text-2xl font-bold active:bg-red-600"
          style={{ touchAction: 'manipulation' }}
        >
          🔥
        </button>
        <div className="text-white text-xs text-center opacity-50">Action</div>
      </div>

      {/* Pause button (top right) */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onPause?.();
          }}
          className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center text-white text-lg active:bg-gray-700"
          style={{ touchAction: 'manipulation' }}
        >
          ⏸️
        </button>
      </div>

      {/* Mobile UI overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

// Hook for mobile detection
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Mobile performance optimization hook
export const useMobileOptimization = () => {
  const isMobile = useIsMobile();
  
  return {
    pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio,
    shadows: !isMobile,
    antialias: !isMobile,
    powerPreference: (isMobile ? 'default' : 'high-performance') as WebGLPowerPreference,
    shadowMapSize: isMobile ? 512 : 1024,
  };
}; 