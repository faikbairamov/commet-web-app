import React from "react";
import EnhancedAIChatForm from "../components/EnhancedAIChatForm";
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
            Get intelligent insights about GitHub repositories. Analyze single
            projects or multiple connected projects to understand how they work
            together, API connections, and get detailed development
            instructions.
          </p>
        </div>

        <EnhancedAIChatForm />

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
                Select Projects
              </h3>
              <p className="text-muted-foreground text-sm">
                Choose single repository or multiple connected projects
                (frontend, backend, etc.) to analyze their relationships and
                integration patterns.
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
                Ask about code patterns, API connections, integration
                instructions, or how projects work together.
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
                Receive comprehensive analysis with detailed instructions, API
                schemas, and complete prompts for development tasks.
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
                Single Project Analysis
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
                Multi-Project Analysis
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• How do these projects work together and connect?</li>
                <li>• What are the API endpoints and schemas?</li>
                <li>• How can I integrate projects for a complete app?</li>
                <li>• What are the data flow patterns between projects?</li>
                <li>• How do I set up the development environment?</li>
                <li>• What are the shared dependencies and technologies?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Development Instructions
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Complete prompts for LLM development</li>
                <li>• API schema documentation</li>
                <li>• Integration step-by-step guides</li>
                <li>• Code adaptation instructions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Project Health & Quality
              </h3>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Development activity patterns</li>
                <li>• Code quality assessment</li>
                <li>• Recent changes and trends</li>
                <li>• Best practices and recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
