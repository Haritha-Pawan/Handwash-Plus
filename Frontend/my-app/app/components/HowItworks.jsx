'use client';
import { howItWorksSteps } from '../constance/costance';

export function HowItWorks() {


  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl my-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our simple three-step process helps schools maintain excellent hygiene standards
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {howItWorksSteps.map((step, index) => (
          <div key={index} className="relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-8xl font-bold text-cyan-100 -z-10">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
            
            {index < howItWorksSteps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-300 to-blue-300"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
