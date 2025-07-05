
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

export default function IdeaEvolutionPanel({ ideaEvolution, businessConcept, mindMapData }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Idea Evolution Timeline</h2>
        <p className="text-gray-600">Track how your business concept has developed over time</p>
      </div>

      {ideaEvolution.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Evolution History Yet</h3>
            <p className="text-gray-600">
              As you continue conversations with your AI Co-Founder, we'll track how your business idea evolves and grows.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ideaEvolution.map((evolution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-l-4 border-l-violet-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-violet-600" />
                      Evolution #{ideaEvolution.length - index}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {evolution.timestamp && isValidDate(new Date(evolution.timestamp))
                        ? format(new Date(evolution.timestamp), 'MMM d, h:mm a')
                        : 'a few moments ago'
                      }
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Concept</h4>
                    <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg">
                      "{evolution.concept || 'Concept not specified in this step.'}"
                    </p>
                  </div>
                  
                  {evolution.changes && evolution.changes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">New Insights Added</h4>
                      <div className="flex flex-wrap gap-2">
                        {evolution.changes.map((change, i) => (
                          <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700">
                            {change}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Triggered by</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      "{evolution.trigger}..."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-600 mb-1">
              {ideaEvolution.length}
            </div>
            <div className="text-sm text-gray-600">Evolution Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mindMapData.nodes.length}
            </div>
            <div className="text-sm text-gray-600">Key Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {businessConcept ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-600">Business Concept</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
