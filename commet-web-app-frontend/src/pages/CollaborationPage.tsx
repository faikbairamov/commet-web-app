import React, { useState, useEffect, useRef } from "react";
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
  Users,
  MessageCircle,
  Bell,
  Activity,
  GitBranch,
  Clock,
  Send,
  Video,
  UserPlus,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CollaborationData {
  repository: string;
  active_users: ActiveUser[];
  recent_activity: Activity[];
  team_discussions: Discussion[];
  notifications: Notification[];
  live_sessions: LiveSession[];
  shared_resources: SharedResource[];
  team_metrics: TeamMetrics;
}

interface ActiveUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  status: "online" | "away" | "busy" | "offline";
  current_file?: string;
  current_branch?: string;
  last_seen: string;
  role: "admin" | "developer" | "reviewer" | "viewer";
  timezone: string;
}

interface Activity {
  id: string;
  user: ActiveUser;
  type: "commit" | "review" | "comment" | "merge" | "issue" | "discussion";
  title: string;
  description: string;
  timestamp: string;
  repository: string;
  branch?: string;
  file_path?: string;
  metadata?: any;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  author: ActiveUser;
  created_at: string;
  updated_at: string;
  participants: ActiveUser[];
  messages: Message[];
  status: "open" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  tags: string[];
}

interface Message {
  id: string;
  author: ActiveUser;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  replies: Message[];
  edited: boolean;
  attachments?: Attachment[];
}

