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

Answer in a clear, professional manner suitable for developers and technical stakeholders.
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

