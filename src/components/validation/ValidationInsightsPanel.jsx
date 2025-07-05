import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Target,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ValidationInsightsPanel({ 
  analysisData, 
  validationScore, 
  recommendations, 
  isLoading,
  businessConcept,
  foundersWorkspaceData 
}) {
  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Validation Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Star className="w-16 h-16 text-purple-400" />
            </motion.div>
            <p className="text-sm text-gray-600 mt-4">Generating validation insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData && !validationScore) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Validation Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Final Validation</h3>
            <p className="text-gray-600 mb-4">Complete market and competitor analysis to generate your validation score</p>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Your validation score will help determine if you should proceed, pivot, or refine your concept.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'go': return 'bg-green-100 text-green-800';
      case 'pivot': return 'bg-yellow-100 text-yellow-800';
      case 'stop': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-600" />
          Validation Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Score */}
        {validationScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(validationScore)}`}>
              {validationScore}
            </div>
            <div className="text-sm text-gray-600 mb-4">Validation Score</div>
            <Progress value={validationScore} className="h-3 mb-4" />
            
            {analysisData?.recommendation && (
              <Badge className={`${getRecommendationColor(analysisData.recommendation)} text-sm px-4 py-2`}>
                Recommendation: {analysisData.recommendation.toUpperCase()}
              </Badge>
            )}
          </motion.div>
        )}

        {/* Score Breakdown */}
        {analysisData?.scoreBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(analysisData.scoreBreakdown).map(([category, score], index) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Key Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-blue-900">{rec.recommendation}</span>
                    <Badge className={`text-xs ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority}
                    </Badge>
                  </div>
                  {rec.timeframe && (
                    <div className="text-xs text-blue-700">Timeline: {rec.timeframe}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {analysisData?.nextSteps && analysisData.nextSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-purple-600" />
              Next Steps
            </h4>
            <div className="space-y-2">
              {analysisData.nextSteps.slice(0, 3).map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{step.action}</div>
                    <div className="text-xs text-gray-600">
                      {step.timeline} • {step.resources_needed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success Probability */}
        {analysisData?.successProbability && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
          >
            <div className="text-center">
              <div className="text-sm font-medium text-purple-900 mb-2">Success Probability</div>
              <div className="text-lg font-bold text-purple-700">{analysisData.successProbability}</div>
            </div>
          </motion.div>
        )}

        {/* Continue to Next Stage */}
        {validationScore >= 60 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link to={createPageUrl("ClarificationEngine")}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2">
                <Target className="w-4 h-4" />
                Continue to Feature Clarification
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}