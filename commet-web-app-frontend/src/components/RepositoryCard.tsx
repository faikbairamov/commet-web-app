import React from "react";
import { Star, GitFork, Eye, Calendar, Code2, Globe, Lock } from "lucide-react";
import type { RepositoryCardProps } from "../types/index.js";
import { formatNumber, formatRelativeTime, getLanguageColor } from "../utils";

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  className = "",
}) => {
  const languageColor = getLanguageColor(repository.language);

  return (
    <div className={`card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {repository.name}
            </h3>
            {repository.is_private ? (
              <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {repository.full_name}
          </p>
          {repository.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {repository.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            {formatNumber(repository.stars)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <GitFork className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-muted-foreground">
            {formatNumber(repository.forks)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">
            {formatNumber(repository.watchers)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Code2 className="h-4 w-4 text-red-500" />
          <span className="text-sm text-muted-foreground">
            {formatNumber(repository.open_issues)}
          </span>
        </div>
      </div>

      {/* Language and dates */}
      <div className="space-y-3">
        {/* Primary language */}
        {repository.language && (
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span className="text-sm text-muted-foreground">
              {repository.language}
            </span>
          </div>
        )}

        {/* Languages breakdown */}
        {Object.keys(repository.languages).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Languages
            </h4>
            <div className="space-y-1">
              {Object.entries(repository.languages)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([lang, percentage]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getLanguageColor(lang) }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {lang}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created {formatRelativeTime(repository.created_at)}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatRelativeTime(repository.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex space-x-3">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center"
          >
            View on GitHub
          </a>
          <a
            href={repository.clone_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Clone
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
