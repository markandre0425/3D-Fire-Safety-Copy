import React from "react";

export default function MobileControls() {
  // Simple placeholder component to resolve the 404 error
  // This can be enhanced later if mobile controls are actually needed
  
  return (
    <div className="fixed bottom-4 left-4 right-4 flex justify-center items-center pointer-events-auto z-50">
      <div className="bg-white/80 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          Mobile controls placeholder - use WASD keys to move
        </p>
      </div>
    </div>
  );
} 