import { Button } from '../ui/button';
import { Droplet, Sparkles, Heart, Shield, HandMetal, Waves } from 'lucide-react';
import Images from 'next/image';
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Hero() {
   const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 z-10 relative">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Promote Healthy{' '}
            <span className="text-cyan-600">Handwashing</span> Habits in Your School
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Monitor and encourage proper handwashing practices among students. 
            Our comprehensive system helps schools maintain excellent hygiene 
            standards and build lifelong healthy habits.
          </p>

          <div className="flex flex-wrap gap-4">
            
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Start Monitoring
            </Button>
            
            <Button
          variant="outline"
          className="px-8 py-6 text-lg rounded-full border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50">
         View Dashboard
        </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center bg-gradient-to-r from-blue-100/50 to-blue-100/25 p-4 rounded-md">
              <div className="text-4xl font-bold text-gray-900">12K</div>
              <div className="text-sm text-gray-600 mt-1">Students Monitored</div>
            </div>
            <div className="text-center bg-gradient-to-r from-blue-100/50 to-blue-100/25 p-4 rounded-md">
              <div className="text-4xl font-bold text-gray-900">89%</div>
              <div className="text-sm text-gray-600 mt-1">Compliance Rate</div>
            </div>
            <div className="text-center bg-gradient-to-r from-blue-100/50 to-blue-100/25 p-4 rounded-md">
              <div className="text-4xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-600 mt-1">Schools Joined</div>
            </div>
          </div>
        </div>

        {/* Right Content - Hexagonal Image */}
        <div className="relative flex items-center justify-center mb-50 lg:mb-24 ">
          {/* Decorative floating icons */}
          
          
          <div className="absolute top-0 right-10 left-[-20] w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <Sparkles className="w-7 h-7 text-purple-500" />
          </div>
          
          <div className="absolute bottom-8 left-[-50] w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
          </div>
          
          <div className="absolute  right-[-20] w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
            <Shield className="w-8 h-8 text-cyan-500" />
          </div>

          <div className="absolute  left-[-4] w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
            <HandMetal className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="absolute bottom-10 right-[-1] w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3s' }}>
            <Waves className="w-6 h-6 text-teal-500" />
          </div>
          
          {/* Hexagonal container */}
          <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            <div 
              className="w-full h-full"
             
            >
              <img
                src={'images/handwash.webp'}
                alt="Students washing hands"
                className=" object-cover  rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
    </div>
  );
}
