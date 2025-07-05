import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { InvokeLLM } from "@/api/integrations";
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Code, 
  Eye,
  MapPin,
  Lightbulb,
  Lock,
  Unlock,
  Palette,
  Layers,
  ArrowRight,
  Target,
  Zap,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FeatureClarifier from "./FeatureClarifier";
import TechStackSelector from "./TechStackSelector";
import MindMapPanel from "./MindMapPanel";
import UIMockupSelector from "./UIMockupSelector";

const ClarityScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Ready";
    if (score >= 60) return "Needs Review";
    return "Incomplete";
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
      <div className="w-2 h-2 rounded-full bg-current"></div>
      {score}% {getScoreLabel(score)}
    </div>
  );
};

const FeatureOverview = ({ feature, onSelectFeature, isSelected }) => {
  const clarityScore = feature.clarificationData?.clarityScore || 0;
  const isExecutionReady = feature.clarificationData?.executionReady || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelectFeature(feature)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <ClarityScore score={clarityScore} />
          {isExecutionReady && (
            <div className="flex items-center gap-1 text-green-600">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">Locked</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Search className="w-3 h-3" />
          <span>Clarified: {feature.clarificationData?.clarified ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Code className="w-3 h-3" />
          <span>Stack: {feature.techStack?.frontend || 'TBD'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>UI: {feature.uiSpec?.selected ? 'Ready' : 'Pending'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ClarificationEngine({ 
  features, 
  onUpdateFeature,
  businessStrategy,
  onFeatureExecutionReady 
}) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mindMapData, setMindMapData] = useState({
    nodes: [],
    connections: [],
    userFlows: []
  });

  const approvedFeatures = features.filter(f => f.status === 'approved');
  const clarifiedFeatures = approvedFeatures.filter(f => f.clarificationData?.clarified);
  const executionReadyFeatures = approvedFeatures.filter(f => f.clarificationData?.executionReady);
  const overallProgress = approvedFeatures.length > 0 ? (executionReadyFeatures.length / approvedFeatures.length) * 100 : 0;

  useEffect(() => {
    if (approvedFeatures.length > 0 && !selectedFeature) {
      setSelectedFeature(approvedFeatures[0]);
    }
  }, [approvedFeatures, selectedFeature]);

  useEffect(() => {
    generateMindMapData();
  }, [clarifiedFeatures]);

  const generateMindMapData = async () => {
    if (clarifiedFeatures.length < 2) return;

    try {
      const response = await InvokeLLM({
        prompt: `
          Generate a mind map structure for the following features:
          ${clarifiedFeatures.map(f => `- ${f.name}: ${f.description}`).join('\n')}
          
          Create nodes representing:
          1. Main feature categories
          2. Individual features
          3. User interaction points
          4. Data flows between features
          
          Return connections showing how features relate to each other.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  label: { type: "string" },
                  type: { type: "string", enum: ["feature", "category", "interaction", "data"] },
                  x: { type: "number" },
                  y: { type: "number" }
                }
              }
            },
            connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                  label: { type: "string" }
                }
              }
            },
            userFlows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  steps: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setMindMapData(response);
    } catch (error) {
      console.error('Failed to generate mind map:', error);
    }
  };

  const handleFeatureUpdate = (featureId, updateData) => {
    const updatedFeature = {
      ...features.find(f => f.id === featureId),
      ...updateData
    };
    onUpdateFeature(updatedFeature);
    
    // Update selected feature if it's the one being updated
    if (selectedFeature && selectedFeature.id === featureId) {
      setSelectedFeature(updatedFeature);
    }
  };

  const calculateClarityScore = (feature) => {
    let score = 0;
    const clarificationData = feature.clarificationData || {};
    
    // Basic clarification (40 points)
    if (clarificationData.inputs) score += 10;
    if (clarificationData.outputs) score += 10;
    if (clarificationData.userInteraction) score += 10;
    if (clarificationData.edgeCases) score += 10;
    
    // Tech stack (20 points)
    if (feature.techStack?.frontend) score += 10;
    if (feature.techStack?.backend) score += 10;
    
    // UI specification (20 points)
    if (feature.uiSpec?.selected) score += 20;
    
    // Ambiguity resolution (20 points)
    if (clarificationData.ambiguitiesResolved) score += 20;
    
    return Math.min(score, 100);
  };

  const lockFeatureForExecution = async (feature) => {
    const clarityScore = calculateClarityScore(feature);
    
    if (clarityScore < 80) {
      alert('Feature needs higher clarity score (80%+) before locking for execution.');
      return;
    }

    const updatedFeature = {
      ...feature,
      clarificationData: {
        ...feature.clarificationData,
        executionReady: true,
        clarityScore,
        lockedAt: new Date().toISOString()
      }
    };

    handleFeatureUpdate(feature.id, updatedFeature);
    
    if (onFeatureExecutionReady) {
      onFeatureExecutionReady(updatedFeature);
    }
  };

  if (approvedFeatures.length === 0) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Features to Clarify</h3>
          <p className="text-gray-600">
            Approve some features in the Feature Builder first, then return here to clarify them for execution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Progress */}
      <div className="border-b border-gray-100 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ClarificationEngine</h2>
            <p className="text-gray-600">Refine features for execution readiness</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {executionReadyFeatures.length} of {approvedFeatures.length} ready
            </div>
            <div className="w-32">
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{approvedFeatures.length}</div>
            <div className="text-xs text-blue-600">Total Features</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{clarifiedFeatures.length}</div>
            <div className="text-xs text-yellow-600">Clarified</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{executionReadyFeatures.length}</div>
            <div className="text-xs text-green-600">Execution Ready</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(overallProgress)}%</div>
            <div className="text-xs text-purple-600">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 bg-gray-50 rounded-none border-b">
            <TabsTrigger value="overview" className="gap-2">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clarify" className="gap-2">
              <Search className="w-4 h-4" />
              Clarify
              {selectedFeature && !selectedFeature.clarificationData?.clarified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="stack" className="gap-2">
              <Code className="w-4 h-4" />
              Tech Stack
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="gap-2">
              <MapPin className="w-4 h-4" />
              Mind Map
            </TabsTrigger>
            <TabsTrigger value="ui" className="gap-2">
              <Palette className="w-4 h-4" />
              UI Design
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="h-full m-0 p-6 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Clarification Status</h3>
                {approvedFeatures.map(feature => (
                  <FeatureOverview
                    key={feature.id}
                    feature={feature}
                    onSelectFeature={setSelectedFeature}
                    isSelected={selectedFeature?.id === feature.id}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clarify" className="h-full m-0">
              {selectedFeature && (
                <FeatureClarifier
                  feature={selectedFeature}
                  onUpdateFeature={handleFeatureUpdate}
                  onLockForExecution={lockFeatureForExecution}
                />
              )}
            </TabsContent>

            <TabsContent value="stack" className="h-full m-0">
              {selectedFeature && (
                <TechStackSelector
                  feature={selectedFeature}
                  onUpdateFeature={handleFeatureUpdate}
                  businessStrategy={businessStrategy}
                />
              )}
            </TabsContent>

            <TabsContent value="mindmap" className="h-full m-0">
              <MindMapPanel
                mindMapData={mindMapData}
                features={clarifiedFeatures}
                onUpdateMindMap={setMindMapData}
              />
            </TabsContent>

            <TabsContent value="ui" className="h-full m-0">
              {selectedFeature && (
                <UIMockupSelector
                  feature={selectedFeature}
                  onUpdateFeature={handleFeatureUpdate}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}