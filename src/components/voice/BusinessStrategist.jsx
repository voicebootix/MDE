import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  X,
  MessageSquare,
  ExternalLink,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";

const CompetitorCard = ({ competitor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
      <Button variant="ghost" size="sm" className="gap-1">
        <ExternalLink className="w-3 h-3" />
        Visit
      </Button>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4 mb-3">
      <div>
        <h5 className="text-sm font-medium text-green-700 mb-1">Strengths</h5>
        <p className="text-sm text-gray-600">{competitor.strengths}</p>
      </div>
      <div>
        <h5 className="text-sm font-medium text-red-700 mb-1">Weaknesses</h5>
        <p className="text-sm text-gray-600">{competitor.weaknesses}</p>
      </div>
    </div>
    
    <div className="flex gap-2">
      <Button size="sm" variant="outline" className="gap-1">
        <CheckCircle className="w-3 h-3" />
        Keep Feature
      </Button>
      <Button size="sm" variant="outline" className="gap-1">
        <X className="w-3 h-3" />
        Drop Feature
      </Button>
      <Button size="sm" variant="outline" className="gap-1">
        <MessageSquare className="w-3 h-3" />
        Discuss
      </Button>
    </div>
  </motion.div>
);

const RecommendationCard = ({ recommendation, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Target className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-700 mb-3">{recommendation}</p>
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
            <CheckCircle className="w-3 h-3" />
            Accept
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <X className="w-3 h-3" />
            Reject
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            Discuss
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BusinessStrategist({ businessStrategy, features }) {
  const [acceptedRecommendations, setAcceptedRecommendations] = useState([]);
  const [rejectedRecommendations, setRejectedRecommendations] = useState([]);

  if (!businessStrategy) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Strategy Pending</h3>
          <p className="text-gray-600 mb-4">
            Ask me to analyze your market, research competitors, or validate your business model
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-600 mb-2">Try asking:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• "Who are my main competitors?"</li>
              <li>• "What's the market size for this idea?"</li>
              <li>• "How should I price this product?"</li>
              <li>• "What's my go-to-market strategy?"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{businessStrategy.marketAnalysis}</p>
        </CardContent>
      </Card>

      {/* Competitor Landscape */}
      {businessStrategy.competitors && businessStrategy.competitors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Competitor Analysis</h3>
            <Badge variant="outline">{businessStrategy.competitors.length}</Badge>
          </div>
          
          {businessStrategy.competitors.map((competitor, index) => (
            <CompetitorCard 
              key={competitor.name} 
              competitor={competitor} 
              index={index}
            />
          ))}
        </div>
      )}

      {/* Strategic Recommendations */}
      {businessStrategy.recommendations && businessStrategy.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Strategic Recommendations</h3>
            <Badge variant="outline">{businessStrategy.recommendations.length}</Badge>
          </div>
          
          {businessStrategy.recommendations.map((recommendation, index) => (
            <RecommendationCard 
              key={index} 
              recommendation={recommendation} 
              index={index}
            />
          ))}
        </div>
      )}

      {/* Strategy Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Strategy Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Strengths</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {features.length} validated features</li>
                <li>• Clear market positioning</li>
                <li>• Competitive differentiation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Actions</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Validate core assumptions</li>
                <li>• Build MVP prototype</li>
                <li>• Test with early users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}