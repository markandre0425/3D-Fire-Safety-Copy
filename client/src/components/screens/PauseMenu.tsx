import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
}

export default function PauseMenu({ onResume, onRestart }: PauseMenuProps) {
  const { restart } = useGame();
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <Card className="w-full max-w-md bg-opacity-90">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Game Paused</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4"
              onClick={onResume}
            >
              Resume Game
            </Button>
            
            <Button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-4"
              onClick={onRestart}
            >
              Restart Level
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white py-4"
              onClick={toggleMute}
            >
              {isMuted ? "Unmute Sound" : "Mute Sound"}
            </Button>
            
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white py-4"
              onClick={restart}
            >
              Quit to Main Menu
            </Button>
          </div>
          
          <div className="mt-6 text-gray-500 text-sm text-center">
            <p>Press ESC to resume the game</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
