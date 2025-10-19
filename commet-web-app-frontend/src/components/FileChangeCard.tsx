import React, { useState } from "react";
import { FileText, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { FileChangeCardProps } from "../types/index.js";
import { getFileExtension, getFileTypeIcon, formatNumber } from "../utils";

const FileChangeCard: React.FC<FileChangeCardProps> = ({
  fileChange,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileIcon = getFileTypeIcon(fileChange.filename);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "bg-green-500/20 text-green-400";
      case "removed":
        return "bg-red-500/20 text-red-400";
      case "modified":
        return "bg-yellow-500/20 text-yellow-400";
      case "renamed":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getLanguage = (filename: string) => {
    const ext = getFileExtension(filename);
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
      html: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      md: "markdown",
      sql: "sql",
      sh: "bash",
      dockerfile: "dockerfile",
    };
    return languageMap[ext] || "text";
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* File header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-sm">{fileIcon}</span>
            <span className="text-sm font-medium text-foreground truncate">
              {fileChange.filename}
            </span>
            {fileChange.previous_filename && (
              <span className="text-xs text-muted-foreground">
                (renamed from {fileChange.previous_filename})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                fileChange.status
              )}`}
            >
              {fileChange.status}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded transition-colors duration-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* File stats */}
        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Plus className="h-3 w-3 text-green-500" />
            <span className="text-green-400">
              +{formatNumber(fileChange.additions)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Minus className="h-3 w-3 text-red-500" />
            <span className="text-red-400">
              -{formatNumber(fileChange.deletions)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{formatNumber(fileChange.changes)} changes</span>
          </div>
        </div>
      </div>

      {/* Code diff */}
      {isExpanded && fileChange.patch && (
        <div className="border-t border-border">
          <div className="p-3">
            <h4 className="text-xs font-medium text-foreground mb-2">
              Code Changes
            </h4>
            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={getLanguage(fileChange.filename)}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: "1.4",
                }}
                showLineNumbers={true}
                wrapLines={true}
                wrapLongLines={true}
              >
                {fileChange.patch}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileChangeCard;
