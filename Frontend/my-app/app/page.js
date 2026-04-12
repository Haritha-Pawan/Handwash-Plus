"use client";



import { Hero } from "./components/common/Hero";
import { Features } from "./components/common/Features";
import { HandwashSteps } from "./components/common/HandwashStep";
import { HowItWorks } from "./components/common/HowItworks";


export default function Home() {

 
  return (
   
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <Hero />
      <HandwashSteps /> 
      <Features />
      <HowItWorks />
 
  
      </div>
   
  );
}
