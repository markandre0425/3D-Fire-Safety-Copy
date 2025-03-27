import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function ScoreDisplay() {
  const { score } = usePlayer();
  const { levelTime, levelData } = useFireSafety();
  
  // Format the time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Calculate progress toward required score
  const requiredScore = levelData.requiredScore;
  const scorePercentage = Math.min(100, (score / requiredScore) * 100);
  
  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-3 rounded-md text-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold">Score:</span>
        <span className="text-lg">{score} / {requiredScore}</span>
      </div>
      
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${scorePercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold">Time:</span>
        <span className="text-sm">{formatTime(levelTime)}</span>
      </div>
    </div>
  );
}
