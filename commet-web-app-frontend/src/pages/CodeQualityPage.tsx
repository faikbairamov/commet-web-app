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
import { Badge } from "@/components/ui/badge";
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
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Code,
  FileText,
  Clock,
  TrendingUp,
  RefreshCw,
  Download,
  ExternalLink,
  Copy,
  Star,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodeQualityData {
  repository: string;
  overall_score: number;
  last_analyzed: string;
  issues: QualityIssue[];
  metrics: QualityMetrics;
  recommendations: QualityRecommendation[];
  trends: QualityTrend[];
  security: SecurityAnalysis;
  performance: PerformanceAnalysis;
  maintainability: MaintainabilityAnalysis;
}

interface QualityIssue {
  id: string;
  type: "error" | "warning" | "info" | "security";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  file_path: string;
  line_number: number;
  rule_id: string;
  category: string;
  fix_suggestion: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
}

interface QualityMetrics {
  code_coverage: number;
  cyclomatic_complexity: number;
  technical_debt: number;
  code_duplication: number;
  maintainability_index: number;
  lines_of_code: number;
  functions: number;
  classes: number;
  files: number;
  test_coverage: number;
  documentation_coverage: number;
}

interface QualityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  impact: string;
  effort: string;
  examples: string[];
}

interface QualityTrend {
  date: string;
  score: number;
  issues: number;
  coverage: number;
  debt: number;
}

interface SecurityAnalysis {
  vulnerabilities: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  security_score: number;
  recommendations: string[];
}

interface PerformanceAnalysis {
  performance_score: number;
  bottlenecks: string[];
  optimization_opportunities: string[];
  recommendations: string[];
}

interface MaintainabilityAnalysis {
  maintainability_score: number;
  complexity_issues: number;
  documentation_issues: number;
  naming_issues: number;
  recommendations: string[];
}

