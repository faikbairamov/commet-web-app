// Utility functions for the application

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

// Get language color for syntax highlighting
export const getLanguageColor = (language: string): string => {
  const colors: { [key: string]: string } = {
    javascript: "#f7df1e",
    typescript: "#3178c6",
    python: "#3776ab",
    java: "#ed8b00",
    cpp: "#00599c",
    c: "#a8b9cc",
    csharp: "#239120",
    php: "#777bb4",
    ruby: "#cc342d",
    go: "#00add8",
    rust: "#000000",
    swift: "#fa7343",
    kotlin: "#7f52ff",
    html: "#e34f26",
    css: "#1572b6",
    scss: "#cf649a",
    sass: "#cf649a",
    less: "#1d365d",
    json: "#000000",
    yaml: "#cb171e",
    yml: "#cb171e",
    xml: "#005faf",
    markdown: "#083fa1",
    sql: "#336791",
    shell: "#89e051",
    bash: "#89e051",
    powershell: "#012456",
    dockerfile: "#2496ed",
    default: "#6b7280",
  };

  return colors[language.toLowerCase()] || colors.default;
};

// Get file type icon
export const getFileTypeIcon = (filename: string): string => {
  const extension = getFileExtension(filename);

  const icons: { [key: string]: string } = {
    js: "📄",
    ts: "📘",
    jsx: "⚛️",
    tsx: "⚛️",
    py: "🐍",
    java: "☕",
    cpp: "⚙️",
    c: "⚙️",
    cs: "🔷",
    php: "🐘",
    rb: "💎",
    go: "🐹",
    rs: "🦀",
    swift: "🦉",
    kt: "🟣",
    html: "🌐",
    css: "🎨",
    scss: "🎨",
    sass: "🎨",
    less: "🎨",
    json: "📋",
    yaml: "📝",
    yml: "📝",
    xml: "📄",
    md: "📖",
    sql: "🗄️",
    sh: "💻",
    bash: "💻",
    ps1: "💻",
    dockerfile: "🐳",
    default: "📄",
  };

  return icons[extension] || icons.default;
};

// Format commit message for display
export const formatCommitMessage = (message: string): string => {
  // Split by newline and take first line
  const firstLine = message.split("\n")[0];
  return truncateText(firstLine, 80);
};

// Get commit type from message
export const getCommitType = (
  message: string
): { type: string; color: string } => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.startsWith("feat")) {
    return { type: "feat", color: "text-green-600" };
  } else if (lowerMessage.startsWith("fix")) {
    return { type: "fix", color: "text-red-600" };
  } else if (lowerMessage.startsWith("docs")) {
    return { type: "docs", color: "text-blue-600" };
  } else if (lowerMessage.startsWith("style")) {
    return { type: "style", color: "text-purple-600" };
  } else if (lowerMessage.startsWith("refactor")) {
    return { type: "refactor", color: "text-yellow-600" };
  } else if (lowerMessage.startsWith("test")) {
    return { type: "test", color: "text-indigo-600" };
  } else if (lowerMessage.startsWith("chore")) {
    return { type: "chore", color: "text-gray-600" };
  } else {
    return { type: "other", color: "text-gray-500" };
  }
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Check if string is valid URL
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Parse GitHub URL to extract owner/repo
export const parseGitHubUrl = (url: string): string | null => {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (match) {
    return `${match[1]}/${match[2]}`;
  }

  return null;
};

// Format bytes to human readable
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateString);
  }
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Sleep function for delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
