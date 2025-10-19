"""
Jira integration for project management and ticket tracking
"""

import re
import base64
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging

from ..base_integration import BaseIntegration

logger = logging.getLogger(__name__)

class JiraIntegration(BaseIntegration):
    """Jira integration for project management and ticket tracking"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize Jira integration
        
        Args:
            config: Dictionary containing Jira configuration
                - base_url: Jira instance URL (e.g., https://company.atlassian.net)
                - email: Jira user email
                - api_token: Jira API token
                - project_key: Default project key for ticket creation
        """
        # Set email before calling super().__init__ to avoid attribute errors
        self.email = config.get('email')
        self.project_key = config.get('project_key')
        
        if not self.email:
            raise ValueError("email is required for Jira integration")
        
        super().__init__(config)
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for Jira API requests"""
        # Create basic auth header
        auth_string = f"{self.email}:{self.api_key}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        return {
            'Authorization': f'Basic {auth_b64}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def test_connection(self) -> bool:
        """Test Jira connection"""
        try:
            response = self._make_request('GET', '/rest/api/3/myself')
            return response is not None and response.status_code == 200
        except Exception as e:
            logger.error(f"Jira connection test failed: {str(e)}")
            return False
    
    def send_data(self, data: Dict[str, Any]) -> bool:
        """Send data to Jira (generic method)"""
        try:
            if data.get('type') == 'create_ticket':
                return self.create_ticket(data.get('ticket_data', {}))
            elif data.get('type') == 'update_ticket':
                return self.update_ticket(data.get('ticket_key'), data.get('updates', {}))
            elif data.get('type') == 'add_worklog':
                return self.add_worklog(
                    data.get('ticket_key'),
                    data.get('time_spent'),
                    data.get('comment', ''),
                    data.get('started')
                )
            else:
                logger.warning(f"Unknown data type: {data.get('type')}")
                return False
        except Exception as e:
            logger.error(f"Failed to send data to Jira: {str(e)}")
            return False
    
    def extract_ticket_key(self, text: str) -> Optional[str]:
        """
        Extract Jira ticket key from text (e.g., PROJ-123)
        
        Args:
            text: Text to search for ticket key
            
        Returns:
            Ticket key if found, None otherwise
        """
        # Pattern to match JIRA ticket keys (PROJECT-123)
        pattern = r'\b([A-Z][A-Z0-9]+-\d+)\b'
        matches = re.findall(pattern, text.upper())
        return matches[0] if matches else None
    
    def create_ticket(self, ticket_data: Dict[str, Any]) -> bool:
        """
        Create a new Jira ticket
        
        Args:
            ticket_data: Dictionary containing ticket information
                - project_key: Project key (optional, uses default if not provided)
                - summary: Ticket summary
                - description: Ticket description
                - issue_type: Issue type (default: auto-detect from project)
                - priority: Priority level (default: Medium)
                - labels: List of labels
                
        Returns:
            True if ticket created successfully, False otherwise
        """
        try:
            project_key = ticket_data.get('project_key', self.project_key)
            if not project_key:
                logger.error("No project key provided for ticket creation")
                return False
            
            # Get the correct issue type for the project
            issue_type = ticket_data.get('issue_type')
            if not issue_type:
                issue_type = self.get_default_issue_type(project_key)
                logger.info(f"Using default issue type '{issue_type}' for project {project_key}")
            
            # Prepare ticket payload
            description = ticket_data.get('description', '')
            
            # Convert description to Atlassian Document Format if it's plain text
            if description and not isinstance(description, dict):
                description = self._convert_to_atlassian_doc_format(description)
            
            payload = {
                'fields': {
                    'project': {'key': project_key},
                    'summary': ticket_data.get('summary', 'Commet Analysis Ticket'),
                    'description': description,
                    'issuetype': {'name': issue_type},
                    'priority': {'name': ticket_data.get('priority', 'Medium')}
                }
            }
            
            # Add labels if provided
            if ticket_data.get('labels'):
                payload['fields']['labels'] = ticket_data['labels']
            
            # Add assignee if provided
            if ticket_data.get('assignee'):
                payload['fields']['assignee'] = {'name': ticket_data['assignee']}
            
            response = self._make_request('POST', '/rest/api/3/issue', data=payload)
            
            if response and response.status_code == 201:
                ticket_info = response.json()
                logger.info(f"Created Jira ticket: {ticket_info.get('key')}")
                return True
            else:
                logger.error(f"Failed to create Jira ticket: {response.text if response else 'No response'}")
                return False
                
        except Exception as e:
            logger.error(f"Error creating Jira ticket: {str(e)}")
            return False
    
    def update_ticket(self, ticket_key: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing Jira ticket
        
        Args:
            ticket_key: Jira ticket key (e.g., PROJ-123)
            updates: Dictionary containing updates
                - summary: New summary
                - description: New description
                - priority: New priority
                - status: New status
                - assignee: New assignee
                
        Returns:
            True if ticket updated successfully, False otherwise
        """
        try:
            payload = {'fields': {}}
            
            # Map updates to Jira fields
            if 'summary' in updates:
                payload['fields']['summary'] = updates['summary']
            if 'description' in updates:
                payload['fields']['description'] = updates['description']
            if 'priority' in updates:
                payload['fields']['priority'] = {'name': updates['priority']}
            if 'assignee' in updates:
                payload['fields']['assignee'] = {'name': updates['assignee']}
            
            response = self._make_request('PUT', f'/rest/api/3/issue/{ticket_key}', data=payload)
            
            if response and response.status_code == 204:
                logger.info(f"Updated Jira ticket: {ticket_key}")
                return True
            else:
                logger.error(f"Failed to update Jira ticket {ticket_key}: {response.text if response else 'No response'}")
                return False
                
        except Exception as e:
            logger.error(f"Error updating Jira ticket {ticket_key}: {str(e)}")
            return False
    
    def add_worklog(self, ticket_key: str, time_spent: str, comment: str = '', 
                   started: Optional[str] = None) -> bool:
        """
        Add worklog entry to Jira ticket
        
        Args:
            ticket_key: Jira ticket key
            time_spent: Time spent (e.g., "2h 30m", "1d")
            comment: Worklog comment
            started: Start time (ISO format, defaults to now)
            
        Returns:
            True if worklog added successfully, False otherwise
        """
        try:
            if not started:
                started = datetime.now().isoformat()
            
            payload = {
                'timeSpent': time_spent,
                'comment': comment,
                'started': started
            }
            
            response = self._make_request('POST', f'/rest/api/3/issue/{ticket_key}/worklog', data=payload)
            
            if response and response.status_code == 201:
                logger.info(f"Added worklog to Jira ticket: {ticket_key}")
                return True
            else:
                logger.error(f"Failed to add worklog to ticket {ticket_key}: {response.text if response else 'No response'}")
                return False
                
        except Exception as e:
            logger.error(f"Error adding worklog to ticket {ticket_key}: {str(e)}")
            return False
    
    def transition_ticket(self, ticket_key: str, transition_name: str) -> bool:
        """
        Transition Jira ticket to new status
        
        Args:
            ticket_key: Jira ticket key
            transition_name: Name of transition (e.g., "In Progress", "Done")
            
        Returns:
            True if transition successful, False otherwise
        """
        try:
            # First, get available transitions
            response = self._make_request('GET', f'/rest/api/3/issue/{ticket_key}/transitions')
            
            if not response or response.status_code != 200:
                logger.error(f"Failed to get transitions for ticket {ticket_key}")
                return False
            
            transitions = response.json().get('transitions', [])
            
            # Find the transition by name
            target_transition = None
            for transition in transitions:
                if transition['name'].lower() == transition_name.lower():
                    target_transition = transition
                    break
            
            if not target_transition:
                logger.error(f"Transition '{transition_name}' not found for ticket {ticket_key}")
                return False
            
            # Execute the transition
            payload = {
                'transition': {'id': target_transition['id']}
            }
            
            response = self._make_request('POST', f'/rest/api/3/issue/{ticket_key}/transitions', data=payload)
            
            if response and response.status_code == 204:
                logger.info(f"Transitioned Jira ticket {ticket_key} to '{transition_name}'")
                return True
            else:
                logger.error(f"Failed to transition ticket {ticket_key}: {response.text if response else 'No response'}")
                return False
                
        except Exception as e:
            logger.error(f"Error transitioning ticket {ticket_key}: {str(e)}")
            return False
    
    def get_ticket(self, ticket_key: str) -> Optional[Dict[str, Any]]:
        """
        Get Jira ticket information
        
        Args:
            ticket_key: Jira ticket key
            
        Returns:
            Ticket information dictionary or None if not found
        """
        try:
            response = self._make_request('GET', f'/rest/api/3/issue/{ticket_key}')
            
            if response and response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get ticket {ticket_key}: {response.text if response else 'No response'}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting ticket {ticket_key}: {str(e)}")
            return None
    
    def get_project_issue_types(self, project_key: str) -> List[Dict[str, Any]]:
        """
        Get available issue types for a project
        
        Args:
            project_key: Jira project key
            
        Returns:
            List of issue type information dictionaries
        """
        try:
            response = self._make_request('GET', f'/rest/api/3/project/{project_key}')
            
            if response and response.status_code == 200:
                project_data = response.json()
                return project_data.get('issueTypes', [])
            else:
                logger.error(f"Failed to get project {project_key}: {response.text if response else 'No response'}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting project issue types: {str(e)}")
            return []
    
    def get_default_issue_type(self, project_key: str) -> str:
        """
        Get the default issue type for a project
        
        Args:
            project_key: Jira project key
            
        Returns:
            Default issue type name
        """
        try:
            issue_types = self.get_project_issue_types(project_key)
            
            # Look for common issue types in order of preference
            preferred_types = ['Task', 'Story', 'Bug', 'Sub-task', 'Epic']
            
            for preferred_type in preferred_types:
                for issue_type in issue_types:
                    if issue_type.get('name') == preferred_type:
                        return preferred_type
            
            # If no preferred type found, return the first available type
            if issue_types:
                return issue_types[0].get('name', 'Task')
            
            return 'Task'  # Fallback
            
        except Exception as e:
            logger.error(f"Error getting default issue type: {str(e)}")
            return 'Task'
    
    def search_tickets(self, jql: str, max_results: int = 50) -> List[Dict[str, Any]]:
        """
        Search Jira tickets using JQL
        
        Args:
            jql: JQL query string
            max_results: Maximum number of results to return
            
        Returns:
            List of ticket information dictionaries
        """
        try:
            payload = {
                'jql': jql,
                'maxResults': max_results,
                'fields': ['key', 'summary', 'description', 'status', 'assignee', 'created', 'updated', 'labels', 'issuetype', 'priority']
            }
            
            # Use the correct Jira API v3 search endpoint
            response = self._make_request('POST', '/rest/api/3/search/jql', data=payload)
            
            if response and response.status_code == 200:
                data = response.json()
                issues = data.get('issues', [])
                
                # Process the issues to extract relevant information
                processed_tickets = []
                for issue in issues:
                    fields = issue.get('fields', {})
                    ticket = {
                        'key': issue.get('key'),
                        'summary': fields.get('summary'),
                        'description': fields.get('description'),
                        'status': fields.get('status', {}).get('name'),
                        'assignee': fields.get('assignee', {}).get('displayName') if fields.get('assignee') else 'Unassigned',
                        'created': fields.get('created'),
                        'updated': fields.get('updated'),
                        'labels': fields.get('labels', []),
                        'issuetype': fields.get('issuetype', {}).get('name'),
                        'priority': fields.get('priority', {}).get('name')
                    }
                    processed_tickets.append(ticket)
                
                return processed_tickets
            elif response and response.status_code == 410:
                # API deprecated warning, but search might still work
                logger.warning("Jira search API returned 410 (deprecated), but continuing...")
                # Try to parse the response anyway
                try:
                    data = response.json()
                    issues = data.get('issues', [])
                    processed_tickets = []
                    for issue in issues:
                        fields = issue.get('fields', {})
                        ticket = {
                            'key': issue.get('key'),
                            'summary': fields.get('summary'),
                            'description': fields.get('description'),
                            'status': fields.get('status', {}).get('name'),
                            'assignee': fields.get('assignee', {}).get('displayName') if fields.get('assignee') else 'Unassigned',
                            'created': fields.get('created'),
                            'updated': fields.get('updated'),
                            'labels': fields.get('labels', []),
                            'issuetype': fields.get('issuetype', {}).get('name'),
                            'priority': fields.get('priority', {}).get('name')
                        }
                        processed_tickets.append(ticket)
                    return processed_tickets
                except:
                    return []
            else:
                logger.error(f"Failed to search tickets: {response.text if response else 'No response'}")
                return []
                
        except Exception as e:
            logger.error(f"Error searching tickets: {str(e)}")
            return []
    
    def sync_commit_to_ticket(self, commit_data: Dict[str, Any], ticket_key: str) -> bool:
        """
        Sync GitHub commit with Jira ticket
        
        Args:
            commit_data: GitHub commit information
            ticket_key: Jira ticket key
            
        Returns:
            True if sync successful, False otherwise
        """
        try:
            # Estimate time spent based on commit stats
            time_spent = self._estimate_time_spent(commit_data)
            
            # Create worklog comment
            comment = f"""
**Commet Analysis - Commit Sync**

**Commit**: {commit_data.get('sha', 'N/A')[:8]}
**Message**: {commit_data.get('message', 'N/A')}
**Author**: {commit_data.get('author', {}).get('name', 'N/A')}
**Date**: {commit_data.get('author', {}).get('date', 'N/A')}

**Changes**:
- Additions: {commit_data.get('stats', {}).get('additions', 0)}
- Deletions: {commit_data.get('stats', {}).get('deletions', 0)}
- Total: {commit_data.get('stats', {}).get('total', 0)}

**Commit URL**: {commit_data.get('url', 'N/A')}
            """.strip()
            
            # Add worklog entry
            success = self.add_worklog(ticket_key, time_spent, comment)
            
            if success:
                # Auto-transition based on commit message
                self._auto_transition_ticket(commit_data, ticket_key)
            
            return success
            
        except Exception as e:
            logger.error(f"Error syncing commit to ticket {ticket_key}: {str(e)}")
            return False
    
    def create_quality_ticket(self, analysis_data: Dict[str, Any], project_key: str = None) -> bool:
        """
        Create Jira ticket for code quality issues
        
        Args:
            analysis_data: Code analysis results
            project_key: Project key (uses default if not provided)
            
        Returns:
            True if ticket created successfully, False otherwise
        """
        try:
            project_key = project_key or self.project_key
            if not project_key:
                logger.error("No project key provided for quality ticket creation")
                return False
            
            # Determine priority based on severity
            severity = analysis_data.get('severity', 'medium').lower()
            priority = self._map_severity_to_priority(severity)
            
            # Create ticket data (let create_ticket determine the correct issue type)
            ticket_data = {
                'project_key': project_key,
                'summary': f"Code Quality: {analysis_data.get('title', 'Issue Found')}",
                'description': self._format_quality_issue_description(analysis_data),
                'priority': priority,
                'labels': ['commet-analysis', 'code-quality', f'severity-{severity}']
            }
            
            return self.create_ticket(ticket_data)
            
        except Exception as e:
            logger.error(f"Error creating quality ticket: {str(e)}")
            return False
    
    def _estimate_time_spent(self, commit_data: Dict[str, Any]) -> str:
        """Estimate time spent based on commit statistics"""
        stats = commit_data.get('stats', {})
        total_changes = stats.get('total', 0)
        
        # Rough estimation: 1 minute per 10 lines of code
        estimated_minutes = max(1, total_changes // 10)
        
        if estimated_minutes < 60:
            return f"{estimated_minutes}m"
        else:
            hours = estimated_minutes // 60
            minutes = estimated_minutes % 60
            if minutes == 0:
                return f"{hours}h"
            else:
                return f"{hours}h {minutes}m"
    
    def _auto_transition_ticket(self, commit_data: Dict[str, Any], ticket_key: str):
        """Auto-transition ticket based on commit message"""
        message = commit_data.get('message', '').lower()
        
        if any(keyword in message for keyword in ['fix', 'resolve', 'close']):
            self.transition_ticket(ticket_key, 'Done')
        elif any(keyword in message for keyword in ['wip', 'work in progress']):
            self.transition_ticket(ticket_key, 'In Progress')
        elif any(keyword in message for keyword in ['start', 'begin']):
            self.transition_ticket(ticket_key, 'In Progress')
    
    def _map_severity_to_priority(self, severity: str) -> str:
        """Map severity level to Jira priority"""
        severity_map = {
            'critical': 'Highest',
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low',
            'info': 'Lowest'
        }
        return severity_map.get(severity.lower(), 'Medium')
    
    def _convert_to_atlassian_doc_format(self, text: str) -> Dict[str, Any]:
        """
        Convert plain text to Atlassian Document Format
        
        Args:
            text: Plain text to convert
            
        Returns:
            Atlassian Document Format dictionary
        """
        # Split text into lines and convert to document format
        lines = text.strip().split('\n')
        content = []
        
        for line in lines:
            if line.strip():
                # Check if line is a header (starts with **)
                if line.strip().startswith('**') and line.strip().endswith('**'):
                    # Header
                    header_text = line.strip()[2:-2]  # Remove ** markers
                    content.append({
                        "type": "heading",
                        "attrs": {"level": 3},
                        "content": [{"type": "text", "text": header_text}]
                    })
                elif line.strip().startswith('```'):
                    # Code block start/end - skip for now
                    continue
                elif line.strip().startswith('- '):
                    # List item
                    list_text = line.strip()[2:]  # Remove - marker
                    content.append({
                        "type": "bulletList",
                        "content": [{
                            "type": "listItem",
                            "content": [{
                                "type": "paragraph",
                                "content": [{"type": "text", "text": list_text}]
                            }]
                        }]
                    })
                else:
                    # Regular paragraph
                    content.append({
                        "type": "paragraph",
                        "content": [{"type": "text", "text": line.strip()}]
                    })
            else:
                # Empty line - add paragraph break
                content.append({
                    "type": "paragraph",
                    "content": []
                })
        
        return {
            "type": "doc",
            "version": 1,
            "content": content
        }
    
    def _format_quality_issue_description(self, analysis_data: Dict[str, Any]) -> str:
        """Format code quality issue description for Jira"""
        return f"""
**Commet Code Quality Analysis**

**Issue**: {analysis_data.get('title', 'Code Quality Issue')}
**Severity**: {analysis_data.get('severity', 'Medium').title()}
**File**: {analysis_data.get('file_path', 'N/A')}
**Line**: {analysis_data.get('line_number', 'N/A')}

**Description**:
{analysis_data.get('description', 'No description available')}

**Recommendation**:
{analysis_data.get('recommendation', 'No recommendation available')}

**Code Context**:
```
{analysis_data.get('code_snippet', 'No code context available')}
```

**Analysis Details**:
- Quality Score: {analysis_data.get('quality_score', 'N/A')}/100
- Category: {analysis_data.get('category', 'N/A')}
- Detected: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---
*This ticket was automatically created by Commet based on code analysis.*
        """.strip()
    
    def get_project_history(self, project_key: str, days_back: int = 30) -> Dict[str, Any]:
        """
        Get comprehensive project history for analysis
        
        Args:
            project_key: Jira project key
            days_back: Number of days to look back
            
        Returns:
            Dictionary containing project history data
        """
        try:
            from datetime import datetime, timedelta
            
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            start_date_str = start_date.strftime('%Y-%m-%d')
            
            # Get all tickets created in the time period
            created_jql = f"project = {project_key} AND created >= '{start_date_str}'"
            created_tickets = self.search_tickets(created_jql, max_results=100)
            
            # Get all tickets updated in the time period
            updated_jql = f"project = {project_key} AND updated >= '{start_date_str}'"
            updated_tickets = self.search_tickets(updated_jql, max_results=100)
            
            # Get all tickets in the project (for overall stats)
            all_tickets_jql = f"project = {project_key}"
            all_tickets = self.search_tickets(all_tickets_jql, max_results=200)
            
            # Analyze ticket types and priorities
            issue_types = {}
            priorities = {}
            statuses = {}
            labels = {}
            
            for ticket in all_tickets:
                # Count issue types
                issue_type = ticket.get('issuetype', 'Unknown')
                issue_types[issue_type] = issue_types.get(issue_type, 0) + 1
                
                # Count priorities
                priority = ticket.get('priority', 'Unknown')
                priorities[priority] = priorities.get(priority, 0) + 1
                
                # Count statuses
                status = ticket.get('status', 'Unknown')
                statuses[status] = statuses.get(status, 0) + 1
                
                # Count labels
                for label in ticket.get('labels', []):
                    labels[label] = labels.get(label, 0) + 1
            
            # Get recent activity (last 7 days)
            recent_start = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            recent_jql = f"project = {project_key} AND updated >= '{recent_start}'"
            recent_tickets = self.search_tickets(recent_jql, max_results=50)
            
            return {
                'project_key': project_key,
                'analysis_period': {
                    'start_date': start_date_str,
                    'end_date': end_date.strftime('%Y-%m-%d'),
                    'days_analyzed': days_back
                },
                'ticket_statistics': {
                    'total_tickets': len(all_tickets),
                    'created_in_period': len(created_tickets),
                    'updated_in_period': len(updated_tickets),
                    'recent_activity': len(recent_tickets)
                },
                'breakdown': {
                    'issue_types': issue_types,
                    'priorities': priorities,
                    'statuses': statuses,
                    'labels': labels
                },
                'recent_tickets': recent_tickets,
                'created_tickets': created_tickets,
                'updated_tickets': updated_tickets,
                'all_tickets': all_tickets
            }
            
        except Exception as e:
            logger.error(f"Error getting project history: {str(e)}")
            return {}