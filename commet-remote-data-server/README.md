# 🚀 Commet Remote Data Server

A powerful Python web server that provides **real-time GitHub repository data access** over the network without requiring local repository cloning. Built with Flask and PyGithub, this server acts as a bridge between your applications and GitHub's API, offering detailed commit analysis, code differences, and repository metadata.

## 🎯 What This Project Does

This server solves a critical problem in modern development workflows: **accessing GitHub repository data programmatically without the overhead of cloning repositories locally**. Instead of downloading entire repositories (which can be gigabytes), this server fetches only the specific data you need directly from GitHub's API.

### Core Capabilities:

- **📊 Real-time Commit Analysis**: Get detailed commit information with code differences
- **🔍 Repository Intelligence**: Access comprehensive repository metadata and statistics
- **🌐 Network-Based**: No local git operations or repository cloning required
- **🔐 Private Repository Support**: Secure access to private repositories with authentication
- **📈 LLM-Ready Data**: Structured responses perfect for AI/ML analysis
- **⚡ High Performance**: Efficient API calls with rate limit management

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your Client   │───▶│  Flask Server    │───▶│  GitHub API     │
│   (Frontend/    │    │  (Port 3000)     │    │  (api.github.com)│
│    Backend/     │    │                  │    │                 │
│    LLM)         │◀───│  PyGithub Client │◀───│  Repository     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow:

1. **Client Request** → Your application sends HTTP request to the server
2. **Server Processing** → Flask receives request, validates parameters
3. **GitHub API Call** → PyGithub makes authenticated request to GitHub
4. **Data Processing** → Server processes and structures the response
5. **Client Response** → JSON data sent back to your application

## 📋 Features & Capabilities

### 🔧 Core Features

- **RESTful API Design**: Clean, intuitive endpoints following REST principles
- **Comprehensive Error Handling**: Detailed error messages with proper HTTP status codes
- **Parameter Validation**: Strict validation ensuring data integrity
- **Rate Limit Management**: Intelligent handling of GitHub API rate limits
- **Debug Mode**: Development-friendly logging and error reporting

### 🌐 GitHub Integration Features

- **Commit Analysis**: Detailed commit information with author, committer, and statistics
- **Code Differences**: Full diff patches showing exactly what was added/removed
- **File Change Tracking**: Per-file statistics and change status
- **Repository Metadata**: Complete repository information including stars, forks, languages
- **Branch Support**: Access commits from any branch
- **Private Repository Access**: Secure authentication for private repositories

### 🤖 LLM/AI Ready Features

- **Structured JSON Responses**: Perfect for feeding into language models
- **Code Diff Format**: Standard patch format for code analysis
- **File Context**: Complete file paths and change context
- **Metadata Rich**: Comprehensive information for AI processing

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.7+** (Recommended: Python 3.9+)
- **pip** (Python package manager)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone https://github.com/userenukidze/commet-remote-data-server.git
cd commet-remote-data-server
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Run the Server

```bash
python server.py
```

The server will start on `http://localhost:3000` with debug mode enabled.

## 📚 API Documentation

### 🏠 Basic Endpoints

#### `GET /` - Home Page

**Purpose**: Welcome page with server information
**Response**: Server status and available endpoints

```json
{
  "message": "Welcome to the Python Server!",
  "status": "running",
  "port": 3000
}
```

#### `GET /health` - Health Check

**Purpose**: Server health monitoring and status verification
**Response**: Health status confirmation

```json
{
  "status": "healthy",
  "message": "Server is running properly"
}
```

### 👥 User Management Endpoints

#### `GET /api/users` - Get All Users

**Purpose**: Retrieve sample user data
**Response**: Array of user objects

```json
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" },
    { "id": 3, "name": "Bob Johnson", "email": "bob@example.com" }
  ]
}
```

#### `POST /api/users` - Create User

**Purpose**: Create a new user (sample implementation)
**Request Body**: JSON with name and email
**Response**: Success message with created user data

```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }
}
```

### 🔗 GitHub Integration Endpoints

#### `GET /api/git/commits` - Get Git Commits

**Purpose**: Fetch basic commit information from GitHub repositories
**Supported Parameter Combinations**:

