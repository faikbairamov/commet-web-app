#!/bin/bash
# jira-history-demo.sh - Demo the Jira history analysis feature

echo "🎯 Commet Jira History Analysis Demo"
echo "===================================="
echo ""

echo "📊 Step 1: Get Project History Data"
echo "==================================="
echo "Fetching project history from Jira..."

curl -s -X GET "http://localhost:3000/api/integrations/jira/project-history?project_key=COMM&days_back=30" | jq '{
  project_key: .project_key,
  analysis_period: .analysis_period,
  ticket_statistics: .ticket_statistics,
  breakdown: .breakdown
}'

echo ""
echo "🤖 Step 2: AI-Powered Project Analysis"
echo "======================================"
echo "Generating comprehensive AI analysis..."

curl -s -X POST http://localhost:3000/api/integrations/jira/project-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "days_back": 30
  }' | jq -r '.ai_analysis'

echo ""
echo "✅ Demo Complete!"
echo "================="
echo ""
echo "🎯 Key Features Demonstrated:"
echo "- ✅ Real-time Jira project data retrieval"
echo "- ✅ Comprehensive project statistics and breakdowns"
echo "- ✅ AI-powered analysis and insights"
echo "- ✅ Business intelligence and recommendations"
echo "- ✅ Risk assessment and mitigation strategies"
echo ""
echo "🔗 API Endpoints Available:"
echo "- GET /api/integrations/jira/project-history"
echo "- POST /api/integrations/jira/project-analysis"
echo ""
echo "📈 This feature provides:"
echo "- Project health assessment"
echo "- Workload analysis"
echo "- Business insights"
echo "- Process improvement recommendations"
echo "- Risk assessment"
echo "- Actionable next steps"
