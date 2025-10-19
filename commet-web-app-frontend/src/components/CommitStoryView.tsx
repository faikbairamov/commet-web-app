import React, { useState } from "react";
import {
  BookOpen,
  GitBranch,
  Star,
  GitFork,
  Calendar,
  Code2,
  RefreshCw,
  Copy,
  Check,
  Settings,
} from "lucide-react";
import type { CommitStoryResponse } from "../types/index.js";
import { formatRelativeTime, formatNumber } from "../utils";

interface CommitStoryViewProps {
  storyData: CommitStoryResponse;
  onRegenerate: (style: "narrative" | "technical" | "casual") => void;
  isLoading?: boolean;
  className?: string;
}

const CommitStoryView: React.FC<CommitStoryViewProps> = ({
  storyData,
  onRegenerate,
  isLoading = false,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<
    "narrative" | "technical" | "casual"
  >(storyData.story_style as "narrative" | "technical" | "casual");

  const handleCopyStory = async () => {
    try {
      await navigator.clipboard.writeText(storyData.story);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy story:", err);
    }
  };

  const handleRegenerate = () => {
    onRegenerate(selectedStyle);
    setShowSettings(false);
  };

  const getStyleDescription = (style: string) => {
    switch (style) {
      case "narrative":
        return "An engaging story that tells the journey of development";
      case "technical":
        return "A technical analysis focusing on patterns and decisions";
      case "casual":
        return "A friendly, conversational explanation";
      default:
        return "An engaging story about the project's development";
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case "narrative":
        return <BookOpen className="w-4 h-4" />;
      case "technical":
        return <Code2 className="w-4 h-4" />;
      case "casual":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                {storyData.repository_info.name} - Development Story
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {storyData.repository_info.description ||
                "No description available"}
            </p>

            {/* Repository Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <GitBranch className="h-4 w-4" />
                <span>{storyData.branch}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{formatNumber(storyData.repository_info.stars)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="h-4 w-4" />
                <span>{formatNumber(storyData.repository_info.forks)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Code2 className="h-4 w-4" />
                <span>{storyData.repository_info.language || "Mixed"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatRelativeTime(storyData.repository_info.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              <Settings className="w-4 h-4 mr-2" />
              Style
            </button>
            <button
              onClick={handleCopyStory}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Story Style Info */}
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          {getStyleIcon(storyData.story_style)}
          <span className="text-sm font-medium text-foreground">
            {storyData.story_style.charAt(0).toUpperCase() +
              storyData.story_style.slice(1)}{" "}
            Style
          </span>
          <span className="text-sm text-muted-foreground">
            - {getStyleDescription(storyData.story_style)}
          </span>
        </div>
      </div>

      {/* Style Settings Panel */}
      {showSettings && (
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Choose Story Style
          </h3>
          <div className="space-y-3">
            {[
              {
                value: "narrative",
                label: "Narrative",
                description: "Engaging story with characters and plot",
              },
              {
                value: "technical",
                label: "Technical",
                description: "Deep analysis of patterns and decisions",
              },
              {
                value: "casual",
                label: "Casual",
                description: "Friendly, conversational explanation",
              },
            ].map((style) => (
              <label
                key={style.value}
                className="flex items-start space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="storyStyle"
                  value={style.value}
                  checked={selectedStyle === style.value}
                  onChange={(e) =>
                    setSelectedStyle(
                      e.target.value as "narrative" | "technical" | "casual"
                    )
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {style.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {style.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRegenerate}
              className="btn-primary text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Story Content */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">The Story</h3>
          <div className="text-sm text-muted-foreground">
            Based on {storyData.total_commits_analyzed} commits
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {storyData.story}
            </div>
          </div>
        )}
      </div>

      {/* Commit Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Commit Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {storyData.total_commits_analyzed}
            </div>
            <div className="text-sm text-muted-foreground">
              Commits Analyzed
            </div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {storyData.repository_info.language || "Mixed"}
            </div>
            <div className="text-sm text-muted-foreground">
              Primary Language
            </div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {formatRelativeTime(storyData.repository_info.updated_at)}
            </div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitStoryView;