1. `repo + token + branch + limit`
2. `repo + token + limit`
3. `repo + branch + limit`

**Parameters**:

- `repo` (required): Repository in format `owner/repo`
- `token` (optional): GitHub personal access token
- `branch` (optional): Branch name
- `limit` (required): Number of commits (1-100)

**Example Request**:

```bash
curl "http://localhost:3000/api/git/commits?repo=microsoft/vscode&branch=main&limit=10"
```

**Response Structure**:

```json
{
  "repository": "microsoft/vscode",
  "branch": "main",
  "total_commits": 10,
  "commits": [
    {
      "sha": "abc123def456...",
      "message": "Fix API endpoint validation",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2024-01-15T10:30:00Z"
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2024-01-15T10:30:00Z"
      },
      "url": "https://github.com/microsoft/vscode/commit/abc123...",
      "api_url": "https://api.github.com/repos/microsoft/vscode/commits/abc123...",
      "stats": {
        "additions": 25,
        "deletions": 10,
        "total": 35
      }
    }
  ]
}
```

#### `GET /api/git/commit-details` - Get Detailed Commits with Code Differences

**Purpose**: Fetch comprehensive commit information including code differences and file changes
**Supported Parameter Combinations**: Same as commits endpoint

**Example Request**:

```bash
curl "http://localhost:3000/api/git/commit-details?repo=microsoft/vscode&branch=main&limit=5"
```

**Response Structure** (Enhanced with file changes):

```json
{
  "repository": "microsoft/vscode",
  "branch": "main",
  "total_commits": 5,
  "commits": [
    {
      "sha": "abc123def456...",
      "message": "Fix API endpoint validation",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2024-01-15T10:30:00Z"
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2024-01-15T10:30:00Z"
      },
      "url": "https://github.com/microsoft/vscode/commit/abc123...",
      "stats": { "additions": 25, "deletions": 10, "total": 35 },
      "file_changes": [
        {
          "filename": "src/api/endpoints.js",
          "status": "modified",
          "additions": 15,
          "deletions": 5,
          "changes": 20,
          "patch": "@@ -1,10 +1,15 @@\n function validateEndpoint(req, res) {\n-  if (!req.body) {\n-    return res.status(400).json({ error: 'Invalid request' });\n-  }\n+  if (!req.body || !req.body.data) {\n+    return res.status(400).json({ \n+      error: 'Invalid request',\n+      details: 'Missing required data field'\n+    });\n+  }\n \n   // Process request\n   processRequest(req.body);\n }",
          "previous_filename": null
        }
      ]
    }
  ]
}
```

#### `GET /api/git/repo` - Get Repository Information

**Purpose**: Fetch comprehensive repository metadata and statistics
**Supported Parameter Combinations**:

1. `repo + token` (for private repositories)
2. `repo` only (for public repositories)

**Example Request**:

```bash
curl "http://localhost:3000/api/git/repo?repo=microsoft/vscode"
```

**Response Structure**:

```json
{
  "name": "vscode",
  "full_name": "microsoft/vscode",
  "description": "Visual Studio Code",
  "url": "https://github.com/microsoft/vscode",
  "clone_url": "https://github.com/microsoft/vscode.git",
  "ssh_url": "git@github.com:microsoft/vscode.git",
  "language": "TypeScript",
  "languages": {
    "TypeScript": 65.2,
    "JavaScript": 20.1,
    "CSS": 10.5,
    "HTML": 4.2
  },
  "stars": 150000,
  "forks": 25000,
  "watchers": 8000,
  "open_issues": 5000,
  "created_at": "2015-09-01T00:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z",
  "pushed_at": "2024-01-15T14:30:00Z",
  "default_branch": "main",
  "is_private": false,
  "owner": {
    "login": "microsoft",
    "type": "Organization",
    "avatar_url": "https://avatars.githubusercontent.com/u/6154722?v=4",
    "url": "https://github.com/microsoft"
  }
}
```

### 🤖 AI-Powered Repository Analysis

#### `POST /api/chat` - AI-Powered Repository Analysis and Q&A

**Purpose**: Answer intelligent questions about GitHub repositories using AI analysis
**Method**: `POST`
**Content-Type**: `application/json`

