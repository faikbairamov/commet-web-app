import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Star,
  GitCommit,
  FileText,
  Download,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsData {
  repository: string;
  period: string;
  commits: CommitAnalytics[];
  contributors: ContributorAnalytics[];
  languages: LanguageAnalytics[];
  activity: ActivityAnalytics[];
  trends: TrendAnalytics[];
  summary: SummaryAnalytics;
}

interface CommitAnalytics {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  authors: string[];
}

interface ContributorAnalytics {
  name: string;
  email: string;
  commits: number;
  additions: number;
  deletions: number;
  avatar_url?: string;
  last_commit: string;
}

interface LanguageAnalytics {
  language: string;
  percentage: number;
  files: number;
  lines: number;
}

interface ActivityAnalytics {
  hour: number;
  commits: number;
  day: string;
}

interface TrendAnalytics {
  date: string;
  commits: number;
  issues: number;
  prs: number;
}

interface SummaryAnalytics {
  total_commits: number;
  total_contributors: number;
  total_files: number;
  total_lines: number;
  avg_commits_per_day: number;
  most_active_day: string;
  most_active_hour: number;
  top_contributor: string;
  primary_language: string;
}

const AnalyticsPage: React.FC = () => {
  const {} = useApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    repository: "microsoft/vscode",
    period: "30d",
    commits: [
      {
        date: "2024-01-01",
        commits: 12,
        additions: 450,
        deletions: 120,
        authors: ["john", "jane"],
      },
      {
        date: "2024-01-02",
        commits: 8,
        additions: 320,
        deletions: 80,
        authors: ["john", "bob"],
      },
      {
        date: "2024-01-03",
        commits: 15,
        additions: 600,
        deletions: 150,
        authors: ["jane", "alice"],
      },
      {
        date: "2024-01-04",
        commits: 6,
        additions: 200,
        deletions: 50,
        authors: ["bob"],
      },
      {
        date: "2024-01-05",
        commits: 20,
        additions: 800,
        deletions: 200,
        authors: ["john", "jane", "alice"],
      },
    ],
    contributors: [
      {
        name: "John Doe",
        email: "john@example.com",
        commits: 45,
        additions: 1800,
        deletions: 450,
        last_commit: "2024-01-05",
        avatar_url: "https://github.com/johndoe.png",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        commits: 38,
        additions: 1500,
        deletions: 380,
        last_commit: "2024-01-05",
        avatar_url: "https://github.com/janesmith.png",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        commits: 25,
        additions: 1000,
        deletions: 250,
        last_commit: "2024-01-04",
        avatar_url: "https://github.com/bobjohnson.png",
      },
      {
        name: "Alice Brown",
        email: "alice@example.com",
        commits: 18,
        additions: 720,
        deletions: 180,
        last_commit: "2024-01-05",
        avatar_url: "https://github.com/alicebrown.png",
      },
    ],
    languages: [
      { language: "TypeScript", percentage: 65.2, files: 1250, lines: 45000 },
      { language: "JavaScript", percentage: 20.1, files: 380, lines: 15000 },
      { language: "CSS", percentage: 10.5, files: 200, lines: 8000 },
      { language: "HTML", percentage: 4.2, files: 80, lines: 3000 },
    ],
    activity: [
      { hour: 0, commits: 2, day: "Monday" },
      { hour: 1, commits: 1, day: "Monday" },
      { hour: 2, commits: 0, day: "Monday" },
      { hour: 3, commits: 0, day: "Monday" },
      { hour: 4, commits: 0, day: "Monday" },
      { hour: 5, commits: 0, day: "Monday" },
      { hour: 6, commits: 1, day: "Monday" },
      { hour: 7, commits: 3, day: "Monday" },
      { hour: 8, commits: 8, day: "Monday" },
      { hour: 9, commits: 12, day: "Monday" },
      { hour: 10, commits: 15, day: "Monday" },
      { hour: 11, commits: 18, day: "Monday" },
      { hour: 12, commits: 14, day: "Monday" },
      { hour: 13, commits: 16, day: "Monday" },
      { hour: 14, commits: 20, day: "Monday" },
      { hour: 15, commits: 22, day: "Monday" },
      { hour: 16, commits: 19, day: "Monday" },
      { hour: 17, commits: 15, day: "Monday" },
      { hour: 18, commits: 10, day: "Monday" },
      { hour: 19, commits: 8, day: "Monday" },
      { hour: 20, commits: 6, day: "Monday" },
      { hour: 21, commits: 4, day: "Monday" },
      { hour: 22, commits: 3, day: "Monday" },
      { hour: 23, commits: 2, day: "Monday" },
    ],
    trends: [
      { date: "2024-01-01", commits: 12, issues: 5, prs: 3 },
      { date: "2024-01-02", commits: 8, issues: 3, prs: 2 },
      { date: "2024-01-03", commits: 15, issues: 7, prs: 4 },
      { date: "2024-01-04", commits: 6, issues: 2, prs: 1 },
      { date: "2024-01-05", commits: 20, issues: 8, prs: 5 },
    ],
    summary: {
      total_commits: 126,
      total_contributors: 4,
      total_files: 1910,
      total_lines: 71000,
      avg_commits_per_day: 4.2,
      most_active_day: "Friday",
      most_active_hour: 15,
      top_contributor: "John Doe",
      primary_language: "TypeScript",
    },
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    // Load analytics data when component mounts
    loadAnalyticsData();
  }, [selectedRepo, selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!analyticsData) return;

    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${analyticsData.repository}-${analyticsData.period}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadAnalyticsData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl mr-4 shadow-lg shadow-primary/25">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive insights into repository activity and
                  development patterns
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={loadAnalyticsData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Enter repository (owner/repo)"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Commits
              </CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.summary.total_commits}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.summary.avg_commits_per_day} commits/day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contributors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.summary.total_contributors}
              </div>
              <p className="text-xs text-muted-foreground">
                Top: {analyticsData?.summary.top_contributor}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Files & Lines
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.summary.total_files.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.summary.total_lines.toLocaleString()} lines of
                code
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Primary Language
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.summary.primary_language}
              </div>
              <p className="text-xs text-muted-foreground">
                Most active: {analyticsData?.summary.most_active_day}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Commit Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Commit Trends</CardTitle>
                  <CardDescription>
                    Daily commit activity over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData?.commits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Code Changes */}
              <Card>
                <CardHeader>
                  <CardTitle>Code Changes</CardTitle>
                  <CardDescription>
                    Additions vs deletions over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData?.commits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="additions" fill="#00C49F" />
                      <Bar dataKey="deletions" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Development Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Development Trends</CardTitle>
                <CardDescription>
                  Commits, issues, and pull requests over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData?.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="issues"
                      stroke="#00C49F"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="prs"
                      stroke="#FFBB28"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contributor Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Contributor Activity</CardTitle>
                  <CardDescription>Commits by contributor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={analyticsData?.contributors}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="commits" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Contributor Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contributor Details</CardTitle>
                  <CardDescription>
                    Detailed contributor statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.contributors.map((contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{contributor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contributor.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {contributor.commits} commits
                          </p>
                          <p className="text-sm text-muted-foreground">
                            +{contributor.additions} -{contributor.deletions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>
                    Programming languages used in the repository
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData?.languages}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ language, percentage }) =>
                          `${language} ${percentage}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {analyticsData?.languages.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Language Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Statistics</CardTitle>
                  <CardDescription>Detailed language breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.languages.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <div>
                            <p className="font-medium">{language.language}</p>
                            <p className="text-sm text-muted-foreground">
                              {language.files} files
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{language.percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {language.lines.toLocaleString()} lines
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity Pattern</CardTitle>
                <CardDescription>
                  When contributors are most active throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData?.activity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="commits" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;
