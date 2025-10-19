"""
AI Service for GitHub Repository Analysis
Handles OpenAI integration for answering questions based on GitHub repository data
"""

import os
import json
from typing import Dict, List, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GitHubAIService:
    """
    AI service that uses OpenAI to answer questions based on GitHub repository information
    """
    
    def __init__(self):
        """Initialize the AI service with OpenAI client"""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=self.api_key)
        # Model options (as of 2024):
        # - gpt-4o-mini: Best value, 60% cheaper than gpt-3.5-turbo, faster, better performance
        # - gpt-4o: Latest multimodal model, excellent for complex analysis
        # - gpt-4-turbo: Good balance of performance and cost
        # - gpt-3.5-turbo: Legacy model, not recommended for new projects
        self.model = "gpt-4o-mini"
    
    def analyze_repository_data(self, repo_data: Dict, commits_data: List[Dict], question: str) -> str:
        """
        Analyze GitHub repository data and answer a question about it
        
        Args:
            repo_data: Repository metadata from /api/git/repo endpoint
            commits_data: List of commits from /api/git/commits or /api/git/commit-details endpoint
            question: User's question about the repository
            
        Returns:
            AI-generated answer based on the repository data
        """
        
        # Prepare context data for the AI
        context = self._prepare_context(repo_data, commits_data)
        
        # Create the prompt for the AI
        prompt = self._create_prompt(context, question)
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert software engineer and GitHub repository analyst. You analyze GitHub repository data and provide detailed, accurate answers about codebases, commit patterns, development activity, and technical details. Always base your answers on the provided repository data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating AI response: {str(e)}"
    
    def _prepare_context(self, repo_data: Dict, commits_data: List[Dict]) -> str:
        """
        Prepare context data from repository and commits information
        
        Args:
            repo_data: Repository metadata
            commits_data: List of commits
            
        Returns:
            Formatted context string for the AI
        """
        
        context_parts = []
        
        # Repository information
        if repo_data:
            context_parts.append("=== REPOSITORY INFORMATION ===")
            context_parts.append(f"Name: {repo_data.get('name', 'N/A')}")
            context_parts.append(f"Full Name: {repo_data.get('full_name', 'N/A')}")
            context_parts.append(f"Description: {repo_data.get('description', 'N/A')}")
            context_parts.append(f"Language: {repo_data.get('language', 'N/A')}")
            context_parts.append(f"Languages: {json.dumps(repo_data.get('languages', {}), indent=2)}")
            context_parts.append(f"Stars: {repo_data.get('stars', 0)}")
            context_parts.append(f"Forks: {repo_data.get('forks', 0)}")
            context_parts.append(f"Open Issues: {repo_data.get('open_issues', 0)}")
            context_parts.append(f"Created: {repo_data.get('created_at', 'N/A')}")
            context_parts.append(f"Last Updated: {repo_data.get('updated_at', 'N/A')}")
            context_parts.append(f"Default Branch: {repo_data.get('default_branch', 'N/A')}")
            context_parts.append(f"Private: {repo_data.get('is_private', False)}")
            
            if 'owner' in repo_data:
                context_parts.append(f"Owner: {repo_data['owner'].get('login', 'N/A')} ({repo_data['owner'].get('type', 'N/A')})")
        
        # Commits information
        if commits_data:
            context_parts.append("\n=== RECENT COMMITS ===")
            for i, commit in enumerate(commits_data[:10]):  # Limit to 10 most recent commits
                context_parts.append(f"\nCommit {i+1}:")
                context_parts.append(f"  SHA: {commit.get('sha', 'N/A')}")
                context_parts.append(f"  Message: {commit.get('message', 'N/A')}")
                context_parts.append(f"  Author: {commit.get('author', {}).get('name', 'N/A')} ({commit.get('author', {}).get('email', 'N/A')})")
                context_parts.append(f"  Date: {commit.get('author', {}).get('date', 'N/A')}")
                
                stats = commit.get('stats', {})
                context_parts.append(f"  Changes: +{stats.get('additions', 0)} -{stats.get('deletions', 0)} ({stats.get('total', 0)} total)")
                
                # Include file changes if available (from commit-details endpoint)
                if 'file_changes' in commit and commit['file_changes']:
                    context_parts.append(f"  Files Changed: {len(commit['file_changes'])}")
                    for file_change in commit['file_changes'][:5]:  # Limit to 5 files per commit
                        context_parts.append(f"    - {file_change.get('filename', 'N/A')} ({file_change.get('status', 'N/A')})")
                        if file_change.get('patch'):
                            # Include a snippet of the actual code changes
                            patch_lines = file_change['patch'].split('\n')[:10]  # First 10 lines of patch
                            context_parts.append(f"      Code Changes:")
                            for line in patch_lines:
                                context_parts.append(f"        {line}")
        
        return "\n".join(context_parts)
    
    def _create_prompt(self, context: str, question: str) -> str:
        """
        Create a prompt for the AI based on context and question
        
        Args:
            context: Repository and commits context
            question: User's question
            
        Returns:
            Formatted prompt for the AI
        """
        
        prompt = f"""
Based on the following GitHub repository data, please answer the user's question.

REPOSITORY DATA:
{context}

USER QUESTION: {question}

Please provide a detailed, helpful answer based on the repository information provided. If the question cannot be answered with the available data, please explain what information is missing and suggest what additional data might be needed.

Focus on:
- Code patterns and development practices
- Commit frequency and patterns
- Technology stack and languages used
- Repository activity and health
- Recent changes and trends
- Any other insights that can be derived from the data

**IMPORTANT FORMATTING REQUIREMENTS:**
- Use proper markdown code blocks for ALL code, JSON, configuration files, and technical content
- Use ```json for JSON schemas and API responses
- Use ```bash for shell commands and installation steps
- Use ```typescript, ```javascript, ```python, etc. for code examples
- Use ```yaml for configuration files
- Use ```text for data flow diagrams
- Always wrap code examples in appropriate code blocks with language specification
- Make API schemas, data structures, and configuration examples clearly formatted in code blocks

Answer in a clear, professional manner suitable for developers and technical stakeholders with proper code formatting.
"""
        
        return prompt.strip()
    
    def get_available_models(self) -> List[str]:
        """
        Get list of available OpenAI models
        
        Returns:
            List of available model names
        """
        try:
            models = self.client.models.list()
            return [model.id for model in models.data if 'gpt' in model.id.lower()]
        except Exception as e:
            return [f"Error retrieving models: {str(e)}"]
    
    def set_model(self, model_name: str) -> bool:
        """
        Set the AI model to use for analysis
        
        Args:
            model_name: Name of the model to use
            
        Returns:
            True if model was set successfully, False otherwise
        """
        try:
            # Test if the model is available
            self.client.models.retrieve(model_name)
            self.model = model_name
            return True
        except Exception as e:
            print(f"Error setting model {model_name}: {str(e)}")
            return False
    
    def analyze_multiple_repositories(self, repositories_data: List[Dict], commits_data: List[List[Dict]], question: str, jira_data: List[Dict] = None) -> str:
        """
        Analyze multiple connected repositories and provide comprehensive cross-project insights
        
        Args:
            repositories_data: List of repository metadata from multiple repos
            commits_data: List of commits from each repository
            question: User's question about the repositories
            jira_data: Optional list of Jira project data for project management insights
            
        Returns:
            AI-generated analysis with project connections and detailed instructions
        """
        
        # Prepare context data for multiple repositories
        context = self._prepare_multi_repository_context(repositories_data, commits_data, jira_data)
        
        # Create the prompt for multi-project analysis
        prompt = self._create_multi_project_prompt(context, question)
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert software architect and full-stack developer. You analyze multiple connected GitHub repositories and provide comprehensive insights about how they work together, API connections, data flow, and detailed development instructions. You excel at creating complete prompts for LLM development tasks that include all necessary context from connected projects."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating multi-project AI response: {str(e)}"
    
    def generate_commit_story(self, repo_data: Dict, commits_data: List[Dict], story_style: str = "narrative") -> str:
        """
        Generate a narrative story from commit history
        
        Args:
            repo_data: Repository metadata
            commits_data: List of commits with their details
            story_style: Style of story ("narrative", "technical", "casual")
            
        Returns:
            AI-generated story about the commit history
        """
        
        # Prepare context data for the story
        context = self._prepare_commit_story_context(repo_data, commits_data)
        
        # Create the prompt based on story style
        prompt = self._create_commit_story_prompt(context, story_style)
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": self._get_commit_story_system_prompt(story_style) + " IMPORTANT: Use formal, professional business language. No storytelling phrases like 'once upon a time' or casual language. Write for corporate executives and stakeholders. Keep it VERY SHORT - maximum 200 words. Present facts and achievements professionally."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=500,
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating commit story: {str(e)}"
    
    def _prepare_commit_story_context(self, repo_data: Dict, commits_data: List[Dict]) -> str:
        """
        Prepare context data from repository and commits for story generation
        """
        
        context_parts = []
        
        # Repository overview
        context_parts.append("=== REPOSITORY OVERVIEW ===")
        context_parts.append(f"Name: {repo_data.get('name', 'N/A')}")
        context_parts.append(f"Description: {repo_data.get('description', 'N/A')}")
        context_parts.append(f"Primary Language: {repo_data.get('language', 'N/A')}")
        context_parts.append(f"Languages: {json.dumps(repo_data.get('languages', {}), indent=2)}")
        context_parts.append(f"Stars: {repo_data.get('stars', 0)}")
        context_parts.append(f"Forks: {repo_data.get('forks', 0)}")
        context_parts.append(f"Created: {repo_data.get('created_at', 'N/A')}")
        context_parts.append(f"Last Updated: {repo_data.get('updated_at', 'N/A')}")
        
        # Commit history
        context_parts.append(f"\n=== COMMIT HISTORY ({len(commits_data)} commits) ===")
        
        for i, commit in enumerate(commits_data):
            context_parts.append(f"\n--- Commit {i+1} ---")
            context_parts.append(f"SHA: {commit.get('sha', 'N/A')}")
            context_parts.append(f"Message: {commit.get('message', 'N/A')}")
            context_parts.append(f"Author: {commit.get('author', {}).get('name', 'N/A')}")
            context_parts.append(f"Date: {commit.get('author', {}).get('date', 'N/A')}")
            
            stats = commit.get('stats', {})
            context_parts.append(f"Changes: +{stats.get('additions', 0)} -{stats.get('deletions', 0)} ({stats.get('total', 0)} total)")
            
            # Include file changes if available
            if 'file_changes' in commit and commit['file_changes']:
                context_parts.append(f"Files Changed: {len(commit['file_changes'])}")
                for file_change in commit['file_changes'][:3]:  # Limit to 3 files per commit
                    context_parts.append(f"  - {file_change.get('filename', 'N/A')} ({file_change.get('status', 'N/A')})")
        
        return "\n".join(context_parts)
    
    def _create_commit_story_prompt(self, context: str, story_style: str) -> str:
        """
        Create the prompt for commit story generation based on style
        """
        
        style_instructions = {
            "narrative": "Write this as a professional project summary. Use formal business language and short sentences. Present the development timeline and key milestones in a corporate style. Focus on what was accomplished and the business value delivered.",
            
            "technical": "Write this as a technical project report. Use professional terminology to explain the codebase evolution, architectural decisions, and development progress. Present findings in a structured, analytical manner.",
            
            "casual": "Write this as a professional project update. Use clear, direct language to explain the development progress and key achievements. Present information in a business-friendly format."
        }
        
        instruction = style_instructions.get(story_style, style_instructions["narrative"])
        
        return f"""Based on the following repository and commit history data, create a professional project summary.

{instruction}

Here's the data to work with:

{context}

Please create a summary that:
1. Uses formal, professional language
2. Has short, clear sentences
3. Explains development progress in business terms
4. Shows project evolution and milestones
5. Is suitable for corporate reporting

Make it SHORT - only 150-250 words maximum. Use formal business language and avoid storytelling phrases."""
    
    def _get_commit_story_system_prompt(self, story_style: str) -> str:
        """
        Get the system prompt based on story style
        """
        
        base_prompt = "You are a professional technical writer who creates formal project summaries for corporate environments. You present development progress in business language suitable for executive reporting."
        
        style_additions = {
            "narrative": " You create professional project summaries with formal business language. Present development milestones and achievements in a corporate style.",
            
            "technical": " You write technical project reports using professional terminology. Present architectural decisions and development progress in a structured, analytical format.",
            
            "casual": " You create professional project updates using clear, direct business language. Present information in a corporate-friendly format."
        }
        
        return base_prompt + style_additions.get(story_style, style_additions["narrative"])
    
    def _prepare_multi_repository_context(self, repositories_data: List[Dict], commits_data: List[List[Dict]], jira_data: List[Dict] = None) -> str:
        """
        Prepare context data from multiple repositories and their commits
        
        Args:
            repositories_data: List of repository metadata
            commits_data: List of commits from each repository
            jira_data: Optional list of Jira project data
            
        Returns:
            Formatted context string for multi-project analysis
        """
        
        context_parts = []
        
        # Overall project overview
        context_parts.append("=== MULTI-PROJECT ANALYSIS ===")
        context_parts.append(f"Total repositories analyzed: {len(repositories_data)}")
        
        # Analyze each repository
        for i, (repo_data, repo_commits) in enumerate(zip(repositories_data, commits_data)):
            context_parts.append(f"\n=== REPOSITORY {i+1}: {repo_data.get('name', 'N/A')} ===")
            context_parts.append(f"Full Name: {repo_data.get('full_name', 'N/A')}")
            context_parts.append(f"Description: {repo_data.get('description', 'N/A')}")
            context_parts.append(f"Language: {repo_data.get('language', 'N/A')}")
            context_parts.append(f"Languages: {json.dumps(repo_data.get('languages', {}), indent=2)}")
            context_parts.append(f"Stars: {repo_data.get('stars', 0)}")
            context_parts.append(f"Forks: {repo_data.get('forks', 0)}")
            context_parts.append(f"Default Branch: {repo_data.get('default_branch', 'N/A')}")
            context_parts.append(f"Private: {repo_data.get('is_private', False)}")
            
            if 'owner' in repo_data:
                context_parts.append(f"Owner: {repo_data['owner'].get('login', 'N/A')} ({repo_data['owner'].get('type', 'N/A')})")
            
            # Recent commits for this repository (optimized for performance)
            if repo_commits:
                context_parts.append(f"\n--- Recent Commits for {repo_data.get('name', 'N/A')} ---")
                for j, commit in enumerate(repo_commits[:3]):  # Limit to 3 most recent commits per repo
                    context_parts.append(f"\nCommit {j+1}:")
                    context_parts.append(f"  SHA: {commit.get('sha', 'N/A')}")
                    context_parts.append(f"  Message: {commit.get('message', 'N/A')}")
                    context_parts.append(f"  Author: {commit.get('author', {}).get('name', 'N/A')}")
                    context_parts.append(f"  Date: {commit.get('author', {}).get('date', 'N/A')}")
                    
                    stats = commit.get('stats', {})
                    context_parts.append(f"  Changes: +{stats.get('additions', 0)} -{stats.get('deletions', 0)} ({stats.get('total', 0)} total)")
                    
                    # Include file changes if available (only for first 2 commits)
                    if j < 2 and 'file_changes' in commit and commit['file_changes']:
                        context_parts.append(f"  Files Changed: {len(commit['file_changes'])}")
                        for file_change in commit['file_changes'][:2]:  # Limit to 2 files per commit
                            context_parts.append(f"    - {file_change.get('filename', 'N/A')} ({file_change.get('status', 'N/A')})")
                            if file_change.get('patch'):
                                # Include a snippet of the actual code changes (truncated)
                                patch_content = file_change['patch']
                                if len(patch_content) > 200:
                                    patch_content = patch_content[:200] + "..."
                                context_parts.append(f"      Code Changes: {patch_content}")
        
        # Cross-repository analysis
        context_parts.append(f"\n=== CROSS-REPOSITORY ANALYSIS ===")
        
        # Detect project types
        project_types = []
        for repo_data in repositories_data:
            name = (repo_data.get('name') or '').lower()
            description = (repo_data.get('description') or '').lower()
            
            if any(keyword in name or keyword in description for keyword in ['frontend', 'client', 'ui', 'react', 'vue', 'angular']):
                project_types.append('Frontend')
            elif any(keyword in name or keyword in description for keyword in ['backend', 'api', 'server', 'node', 'express', 'django', 'flask']):
                project_types.append('Backend')
            elif any(keyword in name or keyword in description for keyword in ['mobile', 'app', 'ios', 'android', 'react-native']):
                project_types.append('Mobile')
            elif any(keyword in name or keyword in description for keyword in ['database', 'db', 'sql', 'mongo']):
                project_types.append('Database')
            elif any(keyword in name or keyword in description for keyword in ['docs', 'documentation']):
                project_types.append('Documentation')
            else:
                project_types.append('Other')
        
        context_parts.append(f"Detected Project Types: {', '.join(project_types)}")
        
        # Analyze technology overlap
        all_languages = []
        for repo_data in repositories_data:
            languages = repo_data.get('languages', {})
            all_languages.extend(languages.keys())
        
        unique_languages = list(set(all_languages))
        context_parts.append(f"Technologies Used: {', '.join(unique_languages)}")
        
        # Detect potential connections
        connections = []
        if 'Frontend' in project_types and 'Backend' in project_types:
            connections.append('Frontend-Backend API Integration')
        if 'Mobile' in project_types and 'Backend' in project_types:
            connections.append('Mobile-Backend API Integration')
        if 'Database' in project_types:
            connections.append('Database Integration')
        if 'Documentation' in project_types:
            connections.append('Documentation & Code Alignment')
        
        if connections:
            context_parts.append(f"Potential Connections: {', '.join(connections)}")
        
        # Add Jira project management data if available
        if jira_data:
            context_parts.append("\n=== JIRA PROJECT MANAGEMENT DATA ===")
            for jira_project in jira_data:
                project_key = jira_project['project_key']
                history = jira_project['history']
                stats = history.get('ticket_statistics', {})
                breakdown = history.get('breakdown', {})
                
                context_parts.append(f"\n**Project {project_key}:**")
                context_parts.append(f"- Total tickets: {stats.get('total_tickets', 0)}")
                context_parts.append(f"- Created in period: {stats.get('created_in_period', 0)}")
                context_parts.append(f"- Updated in period: {stats.get('updated_in_period', 0)}")
                context_parts.append(f"- Recent activity: {stats.get('recent_activity', 0)}")
                
                # Add issue type breakdown
                issue_types = breakdown.get('issue_types', {})
                if issue_types:
                    context_parts.append(f"- Issue types: {', '.join([f'{k}({v})' for k, v in issue_types.items()])}")
                
                # Add status breakdown
                statuses = breakdown.get('statuses', {})
                if statuses:
                    context_parts.append(f"- Statuses: {', '.join([f'{k}({v})' for k, v in statuses.items()])}")
                
                # Add recent tickets
                recent_tickets = history.get('recent_tickets', [])
                if recent_tickets:
                    context_parts.append(f"- Recent tickets: {', '.join([ticket.get('key', 'N/A') for ticket in recent_tickets[:5]])}")
        
        return "\n".join(context_parts)
    
    def _create_multi_project_prompt(self, context: str, question: str) -> str:
        """
        Create a prompt for multi-project analysis
        
        Args:
            context: Multi-repository context
            question: User's question
            
        Returns:
            Formatted prompt for multi-project analysis
        """
        
        prompt = f"""
You are analyzing multiple connected GitHub repositories. Based on the repository data provided, please provide a comprehensive analysis that answers the user's question.

REPOSITORY DATA:
{context}

USER QUESTION: {question}

Please provide a detailed analysis that includes:

1. **Project Overview & Connections**
   - How these projects relate to each other
   - What type of system architecture they form
   - Key integration points and dependencies

2. **Technical Analysis**
   - Technology stack across all projects
   - API patterns and data flow
   - Shared components or services
   - Database schemas and data models

3. **Development Instructions**
   - Step-by-step integration guide
   - API endpoint documentation
   - Data flow diagrams (in text format)
   - Configuration requirements

4. **Complete LLM Development Prompts**
   - Ready-to-use prompts for frontend development that include backend context
   - API schema documentation for each endpoint
   - Data structure definitions
   - Integration patterns and best practices

5. **Cross-Project Insights**
   - How to adapt one project to work with another
   - Common patterns and conventions
   - Potential issues and solutions
   - Scalability considerations

6. **Project Management Integration** (if Jira data is available)
   - Project health and status analysis
   - Workload distribution and team capacity
   - Ticket trends and development velocity
   - Risk assessment and bottleneck identification
   - Recommendations for project management improvements

**IMPORTANT FORMATTING REQUIREMENTS:**
- Use proper markdown code blocks for ALL code, JSON, configuration files, and technical content
- Use ```json for JSON schemas and API responses
- Use ```bash for shell commands and installation steps
- Use ```typescript, ```javascript, ```python, etc. for code examples
- Use ```yaml for configuration files
- Use ```text for data flow diagrams
- Always wrap code examples in appropriate code blocks with language specification
- Make API schemas, data structures, and configuration examples clearly formatted in code blocks

Focus on providing actionable, detailed instructions that would enable someone without deep knowledge of the codebase to:
- Understand how the projects work together
- Integrate them successfully
- Develop new features that work across projects
- Use the information to create complete prompts for AI-assisted development

Make the response practical and immediately useful for development tasks with proper code formatting.
"""
        
        return prompt.strip()

    def analyze_jira_project_history(self, project_history: Dict[str, Any]) -> str:
        """
        Analyze Jira project history and provide comprehensive insights
        
        Args:
            project_history: Dictionary containing project history data from Jira
            
        Returns:
            AI-generated analysis and insights about the project
        """
        try:
            # Prepare context data for the AI
            context = self._prepare_jira_context(project_history)
            
            # Create the prompt for the AI
            prompt = self._create_jira_analysis_prompt(context)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert project manager and business analyst. You analyze Jira project data and provide comprehensive insights about project health, trends, and recommendations. Focus on actionable insights and business value."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating Jira analysis: {str(e)}"
    
    def _prepare_jira_context(self, project_history: Dict[str, Any]) -> str:
        """Prepare Jira project history context for AI analysis"""
        
        stats = project_history.get('ticket_statistics', {})
        breakdown = project_history.get('breakdown', {})
        analysis_period = project_history.get('analysis_period', {})
        
        context = f"""
**Project Analysis Period**: {analysis_period.get('start_date')} to {analysis_period.get('end_date')} ({analysis_period.get('days_analyzed')} days)

**Ticket Statistics**:
- Total tickets in project: {stats.get('total_tickets', 0)}
- Tickets created in period: {stats.get('created_in_period', 0)}
- Tickets updated in period: {stats.get('updated_in_period', 0)}
- Recent activity (last 7 days): {stats.get('recent_activity', 0)}

**Issue Type Breakdown**:
"""
        
        for issue_type, count in breakdown.get('issue_types', {}).items():
            context += f"- {issue_type}: {count}\n"
        
        context += "\n**Priority Distribution**:\n"
        for priority, count in breakdown.get('priorities', {}).items():
            context += f"- {priority}: {count}\n"
        
        context += "\n**Status Distribution**:\n"
        for status, count in breakdown.get('statuses', {}).items():
            context += f"- {status}: {count}\n"
        
        context += "\n**Top Labels**:\n"
        sorted_labels = sorted(breakdown.get('labels', {}).items(), key=lambda x: x[1], reverse=True)
        for label, count in sorted_labels[:10]:  # Top 10 labels
            context += f"- {label}: {count}\n"
        
        # Add recent tickets context
        recent_tickets = project_history.get('recent_tickets', [])
        if recent_tickets:
            context += f"\n**Recent Activity (Last 7 Days)**:\n"
            for ticket in recent_tickets[:5]:  # Show top 5 recent tickets
                context += f"- {ticket.get('key', 'N/A')}: {ticket.get('summary', 'No summary')}\n"
        
        return context
    
    def _create_jira_analysis_prompt(self, context: str) -> str:
        """Create prompt for Jira project analysis"""
        
        return f"""
Analyze the following Jira project data and provide comprehensive insights:

{context}

Please provide a detailed analysis covering:

1. **Project Health Assessment**
   - Overall project status and health
   - Key metrics and trends
   - Areas of concern or success

2. **Workload Analysis**
   - Team capacity and utilization
   - Priority distribution insights
   - Issue type patterns

3. **Business Insights**
   - Business value and impact
   - Customer focus areas
   - Strategic priorities

4. **Process Improvements**
   - Workflow optimization opportunities
   - Bottlenecks and inefficiencies
   - Best practices recommendations

5. **Actionable Recommendations**
   - Immediate actions needed
   - Long-term strategic initiatives
   - Resource allocation suggestions

6. **Risk Assessment**
   - Potential risks and mitigation strategies
   - Dependencies and blockers
   - Quality concerns

Provide specific, actionable insights that would help project managers and stakeholders make informed decisions.
"""

