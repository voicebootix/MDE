
import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Search, 
  Target, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Brain,
  Lightbulb,
  ArrowRight,
  Star,
  BarChart3,
  Shield,
  ArrowLeft,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MarketAnalysisPanel from "../components/validation/MarketAnalysisPanel";
import CompetitorResearchPanel from "../components/validation/CompetitorResearchPanel";
import ValidationInsightsPanel from "../components/validation/ValidationInsightsPanel";

export default function BusinessValidation() {
  const [businessConcept, setBusinessConcept] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [competitorData, setCompetitorData] = useState(null);
  const [validationScore, setValidationScore] = useState(0);
  const [modulePercentage, setModulePercentage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Listen for live updates from global chat
    const handleAIUpdate = (event) => {
      const { action } = event.detail;
      console.log("BusinessValidation received AI action:", action.type, action.data);

      if (action.type === 'update_business_concept' && action.data.concept) {
        setBusinessConcept(action.data.concept);
      }
      if (action.type === 'update_validation_data' && action.data) {
        setMarketData(prev => ({...prev, ...action.data}));
      }
      if (action.type === 'update_module_percentages' && action.data.marketValidation) {
        setModulePercentage(action.data.marketValidation);
      }
    };
    
    window.addEventListener('aiPageAction', handleAIUpdate);
    return () => window.removeEventListener('aiPageAction', handleAIUpdate);
  }, []);

  const loadInitialData = () => {
    try {
      const workspaceData = sessionStorage.getItem('foundersWorkspaceData');
      if (workspaceData) {
        const data = JSON.parse(workspaceData);
        setBusinessConcept(data.dreamStatement || "");
        setMarketData(data.validationData || null);
        setModulePercentage(data.readinessScores?.marketValidation || 0);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">📊 Business Validation</h1>
                <p className="text-xl text-gray-600">Market analysis and competitive intelligence</p>
              </div>
            </motion.div>

            {/* Live Progress Display */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Market Validation Progress</span>
                  </div>
                  <Badge className={`${modulePercentage >= 80 ? 'bg-green-100 text-green-800' : modulePercentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {modulePercentage}% Complete
                  </Badge>
                </div>
                
                {businessConcept && (
                  <div className="mb-4">
                    <p className="text-gray-800 italic text-lg">"{businessConcept}"</p>
                  </div>
                )}

                <Progress value={modulePercentage} className="h-3 mb-4" />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{marketData ? '✓' : '○'}</div>
                    <div className="text-sm text-gray-600">Market Analysis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{competitorData ? '✓' : '○'}</div>
                    <div className="text-sm text-gray-600">Competitor Research</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{validationScore}/10</div>
                    <div className="text-sm text-gray-600">Validation Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MarketAnalysisPanel 
                marketData={marketData}
                businessConcept={businessConcept}
                onUpdate={setMarketData}
              />
            </div>
            <div className="lg:col-span-1">
              <CompetitorResearchPanel 
                competitorData={competitorData}
                businessConcept={businessConcept}
                onUpdate={setCompetitorData}
              />
            </div>
            <div className="lg:col-span-1">
              <ValidationInsightsPanel 
                validationScore={validationScore}
                marketData={marketData}
                competitorData={competitorData}
                onUpdate={setValidationScore}
              />
            </div>
          </div>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-emerald-600" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link to={createPageUrl("ClarificationEngine")}>
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Search className="w-4 h-4" />
                    Define Features
                  </Button>
                </Link>
                <Link to={createPageUrl("CoFounderWorkspace")}>
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Workspace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
