"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  MapPin,
  AlertCircle,
  RefreshCcw,
  Loader2,
  Trash2,
  Edit2,
  Map,
  Users,
  School as SchoolIcon,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  Download,
  Activity,
  Globe,
  Phone,
  Mail,
  Plus,
  X,
  CheckCircle,
  Clock,
  GraduationCap,
  BookOpen,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { SchoolMap } from "../../../../components/SchoolMap";
import { EditSchoolModal } from "../../../../components/EditSchoolModal";
import { CreateSchoolModal } from "../../../../components/CreateSchoolModal";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // State for schools data
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // UI State
  const [schoolToEdit, setSchoolToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Fetch schools from API
  const fetchSchools = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/schools`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Handle different response structures
      const schoolsData = data.data || data.schools || data;
      setSchools(Array.isArray(schoolsData) ? schoolsData : []);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setIsError(true);
      setError(err instanceof Error ? err.message : "Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete school
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchSchools(); // Refresh the list
      } else {
        alert(`Failed to delete: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Error deleting school: ${err instanceof Error ? err.message : "Server error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get unique districts
  const districts = ["All", ...new Set(schools.map(s => s.district).filter(Boolean))];
  
  // Filter schools
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === "All" || school.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Statistics
  const totalStudents = schools.reduce((acc, school) => acc + (school.studentCount || 0), 0);
  const totalTeachers = schools.reduce((acc, school) => acc + (school.teacherCount || 0), 0);
  const averagePerformance = schools.length > 0
    ? Math.round(schools.reduce((acc, s) => acc + (s.performance || 0), 0) / schools.length)
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
      fetchSchools();
    } catch (e) {
      router.push("/login");
    }
  }, [router]);
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict]);
  
  if (!isAuthorized) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading Dashboard...</h2>
        <p className="text-gray-500 mt-2">Fetching school data...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to fetch school data from server."}</p>
          <button
            onClick={fetchSchools}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Schools</p>
                <h3 className="text-3xl font-bold text-gray-800">{schools.length}</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Active institutions
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Students</p>
                <h3 className="text-3xl font-bold text-gray-800">{totalStudents.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-2">Across all schools</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Teachers</p>
                <h3 className="text-3xl font-bold text-gray-800">{totalTeachers.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-2">Dedicated educators</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Performance</p>
                <h3 className="text-3xl font-bold text-gray-800">{averagePerformance}%</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Above target
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school name, address, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer appearance-none"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={fetchSchools}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create School
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("list")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <SchoolIcon className="w-4 h-4" />
                School Directory
              </div>
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "map"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Map View
              </div>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        {activeTab === "map" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">School Locations Map</h2>
                  <p className="text-sm text-gray-500">{filteredSchools.length} schools displayed</p>
                </div>
              </div>
            </div>
            <div className="h-[500px] relative">
              <SchoolMap
                schools={filteredSchools}
                onEdit={(s) => setSchoolToEdit(s)}
                onDelete={(id) => handleDelete(id)}
                onSelect={(s) => setSelectedSchool(s)}
              />
              
              {/* Selected School Info Overlay */}
              {selectedSchool && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-800 font-semibold mb-1">{selectedSchool.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedSchool.city}, {selectedSchool.district}
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
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setSelectedSchool(null)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // School Table View
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">School</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">District</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teachers</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedSchools.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center">
                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No schools found matching your filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedSchools.map((school) => {
                      const id = school.id || school._id || "";
                      return (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-800">{school.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{school.type || "School"}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {school.district}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              <p>{school.city}</p>
                              <p className="text-xs text-gray-400">{school.address}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              {school.studentCount?.toLocaleString() || 0}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                              {school.teacherCount || 0}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    (school.performance || 0) >= 80 ? "bg-green-500" :
                                    (school.performance || 0) >= 60 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${school.performance || 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{school.performance || 0}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSchoolToEdit(school)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                disabled={isDeleting}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedSchool(school)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredSchools.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSchools.length)} of {filteredSchools.length} schools
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create Modal */}
      {showCreateModal && (
        <CreateSchoolModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchSchools}
        />
      )}

      {/* Edit Modal */}
      {schoolToEdit && (
        <EditSchoolModal
          school={schoolToEdit}
          onClose={() => setSchoolToEdit(null)}
          onUpdate={fetchSchools}
        />
      )}
    </div>
  );
};

export default Dashboard;
