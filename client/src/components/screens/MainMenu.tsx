import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAudio } from "@/lib/stores/useAudio";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Shield, Flame, Home, Star, ChevronDown, ChevronUp, Play, Pause, ArrowLeft, Trophy, Clock } from "lucide-react";
import { LEVELS } from "@/lib/constants";
import { Level, DifficultyLevel } from "@/lib/types";

interface MainMenuProps {
  onStartTutorial: () => void;
  onStartGame: () => void;
}

export default function MainMenu({ onStartTutorial, onStartGame }: MainMenuProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [expandedHowToPlay, setExpandedHowToPlay] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [testingKeys, setTestingKeys] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { isMuted, toggleMute } = useAudio();
  const { startLevel } = useFireSafety();
  
  // Enhanced control guide with more details
  const controlGuide = [
    { 
      key: "WASD", 
      action: "Move around", 
      icon: "🏃", 
      detail: "Use W-A-S-D keys to walk around the house and explore different rooms!",
      color: "blue",
      testKeys: ["KeyW", "KeyA", "KeyS", "KeyD"]
    },
    { 
      key: "E", 
      action: "Pick up items", 
      icon: "🧯", 
      detail: "Press E when you see a fire extinguisher or safety equipment to pick it up!",
      color: "red",
      testKeys: ["KeyE"]
    },
    { 
      key: "F", 
      action: "Use extinguisher", 
      icon: "💨", 
      detail: "Press F to spray the fire extinguisher and put out fires safely!",
      color: "green",
      testKeys: ["KeyF"]
    },
    { 
      key: "C", 
      action: "Crouch (safety!)", 
      icon: "🤲", 
      detail: "Press C to crouch down and stay safe from smoke - remember, stay low!",
      color: "purple",
      testKeys: ["KeyC"]
    },
    { 
      key: "Shift", 
      action: "Run faster", 
      icon: "💨", 
      detail: "Hold Shift while moving to run faster during emergencies!",
      color: "orange",
      testKeys: ["ShiftLeft", "ShiftRight"]
    },
    { 
      key: "ESC", 
      action: "Pause game", 
      icon: "⏸️", 
      detail: "Press Escape to pause the game anytime you need a break!",
      color: "gray",
      testKeys: ["Escape"]
    }
  ];

  // Handle key testing with useCallback to maintain reference
  const handleKeyTest = useCallback((event: KeyboardEvent) => {
    if (!testingKeys) return;
    
    // Prevent default behavior for some keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }
    
    const pressedKey = event.code;
    console.log('Key pressed:', pressedKey); // Debug log
    
    setPressedKeys(prev => new Set([...Array.from(prev), pressedKey]));
    
    // Find which control this key belongs to
    const matchingControl = controlGuide.find(control => 
      control.testKeys.includes(pressedKey)
    );
    
    if (matchingControl) {
      console.log('Matching control found:', matchingControl.key); // Debug log
      setActiveControl(matchingControl.key);
      setTimeout(() => setActiveControl(null), 1000);
    }
  }, [testingKeys, controlGuide]);

  // Start/stop key testing
  const toggleKeyTesting = useCallback(() => {
    if (testingKeys) {
      setTestingKeys(false);
      setPressedKeys(new Set());
      setActiveControl(null);
      window.removeEventListener('keydown', handleKeyTest);
      console.log('Key testing stopped'); // Debug log
    } else {
      setTestingKeys(true);
      setPressedKeys(new Set());
      window.addEventListener('keydown', handleKeyTest);
      console.log('Key testing started'); // Debug log
    }
  }, [testingKeys, handleKeyTest]);

  // Cleanup key listener with proper dependency
  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', handleKeyTest);
    };
  }, [handleKeyTest]);

  // Helper function to get difficulty styling
  const getDifficultyStyle = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.Beginner:
        return { color: "green", icon: "🌱", label: "Beginner" };
      case DifficultyLevel.Intermediate:
        return { color: "yellow", icon: "⭐", label: "Intermediate" };
      case DifficultyLevel.Advanced:
        return { color: "orange", icon: "🔥", label: "Advanced" };
      case DifficultyLevel.Expert:
        return { color: "red", icon: "💎", label: "Expert" };
      case DifficultyLevel.Master:
        return { color: "purple", icon: "👑", label: "Master" };
      default:
        return { color: "gray", icon: "⚫", label: "Unknown" };
    }
  };

  // Handle level selection
  const handleLevelSelect = (level: Level) => {
    startLevel(level);
    onStartGame();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Fun floating fire safety icons */}
      <div className="absolute inset-0 overflow-hidden">
        <Shield className="absolute top-1/4 left-1/4 w-8 h-8 text-yellow-300 animate-bounce opacity-30" style={{animationDelay: '0s'}} />
        <Flame className="absolute top-1/3 right-1/4 w-6 h-6 text-orange-300 animate-bounce opacity-30" style={{animationDelay: '1s'}} />
        <Home className="absolute bottom-1/4 left-1/3 w-7 h-7 text-green-300 animate-bounce opacity-30" style={{animationDelay: '2s'}} />
        <Star className="absolute top-1/2 right-1/3 w-5 h-5 text-yellow-300 animate-bounce opacity-30" style={{animationDelay: '3s'}} />
      </div>
      
      <Card className="w-full max-w-3xl max-h-[90vh] bg-white bg-opacity-95 border-4 border-yellow-400 shadow-2xl relative z-10 flex flex-col">
        <CardHeader className="text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-12 h-12 mr-3 text-white animate-pulse" />
            <div>
              <CardTitle className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                🚒 APULA Fire Heroes! 🧯
              </CardTitle>
              <CardDescription className="text-2xl text-yellow-100 mt-2 font-semibold">
                BFP-Certified Fire Safety Adventure for Kids!
              </CardDescription>
            </div>
            <Flame className="w-12 h-12 ml-3 text-white animate-pulse" />
          </div>
          
          {/* BFP Logo Section */}
          <div className="bg-white bg-opacity-20 rounded-lg p-2 mt-4">
            <p className="text-sm font-semibold text-yellow-100">
              🏛️ Approved by Bureau of Fire Protection (BFP) Philippines
            </p>
            <p className="text-xs text-yellow-100">
              Following RA 9514 - Revised Fire Code of the Philippines
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 bg-gradient-to-b from-blue-50 to-purple-50 overflow-y-auto flex-1">
          {showLevelSelect ? (
            <>
              {/* Level Selection Interface */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Button
                    onClick={() => setShowLevelSelect(false)}
                    className="mr-4 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h3 className="text-3xl font-bold text-red-600">🚨 Choose Your Mission!</h3>
                </div>
                <p className="text-gray-600">Select your fire safety challenge level with Captain Apoy!</p>
              </div>
              
              {/* BFP Training Levels */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.values(LEVELS).map((level) => {
                  const difficultyStyle = getDifficultyStyle(level.difficulty);
                  
                  return (
                    <div
                      key={level.id}
                      className={`bg-white p-4 rounded-xl border-4 border-${difficultyStyle.color}-300 hover:border-${difficultyStyle.color}-500 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg`}
                      onClick={() => handleLevelSelect(level.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3">{difficultyStyle.icon}</span>
                          <div>
                            <h4 className={`text-xl font-bold text-${difficultyStyle.color}-600`}>
                              {level.name}
                            </h4>
                            <div className={`text-sm font-semibold text-${difficultyStyle.color}-500 bg-${difficultyStyle.color}-100 px-2 py-1 rounded-lg inline-block`}>
                              {difficultyStyle.label}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <Trophy className="w-4 h-4 mr-1" />
                            <span>{level.requiredScore} pts needed</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{level.description}</p>
                      
                      {/* Learning Objectives */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-bold text-gray-700 mb-2">🎯 Learning Objectives:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {level.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Hazard and Equipment Preview */}
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-red-50 p-2 rounded border">
                          <h6 className="font-bold text-red-600 text-xs mb-1">🔥 Fire Hazards:</h6>
                          <p className="text-xs text-red-500">{level.hazards.length} hazard{level.hazards.length !== 1 ? 's' : ''} to extinguish</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded border">
                          <h6 className="font-bold text-blue-600 text-xs mb-1">🧯 Equipment:</h6>
                          <p className="text-xs text-blue-500">{level.objects.length} tool{level.objects.length !== 1 ? 's' : ''} available</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Captain Apoy Encouragement */}
              <div className="mt-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl p-4 border-4 border-yellow-400">
                <div className="flex items-center">
                  <div className="text-4xl mr-3">🚒</div>
                  <div>
                    <h4 className="text-lg font-bold text-red-600">Captain Apoy says:</h4>
                    <p className="text-gray-700">"Start with Basic Training if you're new, or jump to any level that interests you! Every mission makes you a better fire safety hero! 🦸‍♂️"</p>
                  </div>
                </div>
              </div>
            </>
          ) : !showOptions ? (
            <>
              {/* Fun mascot welcome message */}
              <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl p-6 mb-6 border-4 border-yellow-400">
                <div className="flex items-center mb-4">
                  <div className="text-6xl mr-4">🚒</div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-600">Hi there, Fire Safety Hero! 👋</h3>
                    <p className="text-lg text-gray-700 font-medium">I'm Captain Apoy, your BFP Fire Safety Guide!</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  🌟 Ready for an amazing adventure? Let's explore fire safety together! You'll learn how to identify fire hazards, 
                  use fire extinguishers safely, and become a real fire safety hero just like our brave BFP firefighters! 🦸‍♂️
                </p>
              </div>
              
              {/* BFP Learning Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                  <h4 className="font-bold text-green-700 mb-2">🎯 You'll Learn:</h4>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Fire Tetrahedron (Heat, Fuel, Oxygen, Reaction)</li>
                    <li>• PASS Technique (Pull, Aim, Squeeze, Sweep)</li>
                    <li>• Fire Classes A, B, C, D, K</li>
                    <li>• Emergency Response Procedures</li>
                  </ul>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
                  <h4 className="font-bold text-blue-700 mb-2">🏆 Fun Features:</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Interactive Fire Brigade Training</li>
                    <li>• BFP-Certified Safety Scenarios</li>
                    <li>• Fire Drill Simulations</li>
                    <li>• Achievement Badges System</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-2xl font-bold rounded-xl border-4 border-green-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={onStartTutorial}
                >
                  🎓 Start Fire Safety Training! 
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-6 text-2xl font-bold rounded-xl border-4 border-red-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowLevelSelect(true)}
                >
                  🚨 Choose Your Fire Safety Mission! 🚨
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 text-lg font-bold rounded-xl border-4 border-purple-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowOptions(true)}
                >
                  ⚙️ Game Settings
                </Button>
              </div>
              
              {/* Enhanced Interactive How to Play */}
              <div className="mt-6 bg-yellow-100 rounded-xl border-4 border-yellow-300 overflow-hidden">
                <button
                  onClick={() => setExpandedHowToPlay(!expandedHowToPlay)}
                  className="w-full p-4 flex items-center justify-between hover:bg-yellow-200 transition-colors duration-200"
                >
                  <h4 className="text-lg font-bold text-yellow-800 flex items-center">
                    🎮 <span className="ml-2">How to Play - Interactive Guide</span>
                  </h4>
                  {expandedHowToPlay ? 
                    <ChevronUp className="w-6 h-6 text-yellow-800" /> : 
                    <ChevronDown className="w-6 h-6 text-yellow-800" />
                  }
                </button>
                
                {expandedHowToPlay && (
                  <div className="p-4 pt-0">
                    {/* Key Testing Section */}
                    <div className="mb-4 p-4 bg-white rounded-lg border-2 border-yellow-300">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-gray-700">🔍 Test Your Keyboard!</h5>
                        <Button
                          onClick={toggleKeyTesting}
                          className={`text-sm px-4 py-2 rounded-lg font-bold ${
                            testingKeys 
                              ? "bg-red-500 hover:bg-red-600 text-white" 
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {testingKeys ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Stop Testing
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Start Testing
                            </>
                          )}
                        </Button>
                      </div>
                      {testingKeys && (
                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border">
                          🎯 Press any game key to test it! Your key presses will light up below.
                        </p>
                      )}
                    </div>
                    
                    {/* Control Guide Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {controlGuide.map((control, index) => {
                        const isActive = activeControl === control.key;
                        const hasBeenPressed = control.testKeys.some(key => pressedKeys.has(key));
                        
                        return (
                          <div 
                            key={index} 
                            className={`bg-white p-3 rounded-lg border-2 transition-all duration-300 ${
                              isActive 
                                ? `border-${control.color}-500 bg-${control.color}-50 shadow-lg scale-105` 
                                : hasBeenPressed && testingKeys
                                  ? `border-${control.color}-300 bg-${control.color}-25`
                                  : "border-gray-300"
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <span className={`text-2xl mr-2 ${isActive ? 'animate-bounce' : ''}`}>
                                {control.icon}
                              </span>
                              <div className="flex-1">
                                <div className={`font-bold text-${control.color}-600`}>
                                  {control.key}
                                  {hasBeenPressed && testingKeys && (
                                    <span className="ml-2 text-green-600">✓</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">{control.action}</div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {control.detail}
                            </p>
                            {isActive && (
                              <div className="mt-2 text-xs font-bold text-green-600 animate-pulse">
                                ✨ Great! You pressed {control.key}!
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* PASS Technique Demo */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-300">
                      <h5 className="font-bold text-red-700 mb-2 flex items-center">
                        🧯 <span className="ml-2">Remember the PASS Technique!</span>
                      </h5>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-bold text-red-600">P</div>
                          <div className="text-gray-600">Pull</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-bold text-orange-600">A</div>
                          <div className="text-gray-600">Aim</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-bold text-yellow-600">S</div>
                          <div className="text-gray-600">Squeeze</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-bold text-green-600">S</div>
                          <div className="text-gray-600">Sweep</div>
                        </div>
                      </div>
                    </div>
                    
                    {testingKeys && pressedKeys.size > 0 && (
                      <div className="mt-4 p-3 bg-green-100 rounded-lg border-2 border-green-300">
                        <h6 className="font-bold text-green-700 mb-1">🎉 Keys You've Tested:</h6>
                        <div className="text-sm text-green-600">
                          {Array.from(pressedKeys).map(key => {
                            const control = controlGuide.find(c => c.testKeys.includes(key));
                            return control ? `${control.key} ` : '';
                          }).filter(Boolean).join('• ')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-purple-600 mb-2">⚙️ Game Settings</h3>
                <p className="text-gray-600">Customize your fire safety experience!</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl mb-6 border-4 border-blue-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔊</span>
                    <span className="text-xl font-bold text-blue-700">Sound Effects</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={toggleMute}
                    className={`text-xl font-bold border-2 px-6 py-2 rounded-xl ${
                      isMuted 
                        ? "bg-red-200 border-red-400 text-red-700 hover:bg-red-300" 
                        : "bg-green-200 border-green-400 text-green-700 hover:bg-green-300"
                    }`}
                  >
                    {isMuted ? "🔇 Muted" : "🔊 On"}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl mb-6 border-4 border-green-300">
                <h4 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                  🎮 <span className="ml-2">Game Controls Guide</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {controlGuide.map((control, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border-2 border-gray-300">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{control.icon}</span>
                        <div>
                          <div className={`font-bold text-${control.color}-600`}>{control.key}</div>
                          <div className="text-sm text-gray-600">{control.action}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 text-xl font-bold rounded-xl border-4 border-purple-300 shadow-lg"
                onClick={() => setShowOptions(false)}
              >
                🔙 Back to Main Menu
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
