import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import {
  Code2,
  BarChart3,
  GitBranch,
  Bot,
  Users,
  Github,
  Settings,
  Menu,
  X,
  Key,
  User,
  LogOut,
  Shield,
  TrendingUp,
  ChevronDown,
  Home,
} from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Primary navigation - most important items
  const primaryNavigation = [
    {
      name: "Home",
      href: "/app",
      icon: Home,
      description: "Dashboard overview",
    },
    {
      name: "Repository",
      href: "/app/repository",
      icon: BarChart3,
      description: "Multi-repo analysis",
    },
    {
      name: "Commits",
      href: "/app/commits",
      icon: GitBranch,
      description: "Commit history",
    },
    {
      name: "AI Chat",
      href: "/app/ai-chat",
      icon: Bot,
      description: "AI insights",
    },
  ];

  // Secondary navigation - grouped under a dropdown
  const secondaryNavigation = [
    {
      name: "Analytics",
      href: "/app/analytics",
      icon: TrendingUp,
      description: "Advanced analytics",
    },
    {
      name: "Code Quality",
      href: "/app/code-quality",
      icon: Shield,
      description: "Quality insights",
    },
    {
      name: "Collaboration",
      href: "/app/collaboration",
      icon: Users,
      description: "Team collaboration",
    },
    {
      name: "Contributors",
      href: "/app/users",
      icon: Users,
      description: "Team analysis",
    },
  ];

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { default: api } = await import("../services/api");
      await api.logout();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link
              to="/app"
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-200">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-200">
                Commet
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Primary Navigation */}
            {primaryNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCurrentPath(item.href)
                    ? "text-foreground bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm"
                }`}
              >
                {item.icon && (
                  <item.icon
                    className={`h-4 w-4 transition-colors duration-200 ${
                      isCurrentPath(item.href)
                        ? "text-primary"
                        : "group-hover:text-primary"
                    }`}
                  />
                )}
                <span className="transition-colors duration-200">
                  {item.name}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-muted-foreground bg-popover border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                  {item.description}
                </div>
              </Link>
            ))}

            {/* More Menu Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  secondaryNavigation.some((item) => isCurrentPath(item.href))
                    ? "text-foreground bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm"
                }`}
              >
                <span className="transition-colors duration-200">More</span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isMoreMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-[9999]">
                  <div className="py-1">
                    {secondaryNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className={`group flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isCurrentPath(item.href)
                            ? "text-white bg-slate-800"
                            : "text-slate-200 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side - Auth status and settings */}
          <div className="flex items-center space-x-4">
            {/* Authentication status */}
            <div className="hidden md:flex items-center space-x-3">
              {state.authenticatedUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={state.authenticatedUser.avatar_url}
                      alt={state.authenticatedUser.login}
                      className="w-8 h-8 rounded-full border-2 border-border"
                    />
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-foreground">
                        {state.authenticatedUser.name ||
                          state.authenticatedUser.login}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{state.authenticatedUser.login}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Link
                      to="/app/settings"
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted/50 rounded-lg transition-all duration-200"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : state.githubToken ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <Key className="h-4 w-4" />
                    <span className="hidden sm:inline">Token Auth</span>
                  </div>
                  <Link
                    to="/app/settings"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Not authenticated</span>
                  </div>
                  <Link to="/app/auth" className="btn-primary text-sm">
                    <Github className="h-4 w-4 mr-2" />
                    Connect
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Primary Navigation */}
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isCurrentPath(item.href)
                      ? "text-foreground bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Secondary Navigation */}
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isCurrentPath(item.href)
                      ? "text-foreground bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Mobile auth section */}
              <div className="pt-4 border-t border-border/40">
                {state.authenticatedUser ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={state.authenticatedUser.avatar_url}
                        alt={state.authenticatedUser.login}
                        className="w-10 h-10 rounded-full border-2 border-border"
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {state.authenticatedUser.name ||
                            state.authenticatedUser.login}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{state.authenticatedUser.login}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to="/app/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 btn-secondary text-sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 btn-destructive text-sm"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : state.githubToken ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm text-primary mb-3">
                      <Key className="h-4 w-4" />
                      <span>Token Authentication</span>
                    </div>
                    <Link
                      to="/app/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full btn-secondary text-sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <User className="h-4 w-4" />
                      <span>Not authenticated</span>
                    </div>
                    <Link
                      to="/app/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full btn-primary text-sm"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Connect GitHub
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
