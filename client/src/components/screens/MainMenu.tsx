import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAudio } from "@/lib/stores/useAudio";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Shield, Flame, Home, Star } from "lucide-react";
import { LEVELS } from "@/lib/constants";
import { Level } from "@/lib/types";
import { useGame } from "@/lib/stores/useGame";
import { usePlayer } from "@/lib/stores/usePlayer";

interface MainMenuProps {
  onStartTutorial: () => void;
  onStartGame: () => void;
}

export default function MainMenu({ onStartTutorial, onStartGame }: MainMenuProps) {
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { isMuted, toggleMute } = useAudio();
  const { phase } = useGame();
  const { currentLevel, levelData } = useFireSafety();
  const { health, oxygen, score } = usePlayer();
  const { startLevel } = useFireSafety();

  // Handle level selection
  const handleLevelSelect = (level: Level) => {
    console.log("🎯 Starting level:", level);
    startLevel(level);
    onStartGame();
  };

  const handleStartGame = () => {
    console.log("🚀 Starting game with default level...");
    console.log("📊 Initial state:", { phase, currentLevel, health, oxygen, score });
    onStartGame();
  };

  const handleStartTutorial = () => {
    console.log("📚 Starting tutorial...");
    onStartTutorial();
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
                🔥 APULA 3D Fire Safety Simulator
              </CardTitle>
              <CardDescription className="text-2xl text-yellow-100 mt-2 font-semibold">
                Interactive Fire Safety Training
              </CardDescription>
            </div>
            <Flame className="w-12 h-12 ml-3 text-white animate-pulse" />
          </div>
          
          {/* BFP Logo Section */}
          <div className="bg-white bg-opacity-20 rounded-lg p-2 mt-4">
            <p className="text-sm font-semibold text-yellow-100">
              🏛️ Bureau of Fire Protection (BFP) Philippines
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
                <h3 className="text-3xl font-bold text-red-600 mb-2">🚨 Choose Your Mission!</h3>
                <p className="text-gray-600">Select your fire safety challenge level</p>
              </div>
              
              {/* BFP Training Levels */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.values(LEVELS).map((level) => (
                  <div
                    key={level.id}
                    className="bg-white p-4 rounded-xl border-4 border-blue-300 hover:border-blue-500 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg"
                    onClick={() => handleLevelSelect(level.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">🔥</span>
                        <div>
                          <h4 className="text-xl font-bold text-blue-600">
                            {level.name}
                          </h4>
                          <div className="text-sm font-semibold text-blue-500 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                            {level.difficulty}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <span>🏆 {level.requiredScore} pts needed</span>
                        </div>
                        <div className="flex items-center">
                          <span>⏰ {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{level.description}</p>
                    
                    {/* Learning Objectives */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-bold text-gray-700 mb-2">🎯 Learning Objectives:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {level.learningObjectives.slice(0, 2).map((objective, index) => (
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
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-3 text-lg font-bold rounded-xl"
                onClick={() => setShowLevelSelect(false)}
              >
                🔙 Back to Main Menu
              </Button>
            </>
          ) : (
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
              
              <div className="flex flex-col space-y-4">
                <Button 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-2xl font-bold rounded-xl border-4 border-green-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={handleStartTutorial}
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
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-bold rounded-xl border-4 border-blue-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={handleStartGame}
                >
                  🎮 Quick Start (Kitchen Level)
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 text-sm font-bold rounded-xl border-2 border-purple-300 shadow-lg"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  🔧 {showDebug ? 'Hide' : 'Show'} Debug Info
                </Button>
              </div>
              
              {/* Controls Guide */}
              <div className="mt-6 bg-blue-100 rounded-xl p-4 border-2 border-blue-300">
                <h4 className="font-bold text-blue-700 mb-2">🎮 Controls:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>WASD / Arrows: Move</div>
                  <div>E: Interact / Collect Items</div>
                  <div>F: Use Extinguisher</div>
                  <div>Shift: Run</div>
                  <div>C: Crouch</div>
                  <div>Esc: Pause</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showDebug && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-black z-50">
          <h3 className="font-bold text-red-600 mb-2">Debug Information:</h3>
          <div className="text-sm space-y-1">
            <div>🎮 Game Phase: {phase}</div>
            <div>🏠 Current Level: {currentLevel}</div>
            <div>❤️ Health: {health}</div>
            <div>💨 Oxygen: {oxygen}</div>
            <div>🏆 Score: {score}</div>
            <div>⏰ Time Limit: {levelData.timeLimit}s</div>
            <div>🎯 Required Score: {levelData.requiredScore}</div>
            <div>📦 Objects: {levelData.objects.length}</div>
            <div>🔥 Hazards: {levelData.hazards.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
