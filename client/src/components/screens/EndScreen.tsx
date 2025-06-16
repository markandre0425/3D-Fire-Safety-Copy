import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useGame } from "@/lib/stores/useGame";
import { SAFETY_TIPS } from "@/lib/constants";
import { Shield, Flame, Home, Star, Trophy, Medal, Award } from "lucide-react";

export default function EndScreen() {
  const { score } = usePlayer();
  const { completedLevels } = useFireSafety();
  const { restart } = useGame();
  
  // Memoize random tips to prevent re-selection on every render
  const randomTips = useMemo(() => {
    return [...SAFETY_TIPS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2); // Reduced from 3 to 2 for better fit
  }, []);
  
  // Memoize star calculation to prevent recalculation
  const stars = useMemo(() => {
    const baseScore = 800; // Minimum score for 3 stars
    if (score >= baseScore && completedLevels.length >= 3) return 3;
    if (score >= baseScore / 2 && completedLevels.length >= 2) return 2;
    return 1;
  }, [score, completedLevels.length]);
  
  // Memoize completion status
  const isGameComplete = useMemo(() => completedLevels.length === 3, [completedLevels.length]);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 z-50 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Celebratory floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        <Trophy className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-300 animate-bounce opacity-40" style={{animationDelay: '0s'}} />
        <Medal className="absolute top-1/3 right-1/4 w-5 h-5 text-gold-300 animate-bounce opacity-40" style={{animationDelay: '1s'}} />
        <Shield className="absolute bottom-1/4 left-1/3 w-6 h-6 text-green-300 animate-bounce opacity-40" style={{animationDelay: '2s'}} />
        <Star className="absolute top-1/2 right-1/3 w-4 h-4 text-yellow-300 animate-bounce opacity-40" style={{animationDelay: '3s'}} />
        <Award className="absolute bottom-1/3 right-1/2 w-5 h-5 text-purple-300 animate-bounce opacity-40" style={{animationDelay: '4s'}} />
        <Flame className="absolute top-2/3 left-1/5 w-4 h-4 text-orange-300 animate-bounce opacity-40" style={{animationDelay: '5s'}} />
      </div>
      
      {/* Scrollable container */}
      <div className="w-full max-w-4xl max-h-full overflow-y-auto relative z-10">
        <Card className="w-full bg-white bg-opacity-95 border-4 border-yellow-400 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 mr-2 text-white animate-pulse" />
              <div>
                <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                  {isGameComplete ? "🎉 Mission Complete! 🎉" : "🔥 Keep Training! 🔥"}
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl lg:text-2xl text-yellow-100 mt-2 font-semibold">
                  {isGameComplete ? "You're a BFP Fire Safety Hero!" : "Practice Makes Perfect!"}
                </CardDescription>
              </div>
              <Medal className="w-8 h-8 ml-2 text-white animate-pulse" />
            </div>
            
            {/* Achievement Badge */}
            <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 mt-3">
              <p className="text-sm sm:text-lg font-bold text-yellow-100">
                🏆 {isGameComplete ? "CERTIFIED FIRE SAFETY HERO!" : "FIRE SAFETY TRAINEE"}
              </p>
              <p className="text-xs sm:text-sm text-yellow-100">
                Bureau of Fire Protection (BFP) Training Program
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-blue-50 to-purple-50 space-y-4 sm:space-y-6">
            
            {/* Captain Apoy's Message */}
            <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl p-4 sm:p-6 border-4 border-yellow-400">
              <div className="flex items-center mb-3">
                <div className="text-4xl sm:text-6xl mr-3">🚒</div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-red-600">
                    {isGameComplete ? "Amazing work, Fire Hero! 🌟" : "Great effort, future hero! 💪"}
                  </h3>
                  <p className="text-sm sm:text-lg text-gray-700 font-medium">Captain Apoy is proud of you!</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">
                {isGameComplete 
                  ? "🎊 Fantastic! You've mastered all the BFP fire safety skills! You're ready to be a real fire safety hero! 🦸‍♂️🚒"
                  : "🌟 You're doing great! Fire safety takes practice. Keep learning the PASS technique! 💪🧯"
                }
              </p>
            </div>
            
            {/* Score and Achievement Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Score Card */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 sm:p-6 rounded-xl border-4 border-blue-300">
                <h4 className="text-lg sm:text-2xl font-bold text-blue-700 mb-2 flex items-center">
                  🎯 <span className="ml-2">Your Score</span>
                </h4>
                <div className="text-2xl sm:text-4xl font-bold text-blue-800">{score} points</div>
                <div className="text-sm sm:text-lg text-blue-600 mt-2">
                  Levels: {completedLevels.length} / 3
                </div>
              </div>
              
              {/* Stars Achievement */}
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 sm:p-6 rounded-xl border-4 border-yellow-300">
                <h4 className="text-lg sm:text-2xl font-bold text-yellow-700 mb-2 flex items-center">
                  ⭐ <span className="ml-2">Achievement</span>
                </h4>
                <div className="flex justify-center items-center space-x-1 sm:space-x-2 text-4xl sm:text-6xl my-2 sm:my-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span 
                      key={i} 
                      className={`transition-all duration-300 ${
                        i < stars 
                          ? "text-yellow-400 drop-shadow-lg animate-pulse" 
                          : "text-gray-300"
                      }`}
                      style={{ textShadow: i < stars ? "2px 2px 4px rgba(0,0,0,0.3)" : "none" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-center text-yellow-700 font-bold text-sm sm:text-base">
                  {stars === 3 ? "Perfect Hero!" : stars === 2 ? "Great Work!" : "Keep Going!"}
                </div>
              </div>
            </div>
            
            {/* Fire Safety Knowledge Badges - Only show if game complete */}
            {isGameComplete && (
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 sm:p-6 border-4 border-green-300">
                <h4 className="text-lg sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 text-center flex items-center justify-center">
                  🏅 <span className="ml-1 mr-1">BFP Badges Earned!</span> 🏅
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-white p-2 sm:p-4 rounded-lg border-2 border-green-400 text-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🧯</div>
                    <div className="font-bold text-green-700 text-sm sm:text-base">PASS Master</div>
                    <div className="text-xs sm:text-sm text-green-600">Fire Expert</div>
                  </div>
                  <div className="bg-white p-2 sm:p-4 rounded-lg border-2 border-blue-400 text-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔥</div>
                    <div className="font-bold text-blue-700 text-sm sm:text-base">Hazard Detective</div>
                    <div className="text-xs sm:text-sm text-blue-600">Risk Finder</div>
                  </div>
                  <div className="bg-white p-2 sm:p-4 rounded-lg border-2 border-purple-400 text-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🚨</div>
                    <div className="font-bold text-purple-700 text-sm sm:text-base">Emergency Hero</div>
                    <div className="text-xs sm:text-sm text-purple-600">Quick Response</div>
                  </div>
                  <div className="bg-white p-2 sm:p-4 rounded-lg border-2 border-orange-400 text-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏠</div>
                    <div className="font-bold text-orange-700 text-sm sm:text-base">Safety Guardian</div>
                    <div className="text-xs sm:text-sm text-orange-600">Home Protector</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* BFP Fire Safety Tips - Condensed */}
            <div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-gray-800 flex items-center justify-center">
                <span className="mr-2">🧯</span>
                Remember These Tips!
                <span className="ml-2">🔥</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {randomTips.map((tip, index) => (
                  <div key={tip.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <span className="text-lg sm:text-2xl mr-2 sm:mr-3">💡</span>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1 text-sm sm:text-base">{tip.title}</h4>
                        <p className="text-blue-700 text-xs sm:text-sm">{tip.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 sm:py-6 text-lg sm:text-2xl font-bold rounded-xl border-4 border-green-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={restart}
              >
                🚀 Train Again & Improve!
              </Button>
              
              {isGameComplete && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 sm:p-4 border-4 border-yellow-300 text-center">
                  <h4 className="text-lg sm:text-xl font-bold text-orange-700 mb-2">🎓 Mission Complete!</h4>
                  <p className="text-orange-600 text-sm sm:text-lg">
                    Share your fire safety knowledge with family and friends! 
                  </p>
                  <p className="text-orange-600 text-xs sm:text-sm mt-1">
                    Together, we can make every home safer! 🏠❤️
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