**Supported Parameter Combinations**:

1. `repo + token + branch + commits_limit`
2. `repo + token + commits_limit`
3. `repo + branch + commits_limit`

**Request Body Structure**:

```json
{
  "question": "string (required) - Your question about the repository",
  "repo": "string (required) - Repository in format 'owner/repo'",
  "token": "string (optional) - GitHub personal access token",
  "branch": "string (optional) - Branch name",
  "commits_limit": "number (optional) - Number of commits to analyze (1-100, default: 10)"
}
```

**Example Requests**:

```bash
# Basic question about public repository
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What programming languages are used in this repository?",
    "repo": "microsoft/vscode",
    "branch": "main",
    "commits_limit": 10
  }'

# Question about private repository
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How active is this repository and what are the recent trends?",
    "repo": "your-org/private-repo",
    "token": "ghp_xxxxxxxxxxxxxxxxxxxx",
    "commits_limit": 20
  }'

# Question about specific branch
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the recent development patterns in the develop branch?",
    "repo": "facebook/react",
    "branch": "develop",
    "commits_limit": 15
  }'
```

**Response Structure**:

```json
{
  "question": "What programming languages are used in this repository?",
  "repository": "microsoft/vscode",
  "branch": "main",
  "analysis_data": {
    "repository_info": {
      "name": "vscode",
      "full_name": "microsoft/vscode",
      "description": "Visual Studio Code",
      "url": "https://github.com/microsoft/vscode",
      "language": "TypeScript",
      "languages": {
        "TypeScript": 65.2,
        "JavaScript": 20.1,
        "CSS": 10.5,
        "HTML": 4.2
      },
      "stars": 177667,
      "forks": 35564,
      "watchers": 8000,
      "open_issues": 14268,
      "created_at": "2015-09-01T00:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z",
      "pushed_at": "2024-01-15T14:30:00Z",
      "default_branch": "main",
      "is_private": false,
      "owner": {
        "login": "microsoft",
        "type": "Organization",
        "avatar_url": "https://avatars.githubusercontent.com/u/6154722?v=4",
        "url": "https://github.com/microsoft"
      }
    },
    "commits_analyzed": 10,
    "commits_limit": 10
  },
  "ai_response": "Based on the repository data, the main programming language is TypeScript (65.2%), followed by JavaScript (20.1%), CSS (10.5%), and HTML (4.2%). This indicates a modern web-based application with strong type safety...",
  "model_used": "gpt-4o-mini"
}
```

**Error Responses**:

```json
// 400 Bad Request - Missing required fields
{
  "error": "Question parameter is required"
}

// 400 Bad Request - Invalid parameter combination
{
  "error": "Invalid parameter combination. Must include either 'token' or 'branch' parameter"
}

// 404 Not Found - Repository not found
{
  "error": "Repository not found or not accessible: 404 Not Found"
}

// 503 Service Unavailable - AI service not available
{
  "error": "AI service not available. Please check OPENAI_API_KEY environment variable."
}
```

**Validation Rules**:

- **`question`**: Required string, cannot be empty
- **`repo`**: Required string, must be in format `owner/repo`
- **`token`**: Optional string, GitHub personal access token
- **`branch`**: Optional string, branch name
- **`commits_limit`**: Optional number, 1-100 (default: 10)

**Parameter Combination Rules**:

- Must include either `token` OR `branch` (or both)
- Cannot have neither `token` nor `branch`
- `token` is required for private repositories
- `branch` defaults to repository's default branch if not specified

## 🔐 Authentication & Security

### GitHub Personal Access Tokens

For private repositories or higher rate limits, you'll need a GitHub Personal Access Token:

1. **Generate Token**:

   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (for private repos), `public_repo` (for public repos)

2. **Use Token**:
   ```bash
   curl "http://localhost:3000/api/git/commits?repo=private/repo&token=ghp_xxxxxxxxxxxxxxxxxxxx&limit=10"
   ```

### Rate Limits

- **Without Token**: 60 requests/hour per IP address
- **With Token**: 5,000 requests/hour per authenticated user

## 🚀 Usage Examples

### Basic Repository Analysis

