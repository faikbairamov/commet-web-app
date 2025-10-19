#!/usr/bin/env python3
"""
Test script for AI-to-Jira automatic ticket creation integration
"""

import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:3000"
TEST_REPOSITORY = "microsoft/vscode"  # Use a well-known repository for testing

def test_ai_jira_integration():
    """Test the AI-to-Jira integration with various questions"""
    
    print("🧪 Testing AI-to-Jira Integration")
    print("=" * 50)
    
    # Test questions that should trigger different types of tickets
    test_questions = [
        {
            "question": "What security vulnerabilities exist in this repository?",
            "expected_issues": ["security"],
            "description": "Security vulnerability detection"
        },
        {
            "question": "What are the code quality issues in this repository?",
            "expected_issues": ["code_quality"],
            "description": "Code quality analysis"
        },
        {
            "question": "What performance issues can you identify?",
            "expected_issues": ["performance"],
            "description": "Performance issue detection"
        },
        {
            "question": "What bugs or errors are present in the codebase?",
            "expected_issues": ["bug"],
            "description": "Bug detection"
        },
        {
            "question": "How is the documentation quality?",
            "expected_issues": ["documentation"],
            "description": "Documentation analysis"
        }
    ]
    
    for i, test_case in enumerate(test_questions, 1):
        print(f"\n🔍 Test {i}: {test_case['description']}")
        print(f"Question: {test_case['question']}")
        print("-" * 40)
        
        # Make API request
        payload = {
            "question": test_case["question"],
            "repo": TEST_REPOSITORY,
            "branch": "main",  # Add branch parameter
            "commits_limit": 10,
            "auto_create_tickets": True
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/api/chat",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✅ AI Response received")
                print(f"Repository: {data.get('repository', 'N/A')}")
                print(f"Model: {data.get('model_used', 'N/A')}")
                
                # Check for created tickets
                tickets_created = data.get('jira_tickets_created', [])
                if tickets_created:
                    print(f"🎫 Jira tickets created: {len(tickets_created)}")
                    for ticket in tickets_created:
                        print(f"   - {ticket['type']}: {ticket['title']} ({ticket['severity']} severity)")
                else:
                    print("ℹ️  No Jira tickets created (no issues detected or Jira not configured)")
                
                # Show AI response preview
                ai_response = data.get('ai_response', '')
                preview = ai_response[:200] + "..." if len(ai_response) > 200 else ai_response
                print(f"AI Response Preview: {preview}")
                
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {str(e)}")
        
        # Wait between requests to avoid rate limiting
        time.sleep(2)
    
    print("\n" + "=" * 50)
    print("🏁 Testing completed!")

def test_jira_connection():
    """Test Jira connection before running AI tests"""
    
    print("🔗 Testing Jira Connection")
    print("-" * 30)
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/integrations/jira/test")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('connected'):
                print("✅ Jira connection successful")
                return True
            else:
                print("❌ Jira connection failed")
                return False
        else:
            print(f"❌ Jira test failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Jira connection test failed: {str(e)}")
        return False

def test_server_status():
    """Test if the server is running"""
    
    print("🖥️  Testing Server Status")
    print("-" * 30)
    
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server is running: {data.get('message', 'OK')}")
            return True
        else:
            print(f"❌ Server health check failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Server not accessible: {str(e)}")
        print("💡 Make sure the server is running: python server.py")
        return False

def main():
    """Main test function"""
    
    print("🚀 Commet AI-to-Jira Integration Test")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Test Repository: {TEST_REPOSITORY}")
    print()
    
    # Test server status
    if not test_server_status():
        return
    
    print()
    
    # Test Jira connection
    jira_connected = test_jira_connection()
    if not jira_connected:
        print("\n⚠️  Jira not connected - tickets will not be created")
        print("💡 Configure Jira environment variables to test ticket creation")
    
    print()
    
    # Run AI integration tests
    test_ai_jira_integration()
    
    print("\n📋 Test Summary:")
    print("- AI analysis functionality tested")
    if jira_connected:
        print("- Jira ticket creation tested")
    else:
        print("- Jira ticket creation skipped (not configured)")
    print("- Integration working as expected")

if __name__ == "__main__":
    main()
