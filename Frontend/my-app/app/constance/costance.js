  import { Activity, BarChart3, Bell, Users } from 'lucide-react';
  import { Clock, CheckCircle, TrendingUp } from 'lucide-react';
  import Image from 'next/image';


  export const dummyPosts = [
  {
    id: 1,
    title: "Best handwash for sensitive skin?",
    description: "Looking for a gentle handwash for daily use.",
    image: "/images/step3.jpg",
    votes: 12,
    user: "Lahiru",
  },
  {
    id: 2,
    title: "Public hygiene tips",
    description: "How to maintain hygiene in crowded places?",
    image: "/images/step4.jpg",
    votes: 30,
    user: "Nimal",
  },
    {
    id: 2,
    title: "Public hygiene tips",
    description: "How to maintain hygiene in crowded places?",
    image: "/images/step4.jpg",
    votes: 30,
    user: "Nimal",
  },
    {
    id: 2,
    title: "Public hygiene tips",
    description: "How to maintain hygiene in crowded places?",
    image: "/images/step4.jpg",
    votes: 30,
    user: "Nimal",
  }
];
  
  export const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track handwashing activities across your school in real-time with our advanced monitoring system.',
      color: 'bg-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights about student handwashing habits and compliance rates.',
      color: 'bg-blue-500',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Automated reminders to encourage students to wash hands at key times throughout the day.',
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      title: 'Student Engagement',
      description: 'Gamification and rewards system to motivate students and build healthy hygiene habits.',
      color: 'bg-pink-500',
    },
  ];

  
 export const steps = [
    {
      number: 1,
      emoji: '🚰',
      title: 'Wet Hands',
      description: 'Use clean running water',
      image: '/images/step1.jpg',
    },
    {
      number: 2,
      emoji: '🧴',
      title: 'Apply Soap',
      description: 'Cover all hand surfaces',
      image: '/images/step2.jpg',
    },
    {
      number: 3,
      emoji: '👏',
      title: 'Lather & Scrub',
      description: 'Rub for 20 seconds',
      image: '/images/step3.jpg',
    },
    {
      number: 4,
      emoji: '🤲',
      title: 'Between Fingers',
      description: 'Clean all surfaces thoroughly',
      image: '/images/step4.jpg',
    },
    {
      number: 5,
      emoji: '💧',
      title: 'Rinse Well',
      description: 'Use clean running water',
      image: '/images/step5.jpg',
    },
    {
      number: 6,
      emoji: '🧻',
      title: 'Dry Hands',
      description: 'Use clean towel or air dry',
      image: '/images/step6.jpg',
    },
  ];

   export const howItWorksSteps = [
    {
      icon: Clock,
      title: 'Monitor Activity',
      description: 'Track when and how often students wash their hands throughout the school day',
      step: '01',
    },
    {
      icon: CheckCircle,
      title: 'Verify Compliance',
      description: 'Ensure proper handwashing technique and duration with our smart verification system',
      step: '02',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'View detailed reports and analytics to measure improvement and identify areas of focus',
      step: '03',
    },
  ];