const CodeQualityPage: React.FC = () => {
  const {} = useApp();
  const [qualityData, setQualityData] = useState<CodeQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for demonstration
  const mockQualityData: CodeQualityData = {
    repository: "microsoft/vscode",
    overall_score: 78,
    last_analyzed: "2024-01-15T10:30:00Z",
    issues: [
      {
        id: "1",
        type: "security",
        severity: "high",
        title: "Potential SQL Injection",
        description:
          "User input is directly concatenated into SQL query without proper sanitization.",
        file_path: "src/auth/user.py",
        line_number: 45,
        rule_id: "SEC001",
        category: "Security",
        fix_suggestion: "Use parameterized queries or prepared statements",
        effort: "medium",
        impact: "high",
      },
      {
        id: "2",
        type: "warning",
        severity: "medium",
        title: "Complex Function",
        description:
          "Function has high cyclomatic complexity (15). Consider breaking it down into smaller functions.",
        file_path: "src/utils/processor.js",
        line_number: 120,
        rule_id: "COMP001",
        category: "Complexity",
        fix_suggestion: "Extract smaller functions and reduce nesting",
        effort: "high",
        impact: "medium",
      },
      {
        id: "3",
        type: "error",
        severity: "medium",
        title: "Unused Variable",
        description: "Variable 'tempData' is declared but never used.",
        file_path: "src/components/DataTable.tsx",
        line_number: 67,
        rule_id: "UNUSED001",
        category: "Code Style",
        fix_suggestion: "Remove unused variable or use it in the code",
        effort: "low",
        impact: "low",
      },
      {
        id: "4",
        type: "info",
        severity: "low",
        title: "Missing Documentation",
        description:
          "Function 'calculateMetrics' lacks proper JSDoc documentation.",
        file_path: "src/analytics/metrics.js",
        line_number: 23,
        rule_id: "DOC001",
        category: "Documentation",
        fix_suggestion: "Add comprehensive JSDoc comments",
        effort: "low",
        impact: "low",
      },
    ],
    metrics: {
      code_coverage: 85,
      cyclomatic_complexity: 12.5,
      technical_debt: 24,
      code_duplication: 8.2,
      maintainability_index: 78,
      lines_of_code: 125000,
      functions: 2500,
      classes: 450,
      files: 1200,
      test_coverage: 85,
      documentation_coverage: 65,
    },
    recommendations: [
      {
        id: "1",
        title: "Improve Test Coverage",
        description:
          "Increase test coverage from 85% to 90% by adding unit tests for edge cases.",
        priority: "high",
        category: "Testing",
        impact: "Reduces bugs and improves code reliability",
        effort: "2-3 weeks",
        examples: [
          "Add tests for error handling",
          "Test boundary conditions",
          "Add integration tests",
        ],
      },
      {
        id: "2",
        title: "Reduce Code Duplication",
        description:
          "Refactor duplicated code into reusable components and utilities.",
        priority: "medium",
        category: "Maintainability",
        impact: "Easier maintenance and fewer bugs",
        effort: "1-2 weeks",
        examples: [
          "Extract common validation logic",
          "Create shared utility functions",
          "Use design patterns",
        ],
      },
      {
        id: "3",
        title: "Improve Documentation",
        description:
          "Add comprehensive documentation for public APIs and complex functions.",
        priority: "medium",
        category: "Documentation",
        impact: "Better developer experience and onboarding",
        effort: "1 week",
        examples: [
          "Add API documentation",
          "Document complex algorithms",
          "Create usage examples",
        ],
      },
    ],
    trends: [
      { date: "2024-01-01", score: 75, issues: 45, coverage: 82, debt: 28 },
      { date: "2024-01-02", score: 76, issues: 43, coverage: 83, debt: 27 },
      { date: "2024-01-03", score: 77, issues: 41, coverage: 84, debt: 26 },
      { date: "2024-01-04", score: 78, issues: 38, coverage: 85, debt: 24 },
      { date: "2024-01-05", score: 78, issues: 35, coverage: 85, debt: 24 },
    ],
    security: {
      vulnerabilities: 3,
      high_risk: 1,
      medium_risk: 2,
      low_risk: 0,
      security_score: 85,
      recommendations: [
        "Implement input validation for all user inputs",
        "Use HTTPS for all API communications",
        "Add rate limiting to prevent abuse",
        "Regular security audits and dependency updates",
      ],
    },
    performance: {
      performance_score: 82,
      bottlenecks: [
        "Database queries without proper indexing",
        "Large file processing without streaming",
        "Inefficient regex patterns in text processing",
      ],
      optimization_opportunities: [
        "Implement database query optimization",
        "Add caching for frequently accessed data",
        "Optimize image processing algorithms",
      ],
      recommendations: [
        "Add database indexes for frequently queried fields",
        "Implement Redis caching for session data",
        "Use CDN for static assets",
        "Optimize bundle size with code splitting",
      ],
    },
    maintainability: {
      maintainability_score: 75,
      complexity_issues: 12,
      documentation_issues: 8,
      naming_issues: 5,
      recommendations: [
        "Refactor complex functions into smaller, focused functions",
        "Improve variable and function naming conventions",
        "Add comprehensive inline documentation",
        "Implement consistent code formatting standards",
      ],
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  useEffect(() => {
    loadQualityData();
  }, [selectedRepo]);

  const loadQualityData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQualityData(mockQualityData);
    } catch (err) {
      setError("Failed to load code quality data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!qualityData) return;

    const report = {
      repository: qualityData.repository,
      overall_score: qualityData.overall_score,
      last_analyzed: qualityData.last_analyzed,
      summary: {
        total_issues: qualityData.issues.length,
        critical_issues: qualityData.issues.filter(
          (i) => i.severity === "critical"
        ).length,
        high_issues: qualityData.issues.filter((i) => i.severity === "high")
          .length,
        medium_issues: qualityData.issues.filter((i) => i.severity === "medium")
          .length,
        low_issues: qualityData.issues.filter((i) => i.severity === "low")
          .length,
      },
      metrics: qualityData.metrics,
      recommendations: qualityData.recommendations,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code-quality-report-${qualityData.repository}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues =
    qualityData?.issues.filter((issue) => {
      if (selectedSeverity !== "all" && issue.severity !== selectedSeverity)
        return false;
      if (selectedCategory !== "all" && issue.category !== selectedCategory)
        return false;
      return true;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Analyzing code quality...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadQualityData} variant="outline">
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Code Quality Insights
                </h1>
                <p className="text-muted-foreground mt-2">
                  Automated code analysis, security scanning, and quality
                  recommendations
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={handleExportReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={loadQualityData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
          </div>
        </div>

        {/* Repository Input */}
        <div className="mb-8">
          <Input
            placeholder="Enter repository (owner/repo)"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Score
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  qualityData?.overall_score || 0
                )}`}
              >
                {qualityData?.overall_score}/100
              </div>
              <Progress
                value={qualityData?.overall_score || 0}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  qualityData?.security.security_score || 0
                )}`}
              >
                {qualityData?.security.security_score}/100
              </div>
              <p className="text-xs text-muted-foreground">
                {qualityData?.security.vulnerabilities} vulnerabilities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  qualityData?.performance.performance_score || 0
                )}`}
              >
                {qualityData?.performance.performance_score}/100
              </div>
              <p className="text-xs text-muted-foreground">
                {qualityData?.performance.bottlenecks.length} bottlenecks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Maintainability
              </CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  qualityData?.maintainability.maintainability_score || 0
                )}`}
              >
                {qualityData?.maintainability.maintainability_score}/100
              </div>
              <p className="text-xs text-muted-foreground">
                {qualityData?.maintainability.complexity_issues} complexity
                issues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Test Coverage
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityData?.metrics.test_coverage}%
              </div>
              <Progress
                value={qualityData?.metrics.test_coverage || 0}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Code Duplication
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityData?.metrics.code_duplication}%
              </div>
              <p className="text-xs text-muted-foreground">
                {qualityData?.metrics.lines_of_code.toLocaleString()} lines of
                code
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Technical Debt
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityData?.metrics.technical_debt}h
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated remediation time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complexity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityData?.metrics.cyclomatic_complexity}
              </div>
              <p className="text-xs text-muted-foreground">
                Average per function
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Analysis Tabs */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Complexity">Complexity</SelectItem>
                  <SelectItem value="Code Style">Code Style</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Issues List */}
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card
                  key={issue.id}
                  className="border-l-4"
                  style={{ borderLeftColor: getSeverityColor(issue.severity) }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(issue.type)}
                        <div>
                          <CardTitle className="text-lg">
                            {issue.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={getSeverityColor(issue.severity)}
                            >
                              {issue.severity}
                            </Badge>
                            <Badge variant="secondary">{issue.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {issue.file_path}:{issue.line_number}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Effort: {issue.effort}</Badge>
                        <Badge variant="outline">Impact: {issue.impact}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {issue.description}
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Fix Suggestion:</h4>
                      <p className="text-sm">{issue.fix_suggestion}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View in IDE
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Rule ID
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rule: {issue.rule_id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {qualityData?.recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant="outline"
                            className={getSeverityColor(rec.priority)}
                          >
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="secondary">{rec.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {rec.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Impact:</h4>
                        <p className="text-sm text-muted-foreground">
                          {rec.impact}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Effort:</h4>
                        <p className="text-sm text-muted-foreground">
                          {rec.effort}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Examples:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {rec.examples.map((example, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Overview</CardTitle>
                  <CardDescription>
                    Current security status and vulnerabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>High Risk</span>
                      <Badge variant="destructive">
                        {qualityData?.security.high_risk}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Medium Risk</span>
                      <Badge variant="secondary">
                        {qualityData?.security.medium_risk}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Low Risk</span>
                      <Badge variant="outline">
                        {qualityData?.security.low_risk}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>
                    Actionable security improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {qualityData?.security.recommendations.map((rec, index) => (
                      <Alert key={index}>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
                <CardDescription>
                  Code quality metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityData?.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(trend.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trend.issues} issues, {trend.coverage}% coverage
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            trend.score
                          )}`}
                        >
                          {trend.score}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trend.debt}h debt
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CodeQualityPage;
