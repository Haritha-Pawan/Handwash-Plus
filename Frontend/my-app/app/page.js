"use client";



import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HandwashSteps } from "./components/HandwashStep";
import { HowItWorks } from "./components/HowItworks";


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
