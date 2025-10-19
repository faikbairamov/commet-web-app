# Jira Integration for Commet

This document explains how to set up and use the Jira integration with Commet.

## 🚀 Features

- **Automatic Ticket Creation**: Create Jira tickets from code quality analysis
- **AI-Powered Auto-Tickets**: Automatically create Jira tickets when AI detects issues
- **Commit Synchronization**: Sync GitHub commits with Jira tickets
- **Worklog Tracking**: Automatic time tracking based on commit activity
- **Status Transitions**: Auto-transition tickets based on commit messages
- **Real-time Webhooks**: Handle Jira events in real-time
- **JQL Search**: Search and filter Jira tickets using JQL queries

## 📋 Prerequisites

1. **Jira Instance**: You need access to a Jira instance (Cloud or Server)
2. **API Token**: Generate a Jira API token from your account settings
3. **Project Access**: Ensure you have access to the Jira project you want to integrate with

## 🔧 Setup

### 1. Get Jira API Token

1. Go to your Jira instance
2. Click on your profile picture → **Account Settings**
3. Go to **Security** → **API tokens**
4. Click **Create API token**
5. Give it a name (e.g., "Commet Integration")
6. Copy the generated token

### 2. Configure Environment Variables

Add these variables to your `.env` file:

```bash
# Jira Integration Configuration
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY

# Auto-ticket creation settings
JIRA_AUTO_CREATE_TICKETS=true  # Enable/disable automatic ticket creation from AI analysis
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Server

```bash
python server.py
```

## 🔌 API Endpoints

### Integration Status

```http
GET /api/integrations/jira/status
```

**Response:**

```json
{
  "name": "JiraIntegration",
  "enabled": true,
  "connected": true,
  "base_url": "https://your-domain.atlassian.net"
}
```

### Test Connection

```http
POST /api/integrations/jira/test
```

**Response:**

```json
{
  "connected": true,
  "message": "Connection successful"
}
```

### Create Ticket

```http
POST /api/integrations/jira/ticket
Content-Type: application/json

{
  "project_key": "PROJ",
  "summary": "Fix authentication bug",
  "description": "Detailed description of the issue",
  "issue_type": "Bug",
  "priority": "High",
  "labels": ["bug", "authentication"]
}
```

### Get Ticket

```http
GET /api/integrations/jira/ticket/PROJ-123
```

### Update Ticket

```http
PUT /api/integrations/jira/ticket/PROJ-123
Content-Type: application/json

{
  "summary": "Updated summary",
  "priority": "Medium"
}
```

### Add Worklog

```http
POST /api/integrations/jira/ticket/PROJ-123/worklog
Content-Type: application/json

{
  "time_spent": "2h 30m",
  "comment": "Worked on fixing the authentication issue",
  "started": "2024-01-15T09:00:00.000+0000"
}
```

### Transition Ticket

```http
POST /api/integrations/jira/ticket/PROJ-123/transition
Content-Type: application/json

{
  "transition_name": "In Progress"
}
```

### Sync Commit to Ticket

```http
POST /api/integrations/jira/sync-commit
Content-Type: application/json

{
  "ticket_key": "PROJ-123",
  "commit_data": {
    "sha": "abc123def456",
    "message": "PROJ-123: Fix authentication bug",
    "author": {
      "name": "John Doe",
      "email": "john@company.com",
      "date": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "additions": 15,
      "deletions": 8,
      "total": 23
    },
    "url": "https://github.com/company/repo/commit/abc123def456"
  }
}
```

### Create Quality Ticket

```http
POST /api/integrations/jira/quality-ticket
Content-Type: application/json

{
  "project_key": "TECH",
  "analysis_data": {
    "title": "SQL Injection Vulnerability",
    "severity": "high",
    "file_path": "src/auth/user.py",
    "line_number": 45,
    "description": "Potential SQL injection in user authentication",
    "recommendation": "Use parameterized queries",
    "code_snippet": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
    "quality_score": 65,
    "category": "security"
  }
}
```

### Search Tickets

```http
POST /api/integrations/jira/search
Content-Type: application/json

{
  "jql": "project = PROJ AND status = 'In Progress'",
  "max_results": 50
}
```

## 🔗 Webhook Integration

### Setup Jira Webhook

1. Go to your Jira instance
2. Navigate to **System** → **Webhooks**
3. Click **Create a webhook**
4. Set the URL to: `https://your-commet-server.com/webhooks/jira`
5. Select events:
   - Issue created
   - Issue updated
   - Issue deleted
   - Worklog created
   - Worklog updated
   - Worklog deleted

### Webhook Events

The webhook handler processes these events:

- **Issue Created**: Logs new ticket creation
- **Issue Updated**: Tracks status, assignee, and priority changes
- **Issue Deleted**: Handles ticket deletion
- **Worklog Events**: Tracks time logging activities

## 🤖 AI-Powered Auto-Ticket Creation

Commet can automatically create Jira tickets when the AI detects issues during repository analysis. This feature is enabled by default but can be controlled via environment variables.

### How It Works

1. **AI Analysis**: When you ask questions about a repository, the AI analyzes the code and commits
2. **Issue Detection**: The system automatically detects various types of issues:
   - **Security Issues**: Vulnerabilities, authentication problems, injection risks
   - **Performance Issues**: Bottlenecks, memory leaks, optimization needs
   - **Code Quality Issues**: Maintainability, complexity, technical debt
   - **Bug Patterns**: Error patterns, exception handling issues
   - **Documentation Issues**: Missing or outdated documentation