```bash
# Get repository overview
curl "http://localhost:3000/api/git/repo?repo=microsoft/vscode"

# Get recent commits
curl "http://localhost:3000/api/git/commits?repo=microsoft/vscode&branch=main&limit=20"

# Get detailed commit analysis
curl "http://localhost:3000/api/git/commit-details?repo=microsoft/vscode&branch=main&limit=5"
```

### Private Repository Access

```bash
# Access private repository with authentication
curl "http://localhost:3000/api/git/commits?repo=your-org/private-repo&token=ghp_xxxxxxxxxxxxxxxxxxxx&branch=develop&limit=15"
```

### Branch-Specific Analysis

```bash
# Analyze specific branch
curl "http://localhost:3000/api/git/commit-details?repo=microsoft/vscode&branch=feature/new-api&limit=10"
```

## 🤖 LLM/AI Integration

This server is specifically designed for AI/ML integration. The structured responses are perfect for feeding into language models:

### Code Analysis Example

```python
import requests
import json

# Get commit details
response = requests.get("http://localhost:3000/api/git/commit-details?repo=microsoft/vscode&limit=5")
data = response.json()

# Extract code changes for LLM analysis
for commit in data['commits']:
    print(f"Commit: {commit['message']}")
    for file_change in commit['file_changes']:
        print(f"File: {file_change['filename']}")
        print(f"Changes: +{file_change['additions']} -{file_change['deletions']}")
        if file_change['patch']:
            print(f"Diff:\n{file_change['patch']}")
```

### Repository Intelligence

```python
# Get repository metadata for analysis
response = requests.get("http://localhost:3000/api/git/repo?repo=microsoft/vscode")
repo_data = response.json()

# Analyze repository characteristics
print(f"Language: {repo_data['language']}")
print(f"Languages: {repo_data['languages']}")
print(f"Activity: {repo_data['stars']} stars, {repo_data['forks']} forks")
print(f"Last updated: {repo_data['updated_at']}")
```

## 🌐 Frontend Integration Guide

### Complete Frontend Implementation Examples

#### **JavaScript/Fetch API Implementation**

```javascript
class GitHubAIClient {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
  }

  async askQuestion(question, repo, options = {}) {
    const requestBody = {
      question: question,
      repo: repo,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error asking question:", error);
      throw error;
    }
  }

  // Helper methods for common questions
  async getRepositoryLanguages(repo, options = {}) {
    return this.askQuestion(
      "What programming languages are used in this repository?",
      repo,
      options
    );
  }

  async getRepositoryActivity(repo, options = {}) {
    return this.askQuestion(
      "How active is this repository and what are the recent development trends?",
      repo,
      options
    );
  }

  async getCodeQuality(repo, options = {}) {
    return this.askQuestion(
      "What is the code quality and development practices like in this repository?",
      repo,
      options
    );
  }

  async getArchitecture(repo, options = {}) {
    return this.askQuestion(
      "What is the overall architecture and structure of this codebase?",
      repo,
      options
    );
  }
}

// Usage
const aiClient = new GitHubAIClient();

// Ask a custom question
aiClient
  .askQuestion(
    "What are the main features being developed recently?",
    "microsoft/vscode",
    { branch: "main", commits_limit: 15 }
  )
  .then((response) => {
    console.log("AI Response:", response.ai_response);
    console.log("Repository Info:", response.analysis_data.repository_info);
  });

// Use helper methods
aiClient
  .getRepositoryLanguages("facebook/react", { commits_limit: 20 })
  .then((response) => console.log(response.ai_response));
```

#### **React Hook Implementation**

