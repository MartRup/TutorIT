import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Play,
  Users,
  MessageCircle,
  User,
  Settings,
  BookOpen,
  LogOut
} from "lucide-react";

const Layout = ({ children, activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userType');
    setUserRole(role);
  }, []);

  // Define navigation items for students
  const studentNavItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      key: "dashboard",
      path: "/dashboard"
    },
    {
      icon: <Play className="h-5 w-5" />,
      label: "Sessions",
      key: "sessions",
      path: "/sessions"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Find Tutors",
      key: "find-tutors",
      path: "/find-tutors"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Messages",
      key: "messages",
      path: "/messages"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      key: "settings",
      path: "/settings"
    }
  ];

  // Define navigation items for tutors (no Find Tutors)
  const tutorNavItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      key: "dashboard",
      path: "/dashboard"
    },
    {
      icon: <Play className="h-5 w-5" />,
      label: "Sessions",
      key: "sessions",
      path: "/tutor-sessions"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Messages",
      key: "messages",
      path: "/messages"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      key: "settings",
      path: "/settings"
    }
  ];

  // Select navigation items based on user role
  const navItems = userRole === 'tutor' ? tutorNavItems : studentNavItems;

  const handleNavigation = (path, key) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-200 p-6 min-h-screen">
          <h1 className="mb-8 text-2xl font-bold">
            <span className="text-blue-600">Tutor</span>
            <span>IT</span>
          </h1>

          {/* Role Badge */}
          {userRole && (
            <div className="mb-6 px-3 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">{userRole}</p>
            </div>
          )}

          <nav className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.path, item.key)}
                className={`w-full rounded-lg px-4 py-2 text-left font-semibold flex items-center gap-3 ${activePage === item.key
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  : "text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-2 text-left font-semibold flex items-center gap-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;