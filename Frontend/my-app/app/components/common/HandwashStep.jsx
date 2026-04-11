'use client';
import { useState } from 'react';
import { steps } from '../../constance/data/costance';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export function HandwashSteps() {
  const [selectedStep, setSelectedStep] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById('steps-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('steps-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto px-6 py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl my-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Follow These 6 Easy Steps 🧼
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a step to learn the proper handwashing technique
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative">
        {/* Left Arrow */}
        <Button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 p-0 items-center justify-center"
          variant="ghost"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>

        {/* Cards Container */}
        <div
          id="steps-container"
          className="flex gap-6 overflow-x-auto pb-4 px-12 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => setSelectedStep(index)}
              className={`flex-shrink-0 w-64 cursor-pointer transition-all duration-300 ${
                selectedStep === index ? 'scale-105' : 'scale-100'
              }`}
            >
              <div
                className={`rounded-3xl overflow-hidden border-4 transition-all duration-300 ${
                  selectedStep === index
                    ? 'border-cyan-500 shadow-2xl'
                    : 'border-gray-200 shadow-lg hover:border-cyan-300'
                }`}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Step Number Badge */}
                  <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  {/* Emoji Overlay */}
                  <div className="absolute bottom-3 left-3 text-5xl bg-white/90 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                    {step.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white p-5 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 p-0 items-center justify-center"
          variant="ghost"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </Button>
      </div>

      {/* Bottom Tip */}
      <div className="max-w-7xl mt-12 text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-cyan-300">
        <p className="text-lg text-gray-700">
          <span className="font-bold text-cyan-600">💡 Remember:</span> Wash your hands for at least{' '}
          <span className="font-bold text-cyan-600">20 seconds</span> - that&apos;s about the time it takes to sing &quot;Happy Birthday&quot; twice! 🎵
        </p>
      </div>
    </div>
  );
}