#!/usr/bin/env python3
"""
Demo script for 3-minute presentation of AI-to-Jira integration
"""

import requests
import json
import time

# Configuration
API_BASE_URL = "http://localhost:3000"

def demo_ai_jira_integration():
    """Demo the AI-to-Jira integration for the presentation"""
    
    print("🎬 Commet AI-to-Jira Integration Demo")
    print("=" * 50)
    
    # Demo 1: Security Analysis with Auto-Ticket Creation
    print("\n🔒 Demo 1: Security Vulnerability Detection")
    print("-" * 40)
    
    security_payload = {
        "question": "What security vulnerabilities exist in this repository?",
        "repo": "microsoft/vscode",
        "branch": "main",  # Add branch parameter
        "commits_limit": 15,
        "auto_create_tickets": True
    }
    
    print("Asking AI: 'What security vulnerabilities exist in this repository?'")
    print("Repository: microsoft/vscode")
    print("Analyzing commits and code...")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/chat",
            json=security_payload,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"\n✅ AI Analysis Complete!")
            print(f"Repository: {data.get('repository')}")
            print(f"Commits Analyzed: {data.get('analysis_data', {}).get('commits_analyzed', 0)}")
            
            # Show AI response
            ai_response = data.get('ai_response', '')
            print(f"\n🤖 AI Response:")
            print("-" * 20)
            # Show first 300 characters
            preview = ai_response[:300] + "..." if len(ai_response) > 300 else ai_response
            print(preview)
            
            # Show created tickets
            tickets = data.get('jira_tickets_created', [])
            if tickets:
                print(f"\n🎫 Jira Tickets Created: {len(tickets)}")
                for ticket in tickets:
                    print(f"   ✅ {ticket['type'].title()}: {ticket['title']}")
                    print(f"      Priority: {ticket['priority']} | Severity: {ticket['severity']}")
            else:
                print("\nℹ️  No tickets created (no issues detected or Jira not configured)")
                
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Demo failed: {str(e)}")
    
    print("\n" + "=" * 50)
    
    # Demo 2: Code Quality Analysis
    print("\n📊 Demo 2: Code Quality Analysis")
    print("-" * 40)
    
    quality_payload = {
        "question": "What are the code quality issues and technical debt in this repository?",
        "repo": "facebook/react",
        "branch": "main",  # Add branch parameter
        "commits_limit": 10,
        "auto_create_tickets": True
    }
    
    print("Asking AI: 'What are the code quality issues and technical debt?'")
    print("Repository: facebook/react")
    print("Analyzing code patterns...")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/chat",
            json=quality_payload,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"\n✅ AI Analysis Complete!")
            
            # Show created tickets
            tickets = data.get('jira_tickets_created', [])
            if tickets:
                print(f"\n🎫 Jira Tickets Created: {len(tickets)}")
                for ticket in tickets:
                    print(f"   ✅ {ticket['type'].title()}: {ticket['title']}")
                    print(f"      Priority: {ticket['priority']} | Category: {ticket['category']}")
            else:
                print("\nℹ️  No tickets created (no issues detected or Jira not configured)")
                
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Demo failed: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Demo Summary:")
    print("✅ AI analyzes repositories for issues")
    print("✅ Automatically creates Jira tickets for detected problems")
    print("✅ Proper priority mapping and categorization")
    print("✅ Complete workflow automation")

def check_prerequisites():
    """Check if server and Jira are configured"""
    
    print("🔍 Checking Prerequisites...")
    
    # Check server
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Server is running")
        else:
            print("❌ Server not responding")
            return False
    except:
        print("❌ Server not accessible - run: python server.py")
        return False
    
    # Check Jira
    try:
        response = requests.post(f"{API_BASE_URL}/api/integrations/jira/test")
        if response.status_code == 200:
            data = response.json()
            if data.get('connected'):
                print("✅ Jira integration configured")
                return True
            else:
                print("⚠️  Jira not connected - tickets won't be created")
                return True  # Continue demo anyway
        else:
            print("⚠️  Jira integration not configured")
            return True  # Continue demo anyway
    except:
        print("⚠️  Jira integration not available")
        return True  # Continue demo anyway

if __name__ == "__main__":
    if check_prerequisites():
        print("\n🚀 Starting Demo...")
        demo_ai_jira_integration()
    else:
        print("\n❌ Prerequisites not met. Please check server and Jira configuration.")
