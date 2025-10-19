import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RepositoryPage from "./pages/RepositoryPage";
import CommitsPage from "./pages/CommitsPage";
import AIChatPage from "./pages/AIChatPage";
import UsersPage from "./pages/UsersPage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CodeQualityPage from "./pages/CodeQualityPage";
import CollaborationPage from "./pages/CollaborationPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Web App Routes */}
          <Route
            path="/app/*"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/repository" element={<RepositoryPage />} />
                    <Route path="/commits" element={<CommitsPage />} />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/code-quality" element={<CodeQualityPage />} />
                    <Route
                      path="/collaboration"
                      element={<CollaborationPage />}
                    />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/auth/success" element={<AuthPage />} />
                    <Route path="/auth/error" element={<AuthPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Legacy routes for backward compatibility */}
          <Route
            path="/commits"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <CommitsPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <AIChatPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/users"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <UsersPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/auth"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <AuthPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/auth/success"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <AuthPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/auth/error"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <AuthPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <SettingsPage />
                </main>
                <Footer />
              </div>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
