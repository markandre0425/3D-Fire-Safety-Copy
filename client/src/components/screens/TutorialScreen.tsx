import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Shield, Flame, Users, AlertTriangle, Check } from "lucide-react";

interface TutorialScreenProps {
  onComplete: () => void;
}

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "🚒 Welcome to BFP Fire Safety Academy! 🎓",
      content: "Hi there, brave Fire Safety Hero! I'm Captain Apoy from the Bureau of Fire Protection (BFP). Today, you'll learn everything about fire safety - just like real Filipino firefighters do! Are you ready to become a fire safety expert?",
      mascot: "🚒",
      bgColor: "from-red-400 to-orange-400",
      borderColor: "border-red-400",
      facts: [
        "The BFP was created in 1991 to protect Filipino families",
        "Every year, BFP saves thousands of lives across the Philippines!",
        "Fire safety knowledge can help you protect your family and friends"
      ]
    },
    {
      title: "🔥 Understanding Fire: The Fire Tetrahedron",
      content: "Fire needs four things to survive - we call this the 'Fire Tetrahedron'! Think of it like a recipe - remove any ingredient and the fire goes away. Let's learn about Heat, Fuel, Oxygen, and Chemical Reaction!",
      mascot: "🔥",
      bgColor: "from-orange-400 to-yellow-400", 
      borderColor: "border-orange-400",
      facts: [
        "🔥 HEAT: Fire needs heat to start (like matches or electricity)",
        "⛽ FUEL: Things that burn (wood, paper, gasoline, clothes)",
        "🌬️ OXYGEN: Fire needs air to breathe (about 16% oxygen minimum)",
        "⚗️ REACTION: The chemical process that makes fire keep burning"
      ]
    },
    {
      title: "🧯 Fire Classes: Know Your Enemy!",
      content: "Just like there are different types of Pokemon, there are different classes of fire! Each class needs a different approach. The BFP teaches us about Classes A, B, C, D, and K. Let's meet each fire type!",
      mascot: "🛡️",
      bgColor: "from-blue-400 to-purple-400",
      borderColor: "border-blue-400", 
      facts: [
        "🏠 Class A: Ordinary materials (wood, paper, cloth, plastic)",
        "⛽ Class B: Flammable liquids (gasoline, oil, paint)",
        "⚡ Class C: Electrical equipment (appliances, wires)",
        "🔬 Class D: Special metals (magnesium, sodium)",
        "🍳 Class K: Cooking oils and fats (kitchen fires)"
      ]
    },
    {
      title: "🧯 PASS Technique: Your Fire-Fighting Superpower!",
      content: "Every BFP firefighter knows the PASS technique! It's like a secret code that helps you use fire extinguishers safely. Let's learn this super important skill step by step!",
      mascot: "🦸‍♂️",
      bgColor: "from-green-400 to-blue-400",
      borderColor: "border-green-400",
      facts: [
        "📌 PULL: Pull the safety pin (like opening a soda can!)",
        "🎯 AIM: Aim at the BASE of the fire (not the flames!)",
        "🤏 SQUEEZE: Squeeze the handle firmly", 
        "↔️ SWEEP: Sweep side to side until fire is out"
      ]
    },
    {
      title: "🚨 BFP Emergency Response: What to Do in a Fire",
      content: "If you discover a fire, remember the BFP emergency steps! Stay calm, think like a firefighter, and follow these important rules that have saved many Filipino families!",
      mascot: "🚨",
      bgColor: "from-red-400 to-pink-400",
      borderColor: "border-red-400",
      facts: [
        "🔔 Alert others immediately - shout 'FIRE!'",
        "📞 Call 168 (BFP emergency number) or 911",
        "🏃‍♂️ Get out quickly using the nearest safe exit",
        "🚪 Close doors behind you to stop fire spread",
        "📍 Meet at your family's meeting place outside",
        "🚫 NEVER go back inside a burning building!"
      ]
    },
    {
      title: "🎮 Game Controls: How to Be a Digital Fire Hero",
      content: "Now let's learn how to control your character in our fire safety adventure! These controls will help you navigate dangerous situations and practice your fire safety skills safely!",
      mascot: "🎮",
      bgColor: "from-purple-400 to-indigo-400",
      borderColor: "border-purple-400",
      facts: [
        "🏃 WASD or Arrow Keys: Move your fire safety hero",
        "🧯 E Key: Pick up fire extinguishers and safety equipment",
        "💨 F Key: Use your fire extinguisher (remember PASS!)",
        "🏃‍♂️ Shift: Run faster when escaping danger",
        "🤲 C Key: Crouch low to avoid smoke (stay below smoke!)",
        "⏸️ ESC: Pause if you need a break"
      ]
    },
    {
      title: "🏆 Fire Brigade Training: Your Mission",
      content: "Congratulations! You're now ready for your first fire safety mission! In this game, you'll join a virtual Fire Brigade, just like real BFP firefighters. Your job is to find fire hazards, use fire extinguishers correctly, and help keep everyone safe!",
      mascot: "🏆",
      bgColor: "from-yellow-400 to-orange-400",
      borderColor: "border-yellow-400",
      facts: [
        "🎯 Find and extinguish all fires using PASS technique",
        "🔍 Identify fire hazards before they become dangerous",
        "🏃‍♂️ Practice emergency evacuation procedures",
        "⭐ Earn badges for excellent fire safety skills",
        "📚 Learn new fire safety facts in each level",
        "🤝 Work with your Fire Brigade team to save the day!"
      ]
    },
    {
      title: "🌟 Ready to Become a Fire Safety Hero?",
      content: "Amazing! You've completed the BFP Fire Safety Academy basic training! Remember, the skills you learn here could help you protect your family, friends, and community in real life. Captain Apoy is proud of you - now go save the day!",
      mascot: "⭐",
      bgColor: "from-green-400 to-teal-400",
      borderColor: "border-green-400",
      facts: [
        "🎓 You're now a certified Junior Fire Safety Hero!",
        "📖 You know the Fire Tetrahedron and Fire Classes",
        "🧯 You can use the PASS technique like a pro",
        "🚨 You know BFP emergency procedures",
        "🛡️ You're ready to help keep your community safe!"
      ]
    }
  ];
  
  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const step = tutorialSteps[currentStep];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Floating educational elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Shield className="absolute top-1/4 left-1/6 w-6 h-6 text-yellow-300 animate-bounce opacity-40" style={{animationDelay: '0s'}} />
        <Flame className="absolute top-1/3 right-1/6 w-5 h-5 text-orange-300 animate-bounce opacity-40" style={{animationDelay: '1.5s'}} />
        <Users className="absolute bottom-1/4 left-1/4 w-7 h-7 text-green-300 animate-bounce opacity-40" style={{animationDelay: '3s'}} />
      </div>
      
      <Card className="w-full max-w-4xl bg-white bg-opacity-95 border-4 border-yellow-400 shadow-2xl relative z-10">
        <CardHeader className={`text-center bg-gradient-to-r ${step.bgColor} text-white rounded-t-lg`}>
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl mr-4 animate-pulse">{step.mascot}</div>
            <div>
              <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
                {step.title}
              </CardTitle>
              <div className="mt-2 bg-white bg-opacity-20 rounded-lg p-2">
                <p className="text-sm font-semibold text-yellow-100">
                  BFP Fire Safety Academy • Step {currentStep + 1} of {tutorialSteps.length}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="min-h-[400px]">
            {/* Main content area */}
            <div className={`bg-gradient-to-r from-white to-blue-50 p-6 rounded-xl mb-6 border-4 ${step.borderColor}`}>
              <p className="text-gray-700 text-xl leading-relaxed mb-4">
                {step.content}
              </p>
            </div>
            
            {/* Facts/Learning points */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border-4 border-yellow-300">
              <h4 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
                📚 <span className="ml-2">What You'll Learn:</span>
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {step.facts.map((fact, index) => (
                  <div key={index} className="flex items-start bg-white p-3 rounded-lg border-2 border-orange-200 shadow-sm">
                    <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white disabled:opacity-50 py-3 px-6 rounded-xl border-2 border-gray-400 font-bold text-lg"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            
            {/* Progress indicators */}
            <div className="flex items-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-4 w-4 rounded-full border-2 ${
                    index === currentStep 
                      ? 'bg-blue-500 border-blue-600 scale-125' 
                      : index < currentStep
                      ? 'bg-green-500 border-green-600'
                      : 'bg-gray-300 border-gray-400'
                  } transition-all duration-300`}
                />
              ))}
            </div>
            
            <Button
              onClick={goToNextStep}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl border-2 border-blue-400 font-bold text-lg"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  🚀 Start Mission!
                </>
              ) : (
                <>
                  Next Lesson
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
          
          {/* BFP Attribution */}
          <div className="mt-6 text-center">
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3">
              <p className="text-red-700 font-semibold text-sm">
                🏛️ Educational content approved by Bureau of Fire Protection (BFP) Philippines
              </p>
              <p className="text-red-600 text-xs">
                Following RA 9514 - Revised Fire Code of the Philippines
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
