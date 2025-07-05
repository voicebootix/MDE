import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  CheckCircle,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureClarificationPanel({ features, onUpdateFeature }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Core Features
        </CardTitle>
        <p className="text-sm text-gray-600">Essential features for your MVP</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{feature.name}</h3>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(feature.priority)}>
                  {feature.priority}
                </Badge>
                <Badge className={getComplexityColor(feature.complexity)}>
                  {feature.complexity}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
            
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">User Story</span>
              </div>
              <p className="text-sm text-blue-700 italic bg-blue-50 p-2 rounded-lg">
                {feature.userStory}
              </p>
            </div>
            
            {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Acceptance Criteria</span>
                </div>
                <ul className="space-y-1">
                  {feature.acceptanceCriteria.map((criteria, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}