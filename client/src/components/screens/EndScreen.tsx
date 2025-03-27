import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useGame } from "@/lib/stores/useGame";
import { SAFETY_TIPS } from "@/lib/constants";

export default function EndScreen() {
  const { score } = usePlayer();
  const { completedLevels } = useFireSafety();
  const { restart } = useGame();
  
  // Select three random safety tips to display
  const randomTips = [...SAFETY_TIPS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  // Calculate stars based on score and completed levels
  const getStars = () => {
    const baseScore = 800; // Minimum score for 3 stars
    if (score >= baseScore && completedLevels.length >= 3) return 3;
    if (score >= baseScore / 2 && completedLevels.length >= 2) return 2;
    return 1;
  };
  
  const stars = getStars();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <Card className="w-full max-w-2xl bg-opacity-90 border-blue-500 border-2">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-4xl font-bold tracking-tight mt-2">
            {completedLevels.length === 3 ? "Congratulations!" : "Game Over"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 bg-black bg-opacity-75 text-white">
          <div className="text-center mb-6">
            <div className="text-2xl mb-2">Final Score: {score}</div>
            <div className="text-xl mb-4">Levels Completed: {completedLevels.length}</div>
            
            {/* Stars display */}
            <div className="flex justify-center space-x-2 text-4xl text-yellow-400 my-4">
              {Array(3).fill(0).map((_, i) => (
                <span key={i} className={i < stars ? "opacity-100" : "opacity-30"}>★</span>
              ))}
            </div>
            
            {completedLevels.length === 3 ? (
              <p className="text-lg">
                You've successfully completed all levels and learned valuable fire safety skills!
              </p>
            ) : (
              <p className="text-lg">
                You've completed {completedLevels.length} out of 3 levels. Keep practicing to improve your fire safety skills!
              </p>
            )}
          </div>
          
          <div className="my-6">
            <h3 className="text-xl font-bold mb-3">Fire Safety Tips to Remember:</h3>
            <ul className="space-y-3">
              {randomTips.map(tip => (
                <li key={tip.id} className="bg-gray-800 p-3 rounded-md">
                  <h4 className="font-bold text-yellow-300">{tip.title}</h4>
                  <p className="text-gray-300">{tip.content}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
              onClick={restart}
            >
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
