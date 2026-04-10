"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSchools, useDeleteSchool } from "../../../features/school/hooks/useSchool";
import {
  Droplets,
  MapPin,
  Building,
  AlertCircle,
  RefreshCcw,
  Loader2,
  Trash2,
  Edit2,
  Map,
  Users,
  School,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  MoreVertical,
  Download,
  BarChart3,
  Activity,
  Globe,
  Phone,
  Mail,
  Shield,
  Award,
  Eye,
  Layers,
  Maximize2,
  Minimize2
} from "lucide-react";
import { SchoolMap } from "../../../../components/SchoolMap";
import { EditSchoolModal } from "../../../../components/EditSchoolModal";
import type { School } from "../../../features/school/types/school.types";

const Dashboard = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const schoolsQuery = useSchools();
  const { data: schools = [], isLoading, isError, error } = schoolsQuery;
  const refetch = schoolsQuery.refetch as any;
  const { mutate: deleteSchool, isPending: isDeleting } = useDeleteSchool();

  const [schoolToEdit, setSchoolToEdit] = useState<School | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState("week");

  // Statistics
  const districts = [...new Set(schools.map(s => s.district))];
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === "All" || school.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const totalStudents = filteredSchools.reduce((acc, school) => acc + (school.studentCount || 0), 0);
  const totalTeachers = filteredSchools.reduce((acc, school) => acc + (school.teacherCount || 0), 0);
  const averagePerformance = filteredSchools.length > 0
    ? Math.round(filteredSchools.reduce((acc, s) => acc + (s.performance || 0), 0) / filteredSchools.length)
    : 0;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "superAdmin") {
        router.push("/");
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this school? This action cannot be undone.")) {
      deleteSchool(id, {
        onSuccess: (response) => {
          if (response.success) {
            console.log("✅ School deleted successfully");
          } else {
            alert(`Failed: ${response.message || "Unknown error"}`);
          }
        },
        onError: (err: any) => {
          console.error("❌ Delete failed:", err);
          const errMsg = err?.response?.data?.message || err.message || "Server error";
          alert(`Error deleting school: ${errMsg}`);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative" />
        </div>
        <h2 className="text-2xl font-semibold text-white/90 mt-6 animate-pulse">Loading Dashboard...</h2>
        <p className="text-slate-400 mt-2">Fetching school data from Sri Lanka</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-red-500/20 max-w-lg text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Connection Error</h2>
          <p className="text-slate-300 mb-8">{(error as Error)?.message || "Unable to fetch school data from server."}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-medium shadow-lg shadow-cyan-500/20"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>{`
        nav { display: none !important; }
      `}</style>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative">
        {/* Top Navigation Bar */}
        <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">EduManage SL</h1>
                    <p className="text-xs text-slate-400">Super Admin Console</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Sri Lanka</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-xl border border-slate-600/50">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <Download className="w-5 h-5 text-slate-400" />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Schools</p>
                  <h3 className="text-3xl font-bold text-white">{schools.length}</h3>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                  <Building className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Students</p>
                  <h3 className="text-3xl font-bold text-white">{totalStudents.toLocaleString()}</h3>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Teachers</p>
                  <h3 className="text-3xl font-bold text-white">{totalTeachers.toLocaleString()}</h3>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Avg Performance</p>
                  <h3 className="text-3xl font-bold text-white">{averagePerformance}%</h3>
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Above target
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6">
            {/* Sidebar - Search & Filters */}
            <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300`}>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  {!sidebarCollapsed && <h2 className="text-lg font-semibold text-white">Filters & Search</h2>}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>

                {!sidebarCollapsed && (
                  <>
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search schools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>

                    {/* District Filter */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">District</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                      >
                        <option value="All">All Districts</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time Range Filter */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Time Range</label>
                      <div className="flex gap-2">
                        {['day', 'week', 'month', 'year'].map((range) => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${timeRange === range
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                                : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                              }`}
                          >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-4 border-t border-slate-700/50">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Schools Shown</span>
                          <span className="text-white font-semibold">{filteredSchools.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Districts</span>
                          <span className="text-white font-semibold">{districts.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Avg Students/School</span>
                          <span className="text-white font-semibold">
                            {filteredSchools.length > 0 ? Math.round(totalStudents / filteredSchools.length) : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="flex-1">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Map className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Sri Lanka School Network</h2>
                        <p className="text-xs text-slate-400">{filteredSchools.length} schools mapped</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <Layers className="w-5 h-5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        {isMapFullscreen ?
                          <Minimize2 className="w-5 h-5 text-slate-400" /> :
                          <Maximize2 className="w-5 h-5 text-slate-400" />
                        }
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`${isMapFullscreen ? 'h-[800px]' : 'h-[500px]'} transition-all duration-300 relative`}>
                  <SchoolMap
                    schools={filteredSchools}
                    onEdit={(s) => setSchoolToEdit(s)}
                    onDelete={(id) => handleDelete(id)}
                    onSelect={(s) => setSelectedSchool(s)}
                  />

                  {/* Selected School Info Overlay */}
                  {selectedSchool && (
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold mb-1">{selectedSchool.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {selectedSchool.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {selectedSchool.studentCount || 0} students
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSchoolToEdit(selectedSchool)}
                            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => setSelectedSchool(null)}
                            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                          >
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* School List Grid */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">School Directory</h2>
                <span className="text-sm text-slate-400">{filteredSchools.length} schools</span>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredSchools.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No schools found matching your filters</p>
                  </div>
                ) : (
                  filteredSchools.map((school) => {
                    const id = school.id || school._id || "";
                    return (
                      <div
                        key={id}
                        className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group cursor-pointer"
                        onClick={() => setSelectedSchool(school)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                              {school.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{school.district}</p>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                            <School className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-slate-400">
                            <MapPin className="w-3 h-3 mr-1.5" />
                            {school.address}, {school.city}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-xs text-slate-400">
                              <Users className="w-3 h-3 mr-1.5" />
                              {school.studentCount || 0} students
                            </div>
                            <div className="flex items-center text-xs text-slate-400">
                              <Award className="w-3 h-3 mr-1.5" />
                              {school.teacherCount || 0} teachers
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchoolToEdit(school);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 py-2 rounded-lg text-xs font-medium transition-all"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(id);
                            }}
                            disabled={isDeleting}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchool(school);
                            }}
                            className="flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {schoolToEdit && (
        <EditSchoolModal
          school={schoolToEdit}
          onClose={() => setSchoolToEdit(null)}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;