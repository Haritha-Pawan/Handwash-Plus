import { Droplets } from 'lucide-react';
import {Button}  from './ui/button';


export function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CleanHands</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Features</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Monitoring</a>
            <a href="" className="text-gray-700 hover:text-cyan-600 transition-colors">community</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Contact</a>
          </div>

          <Button className="hidden md:inline-block bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
            Get Started
         </Button>
        </div>
      </div>
    </nav>
  );
}
