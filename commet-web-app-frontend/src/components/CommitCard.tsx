import React, { useState } from "react";
import {
  User,
  Calendar,
  Code2,
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import type { CommitCardProps } from "../types/index.js";
import {
  formatCommitMessage,
  getCommitType,
  formatRelativeTime,
  formatNumber,
} from "../utils";
import FileChangeCard from "./FileChangeCard";

const CommitCard: React.FC<CommitCardProps> = ({
  commit,
  showDetails = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const commitType = getCommitType(commit.message);
  const shortSha = commit.sha.substring(0, 7);

  return (
    <div className={`card p-4 ${className}`}>
      {/* Commit header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${commitType.color} bg-opacity-10`}
            >
              {commitType.type}
            </span>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              {shortSha}
            </span>
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            {formatCommitMessage(commit.message)}
          </h3>
        </div>
      </div>

      {/* Commit metadata */}
      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>{commit.author.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{formatRelativeTime(commit.author.date)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center space-x-1 text-xs">
          <Plus className="h-3 w-3 text-green-500" />
          <span className="text-green-400">
            +{formatNumber(commit.stats.additions)}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <Minus className="h-3 w-3 text-red-500" />
          <span className="text-red-400">
            -{formatNumber(commit.stats.deletions)}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <Code2 className="h-3 w-3 text-gray-500" />
          <span className="text-muted-foreground">
            {formatNumber(commit.stats.total)} changes
          </span>
        </div>
      </div>

      {/* File changes preview */}
      {commit.file_changes && commit.file_changes.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
            <FileText className="h-3 w-3" />
            <span>
              {commit.file_changes.length} file
              {commit.file_changes.length !== 1 ? "s" : ""} changed
            </span>
          </div>

          {/* Show first few files */}
          <div className="space-y-1">
            {commit.file_changes.slice(0, 3).map((fileChange, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span
                  className={`px-1 py-0.5 rounded text-xs font-medium ${
                    fileChange.status === "added"
                      ? "bg-green-500/20 text-green-400"
                      : fileChange.status === "removed"
                      ? "bg-red-500/20 text-red-400"
                      : fileChange.status === "modified"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {fileChange.status}
                </span>
                <span className="text-muted-foreground truncate">
                  {fileChange.filename}
                </span>
              </div>
            ))}
            {commit.file_changes.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{commit.file_changes.length - 3} more files
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expandable details */}
      {commit.file_changes && commit.file_changes.length > 0 && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span>{isExpanded ? "Hide" : "Show"} file changes</span>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {commit.file_changes.map((fileChange, index) => (
                <FileChangeCard
                  key={index}
                  fileChange={fileChange}
                  className="text-xs"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex space-x-2">
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center text-xs py-2"
          >
            View Commit
          </a>
          {commit.api_url && (
            <a
              href={commit.api_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2"
            >
              API
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitCard;
