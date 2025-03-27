import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TutorialScreenProps {
  onComplete: () => void;
}

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to Fire Safety Simulator",
      content: "This tutorial will guide you through the basics of fire safety and how to play the game.",
      image: null
    },
    {
      title: "Movement Controls",
      content: "Use WASD or arrow keys to move your character. Hold SHIFT to run faster, and press C to crouch which can help you avoid smoke damage.",
      image: null
    },
    {
      title: "Interacting with Objects",
      content: "Press E to interact with important safety equipment like fire extinguishers and smoke detectors. Look for objects that can be interacted with throughout each level.",
      image: null
    },
    {
      title: "Using Fire Extinguishers",
      content: "Once you've picked up a fire extinguisher, press F when near a fire to extinguish it. Remember the PASS technique: Pull, Aim, Squeeze, Sweep.",
      image: null
    },
    {
      title: "Hazards and Health",
      content: "Fires and smoke will damage your health over time. Crouch to reduce smoke inhalation, and stay away from flames. Your health and oxygen levels are shown in the bottom left corner.",
      image: null
    },
    {
      title: "Game Objectives",
      content: "In each level, you'll need to find and extinguish all fire hazards, activate smoke detectors, and reach a target score within the time limit. Safety tips will appear to help you learn important fire safety concepts.",
      image: null
    },
    {
      title: "Ready to Begin?",
      content: "Now you're ready to put your fire safety skills to the test! Remember, the knowledge you gain here could help save lives in a real emergency.",
      image: null
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
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <Card className="w-full max-w-2xl bg-opacity-90">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-2xl font-bold">
            {step.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 bg-gray-900 text-white">
          <div className="min-h-[200px]">
            {step.image && (
              <div className="mb-4 flex justify-center">
                <div className="w-64 h-48 bg-gray-700 flex items-center justify-center rounded-md">
                  {/* We would use an image here, but using a placeholder */}
                  <span className="text-gray-400">Tutorial Image</span>
                </div>
              </div>
            )}
            
            <p className="text-gray-300 text-lg my-4">
              {step.content}
            </p>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {tutorialSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={goToNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Start Game' : 'Next'}
              {currentStep < tutorialSteps.length - 1 && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