```javascript
import { useState, useCallback } from "react";

const useGitHubAI = (baseURL = "http://localhost:3000") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const askQuestion = useCallback(
    async (question, repo, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseURL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            repo,
            ...options,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setLastResponse(data);
        setLoading(false);
        return data;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [baseURL]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    askQuestion,
    loading,
    error,
    lastResponse,
    clearError,
  };
};

// React Component Example
const RepositoryAnalyzer = () => {
  const { askQuestion, loading, error, lastResponse } = useGitHubAI();
  const [question, setQuestion] = useState("");
  const [repo, setRepo] = useState("microsoft/vscode");
  const [branch, setBranch] = useState("main");
  const [commitsLimit, setCommitsLimit] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await askQuestion(question, repo, {
        branch: branch || undefined,
        commits_limit: commitsLimit,
      });
    } catch (err) {
      console.error("Failed to ask question:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Repository (owner/repo):</label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="microsoft/vscode"
            required
          />
        </div>

        <div>
          <label>Branch:</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
          />
        </div>

        <div>
          <label>Commits to analyze:</label>
          <input
            type="number"
            value={commitsLimit}
            onChange={(e) => setCommitsLimit(parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>

        <div>
          <label>Your question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What programming languages are used in this repository?"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Ask Question"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {lastResponse && (
        <div>
          <h3>AI Response:</h3>
          <p>{lastResponse.ai_response}</p>

          <h4>Repository Info:</h4>
          <p>
            <strong>Name:</strong>{" "}
            {lastResponse.analysis_data.repository_info.name}
          </p>
          <p>
            <strong>Language:</strong>{" "}
            {lastResponse.analysis_data.repository_info.language}
          </p>
          <p>
            <strong>Stars:</strong>{" "}
            {lastResponse.analysis_data.repository_info.stars}
          </p>
          <p>
            <strong>Commits Analyzed:</strong>{" "}
            {lastResponse.analysis_data.commits_analyzed}
          </p>
        </div>
      )}
    </div>
  );
};
```

#### **Axios Implementation**

```javascript
import axios from "axios";

class GitHubAIService {
  constructor(baseURL = "http://localhost:3000") {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log("Making request to:", config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.error ||
            `HTTP error! status: ${error.response.status}`;
          console.error("API Error:", errorMessage);
          throw new Error(errorMessage);
        } else if (error.request) {
          // Network error
          console.error("Network Error:", error.message);
          throw new Error("Network error - please check your connection");
        } else {
          // Other error
          console.error("Error:", error.message);
          throw error;
        }
      }
    );
  }

  async askQuestion(question, repo, options = {}) {
    try {
      const response = await this.api.post("/api/chat", {
        question,
        repo,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Batch analysis for multiple repositories
  async analyzeMultipleRepositories(questions, repositories, options = {}) {
    const promises = repositories.map((repo) =>
      this.askQuestion(questions, repo, options)
    );

    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        repository: repositories[index],
        success: result.status === "fulfilled",
        data: result.status === "fulfilled" ? result.value : null,
        error: result.status === "rejected" ? result.reason.message : null,
      }));
    } catch (error) {
      throw error;
    }
  }
}

// Usage
const aiService = new GitHubAIService();

// Single question
aiService
  .askQuestion("What are the main development patterns?", "microsoft/vscode", {
    branch: "main",
    commits_limit: 20,
  })
  .then((response) => {
    console.log("Response:", response.ai_response);
  });

// Batch analysis
const repositories = ["microsoft/vscode", "facebook/react", "torvalds/linux"];
aiService
  .analyzeMultipleRepositories(
    "What is the primary programming language?",
    repositories,
    { commits_limit: 10 }
  )
  .then((results) => {
    results.forEach((result) => {
      if (result.success) {
        console.log(`${result.repository}: ${result.data.ai_response}`);
      } else {
        console.error(`${result.repository}: ${result.error}`);
      }
    });
  });
```

#### **Vue.js Implementation**

