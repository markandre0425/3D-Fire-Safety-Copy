# 🚨 APULA 3D Fire Safety Simulator - Debugging Guide

## 🔧 **Fixed Issues (Latest Update)**

### ✅ **Blank Screen Issue - RESOLVED**
The main blank screen issue has been fixed by:
- Simplified App.tsx component structure
- Fixed mobile controls import issues
- Added comprehensive error handling
- Streamlined state management

## 🚀 **Quick Start Debugging**

### 1. **Start the Application**
```bash
cd APULA-3D-Fire-Safety-Simulator-COPY
npm run dev
```

### 2. **Check Console for Debug Info**
Open Chrome DevTools (F12) and look for these logs:
```
🚀 APULA 3D Fire Safety Simulator - Starting...
📦 React version: 18.3.1
🌐 User Agent: [Your browser info]
📱 Screen size: 1920 x 1080
🎮 WebGL Support: ✅ Yes
✅ App rendered successfully
```

### 3. **Check the Debug Overlay**
You should see a debug overlay in the top-left corner showing:
- Phase: ready/playing/ended
- Mobile: Yes/No
- Loading: Complete

## 🐛 **Common Issues & Solutions**

### **Issue 1: Blank Screen**
**Symptoms:** White/blank screen, no content visible
**Solution:**
1. Check browser console for JavaScript errors
2. Verify WebGL support (should show ✅ Yes)
3. Check if debug overlay appears
4. Try different browser (Chrome recommended)

**Debug Steps:**
```bash
# Check if server is running
curl -I http://localhost:5001

# Check for console errors in browser DevTools
# Look for red error messages
```

### **Issue 2: 3D Scene Not Loading**
**Symptoms:** Menu loads but 3D game scene is black
**Solution:**
1. Check WebGL support in console
2. Update graphics drivers
3. Try lowering quality settings (mobile optimization)
4. Check for Three.js errors in console

**Debug Code:**
```javascript
// Test WebGL in browser console
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
console.log('WebGL supported:', !!gl);
```

### **Issue 3: Components Not Loading**
**Symptoms:** Missing UI elements, broken layout
**Solution:**
1. Check for import errors in console
2. Verify all dependencies installed
3. Check TypeScript compilation errors

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run check
```

### **Issue 4: Mobile Controls Not Working**
**Symptoms:** Touch controls don't respond on mobile
**Solution:**
1. Check if mobile detection is working
2. Verify touch events in console
3. Test on different mobile browsers

**Debug:**
```bash
# Test mobile user agent simulation
# Chrome DevTools > Device Toggle (Ctrl+Shift+M)
```

## 📊 **Debug Tools Added**

### **Console Logging**
The app now logs detailed information:
- React version and browser info
- WebGL support status
- Component mounting/unmounting
- Game state changes
- Mobile controls interactions

### **Debug Overlay**
Visual debugging information in top-left corner:
- Current game phase
- Mobile device detection
- Loading status
- Real-time game state

### **Error Handling**
- Global error handlers for uncaught exceptions
- Promise rejection handling
- Component error boundaries
- Detailed error logging

## 🔍 **Advanced Debugging**

### **Performance Issues**
```bash
# Check memory usage
chrome://memory-internals/

# Profile performance
# Chrome DevTools > Performance tab
```

### **Network Issues**
```bash
# Check if assets are loading
# Chrome DevTools > Network tab
# Look for failed requests (red entries)
```

### **3D Rendering Issues**
```bash
# Check Three.js stats
# Look for FPS drops or high draw calls
# Monitor GPU usage
```

## 🛠 **Development Tools**

### **Hot Module Replacement (HMR)**
The app supports hot reloading:
- Code changes automatically update
- State is preserved during updates
- Check for HMR update messages in console

### **TypeScript Checking**
```bash
# Run type checking
npm run check

# Watch for type errors
npm run check -- --watch
```

### **Build Process**
```bash
# Build for production
npm run build

# Test production build
npm start
```

## 📱 **Mobile Testing**

### **Desktop Simulation**
1. Open Chrome DevTools (F12)
2. Click device toggle (📱 icon)
3. Select mobile device
4. Refresh page
5. Test touch controls

### **Real Device Testing**
1. Find your local IP: `ifconfig | grep inet`
2. Connect mobile device to same WiFi
3. Open `http://YOUR_IP:5001` on mobile
4. Look for mobile control interface

## 🚨 **Emergency Fixes**

### **If Nothing Works:**
1. **Clear browser cache** (Ctrl+Shift+R)
2. **Try incognito mode** (Ctrl+Shift+N)
3. **Test different browser** (Firefox, Safari)
4. **Restart development server**
5. **Check port conflicts** (`lsof -i :5001`)

### **Reset Everything:**
```bash
# Kill all processes
pkill -f "tsx server/index.ts"

# Clean install
rm -rf node_modules package-lock.json
npm install

# Restart server
npm run dev
```

## 📞 **Getting Help**

### **Collect Debug Information**
Before reporting issues, collect:
1. Browser console logs (copy all errors)
2. Network tab (failed requests)
3. Browser version and OS
4. Mobile device info (if applicable)
5. Steps to reproduce the issue

### **GitHub Issues**
The repository is now connected to GitHub:
- **URL:** https://github.com/markandre0425/3D-Fire-Safety-Copy
- **Create issues** with debug information
- **Check existing issues** for similar problems

## ✅ **Verification Checklist**

After fixing issues, verify:
- [ ] Server starts without errors
- [ ] Main menu loads completely
- [ ] Debug overlay shows correct info
- [ ] 3D scene renders when starting game
- [ ] Mobile controls work (if on mobile)
- [ ] Console shows no red errors
- [ ] WebGL support detected
- [ ] All assets load successfully

## 🎯 **Expected Behavior**

**Successful startup should show:**
1. ✅ Server running on port 5001
2. ✅ Main menu with fire safety theme
3. ✅ Debug overlay in top-left
4. ✅ No console errors
5. ✅ 3D scene loads when starting game
6. ✅ Mobile controls on mobile devices

**Performance benchmarks:**
- Initial load: < 3 seconds
- 3D scene render: < 2 seconds
- Frame rate: 30+ FPS
- Memory usage: < 200MB 