import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function CompetitorResearchPanel({ competitorData, isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Competitor Research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!competitorData) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Competitor Research
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Research Yet</h3>
            <p className="text-gray-600">Click "Competitor Research" to analyze your competitive landscape</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Competitor Research
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Direct Competitors */}
        {competitorData.directCompetitors && competitorData.directCompetitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-600" />
              Direct Competitors
            </h4>
            <div className="space-y-3">
              {competitorData.directCompetitors.slice(0, 3).map((competitor, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                    {competitor.marketShare && (
                      <Badge variant="outline">{competitor.marketShare}</Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {competitor.description}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <strong className="text-green-700">Strengths:</strong>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {competitor.strengths?.slice(0, 2).map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-red-700">Weaknesses:</strong>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {competitor.weaknesses?.slice(0, 2).map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Competitive Gaps */}
        {competitorData.competitiveGaps && competitorData.competitiveGaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Market Opportunities
            </h4>
            <div className="space-y-2">
              {competitorData.competitiveGaps.slice(0, 3).map((gap, index) => (
                <div key={index} className="p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-900">{gap.gap}</span>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${
                        gap.opportunity_size === 'large' ? 'bg-green-100 text-green-800' :
                        gap.opportunity_size === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {gap.opportunity_size}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Differentiation Strategy */}
        {competitorData.differentiationStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Your Differentiation
            </h4>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-900 mb-2">
                {competitorData.differentiationStrategy.unique_value_prop}
              </div>
              <div className="text-xs text-purple-700">
                {competitorData.differentiationStrategy.positioning_statement}
              </div>
              {competitorData.differentiationStrategy.key_differentiators && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-purple-800 mb-1">Key Differentiators:</div>
                  <div className="flex flex-wrap gap-1">
                    {competitorData.differentiationStrategy.key_differentiators.slice(0, 3).map((diff, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-700 text-xs">
                        {diff}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Indirect Competitors */}
        {competitorData.indirectCompetitors && competitorData.indirectCompetitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Indirect Threats
            </h4>
            <div className="space-y-2">
              {competitorData.indirectCompetitors.slice(0, 3).map((competitor, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    competitor.threat_level === 'high' ? 'bg-red-500' : 
                    competitor.threat_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{competitor.name}</div>
                    <div className="text-xs text-gray-600">{competitor.approach}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}