```javascript
// composables/useGitHubAI.js
import { ref, reactive } from 'vue';
import axios from 'axios';

export function useGitHubAI(baseURL = 'http://localhost:3000') {
  const loading = ref(false);
  const error = ref(null);
  const lastResponse = ref(null);

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const askQuestion = async (question, repo, options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/api/chat', {
        question,
        repo,
        ...options
      });

      lastResponse.value = response.data;
      loading.value = false;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || err.message;
      loading.value = false;
      throw err;
    }
  };

  return {
    loading,
    error,
    lastResponse,
    askQuestion
  };
}

// Vue Component
<template>
  <div class="repository-analyzer">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Repository:</label>
        <input v-model="form.repo" placeholder="microsoft/vscode" required />
      </div>

      <div class="form-group">
        <label>Branch:</label>
        <input v-model="form.branch" placeholder="main" />
      </div>

      <div class="form-group">
        <label>Question:</label>
        <textarea v-model="form.question" required></textarea>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Analyzing...' : 'Ask Question' }}
      </button>
    </form>

    <div v-if="error" class="error">
      Error: {{ error }}
    </div>

    <div v-if="lastResponse" class="response">
      <h3>AI Response:</h3>
      <p>{{ lastResponse.ai_response }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useGitHubAI } from './composables/useGitHubAI';

const { loading, error, lastResponse, askQuestion } = useGitHubAI();

const form = reactive({
  repo: 'microsoft/vscode',
  branch: 'main',
  question: ''
});

const handleSubmit = async () => {
  try {
    await askQuestion(form.question, form.repo, {
      branch: form.branch || undefined,
      commits_limit: 10
    });
  } catch (err) {
    console.error('Failed to ask question:', err);
  }
};
</script>
```

#### **Angular Service Implementation**

```typescript
// services/github-ai.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

export interface ChatRequest {
  question: string;
  repo: string;
  token?: string;
  branch?: string;
  commits_limit?: number;
}

export interface ChatResponse {
  question: string;
  repository: string;
  branch: string;
  analysis_data: {
    repository_info: any;
    commits_analyzed: number;
    commits_limit: number;
  };
  ai_response: string;
  model_used: string;
}

@Injectable({
  providedIn: "root",
})
export class GitHubAIService {
  private baseURL = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  askQuestion(request: ChatRequest): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(`${this.baseURL}/api/chat`, request)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage =
        error.error?.error ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}

// Component usage
@Component({
  selector: "app-repository-analyzer",
  template: `
    <form (ngSubmit)="onSubmit()">
      <div>
        <label>Repository:</label>
        <input [(ngModel)]="request.repo" name="repo" required />
      </div>

      <div>
        <label>Question:</label>
        <textarea
          [(ngModel)]="request.question"
          name="question"
          required
        ></textarea>
      </div>

      <button type="submit" [disabled]="loading">
        {{ loading ? "Analyzing..." : "Ask Question" }}
      </button>
    </form>

    <div *ngIf="error" class="error">
      {{ error }}
    </div>

    <div *ngIf="response" class="response">
      <h3>AI Response:</h3>
      <p>{{ response.ai_response }}</p>
    </div>
  `,
})
export class RepositoryAnalyzerComponent {
  request: ChatRequest = {
    question: "",
    repo: "microsoft/vscode",
    commits_limit: 10,
  };

  loading = false;
  error: string | null = null;
  response: ChatResponse | null = null;

  constructor(private githubAI: GitHubAIService) {}

  onSubmit() {
    this.loading = true;
    this.error = null;

    this.githubAI.askQuestion(this.request).subscribe({
      next: (response) => {
        this.response = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }
}
```

### **Error Handling Best Practices**

```javascript
// Comprehensive error handling
const handleAIRequest = async (question, repo, options = {}) => {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, repo, ...options }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      switch (response.status) {
        case 400:
          throw new Error(`Invalid request: ${errorData.error}`);
        case 404:
          throw new Error(`Repository not found: ${errorData.error}`);
        case 503:
          throw new Error(`AI service unavailable: ${errorData.error}`);
        default:
          throw new Error(`Server error: ${errorData.error}`);
      }
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Network error - please check your connection");
    }
    throw error;
  }
};
```

This comprehensive frontend integration guide provides everything needed to integrate the AI chat endpoint into any frontend framework! 🚀

## 🔧 Development & Customization

### Running in Development Mode

The server runs in debug mode by default, providing:

- **Automatic Reloading**: Changes to code trigger automatic server restart
- **Detailed Error Messages**: Comprehensive error information in console
- **Debug Logging**: Verbose logging for development troubleshooting

### Customizing the Server

1. **Add New Endpoints**: Extend the Flask app with new routes
2. **Modify Response Format**: Customize JSON response structures
3. **Add Authentication**: Implement custom authentication mechanisms
4. **Enhance Error Handling**: Add specific error handling for your use cases

### Environment Configuration

