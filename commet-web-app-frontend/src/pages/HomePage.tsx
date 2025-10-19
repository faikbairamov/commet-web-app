import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import {
  Code2,
  BarChart3,
  GitBranch,
  Bot,
  Users,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Github,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";

const HomePage: React.FC = () => {
  const { state } = useApp();

  const features = [
    {
      icon: BarChart3,
      title: "Multi-Repository Analysis",
      description:
        "Compare and analyze multiple repositories side by side with comprehensive statistics and insights.",
      color: "text-primary",
      href: "/app/repository",
    },
    {
      icon: GitBranch,
      title: "Commit History Explorer",
      description:
        "Browse detailed commit history with code differences, file changes, and contributor insights.",
      color: "text-primary",
      href: "/app/commits",
    },
    {
      icon: Bot,
      title: "AI-Powered Insights",
      description:
        "Get intelligent analysis and answers about your repositories using advanced AI technology.",
      color: "text-primary",
      href: "/app/ai-chat",
    },
    {
      icon: Users,
      title: "Contributor Analytics",
      description:
        "Analyze team contributions, activity patterns, and collaboration insights across repositories.",
      color: "text-primary",
      href: "/app/users",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive analytics dashboard with visual charts, trends, and development insights.",
      color: "text-primary",
      href: "/app/analytics",
    },
    {
      icon: Shield,
      title: "Code Quality Insights",
      description:
        "Automated code analysis, security scanning, and quality recommendations for better code.",
      color: "text-primary",
      href: "/app/code-quality",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Team discussions, live sessions, shared resources, and real-time collaboration tools.",
      color: "text-primary",
      href: "/app/collaboration",
    },
    {
      icon: Shield,
      title: "Secure GitHub Integration",
      description:
        "Safe OAuth authentication with access to both public and private repositories.",
      color: "text-primary",
      href: "/app/auth",
    },
    {
      icon: Zap,
      title: "Real-time Data",
      description:
        "Always up-to-date information with efficient API calls and intelligent caching.",
      color: "text-primary",
      href: "/app/repository",
    },
  ];

  const stats = [
    { label: "Repositories Analyzed", value: "10,000+", icon: BarChart3 },
    { label: "Commits Processed", value: "1M+", icon: GitBranch },
    { label: "Active Users", value: "500+", icon: Users },
    { label: "AI Queries", value: "50K+", icon: Bot },
  ];

  const quickActions = [
    {
      title: "Analyze Repositories",
      description:
        "Compare multiple repositories and get comprehensive insights",
      href: "/app/repository",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Explore Commits",
      description: "Browse commit history with detailed code differences",
      href: "/app/commits",
      icon: GitBranch,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Ask AI Questions",
      description: "Get intelligent insights about your codebase",
      href: "/app/ai-chat",
      icon: Bot,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative p-6 bg-primary/10 rounded-full border border-primary/20">
                  <Code2 className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              <span className="text-gradient">Commet</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              The ultimate GitHub repository analysis platform. Explore commits,
              analyze code, and get AI-powered insights without cloning a single
              repository.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {state.authenticatedUser ? (
                <Link
                  to="/app/repository"
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Analyzing
                </Link>
              ) : (
                <Link to="/app/auth" className="btn-primary text-lg px-8 py-4">
                  <Github className="h-5 w-5 mr-2" />
                  Connect GitHub
                </Link>
              )}
              <Link
                to="/app/commits"
                className="btn-secondary text-lg px-8 py-4"
              >
                Explore Commits
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools for GitHub repository analysis, all in one place.
              No local cloning required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.href}
                  className="group card-elevated p-8 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your path and start exploring GitHub repositories
              immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group relative overflow-hidden card-elevated p-8 hover-lift"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-200"
                    style={{
                      background: `linear-gradient(135deg, var(--color-${
                        action.color.split("-")[1]
                      }-500), var(--color-${action.color.split("-")[1]}-600))`,
                    }}
                  ></div>

                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div
                        className={`p-4 bg-gradient-to-br ${action.color} rounded-xl text-white`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary font-medium">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, secure, and powerful GitHub repository analysis.
            </p>
          </div>

          <div className="card-elevated p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative p-6 bg-primary/10 rounded-full border border-primary/20 w-24 h-24 mx-auto flex items-center justify-center">
                    <Github className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  1. Connect GitHub
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Securely authenticate with GitHub OAuth to access your
                  repositories and private data.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl"></div>
                  <div className="relative p-6 bg-accent/10 rounded-full border border-accent/20 w-24 h-24 mx-auto flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  2. Select Repositories
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from your repositories or analyze public ones. No
                  cloning or local setup required.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative p-6 bg-primary/10 rounded-full border border-primary/20 w-24 h-24 mx-auto flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  3. Get Insights
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore commits, analyze code patterns, and get AI-powered
                  insights about your repositories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-elevated p-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative p-6 bg-primary/10 rounded-full border border-primary/20">
                  <TrendingUp className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your GitHub Analysis?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of developers who are already using Commet to gain
              deeper insights into their codebases.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {state.authenticatedUser ? (
                <Link
                  to="/app/repository"
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Start Analyzing
                </Link>
              ) : (
                <Link to="/app/auth" className="btn-primary text-lg px-8 py-4">
                  <Github className="h-5 w-5 mr-2" />
                  Connect GitHub
                </Link>
              )}
              <Link
                to="/app/commits"
                className="btn-secondary text-lg px-8 py-4"
              >
                Explore Features
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
