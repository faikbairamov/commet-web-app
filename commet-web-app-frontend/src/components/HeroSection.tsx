import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { Github, Play, ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const { state } = useApp();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Your Code's Memory,
              <br />
              <span className="text-primary">Automated.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Commet empowers developers to maintain context and accelerate
              productivity. Automatically capture work sessions, synthesize
              project knowledge, and keep documentation always current with
              intelligent AI analysis.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {state.authenticatedUser ? (
              <Link
                to="/app/repository"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Analyzing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            ) : (
              <Link
                to="/app/auth"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                Connect GitHub
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            )}

            <Link
              to="/app/commits"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/80 hover:border-white rounded-lg transition-colors"
            >
              Explore Commits
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                10,000+
              </div>
              <div className="text-gray-300">Repositories Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                1M+
              </div>
              <div className="text-gray-300">Commits Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                50K+
              </div>
              <div className="text-gray-300">AI Queries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
