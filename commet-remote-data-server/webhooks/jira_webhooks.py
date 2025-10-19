"""
Jira webhook handlers for real-time integration
"""

import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class JiraWebhookHandler:
    """Handle Jira webhooks for real-time integration"""
    
    def __init__(self, jira_integration=None):
        """
        Initialize Jira webhook handler
        
        Args:
            jira_integration: JiraIntegration instance
        """
        self.jira_integration = jira_integration
    
    def handle_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle incoming Jira webhook
        
        Args:
            payload: Jira webhook payload
            
        Returns:
            Response dictionary
        """
        try:
            webhook_event = payload.get('webhookEvent')
            logger.info(f"Received Jira webhook: {webhook_event}")
            
            if webhook_event == 'jira:issue_created':
                return self._handle_issue_created(payload)
            elif webhook_event == 'jira:issue_updated':
                return self._handle_issue_updated(payload)
            elif webhook_event == 'jira:issue_deleted':
                return self._handle_issue_deleted(payload)
            elif webhook_event == 'jira:worklog_created':
                return self._handle_worklog_created(payload)
            elif webhook_event == 'jira:worklog_updated':
                return self._handle_worklog_updated(payload)
            elif webhook_event == 'jira:worklog_deleted':
                return self._handle_worklog_deleted(payload)
            else:
                logger.info(f"Unhandled Jira webhook event: {webhook_event}")
                return {'status': 'ignored', 'message': f'Event {webhook_event} not handled'}
                
        except Exception as e:
            logger.error(f"Error handling Jira webhook: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_issue_created(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle issue created webhook"""
        try:
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            issue_summary = issue.get('fields', {}).get('summary', '')
            
            logger.info(f"New Jira issue created: {issue_key} - {issue_summary}")
            
            # You can add custom logic here, such as:
            # - Notify team members
            # - Create related GitHub issues
            # - Update project dashboards
            # - Send notifications to Slack/Discord
            
            return {
                'status': 'success',
                'message': f'Issue {issue_key} created successfully',
                'issue_key': issue_key
            }
            
        except Exception as e:
            logger.error(f"Error handling issue created: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_issue_updated(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle issue updated webhook"""
        try:
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            changelog = payload.get('changelog', {})
            
            logger.info(f"Jira issue updated: {issue_key}")
            
            # Check what fields were changed
            items = changelog.get('items', [])
            for item in items:
                field = item.get('field')
                from_string = item.get('fromString')
                to_string = item.get('toString')
                
                logger.info(f"Field '{field}' changed from '{from_string}' to '{to_string}'")
                
                # Handle specific field changes
                if field == 'status':
                    self._handle_status_change(issue_key, from_string, to_string)
                elif field == 'assignee':
                    self._handle_assignee_change(issue_key, from_string, to_string)
                elif field == 'priority':
                    self._handle_priority_change(issue_key, from_string, to_string)
            
            return {
                'status': 'success',
                'message': f'Issue {issue_key} updated successfully',
                'issue_key': issue_key,
                'changes': len(items)
            }
            
        except Exception as e:
            logger.error(f"Error handling issue updated: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_issue_deleted(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle issue deleted webhook"""
        try:
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            
            logger.info(f"Jira issue deleted: {issue_key}")
            
            # You can add custom logic here, such as:
            # - Clean up related resources
            # - Update project metrics
            # - Notify stakeholders
            
            return {
                'status': 'success',
                'message': f'Issue {issue_key} deleted successfully',
                'issue_key': issue_key
            }
            
        except Exception as e:
            logger.error(f"Error handling issue deleted: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_worklog_created(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle worklog created webhook"""
        try:
            worklog = payload.get('worklog', {})
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            
            logger.info(f"Worklog created for issue {issue_key}")
            
            # You can add custom logic here, such as:
            # - Update time tracking metrics
            # - Calculate project velocity
            # - Send progress notifications
            
            return {
                'status': 'success',
                'message': f'Worklog created for issue {issue_key}',
                'issue_key': issue_key
            }
            
        except Exception as e:
            logger.error(f"Error handling worklog created: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_worklog_updated(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle worklog updated webhook"""
        try:
            worklog = payload.get('worklog', {})
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            
            logger.info(f"Worklog updated for issue {issue_key}")
            
            return {
                'status': 'success',
                'message': f'Worklog updated for issue {issue_key}',
                'issue_key': issue_key
            }
            
        except Exception as e:
            logger.error(f"Error handling worklog updated: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_worklog_deleted(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle worklog deleted webhook"""
        try:
            worklog = payload.get('worklog', {})
            issue = payload.get('issue', {})
            issue_key = issue.get('key')
            
            logger.info(f"Worklog deleted for issue {issue_key}")
            
            return {
                'status': 'success',
                'message': f'Worklog deleted for issue {issue_key}',
                'issue_key': issue_key
            }
            
        except Exception as e:
            logger.error(f"Error handling worklog deleted: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _handle_status_change(self, issue_key: str, from_status: str, to_status: str):
        """Handle issue status change"""
        logger.info(f"Issue {issue_key} status changed from '{from_status}' to '{to_status}'")
        
        # You can add custom logic here, such as:
        # - Update project dashboards
        # - Send notifications
        # - Trigger automated actions
        
        if to_status.lower() in ['done', 'closed', 'resolved']:
            logger.info(f"Issue {issue_key} completed!")
            # Could trigger deployment, release notes, etc.
    
    def _handle_assignee_change(self, issue_key: str, from_assignee: str, to_assignee: str):
        """Handle issue assignee change"""
        logger.info(f"Issue {issue_key} assignee changed from '{from_assignee}' to '{to_assignee}'")
        
        # You can add custom logic here, such as:
        # - Send notifications to new assignee
        # - Update team workload metrics
        # - Create calendar events
    
    def _handle_priority_change(self, issue_key: str, from_priority: str, to_priority: str):
        """Handle issue priority change"""
        logger.info(f"Issue {issue_key} priority changed from '{from_priority}' to '{to_priority}'")
        
        # You can add custom logic here, such as:
        # - Send urgent notifications
        # - Update project risk metrics
        # - Escalate to management if critical
