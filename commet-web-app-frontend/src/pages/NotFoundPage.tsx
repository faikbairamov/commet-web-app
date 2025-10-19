import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-300 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>

          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-border text-base font-medium rounded-lg text-foreground bg-card hover:bg-muted transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-gray-400">
            Need help? Check out our{" "}
            <Link to="/" className="text-primary hover:text-primary/80">
              home page
            </Link>{" "}
            or{" "}
            <Link
              to="/app/settings"
              className="text-primary hover:text-primary/80"
            >
              settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
