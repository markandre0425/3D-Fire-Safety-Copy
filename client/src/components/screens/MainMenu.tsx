import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAudio } from "@/lib/stores/useAudio";

interface MainMenuProps {
  onStartTutorial: () => void;
  onStartGame: () => void;
}

export default function MainMenu({ onStartTutorial, onStartGame }: MainMenuProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <Card className="w-full max-w-2xl bg-opacity-90 border-orange-500 border-2">
        <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardTitle className="text-4xl font-bold tracking-tight mt-2">
            Fire Safety Simulator
          </CardTitle>
          <CardDescription className="text-xl text-white mt-2">
            Learn to prevent fires and respond to emergencies
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 bg-black bg-opacity-75">
          {!showOptions ? (
            <>
              <p className="text-white text-center mb-6">
                Explore different home environments, identify fire hazards, practice using fire extinguishers, 
                and learn essential fire safety skills that could save lives.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white py-6 text-xl"
                  onClick={onStartTutorial}
                >
                  Start Tutorial
                </Button>
                
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white py-6 text-xl"
                  onClick={onStartGame}
                >
                  Start Game
                </Button>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4"
                  onClick={() => setShowOptions(true)}
                >
                  Options
                </Button>
              </div>
              
              <div className="mt-8 text-gray-300 text-sm text-center">
                <p>Use WASD to move, E to interact, F to extinguish fires</p>
                <p>Press Shift to run, C to crouch, and ESC to pause</p>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-white text-xl font-bold mb-4">Options</h3>
              
              <div className="bg-gray-800 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Sound</span>
                  <Button
                    variant="outline"
                    onClick={toggleMute}
                    className="bg-transparent border-white text-white hover:bg-gray-700"
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                </div>
              </div>
              
              <div className="text-white mb-6">
                <h4 className="font-bold mb-2">Game Controls:</h4>
                <ul className="space-y-1 text-sm">
                  <li>WASD / Arrow Keys: Move</li>
                  <li>E: Interact with objects</li>
                  <li>F: Use fire extinguisher</li>
                  <li>Shift: Run</li>
                  <li>C: Crouch (reduces smoke damage)</li>
                  <li>ESC: Pause game</li>
                  <li>M: Toggle sound</li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowOptions(false)}
              >
                Back to Main Menu
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
