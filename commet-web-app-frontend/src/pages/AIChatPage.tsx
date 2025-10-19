import React from "react";
import AIChatForm from "../components/AIChatForm";
import { Bot } from "lucide-react";

const AIChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-xl">
              <Bot className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Repository Analysis
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get intelligent insights about any GitHub repository. Ask questions
            about code patterns, development activity, technologies used, and
            more.
          </p>
        </div>

        <AIChatForm />

        <div className="mt-12 card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Enter Repository
              </h3>
              <p className="text-muted-foreground text-sm">
                Provide the GitHub repository in owner/repo format and
                optionally specify a branch.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ask Questions
              </h3>
              <p className="text-muted-foreground text-sm">
                Ask any question about the repository, its code, contributors,
                or development patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Get AI Insights
              </h3>
              <p className="text-muted-foreground text-sm">
                Receive detailed AI-powered analysis based on repository data
                and recent commits.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            What you can ask
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Technical Analysis
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• What programming languages are used?</li>
                <li>• What frameworks and libraries are included?</li>
                <li>• How is the code structured and organized?</li>
                <li>• What are the main components and modules?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Development Activity
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Who are the main contributors?</li>
                <li>• What is the commit frequency pattern?</li>
                <li>• What are the recent changes and trends?</li>
                <li>• How active is the development?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Project Insights
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• What is the project about?</li>
                <li>• What are the main features?</li>
                <li>• How mature is the codebase?</li>
                <li>• What is the development workflow?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Code Quality
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• What is the code quality like?</li>
                <li>• Are there any patterns or best practices?</li>
                <li>• What are the recent improvements?</li>
                <li>• How is testing handled?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