```bash
# Set environment variables
export GITHUB_TOKEN=your_token_here
export SERVER_PORT=3000
export DEBUG_MODE=true
```

## 📊 Performance & Scalability

### Optimization Features

- **Efficient API Calls**: Only fetch required data from GitHub
- **Rate Limit Management**: Intelligent handling of GitHub API limits
- **Error Recovery**: Graceful handling of API failures
- **Memory Efficient**: No local storage of repository data

### Scaling Considerations

- **Horizontal Scaling**: Deploy multiple server instances behind a load balancer
- **Caching**: Implement Redis/Memcached for frequently accessed data
- **Database Integration**: Add database layer for persistent storage
- **Monitoring**: Add application performance monitoring (APM)

## 🐛 Error Handling

The server provides comprehensive error handling with appropriate HTTP status codes:

### Common Error Responses

```json
// 400 Bad Request
{
  "error": "Repository parameter 'repo' is required (format: 'owner/repo')"
}

// 404 Not Found
{
  "error": "Repository not found or not accessible: 404 Not Found"
}

// 500 Internal Server Error
{
  "error": "Error fetching commits: API rate limit exceeded"
}
```

### Error Categories

- **Parameter Validation**: Missing or invalid parameters
- **Authentication**: Invalid or expired tokens
- **Repository Access**: Repository not found or inaccessible
- **Rate Limiting**: GitHub API rate limit exceeded
- **Network Issues**: Connection problems with GitHub API

## 🚀 Deployment

### Local Development

```bash
python server.py
```

### Production Deployment

```bash
# Using Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:3000 server:app

# Using Docker
docker build -t commet-server .
docker run -p 3000:3000 commet-server
```

### Cloud Deployment Options

- **Heroku**: Easy deployment with git push
- **AWS EC2**: Full control with custom configuration
- **Google Cloud Run**: Serverless container deployment
- **Azure Container Instances**: Managed container service
- **DigitalOcean App Platform**: Simple cloud deployment

## 📈 Monitoring & Logging

### Built-in Logging

The server provides comprehensive logging for:

- **Request Tracking**: All incoming requests and responses
- **Error Logging**: Detailed error information
- **Performance Metrics**: Response times and API call statistics
- **GitHub API Usage**: Rate limit tracking and usage patterns

### Health Monitoring

```bash
# Check server health
curl http://localhost:3000/health

# Monitor with external tools
# - Prometheus metrics
# - Grafana dashboards
# - Application performance monitoring (APM)
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Follow PEP 8 Python style guidelines
- Add docstrings to all functions
- Include type hints where appropriate
- Write comprehensive tests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Troubleshooting

### Common Issues

#### Rate Limit Exceeded

```json
{
  "error": "Error fetching commits: API rate limit exceeded"
}
```

**Solution**: Use a GitHub token or wait for rate limit reset

#### Repository Not Found

```json
{
  "error": "Repository not found or not accessible: 404 Not Found"
}
```

**Solution**: Check repository name format (`owner/repo`) and permissions

#### Invalid Token

```json
{
  "error": "Repository not found or not accessible: 401 Unauthorized"
}
```

**Solution**: Verify token validity and required scopes

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README for detailed information
- **Community**: Join discussions in GitHub Discussions

## 🔮 Future Enhancements

### Planned Features

- **Caching Layer**: Redis integration for improved performance
- **Webhook Support**: Real-time repository updates
- **Batch Operations**: Multiple repository analysis
- **Advanced Filtering**: Commit filtering by author, date, file type
- **Export Options**: CSV, JSON, XML export formats
- **GraphQL API**: Alternative to REST API
- **Real-time Updates**: WebSocket support for live data

### Integration Possibilities

- **CI/CD Pipelines**: Integration with GitHub Actions
- **Monitoring Tools**: Prometheus, Grafana integration
- **Database Storage**: PostgreSQL, MongoDB support
- **Message Queues**: RabbitMQ, Apache Kafka integration
- **Authentication**: OAuth, JWT token support

---

**Built with ❤️ for the developer community**

This server bridges the gap between your applications and GitHub's vast repository data, making it easier than ever to build intelligent tools that understand code changes, repository evolution, and development patterns.
