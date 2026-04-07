import { Star, Flame, Award, Target } from "lucide-react";

export default function RightSidebar() {
  const progress = [
    { label: "Stars", value: 0, icon: <Star size={18} /> },
    { label: "Streak", value: 8, icon: <Flame size={18} /> },
    { label: "Badges", value: 0, icon: <Award size={18} /> },
    { label: "This Week", value: 30, icon: <Target size={18} /> },
  ];

  const leaders = [
    { name: "Lahiru", score: 120 },
    { name: "Nimal", score: 95 },
    { name: "Kamal", score: 80 },
  ];

  return (
    <div className=" p-4  mb-4">
      
      {/* 🔷 My Progress */}
   
<div className="bg-white rounded-xl shadow p-4 mb-8 mt-8">
  <h3 className="font-semibold mb-4">My Progress</h3>

  <div className="grid grid-cols-4 gap-3">
    {progress.map((item, index) => (
      <div
        key={index}
        className="bg-blue-50 text-blue-600 rounded-lg p-3 flex flex-col items-center justify-center h-32"
      >
        <span className="w-5 h-5">{item.icon}</span>
        <span className="text-lg font-bold ">{item.value}</span>
        <span className="text-xs">{item.label}</span>
      </div>
    ))}
  </div>
</div>

      {/* 🏆 Leaderboard */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-4">Leaderboard</h3>

        <div className="flex justify-between items-end gap-3 ">
          {leaders.map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-amber-200 p-4 rounded-lg w-24 "
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>

              {/* Name */}
              <span className="text-sm mt-1">{user.name}</span>

              {/* Score */}
              <span className="text-xs text-gray-500">
                {user.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}