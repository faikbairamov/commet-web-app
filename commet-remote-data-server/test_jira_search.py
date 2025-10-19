#!/usr/bin/env python3
"""
Test script to verify Jira search functionality
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from integrations.project_management.jira import JiraIntegration

def test_jira_search():
    """Test Jira search functionality"""
    
    # Load environment variables
    load_dotenv()
    
    jira_url = os.getenv('JIRA_URL')
    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')
    jira_project = os.getenv('JIRA_PROJECT_KEY')
    
    if not all([jira_url, jira_email, jira_token, jira_project]):
        print("❌ Jira configuration incomplete!")
        return False
    
    print(f"🔍 Testing Jira Search for Project: {jira_project}")
    print()
    
    try:
        # Initialize Jira integration
        config = {
            'base_url': jira_url,
            'email': jira_email,
            'api_token': jira_token,
            'project_key': jira_project,
            'enabled': True
        }
        
        jira = JiraIntegration(config)
        
        # Test connection
        if not jira.test_connection():
            print("❌ Connection failed!")
            return False
        print("✅ Connection successful!")
        print()
        
        # Test different search queries
        search_queries = [
            f"project = {jira_project}",
            f"project = {jira_project} ORDER BY created DESC",
            f"project = {jira_project} AND labels = commet-test",
            f"project = {jira_project} AND summary ~ 'Commet'",
        ]
        
        for i, jql in enumerate(search_queries, 1):
            print(f"{i}️⃣ Testing search: {jql}")
            try:
                tickets = jira.search_tickets(jql, max_results=5)
                print(f"   ✅ Found {len(tickets)} tickets")
                
                for ticket in tickets[:3]:  # Show first 3
                    key = ticket.get('key', 'Unknown')
                    summary = ticket.get('fields', {}).get('summary', 'No summary')
                    print(f"      - {key}: {summary}")
                    
            except Exception as e:
                print(f"   ❌ Search failed: {str(e)}")
            print()
        
        print("🎉 Search testing completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    test_jira_search()