3. **Automatic Ticket Creation**: For each detected issue, a Jira ticket is automatically created with:
   - Proper priority mapping (High/Medium/Low)
   - Detailed description with AI analysis
   - Repository context and metadata
   - Recommendations and code snippets
   - Automatic labeling (`commet-analysis`, `code-quality`, etc.)

### Configuration

```bash
# Enable/disable auto-ticket creation
JIRA_AUTO_CREATE_TICKETS=true  # Default: true

# Per-request control (in API calls)
{
  "question": "What are the security issues in this repository?",
  "repo": "owner/repo",
  "auto_create_tickets": true  # Override global setting
}
```

### Example Auto-Generated Tickets

When you ask: _"What are the security vulnerabilities in this repository?"_

The AI might detect SQL injection risks and automatically create a ticket:

- **Title**: "SQL Injection Vulnerability in User Authentication"
- **Priority**: High
- **Labels**: `commet-analysis`, `security`, `severity-high`
- **Description**: Full AI analysis with code context and recommendations

## 💡 Usage Examples

### 1. AI-Powered Issue Detection

```bash
# Ask about security issues - automatically creates tickets
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What security vulnerabilities exist in this repository?",
    "repo": "company/application",
    "branch": "main",
    "commits_limit": 20
  }'
```

**Response includes**:

```json
{
  "ai_response": "Analysis shows potential SQL injection...",
  "jira_tickets_created": [
    {
      "type": "security",
      "title": "SQL Injection Vulnerability",
      "severity": "high",
      "priority": "High",
      "category": "security",
      "status": "created"
    }
  ]
}
```

### 2. Automatic Commit Sync

When developers commit with ticket references:

```bash
git commit -m "PROJ-123: Fix authentication bug"
```

Commet automatically:

- Extracts ticket key (PROJ-123)
- Adds worklog entry with estimated time
- Updates ticket status if commit message indicates completion

### 2. Code Quality Issue Tracking

When Commet finds code issues:

```python
# Commet analysis finds security vulnerability
analysis_result = {
    "title": "SQL Injection Risk",
    "severity": "high",
    "file_path": "src/auth/login.py",
    "line_number": 23,
    "description": "Direct string concatenation in SQL query",
    "recommendation": "Use parameterized queries"
}

# Automatically creates Jira ticket
POST /api/integrations/jira/quality-ticket
```

### 3. Sprint Planning Integration

```python
# Get tickets for current sprint
jql = "project = PROJ AND sprint in openSprints()"
tickets = jira_integration.search_tickets(jql)

# Analyze development velocity
for ticket in tickets:
    # Get commit activity for each ticket
    commits = get_commits_for_ticket(ticket['key'])
    # Calculate progress and estimate completion
```

## 🎯 Best Practices

### 1. Commit Message Convention

Use consistent commit message format:

```
TICKET-KEY: Brief description of changes

Optional detailed description of what was changed and why.
```

Examples:

- `PROJ-123: Fix authentication bug`
- `PROJ-456: Add user validation`
- `PROJ-789: Update documentation`

### 2. Ticket Naming

- Use clear, descriptive summaries
- Include context and impact
- Use consistent terminology

### 3. Priority Mapping

Map Commet severity levels to Jira priorities:

- **Critical** → Highest
- **High** → High
- **Medium** → Medium
- **Low** → Low
- **Info** → Lowest

### 4. Label Strategy

Use consistent labels for better organization:

- `commet-analysis` - Tickets created by Commet
- `code-quality` - Code quality issues
- `security` - Security-related issues
- `performance` - Performance issues
- `tech-debt` - Technical debt items

## 🔍 Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check JIRA_URL format (include https://)
   - Verify API token is correct
   - Ensure email matches Jira account

2. **Permission Denied**

   - Check if user has access to the project
   - Verify API token has necessary permissions
   - Ensure project key is correct

3. **Webhook Not Working**
   - Check webhook URL is accessible
   - Verify webhook events are selected
   - Check server logs for errors

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test Connection

```bash
curl -X POST http://localhost:3000/api/integrations/jira/test
```

## 📊 Monitoring

### Health Checks

Monitor integration health:

```bash
# Check status
curl http://localhost:3000/api/integrations/jira/status

# Test connection
curl -X POST http://localhost:3000/api/integrations/jira/test
```

### Logs

Monitor server logs for:

- Connection issues
- API rate limits
- Webhook processing errors
- Ticket creation failures

## 🚀 Advanced Features

### Custom Workflows

Create custom workflows for different project types:

```python
# Custom workflow for security issues
def handle_security_issue(analysis_data):
    ticket_data = {
        'project_key': 'SEC',
        'summary': f"Security: {analysis_data['title']}",
        'issue_type': 'Security Issue',
        'priority': 'Highest',
        'labels': ['security', 'commet-analysis']
    }
    return jira_integration.create_ticket(ticket_data)
```

### Integration with CI/CD

```yaml
# GitHub Actions workflow
- name: Create Jira Ticket for Failed Build
  if: failure()
  run: |
    curl -X POST ${{ secrets.COMMET_API_URL }}/api/integrations/jira/quality-ticket \
      -H "Content-Type: application/json" \
      -d '{
        "analysis_data": {
          "title": "Build Failed",
          "severity": "high",
          "description": "CI/CD pipeline failed",
          "category": "build"
        }
      }'
```

## 📚 Additional Resources

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Jira Webhook Documentation](https://developer.atlassian.com/server/jira/platform/webhooks/)
- [JQL Reference](https://www.atlassian.com/software/jira/guides/expand-jira/jql)
- [Commet Documentation](../README.md)
