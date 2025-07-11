# Mobile Controls Guide - iOS & Android

## 📱 Control Layout Overview

```
┌─────────────────────────────────────┐
│  ⏸️                          👆 Look Around │  ← TOP AREA
│                                     │
│         [3D Game Scene]             │  ← MIDDLE: Touch to Look Around
│                                     │
│                                     │
│  🕹️ Move              🔥 Action     │  ← BOTTOM CONTROLS
└─────────────────────────────────────┘
```

## 🎮 Control Mapping

### **Left Side - Virtual Joystick (Movement)**
- **Location**: Bottom-left corner
- **Function**: Character/Camera movement
- **How it works**:
  - Touch and drag within the circular area
  - The white dot follows your finger
  - Further from center = faster movement
  - Release = stops movement

### **Right Side - Action Button**
- **Location**: Bottom-right corner  
- **Function**: Fire extinguisher / Interact
- **Visual**: Red circular button with 🔥 icon
- **Touch**: Single tap to activate

### **Top Area - Camera Rotation**
- **Location**: Upper half of screen
- **Function**: Look around (first-person view)
- **How it works**:
  - Swipe left/right = turn head left/right
  - Swipe up/down = look up/down
  - Continuous swiping for smooth rotation

### **Pause Button**
- **Location**: Top-right corner
- **Function**: Pause game
- **Visual**: Gray circular button with ⏸️ icon

## 📱 Platform-Specific Behavior

### **iOS Devices**
```
✅ Haptic Feedback: Button presses give tactile feedback
✅ Safe Area: Respects iPhone notch and home indicator
✅ PWA Install: "Add to Home Screen" creates app-like icon
✅ Full Screen: Hides Safari address bar when installed
✅ Touch Prevention: Blocks iOS text selection and context menus
```

### **Android Devices**
```
✅ Haptic Feedback: Vibration on button interactions
✅ Navigation Bar: Adjusts for Android navigation
✅ PWA Install: Chrome prompts to "Install App"
✅ Full Screen: Immersive mode hides system UI
✅ Back Button: Hardware back button pauses game
```

## 🎯 Touch Gestures Breakdown

### **Movement Control (Bottom-Left)**
```javascript
// Virtual joystick behavior
onTouchStart: Records initial position
onTouchMove: Calculates direction & intensity
onTouchEnd: Resets to center, stops movement

// Movement values sent to game:
normalizedX: -1.0 to 1.0 (left/right)
normalizedY: -1.0 to 1.0 (forward/backward)
```

### **Camera Control (Top Half)**
```javascript
// Touch rotation behavior
onTouchStart: Records starting touch point
onTouchMove: Calculates delta movement
- deltaX * 0.01 = horizontal rotation speed
- deltaY * 0.01 = vertical rotation speed

// Sensitivity optimized for mobile:
- Fast swipes = quick turns
- Slow drags = precise aiming
```

### **Action Button (Bottom-Right)**
```javascript
// Fire extinguisher activation
onTouchStart: Immediate action trigger
- Prevents double-tap delays
- Optimized for emergency situations
```

## 📐 Responsive Design

### **Phone Portrait (9:16)**
```
- Joystick: 20% from left edge, 20% from bottom
- Action: 20% from right edge, 20% from bottom  
- Camera area: Full upper 60% of screen
- UI scales to 80% size for easier reach
```

### **Phone Landscape (16:9)**
```
- Joystick: 10% from left edge, 30% from bottom
- Action: 10% from right edge, 30% from bottom
- Camera area: Full upper 70% of screen
- Optimal for 3D environment viewing
```

### **Tablet (4:3 or 3:2)**
```
- Larger touch targets (30% bigger)
- More precise joystick control
- Extended camera rotation area
- Additional UI elements visible
```

## ⚡ Performance Optimizations

### **Mobile-Specific Settings**
```javascript
// Automatic mobile detection applies:
pixelRatio: Limited to 2x (prevents overheating)
shadows: Disabled on mobile
antialias: Disabled for performance
shadowMapSize: Reduced to 512px
powerPreference: "default" (battery saving)
```

### **Touch Response**
```javascript
// Optimized for 60fps touch tracking
touchAction: "none" // Prevents browser interference
preventDefault() // Blocks scrolling/zooming
Immediate response // No 300ms click delays
```

## 🔧 Technical Implementation

The mobile controls integrate with your existing Three.js/React Three Fiber setup:

```typescript
// In your 3D scene component:
import { MobileControls, useIsMobile, useMobileOptimization } from './MobileControls';

function GameScene() {
  const isMobile = useIsMobile();
  const mobileConfig = useMobileOptimization();
  
  const handleMove = (deltaX: number, deltaY: number) => {
    // Move character/camera based on joystick input
    playerRef.current.position.x += deltaX * moveSpeed;
    playerRef.current.position.z += deltaY * moveSpeed;
  };
  
  const handleRotate = (deltaX: number, deltaY: number) => {
    // Rotate camera based on touch input
    camera.rotation.y += deltaX;
    camera.rotation.x += deltaY;
  };
  
  return (
    <>
      <Canvas gl={mobileConfig}>
        {/* Your 3D scene */}
      </Canvas>
      
      {isMobile && (
        <MobileControls 
          onMove={handleMove}
          onRotate={handleRotate}
          onAction={handleFireExtinguisher}
          onPause={handlePause}
        />
      )}
    </>
  );
}
```

## 📱 User Experience Flow

### **First Launch**
1. Browser prompts: "Install APULA 3D?"
2. User adds to home screen
3. App opens in full-screen mode
4. Tutorial overlay shows control locations

### **Gameplay**
1. **Movement**: Thumb on left joystick for walking
2. **Looking**: Right thumb swipes on screen to look around
3. **Action**: Right thumb taps fire button to extinguish
4. **Pause**: Top-right button for menu access

### **Emergency Situations**
- **Large action button** for quick fire extinguisher access
- **Haptic feedback** confirms button presses
- **Visual feedback** shows successful actions
- **Audio cues** work with device volume controls

## 🎮 Gaming Experience Comparison

### **Traditional Mobile Games**
- Similar to: PUBG Mobile, Call of Duty Mobile
- **Left joystick**: Movement (familiar pattern)
- **Right screen**: Camera control (standard FPS)
- **Action buttons**: Bottom-right (genre standard)

### **Educational Benefits**
- **Intuitive**: Uses established mobile gaming patterns
- **Accessible**: Large touch targets for all ages
- **Responsive**: Immediate feedback builds confidence
- **Immersive**: Full-screen 3D removes distractions

This control scheme will feel natural to anyone who's used mobile games, while being educational-focused for fire safety training! 