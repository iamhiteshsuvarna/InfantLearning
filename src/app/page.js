'use client';

import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';

const InfantLearningApp = () => {
  // Define all characters: A-Z followed by 1-10
  const allCharacters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('animate-bounce');
  const timeoutRef = useRef(null);
  
  // Animation options
  const animations = [
    'animate-bounce', 
    'animate-pulse', 
    'animate-ping'
  ];
  
  // Colors for the 3D characters
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-lime-500'
  ];
  
  // Get a random color for a character
  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };
  
  // Get random animation
  const getRandomAnimation = () => {
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
  };
  
  // Function to play sound for a character
  const playSound = (character) => {
    // In a real implementation, this would play an actual sound file
    console.log(`Playing sound for: ${character}`);
    
    // For a real app, you would use the Web Audio API or an audio element:
    // const audio = new Audio(`/sounds/${character.toLowerCase()}.mp3`);
    // audio.play();
  };
  
  // Handle clicking on the main character
  const handleMainCharacterClick = () => {
    // Play sound and show animation regardless of current animation state
    playSound(allCharacters[currentIndex]);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Get a random animation and apply it
    const animation = getRandomAnimation();
    setCurrentAnimation(animation);
    setIsAnimating(true);
    
    // Set a timeout to go to the next character after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      // Move to the next character
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allCharacters.length);
    }, 2000);
  };
  
  // Handle clicking on a character from the list
  const handleCharacterListClick = (index) => {
    // Set the current index immediately
    setCurrentIndex(index);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Get a random animation and apply it
    const animation = getRandomAnimation();
    setCurrentAnimation(animation);
    setIsAnimating(true);
    playSound(allCharacters[index]);
    
    // Set a timeout to end the animation after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };
  
  // Toggle auto-play mode
  const toggleAutoPlay = () => {
    const newState = !isAutoPlaying;
    setIsAutoPlaying(newState);
    
    // If turning on auto-play and not currently animating, start the sequence
    if (newState && !isAnimating) {
      handleMainCharacterClick();
    }
  };
  
  // Effect to handle auto-play
  useEffect(() => {
    // Only set up the next character if auto-play is on and we're not animating
    if (isAutoPlaying && !isAnimating) {
      timeoutRef.current = setTimeout(() => {
        handleMainCharacterClick();
      }, 500);
    }
    
    // Cleanup function to clear timeout if component updates
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAutoPlaying, isAnimating, currentIndex]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">
        Interactive Learning for Infants
      </h1>
      
      {/* Main display for current character */}
      <div 
        className={`${getRandomColor(currentIndex)} w-64 h-64 rounded-3xl shadow-xl flex items-center justify-center transform transition-all duration-300 hover:scale-105 cursor-pointer ${isAnimating ? currentAnimation : ''}`}
        onClick={handleMainCharacterClick}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(20deg) rotateX(10deg)'
        }}
      >
        <div className="text-9xl font-bold text-white drop-shadow-lg"
          style={{
            textShadow: '2px 2px 8px rgba(0,0,0,0.3), 0px 4px 0px rgba(0,0,0,0.2)',
            transform: 'translateZ(20px)'
          }}>
          {allCharacters[currentIndex]}
        </div>
      </div>
      
      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 items-center">
        <button 
          className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 transition-colors"
          onClick={toggleAutoPlay}
        >
          {isAutoPlaying ? "Pause" : "Auto Play"}
        </button>
        
        {/* Pagination/Character selection */}
        <div className="flex flex-wrap justify-center max-w-4xl gap-2 mt-6">
          {allCharacters.map((char, index) => (
            <div
              key={index}
              className={`${char == "" ? 
                  `w-full h-12 rounded-lg` : 
                  `w-12 h-12 ${getRandomColor(index)} rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${currentIndex === index ? `ring-4 ring-blue-300` : ''}`
                }`}
              onClick={() => char == "" ? null:handleCharacterListClick(index)}
            >
              <span className="text-white font-bold">{char}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfantLearningApp;
