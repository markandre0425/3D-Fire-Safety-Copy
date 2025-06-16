import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BFPEducationalContentProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BFPEducationalContent({ isVisible, onClose }: BFPEducationalContentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bfpContent = [
    {
      title: "Bureau of Fire Protection (BFP) History",
      content: [
        "Established on August 2, 1991 through RA 6975 (DILG Act of 1990)",
        "Separated from PC-INP as a distinct agency under DILG",
        "Mandated to prevent and suppress destructive fires",
        "Conduct investigation and provide emergency medical services",
        "Enforce Republic Act 9514 (Revised Fire Code of the Philippines)"
      ]
    },
    {
      title: "Fire Safety Tetrahedron",
      content: [
        "HEAT: Open flames, hot surfaces, electrical energy, friction",
        "FUEL: Solids (wood, paper, cloth), Liquids (gasoline, paint), Gases (propane, natural gas)",
        "OXYGEN: Normal air contains 21% O2, requires approximately 16% to sustain fire",
        "CHEMICAL REACTION: Chain reaction that sustains combustion"
      ]
    },
    {
      title: "Fire Development Stages",
      content: [
        "IGNITION: Fire starts, plenty of oxygen, little heat and smoke",
        "GROWTH: Temperature and smoke increase, oxygen decreases",
        "FLASHOVER: Rapid transition, huge smoke presence",
        "FULLY DEVELOPED: All combustibles burning, maximum heat release",
        "DECAY: Fire intensity decreases due to lack of fuel"
      ]
    },
    {
      title: "Classes of Fire",
      content: [
        "CLASS A: Ordinary combustibles (wood, paper, cloth, rubber, plastics)",
        "CLASS B: Flammable liquids (gasoline, kerosene, paint, propane)",
        "CLASS C: Energized electrical equipment (appliances, switches, panels)",
        "CLASS D: Combustible metals (magnesium, titanium, potassium, sodium)",
        "CLASS K: Cooking oils and fats in commercial kitchens"
      ]
    },
    {
      title: "Fire Extinguishment Methods",
      content: [
        "COOLING: Water is the best cooling agent, absorbs heat",
        "SMOTHERING: Remove oxygen using CO2, foam, or wet blankets",
        "STARVATION: Remove fuel by shutting off supply or relocating materials",
        "CHEMICAL INHIBITION: Break the combustion chain reaction"
      ]
    },
    {
      title: "BFP Emergency Response Team Structure",
      content: [
        "FIRE MARSHAL: Complete monitoring and command post setup",
        "COMMUNICATION TEAM: Call fire stations and public announcements",
        "FIREFIGHTING TEAM: 4 members - Nozzle man, Back-up, Line man, Valve operator",
        "EVACUATION TEAM: 2 members per floor for safe evacuation",
        "RESCUE & SALVAGE TEAM: Search and rescue, property protection",
        "FIRST AID TEAM: Basic first aid and CPR certified"
      ]
    },
    {
      title: "Personal Protective Equipment (PPE)",
      content: [
        "HELMET: Head protection from falling debris",
        "BUNKER COAT: Fire-resistant outer layer protection",
        "TROUSERS & SUSPENDERS: Lower body and support",
        "GLOVES: Hand protection from heat and chemicals",
        "FIRE BOOTS: Foot protection and stability",
        "BREATHING APPARATUS: Protection from smoke inhalation"
      ]
    },
    {
      title: "Fire Safety Tips from BFP",
      content: [
        "Identify and report fire hazards immediately",
        "Unplug electrical equipment when not in use",
        "Maintain proper housekeeping and clear exits",
        "Know location of fire alarms and extinguishers",
        "Enforce 'No Smoking' policies",
        "Avoid overloading electrical circuits",
        "Regular fire safety seminars and drills",
        "Emergency contact: 168 or 818-5150"
      ]
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bfpContent.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bfpContent.length) % bfpContent.length);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-red-900 border-4 border-yellow-400 rounded-lg p-8 max-w-4xl max-h-[80vh] overflow-y-auto relative"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
          >
            {/* BFP Header */}
            <div className="text-center mb-6">
              <div className="bg-yellow-400 text-red-900 px-4 py-2 rounded-lg inline-block mb-4">
                <h1 className="text-2xl font-bold">BUREAU OF FIRE PROTECTION</h1>
                <p className="text-sm">Republic of the Philippines</p>
              </div>
            </div>
            
            {/* Content Slide */}
            <div className="bg-white text-black p-6 rounded-lg min-h-[400px]">
              <h2 className="text-xl font-bold text-red-700 mb-4 border-b-2 border-red-200 pb-2">
                {bfpContent[currentSlide].title}
              </h2>
              <ul className="space-y-3 text-sm">
                {bfpContent[currentSlide].content.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-red-600 mr-3 font-bold">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={prevSlide}
                className="bg-yellow-400 text-red-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                disabled={currentSlide === 0}
              >
                ← Previous
              </button>
              
              <div className="text-yellow-400 font-bold">
                {currentSlide + 1} / {bfpContent.length}
              </div>
              
              <button 
                onClick={nextSlide}
                className="bg-yellow-400 text-red-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                disabled={currentSlide === bfpContent.length - 1}
              >
                Next →
              </button>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Close
            </button>
            
            {/* BFP Logo/Emblem */}
            <div className="text-center mt-4 text-yellow-400 text-sm">
              <p>🔥 Fire Prevention • Suppression • Investigation • Emergency Response 🔥</p>
              <p className="text-xs text-yellow-300 mt-1">
                "Ensuring a Fire-Safe Philippines by 2034"
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 