import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  CheckCircle,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RequirementsPanel({ requirements, clarificationProgress }) {
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'security': return 'bg-red-100 text-red-800';
      case 'performance': return 'bg-yellow-100 text-yellow-800';
      case 'scalability': return 'bg-green-100 text-green-800';
      case 'integration': return 'bg-blue-100 text-blue-800';
      case 'data': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-600" />
          Technical Requirements
        </CardTitle>
        <p className="text-sm text-gray-600">Essential technical specifications</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.length > 0 ? (
          <>
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{req.requirement}</h3>
                  <Badge className={getCategoryColor(req.category)}>
                    {req.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{req.justification}</p>
                
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Ready for implementation</span>
                </div>
              </motion.div>
            ))}

            {/* Progress Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-orange-900">Clarification Progress</span>
                <span className="text-lg font-bold text-orange-700">{clarificationProgress}%</span>
              </div>
              <Progress value={clarificationProgress} className="h-2 mb-3" />
              
              {clarificationProgress >= 75 ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ready for technical architecture!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Continue clarifying features to proceed</span>
                </div>
              )}
            </div>

            {/* Continue to CTO Studio */}
            {clarificationProgress >= 75 && (
              <div className="text-center mt-4">
                <Link to={createPageUrl("CTOStudio")}>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 gap-2">
                    <Settings className="w-4 h-4" />
                    Continue to CTO Studio
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requirements Yet</h3>
            <p className="text-gray-600">Generate features to see technical requirements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}