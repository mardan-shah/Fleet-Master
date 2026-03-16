"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Wrench, Home, Settings, Package, User, X, Menu, Truck } from 'lucide-react';
import { AccountMenuComponent } from "@/components/navbar/AccountMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  icon: any; // You can replace `any` with a more specific type if needed
  label: string;
  path: string;
}

const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = isAuthenticated
    ? [
        { icon: Home, label: "Dashboard", path: "/pages/dashboard" },
        { icon: Package, label: "Vehicles", path: "/pages/vehicles" },
        { icon: User, label: "Drivers", path: "/pages/drivers" },
        { icon: Wrench, label: "Maintenance", path: "/pages/maintenance" },
        { icon: Settings, label: "Settings", path: "/pages/settings" },
      ]
    : [
        { icon: Home, label: "Home", path: "/" },
        { icon: Package, label: "Features", path: "/pages/features" },
        { icon: Settings, label: "Pricing", path: "/pages/pricing" },
        { icon: User, label: "Contact", path: "/pages/contact" },
      ];

  const getTitle = (): string => {
    const item = navItems.find((item) => item.path === pathname);
    return item ? item.label : "MyGarage";
  };

  const getUserInitials = (): string => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/pages/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setSidebarOpen(false);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <nav className="w-full z-50 bg-dark/80 backdrop-blur-sm border-b border-dark-border">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-primaryaccent" />
            <span className="text-lg font-bold text-white truncate">
              {getTitle()}
            </span>
          </div>

          {/* Middle Section - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link href={item.path} key={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 hover:text-primaryaccent hover:bg-dark-hover ${
                    pathname === item.path
                      ? "text-primaryaccent bg-dark-hover"
                      : "text-gray-light"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-40 lg:w-64 bg-dark/50 text-gray-light border-dark-border hidden md:block"
                />
                <Link href="/pages/notification">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-light hover:text-primaryaccent hover:bg-dark-hover"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center">
                <AccountMenuComponent />
              </div>
            ) : (
              <Link href="/pages/signup">
                <Button
                  size="sm"
                  className="bg-primaryaccent text-white hover:bg-primaryaccent/90"
                >
                  Get Started
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-light hover:text-primaryaccent hover:bg-dark-hover"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
          className={`md:hidden fixed inset-0 z-auto bg-dark/95 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Truck className="w-6 h-6 text-primaryaccent" />
              <span className="text-lg font-bold text-white">FleetMaster</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-light hover:text-primaryaccent"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-2 bg-dark flex-grow">
            {navItems.map((item) => (
              <Link href={item.path} key={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-light hover:text-primaryaccent hover:bg-dark-hover"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-auto z-[200] pt-4 border-t border-dark-border">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-dark/50 text-gray-light border-dark-border mb-2"
              />
              <Button className="w-full bg-primaryaccent text-white hover:bg-primaryaccent/90">
                Search
              </Button>
            </div>
          )}
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;
