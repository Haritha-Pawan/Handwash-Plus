"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CleanHands</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-cyan-600">Home</Link>
            <Link href="/features" className="text-gray-700 hover:text-cyan-600">Features</Link>
            <Link href="/monitoring" className="text-gray-700 hover:text-cyan-600">Monitoring</Link>
            <Link href="/community" className="text-gray-700 hover:text-cyan-600">Community</Link>
            <Link href="/dashbord" className="text-gray-700 hover:text-cyan-600">Dashboard</Link>
            <Link href="/contact" className="text-gray-700 hover:text-cyan-600">Contact</Link>
          </div>

          {/* Button */}

          <div className="flex gap-4">
            <Link href="/auth/login">
          <Button className="hidden md:inline-block border border-cyan-600 bg-white px-6 py-2 rounded-full 0">
            Login
          </Button> 
          </Link>
          <Link href="/auth/register">
          <Button className="hidden md:inline-block bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700">
            register
          </Button>
          </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}