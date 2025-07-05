
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { InvokeLLM } from "@/api/integrations";

import BusinessCanvasGenerator from "@/components/workspace/BusinessCanvasGenerator";
import IdeaEvolutionPanel from "@/components/workspace/IdeaEvolutionPanel";
import MindMapWorkspace from "@/components/workspace/MindMapWorkspace";
import ConversationalPlanBuilder from "@/components/workspace/ConversationalPlanBuilder";

export default function CoFounderWorkspace() {
  const [activeTab, setActiveTab] = useState("mindmap");
  const [isProcessing, setIsProcessing] = useState(false);
  const [businessConcept, setBusinessConcept] = useState("");
  const [mindMapData, setMindMapData] = useState({ nodes: [], connections: [] });
  const [businessCanvas, setBusinessCanvas] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [ideaEvolution, setIdeaEvolution] = useState([]);

  // Enhanced readiness tracking
  const [moduleReadiness, setModuleReadiness] = useState({
    businessConcept: 0,
    mindMap: 0,
    businessCanvas: 0,
    businessPlan: 0,
    ideaEvolution: 0,
    overall: 0
  });

  const saveWorkspaceData = (data) => {
    const projectId = sessionStorage.getItem('currentProjectId');
    const workspaceDataKey = projectId ? `foundersWorkspaceData_${projectId}` : 'foundersWorkspaceData';
    const workspaceDataToSave = {
        dreamStatement: data.businessConcept,
        mindMapData: data.mindMapData,
        businessCanvas: data.businessCanvas,
        businessPlan: data.businessPlan,
        ideaEvolution: data.ideaEvolution,
        moduleReadiness: data.moduleReadiness,
        timestamp: new Date().toISOString()
    };
    sessionStorage.setItem(workspaceDataKey, JSON.stringify(workspaceDataToSave));
  };

  // Helper function to update readiness and persist data
  const updateReadiness = (category, score) => {
    setModuleReadiness(prev => {
      const updated = { ...prev, [category]: score };
      const newOverall = Math.round(
        (updated.businessConcept + updated.mindMap + updated.businessCanvas + updated.businessPlan + updated.ideaEvolution) / 5
      );
      updated.overall = newOverall;

      // Save the entire state bundle to ensure consistency
      saveWorkspaceData({
        businessConcept,
        mindMapData,
        businessCanvas,
        businessPlan,
        ideaEvolution,
        moduleReadiness: updated
      });

      return updated;
    });
  };


  useEffect(() => {
    // Listen for real-time updates from Layout AI chat
    const handleAIUpdate = (event) => {
      const { action } = event.detail;
      console.log("CoFounderWorkspace received AI action:", action.type, action.data);

      if (action.type === 'update_mind_map' && action.data.nodes) {
        setMindMapData(prev => {
          const existingLabels = new Set(prev.nodes.map(n => n.label.toLowerCase()));
          const newNodes = action.data.nodes.filter(node => !existingLabels.has(node.label.toLowerCase()));
          if (newNodes.length === 0) return prev;
          
          const updatedNodes = [...prev.nodes, ...newNodes];
          const newReadiness = Math.min(95, updatedNodes.length * 15);
          updateReadiness('mindMap', newReadiness);
          return { ...prev, nodes: updatedNodes };
        });
      }
      if (action.type === 'update_business_concept' && action.data.concept) {
        setBusinessConcept(action.data.concept);
        updateReadiness('businessConcept', 90);
      }
      if (action.type === 'update_business_canvas' && action.data) {
        console.log("Auto-updating business canvas:", action.data);
        setBusinessCanvas(prev => ({...prev, ...action.data}));
        setActiveTab("canvas"); // Auto-switch to show the update
        updateReadiness('businessCanvas', 85);
      }
      if (action.type === 'update_business_plan' && action.data) {
        console.log("Auto-updating business plan:", action.data);
        setBusinessPlan(prev => ({...(prev || {}), ...action.data}));
        updateReadiness('businessPlan', 80);
      }
      if (action.type === 'add_idea_evolution_step' && action.data) {
        setIdeaEvolution(prev => {
          const newEvolution = [...prev, action.data];
          updateReadiness('ideaEvolution', Math.min(90, newEvolution.length * 20 + 20));
          return newEvolution;
        });
      }

      // Logic for auto_populate action type as per outline
      if (action.type === 'auto_populate') {
        console.log("Auto-populating workspace:", action.data);
        
        if (action.data.businessConcept) {
          setBusinessConcept(action.data.businessConcept);
          updateReadiness('businessConcept', 90); // Update readiness when concept is auto-populated
        }
        
        if (action.data.keyFeatures && action.data.keyFeatures.length > 0) {
          setMindMapData(prev => {
            const existingLabels = new Set(prev.nodes.map(n => n.label.toLowerCase()));
            const newNodes = action.data.keyFeatures
              .filter(feature => !existingLabels.has(feature.toLowerCase())) // Avoid adding duplicate features
              .map((feature, index) => ({
                id: `node_${Date.now()}_${index}`,
                label: feature,
                type: 'product',
                description: `Key feature: ${feature}`,
                priority: 'high'
              }));
            
            if (newNodes.length === 0) return prev; // No truly new nodes to add

            const updatedNodes = [...prev.nodes, ...newNodes];
            const newReadiness = Math.min(95, updatedNodes.length * 15); // Recalculate readiness
            updateReadiness('mindMap', newReadiness);
            return { ...prev, nodes: updatedNodes };
          });
        }
      }
    };

    window.addEventListener('aiPageAction', handleAIUpdate);

    // Load initial data from session storage if available
    const projectId = sessionStorage.getItem('currentProjectId');
    const workspaceDataKey = projectId ? `foundersWorkspaceData_${projectId}` : 'foundersWorkspaceData';
    const initialData = sessionStorage.getItem(workspaceDataKey);
    if (initialData) {
        try {
            const data = JSON.parse(initialData);
            setBusinessConcept(data.dreamStatement || "");
            
            // Reconciled logic for mindMapData loading: prioritize existing mindMapData, then keyFeatures
            if (data.mindMapData && data.mindMapData.nodes && data.mindMapData.nodes.length > 0) {
                setMindMapData(data.mindMapData);
            } else if (data.keyFeatures && data.keyFeatures.length > 0) {
                const nodes = data.keyFeatures.map((feature, index) => ({
                    id: `node_${Date.now()}_${index}`,
                    label: feature,
                    type: 'product',
                    description: `Key feature: ${feature}`,
                    priority: 'high'
                }));
                setMindMapData({ nodes, connections: [] });
            } else {
                setMindMapData({ nodes: [], connections: [] });
            }

            setBusinessPlan(data.businessPlan || null);
            setBusinessCanvas(data.businessCanvas || null);
            setIdeaEvolution(data.ideaEvolution || []);

            // The outline implies a recalculation logic when data is loaded,
            // using moduleReadiness as the source for readiness scores.
            // Assuming 'readinessScores' in the outline refers to 'moduleReadiness'
            // and 'overallReadiness' refers to 'overall' for existing data structure.
            if (data.moduleReadiness) {
                setModuleReadiness({
                    businessConcept: data.moduleReadiness.businessConcept || 0,
                    mindMap: data.mindMapData?.nodes?.length > 0 ? (data.moduleReadiness.mindMap || 20) : 0, // Corrected logic here
                    businessCanvas: data.moduleReadiness.businessCanvas || (data.businessCanvas ? 85 : 0), // Default if not found
                    businessPlan: data.moduleReadiness.businessPlan || (data.businessPlan ? 80 : 0), // Default if not found
                    ideaEvolution: data.moduleReadiness.ideaEvolution || (data.ideaEvolution?.length > 0 ? (data.ideaEvolution.length * 20) : 0), // Default if not found
                    overall: data.moduleReadiness.overall || 0
                });
            } else {
                // If moduleReadiness is not found, attempt to calculate initial readiness based on loaded data
                const initialConceptReadiness = data.dreamStatement ? 90 : 0;
                // Determine mind map node count from either mindMapData or keyFeatures
                const currentMindMapNodesCount = (data.mindMapData?.nodes?.length || 0) > 0 
                    ? data.mindMapData.nodes.length 
                    : (data.keyFeatures?.length || 0);
                
                const initialMindMapReadiness = currentMindMapNodesCount > 0 ? Math.min(95, currentMindMapNodesCount * 15) : 0;
                
                const initialBusinessCanvasReadiness = data.businessCanvas ? 85 : 0;
                const initialBusinessPlanReadiness = data.businessPlan ? 80 : 0;
                const initialIdeaEvolutionReadiness = (data.ideaEvolution?.length || 0) > 0 ? Math.min(90, (data.ideaEvolution.length || 0) * 20 + 20) : 0;
                
                const overall = Math.round((initialConceptReadiness + initialMindMapReadiness + initialBusinessCanvasReadiness + initialBusinessPlanReadiness + initialIdeaEvolutionReadiness) / 5);
                setModuleReadiness({
                    businessConcept: initialConceptReadiness,
                    mindMap: initialMindMapReadiness,
                    businessCanvas: initialBusinessCanvasReadiness,
                    businessPlan: initialBusinessPlanReadiness,
                    ideaEvolution: initialIdeaEvolutionReadiness,
                    overall: overall
                });
            }
        } catch (e) {
            console.error("Error parsing initial workspace data from session storage:", e);
        }
    }

    return () => window.removeEventListener('aiPageAction', handleAIUpdate);
  }, []);

  const generateBusinessCanvas = async () => {
    if (!businessConcept || mindMapData.nodes.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `
          Generate a comprehensive Business Model Canvas based on this business concept and mind map:

          Business Concept: ${businessConcept}

          Key Insights:
          ${mindMapData.nodes.map(n => `- ${n.label} (${n.type}): ${n.description}`).join('\n')}

          Create a complete business canvas with all 9 building blocks.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            valueProposition: { type: "string" },
            keyPartners: { type: "array", items: { type: "string" } },
            keyActivities: { type: "array", items: { type: "string" } },
            keyResources: { type: "array", items: { type: "string" } },
            customerSegments: { type: "array", items: { type: "string" } },
            customerRelationships: { type: "array", items: { type: "string" } },
            channels: { type: "array", items: { type: "string" } },
            costStructure: { type: "array", items: { type: "string" } },
            revenueStreams: { type: "array", items: { type: "string" } }
          }
        }
      });

      setBusinessCanvas(response);
      updateReadiness('businessCanvas', 95); // Update readiness after generating canvas
    } catch (error) {
      console.error("Error generating business canvas:", error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 h-full flex flex-col"
        >
          {/* Enhanced Header with Progress */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">🚀 Co-Founder Workspace</h1>
                <p className="text-lg text-gray-600">Your AI-powered business ideation and planning environment</p>
              </div>
            </div>

            {/* Enhanced Business Concept + Progress */}
            {businessConcept ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-violet-200 shadow-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-violet-600" />
                  <span className="font-semibold text-violet-900">Current Business Concept</span>
                  <Badge className="bg-green-100 text-green-800 ml-auto">
                    {moduleReadiness.overall}% Complete
                  </Badge>
                </div>
                <p className="text-gray-800 italic text-lg leading-relaxed mb-4">"{businessConcept}"</p>

                {/* Enhanced Progress Grid */}
                <div className="grid md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600">{moduleReadiness.businessConcept}%</div>
                    <div className="text-xs text-gray-600">Concept</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{moduleReadiness.mindMap}%</div>
                    <div className="text-xs text-gray-600">Mind Map</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600">{moduleReadiness.businessCanvas}%</div>
                    <div className="text-xs text-gray-600">Canvas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">{moduleReadiness.businessPlan}%</div>
                    <div className="text-xs text-gray-600">Plan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{moduleReadiness.ideaEvolution}%</div>
                    <div className="text-xs text-gray-600">Evolution</div>
                  </div>
                </div>

                <Progress value={moduleReadiness.overall} className="h-2" />
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg mb-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-900">AI Co-Founder Ready</span>
                  </div>
                  <p className="text-orange-700 mb-4">
                    Hi! I'm your AI Co-Founder. Let's start building your business concept together.
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">Start by telling me about:</p>
                    <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                      <li>What problem are you solving?</li>
                      <li>Who is your target customer?</li>
                      <li>What makes your solution unique?</li>
                      <li>How will you make money?</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Chat with me below - I'll automatically organize your ideas into a Mind Map, Business Canvas, and Plan!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="mindmap" className="gap-2">
                  <Brain className="w-4 h-4" />
                  Mind Map
                  {mindMapData.nodes.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5">
                      {mindMapData.nodes.length}
                    </Badge>
                  )}
                  <div className="ml-1 text-xs text-green-600 font-bold">
                    {moduleReadiness.mindMap}%
                  </div>
                </TabsTrigger>
                <TabsTrigger value="canvas" className="gap-2">
                  <Target className="w-4 h-4" />
                  Business Canvas
                  <div className="ml-1 text-xs text-green-600 font-bold">
                    {moduleReadiness.businessCanvas}%
                  </div>
                </TabsTrigger>
                <TabsTrigger value="plan" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Business Plan
                  <div className="ml-1 text-xs text-green-600 font-bold">
                    {moduleReadiness.businessPlan}%
                  </div>
                </TabsTrigger>
                <TabsTrigger value="evolution" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Idea Evolution
                  <div className="ml-1 text-xs text-green-600 font-bold">
                    {moduleReadiness.ideaEvolution}%
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mindmap" className="flex-1 mt-4">
                <MindMapWorkspace
                  mindMapData={mindMapData}
                  onUpdateMindMap={setMindMapData}
                  businessConcept={businessConcept}
                />
              </TabsContent>

              <TabsContent value="canvas" className="flex-1 mt-4">
                <BusinessCanvasGenerator
                  businessCanvas={businessCanvas}
                  onUpdateCanvas={setBusinessCanvas}
                  businessConcept={businessConcept}
                  mindMapData={mindMapData}
                  generateBusinessCanvas={generateBusinessCanvas} 
                  isProcessing={isProcessing} 
                />
              </TabsContent>

              <TabsContent value="plan" className="flex-1 mt-4">
                <ConversationalPlanBuilder
                  businessPlan={businessPlan}
                  onUpdatePlan={setBusinessPlan}
                />
              </TabsContent>

              <TabsContent value="evolution" className="flex-1 mt-4">
                <IdeaEvolutionPanel
                  ideaEvolution={ideaEvolution}
                  businessConcept={businessConcept}
                  mindMapData={mindMapData}
                />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
