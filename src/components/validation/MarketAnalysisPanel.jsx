import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function MarketAnalysisPanel({ marketData, isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Market Analysis
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

  if (!marketData) {
    return (
      <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Yet</h3>
            <p className="text-gray-600">Click "Market Analysis" to get comprehensive market intelligence</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Size */}
        {marketData.marketSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Market Opportunity
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">TAM (Total Addressable):</span>
                <span className="text-sm font-medium">{marketData.marketSize.tam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SAM (Serviceable):</span>
                <span className="text-sm font-medium">{marketData.marketSize.sam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SOM (Obtainable):</span>
                <span className="text-sm font-medium">{marketData.marketSize.som}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Growth Rate:</span>
                <Badge className="bg-green-100 text-green-800">{marketData.marketSize.growthRate}</Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* Target Segments */}
        {marketData.targetSegments && marketData.targetSegments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Target Segments
            </h4>
            <div className="space-y-3">
              {marketData.targetSegments.map((segment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{segment.segment}</h5>
                    <Badge variant="outline">{segment.size}</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <strong>Pain Points:</strong> {segment.painPoints?.join(", ")}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Willingness to Pay:</strong> {segment.willingness_to_pay}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Market Trends */}
        {marketData.marketTrends && marketData.marketTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Market Trends
            </h4>
            <div className="space-y-2">
              {marketData.marketTrends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    trend.impact === 'positive' ? 'bg-green-500' : 
                    trend.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{trend.trend}</div>
                    <div className="text-xs text-gray-600">{trend.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Risks */}
        {marketData.keyRisks && marketData.keyRisks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Key Risks
            </h4>
            <div className="space-y-2">
              {marketData.keyRisks.slice(0, 3).map((risk, index) => (
                <div key={index} className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-900">{risk.risk}</span>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${
                        risk.probability === 'high' ? 'bg-red-100 text-red-800' :
                        risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.probability}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{risk.mitigation}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}