interface Reaction {
  emoji: string;
  users: ActiveUser[];
  count: number;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Notification {
  id: string;
  type:
    | "mention"
    | "review_request"
    | "commit"
    | "merge"
    | "issue"
    | "discussion";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
  from_user?: ActiveUser;
}

interface LiveSession {
  id: string;
  title: string;
  host: ActiveUser;
  participants: ActiveUser[];
  start_time: string;
  duration: number;
  type: "code_review" | "planning" | "debugging" | "pair_programming";
  status: "scheduled" | "active" | "ended";
  recording_url?: string;
}

interface SharedResource {
  id: string;
  name: string;
  type: "file" | "folder" | "link" | "document";
  shared_by: ActiveUser;
  shared_at: string;
  access_level: "view" | "edit" | "admin";
  url: string;
  size?: number;
  description?: string;
}

interface TeamMetrics {
  total_commits: number;
  active_contributors: number;
  pull_requests: number;
  code_reviews: number;
  discussions: number;
  response_time: number;
  collaboration_score: number;
}

const CollaborationPage: React.FC = () => {
  const {} = useApp();
  const [collaborationData, setCollaborationData] =
    useState<CollaborationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(
    null
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockCollaborationData: CollaborationData = {
    repository: "microsoft/vscode",
    active_users: [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar_url: "https://github.com/johndoe.png",
        status: "online",
        current_file: "src/editor.ts",
        current_branch: "feature/new-editor",
        last_seen: "2024-01-15T10:30:00Z",
        role: "developer",
        timezone: "UTC-8",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar_url: "https://github.com/janesmith.png",
        status: "away",
        current_file: "src/debugger.ts",
        current_branch: "main",
        last_seen: "2024-01-15T10:25:00Z",
        role: "reviewer",
        timezone: "UTC-5",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        avatar_url: "https://github.com/bobjohnson.png",
        status: "busy",
        current_file: "src/terminal.ts",
        current_branch: "bugfix/terminal-crash",
        last_seen: "2024-01-15T10:20:00Z",
        role: "developer",
        timezone: "UTC+1",
      },
    ],
    recent_activity: [
      {
        id: "1",
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar_url: "https://github.com/johndoe.png",
          status: "online",
          last_seen: "2024-01-15T10:30:00Z",
          role: "developer",
          timezone: "UTC-8",
        },
        type: "commit",
        title: "Added new editor features",
        description: "Implemented syntax highlighting and auto-completion",
        timestamp: "2024-01-15T10:30:00Z",
        repository: "microsoft/vscode",
        branch: "feature/new-editor",
        file_path: "src/editor.ts",
      },
      {
        id: "2",
        user: {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          avatar_url: "https://github.com/janesmith.png",
          status: "away",
          last_seen: "2024-01-15T10:25:00Z",
          role: "reviewer",
          timezone: "UTC-5",
        },
        type: "review",
        title: "Reviewed PR #1234",
        description: "Approved with minor suggestions",
        timestamp: "2024-01-15T10:25:00Z",
        repository: "microsoft/vscode",
      },
    ],
    team_discussions: [
      {
        id: "1",
        title: "New Editor Architecture Discussion",
        description:
          "Let's discuss the proposed changes to the editor architecture",
        author: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar_url: "https://github.com/johndoe.png",
          status: "online",
          last_seen: "2024-01-15T10:30:00Z",
          role: "developer",
          timezone: "UTC-8",
        },
        created_at: "2024-01-15T09:00:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        participants: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            avatar_url: "https://github.com/johndoe.png",
            status: "online",
            last_seen: "2024-01-15T10:30:00Z",
            role: "developer",
            timezone: "UTC-8",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            avatar_url: "https://github.com/janesmith.png",
            status: "away",
            last_seen: "2024-01-15T10:25:00Z",
            role: "reviewer",
            timezone: "UTC-5",
          },
        ],
        messages: [
          {
            id: "1",
            author: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              avatar_url: "https://github.com/johndoe.png",
              status: "online",
              last_seen: "2024-01-15T10:30:00Z",
              role: "developer",
              timezone: "UTC-8",
            },
            content:
              "I've been working on the new editor architecture. What do you think about using a plugin-based approach?",
            timestamp: "2024-01-15T09:00:00Z",
            reactions: [
              { emoji: "👍", users: [], count: 2 },
              { emoji: "💡", users: [], count: 1 },
            ],
            replies: [],
            edited: false,
          },
          {
            id: "2",
            author: {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              avatar_url: "https://github.com/janesmith.png",
              status: "away",
              last_seen: "2024-01-15T10:25:00Z",
              role: "reviewer",
              timezone: "UTC-5",
            },
            content:
              "That sounds great! A plugin-based approach would make it much more extensible. Have you considered the performance implications?",
            timestamp: "2024-01-15T09:15:00Z",
            reactions: [{ emoji: "👍", users: [], count: 1 }],
            replies: [],
            edited: false,
          },
        ],
        status: "open",
        priority: "high",
        tags: ["architecture", "editor", "performance"],
      },
    ],
    notifications: [
      {
        id: "1",
        type: "mention",
        title: "You were mentioned in a discussion",
        message:
          "John Doe mentioned you in 'New Editor Architecture Discussion'",
        timestamp: "2024-01-15T10:30:00Z",
        read: false,
        action_url: "/discussions/1",
        from_user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar_url: "https://github.com/johndoe.png",
          status: "online",
          last_seen: "2024-01-15T10:30:00Z",
          role: "developer",
          timezone: "UTC-8",
        },
      },
      {
        id: "2",
        type: "review_request",
        title: "Review requested for PR #1234",
        message:
          "Jane Smith requested your review for 'Fix terminal crash bug'",
        timestamp: "2024-01-15T10:25:00Z",
        read: true,
        action_url: "/pr/1234",
      },
    ],
    live_sessions: [
      {
        id: "1",
        title: "Code Review Session",
        host: {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          avatar_url: "https://github.com/janesmith.png",
          status: "away",
          last_seen: "2024-01-15T10:25:00Z",
          role: "reviewer",
          timezone: "UTC-5",
        },
        participants: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            avatar_url: "https://github.com/johndoe.png",
            status: "online",
            last_seen: "2024-01-15T10:30:00Z",
            role: "developer",
            timezone: "UTC-8",
          },
        ],
        start_time: "2024-01-15T11:00:00Z",
        duration: 60,
        type: "code_review",
        status: "scheduled",
      },
    ],
    shared_resources: [
      {
        id: "1",
        name: "Editor Architecture Design",
        type: "document",
        shared_by: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar_url: "https://github.com/johndoe.png",
          status: "online",
          last_seen: "2024-01-15T10:30:00Z",
          role: "developer",
          timezone: "UTC-8",
        },
        shared_at: "2024-01-15T09:00:00Z",
        access_level: "edit",
        url: "/documents/editor-architecture.pdf",
        size: 2048000,
        description: "Detailed design document for the new editor architecture",
      },
    ],
    team_metrics: {
      total_commits: 156,
      active_contributors: 8,
      pull_requests: 23,
      code_reviews: 45,
      discussions: 12,
      response_time: 2.5,
      collaboration_score: 87,
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitBranch className="h-4 w-4" />;
      case "review":
        return <CheckCircle className="h-4 w-4" />;
      case "comment":
        return <MessageCircle className="h-4 w-4" />;
      case "merge":
        return <GitBranch className="h-4 w-4" />;
      case "issue":
        return <AlertCircle className="h-4 w-4" />;
      case "discussion":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "commit":
        return "text-green-500";
      case "review":
        return "text-blue-500";
      case "comment":
        return "text-purple-500";
      case "merge":
        return "text-orange-500";
      case "issue":
        return "text-red-500";
      case "discussion":
        return "text-indigo-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    loadCollaborationData();
  }, [selectedRepo]);

  const loadCollaborationData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCollaborationData(mockCollaborationData);
    } catch (err) {
      setError("Failed to load collaboration data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDiscussion) return;

    // Simulate sending message
    console.log("Sending message:", newMessage);
    setNewMessage("");
    setIsTyping(false);
  };

  const handleJoinSession = (sessionId: string) => {
    console.log("Joining session:", sessionId);
    // Implement session joining logic
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [collaborationData?.team_discussions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading collaboration data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadCollaborationData} variant="outline">
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
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Team Collaboration
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time collaboration, discussions, and team coordination
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team
            </Button>
            <Button onClick={loadCollaborationData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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

        {/* Team Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Contributors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborationData?.team_metrics.active_contributors}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  collaborationData?.active_users.filter(
                    (u) => u.status === "online"
                  ).length
                }{" "}
                online now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Collaboration Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborationData?.team_metrics.collaboration_score}/100
              </div>
              <p className="text-xs text-muted-foreground">
                Avg response time:{" "}
                {collaborationData?.team_metrics.response_time}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Discussions
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborationData?.team_discussions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  collaborationData?.team_discussions.filter(
                    (d) => d.status === "open"
                  ).length
                }{" "}
                open
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Live Sessions
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborationData?.live_sessions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  collaborationData?.live_sessions.filter(
                    (s) => s.status === "active"
                  ).length
                }{" "}
                active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Tabs */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Team Members</CardTitle>
                  <CardDescription>
                    Currently active contributors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborationData?.active_users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage
                                src={user.avatar_url}
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                                user.status
                              )} rounded-full border-2 border-background`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {user.current_file}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.current_branch}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Latest team notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {collaborationData?.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg ${
                            !notification.read
                              ? "bg-primary/5 border border-primary/20"
                              : ""
                          }`}
                        >
                          <Bell
                            className={`h-4 w-4 mt-1 ${
                              !notification.read
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(
                                notification.timestamp
                              ).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Shared Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Shared Resources</CardTitle>
                <CardDescription>
                  Files and documents shared by the team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collaborationData?.shared_resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Shared by {resource.shared_by.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(resource.shared_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Discussions List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Discussions</CardTitle>
                    <CardDescription>Active team conversations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {collaborationData?.team_discussions.map((discussion) => (
                        <div
                          key={discussion.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedDiscussion === discussion.id
                              ? "bg-primary/5 border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedDiscussion(discussion.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {discussion.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {discussion.author.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {discussion.priority}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {discussion.messages.length} messages
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {discussion.participants
                                .slice(0, 3)
                                .map((participant) => (
                                  <Avatar
                                    key={participant.id}
                                    className="w-6 h-6"
                                  >
                                    <AvatarImage
                                      src={participant.avatar_url}
                                      alt={participant.name}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {participant.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              {discussion.participants.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{discussion.participants.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Discussion Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {collaborationData?.team_discussions.find(
                        (d) => d.id === selectedDiscussion
                      )?.title || "Select a discussion"}
                    </CardTitle>
                    <CardDescription>
                      {
                        collaborationData?.team_discussions.find(
                          (d) => d.id === selectedDiscussion
                        )?.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {selectedDiscussion ? (
                      <>
                        <ScrollArea className="flex-1 mb-4">
                          <div className="space-y-4">
                            {collaborationData?.team_discussions
                              .find((d) => d.id === selectedDiscussion)
                              ?.messages.map((message) => (
                                <div
                                  key={message.id}
                                  className="flex items-start space-x-3"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={message.author.avatar_url}
                                      alt={message.author.name}
                                    />
                                    <AvatarFallback>
                                      {message.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-medium text-sm">
                                        {message.author.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          message.timestamp
                                        ).toLocaleString()}
                                      </p>
                                      {message.edited && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          edited
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm">{message.content}</p>
                                    {message.reactions.length > 0 && (
                                      <div className="flex items-center space-x-2 mt-2">
                                        {message.reactions.map(
                                          (reaction, index) => (
                                            <Button
                                              key={index}
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2"
                                            >
                                              <span className="mr-1">
                                                {reaction.emoji}
                                              </span>
                                              <span className="text-xs">
                                                {reaction.count}
                                              </span>
                                            </Button>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value);
                              setIsTyping(true);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        {isTyping && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Typing...
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a discussion to view messages
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Team Activity</CardTitle>
                <CardDescription>
                  Latest actions and updates from team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborationData?.recent_activity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">
                            {activity.user.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.file_path && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📁 {activity.file_path}
                            {activity.branch && ` • 🌿 ${activity.branch}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborationData?.live_sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge
                        variant={
                          session.status === "active" ? "default" : "secondary"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Hosted by {session.host.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {session.type.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(session.start_time).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {session.participants.length} participants
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinSession(session.id)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        {session.recording_url && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollaborationPage;
