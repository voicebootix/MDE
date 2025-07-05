import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserFlowPanel({ userFlows, onUpdateFlow }) {
  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          User Flows
        </CardTitle>
        <p className="text-sm text-gray-600">Key user journeys through your product</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {userFlows.map((flow, index) => (
          <motion.div
            key={flow.flowName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <h3 className="font-semibold text-gray-900 mb-3">{flow.flowName}</h3>
            
            {/* Flow Steps */}
            <div className="space-y-3 mb-4">
              {flow.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    {stepIndex + 1}
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{step}</span>
                  {stepIndex < flow.steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Pain Points */}
            {flow.painPoints && flow.painPoints.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Potential Pain Points</span>
                </div>
                <div className="space-y-1">
                  {flow.painPoints.map((painPoint, i) => (
                    <div key={i} className="text-sm text-orange-700 bg-orange-50 p-2 rounded-lg">
                      {painPoint}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}