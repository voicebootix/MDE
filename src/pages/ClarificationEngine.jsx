
import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Target, 
  Users, 
  CheckCircle,
  Settings,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Brain,
  MessageCircle,
  Wrench
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { createPageUrl } from "@/utils";

import FeatureClarificationPanel from "../components/clarification/FeatureClarificationPanel";
import UserFlowPanel from "../components/clarification/UserFlowPanel";
import RequirementsPanel from "../components/clarification/RequirementsPanel";

export default function ClarificationEngine() {
  const [activeTab, setActiveTab] = useState("features");
  const [businessConcept, setBusinessConcept] = useState("");
  const [features, setFeatures] = useState([]);
  const [userFlows, setUserFlows] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [modulePercentage, setModulePercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    loadInitialData();
    
    // Listen for live updates from global chat
    const handleAIUpdate = (event) => {
      const { action } = event.detail;
      console.log("ClarificationEngine received AI action:", action.type, action.data);

      if (action.type === 'update_business_concept' && action.data.concept) {
        setBusinessConcept(action.data.concept);
      }
      if (action.type === 'update_clarification_data' && action.data) {
        if (action.data.features) setFeatures(action.data.features);
        if (action.data.userFlows) setUserFlows(action.data.userFlows);
        if (action.data.requirements) setRequirements(action.data.requirements);
      }
      if (action.type === 'update_module_percentages' && action.data.featureClarification) {
        setModulePercentage(action.data.featureClarification);
      }
    };
    
    window.addEventListener('aiPageAction', handleAIUpdate);
    return () => window.removeEventListener('aiPageAction', handleAIUpdate);
  }, []);

  const loadInitialData = () => {
    try {
      const workspaceData = sessionStorage.getItem('foundersWorkspaceData');
      if (workspaceData) {
        const data = JSON.parse(workspaceData);
        setBusinessConcept(data.dreamStatement || "");
        if (data.clarificationData) {
          setFeatures(data.clarificationData.features || []);
          setUserFlows(data.clarificationData.userFlows || []);
          setRequirements(data.clarificationData.requirements || []);
        }
        setModulePercentage(data.readinessScores?.featureClarification || 0);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // This function now handles both the AI interaction and the subsequent navigation.
  // It effectively replaces the previous 'generateFeatures' and manages the async flow.
  const handleGenerateAndNavigate = async () => {
    if (!businessConcept) {
      console.warn("Business concept is missing, cannot generate clarification data or proceed.");
      // Optionally, show a user-facing error message here.
      return; 
    }
    
    setIsProcessing(true);
    try {
      // Integrate Foundry AI as the Core Competency:
      // InvokeLLM is used to either generate initial clarification data
      // or to refine/validate existing data based on the business concept.
      const llmResponse = await InvokeLLM({
        action: "clarify_and_finalize_product_details", // A specific action for Foundry AI
        context: {
          businessConcept: businessConcept,
          // Pass existing data to the AI for refinement or completion
          existingFeatures: features, 
          existingUserFlows: userFlows,
          existingRequirements: requirements,
        }
      });

      let finalFeatures = features;
      let finalUserFlows = userFlows;
      let finalRequirements = requirements;

      if (llmResponse && llmResponse.data) {
        // Update local state with the AI-generated/refined data
        if (llmResponse.data.features) {
          setFeatures(llmResponse.data.features);
          finalFeatures = llmResponse.data.features; // Use for sessionStorage
        }
        if (llmResponse.data.userFlows) {
          setUserFlows(llmResponse.data.userFlows);
          finalUserFlows = llmResponse.data.userFlows; // Use for sessionStorage
        }
        if (llmResponse.data.requirements) {
          setRequirements(llmResponse.data.requirements);
          finalRequirements = llmResponse.data.requirements; // Use for sessionStorage
        }

        // Update module percentage based on AI's assessment or data presence
        if (llmResponse.data.modulePercentage) {
          setModulePercentage(llmResponse.data.modulePercentage);
        } else if (finalFeatures.length > 0 && finalUserFlows.length > 0 && finalRequirements.length > 0) {
          // Fallback: If AI returns data but no percentage, assume significant completion
          setModulePercentage(100); 
        }

        console.log("Clarification data generated/refined by Foundry AI:", llmResponse.data);
      } else {
        console.warn("Foundry AI did not return expected clarification data. Proceeding with currently defined data.");
      }
      
      // Save the final clarification data (either AI-processed or existing) to sessionStorage.
      // This data will be picked up by the CTO Studio page.
      const clarificationData = {
        businessConcept,
        features: finalFeatures,
        userFlows: finalUserFlows,
        requirements: finalRequirements,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('clarificationData', JSON.stringify(clarificationData));
      console.log("Clarification data saved to session storage for CTO Studio:", clarificationData);
      
      // Navigate to CTO Studio page after successful processing and data saving
      navigate(createPageUrl("CTOStudio"));
      
    } catch (error) {
      console.error("Error during Foundry AI clarification or data saving:", error);
      // In case of an error, save the current data and still attempt to navigate
      // to allow the user to continue, preventing a stuck state.
      const currentClarificationData = {
        businessConcept, features, userFlows, requirements, timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('clarificationData', JSON.stringify(currentClarificationData));
      console.warn("Attempting to navigate to CTO Studio despite error, using current data.");
      navigate(createPageUrl("CTOStudio"));
    } finally {
      setIsProcessing(false); // Ensure processing state is reset
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">🔍 Clarification Engine</h1>
                <p className="text-xl text-gray-600">Define precise features and requirements</p>
              </div>
            </motion.div>

            {/* Live Progress Display */}
            <Card className="bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Feature Clarification Progress</span>
                  </div>
                  <Badge className={`${modulePercentage >= 80 ? 'bg-green-100 text-green-800' : modulePercentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {modulePercentage}% Complete
                  </Badge>
                </div>
                
                {businessConcept && (
                  <div className="mb-4">
                    <p className="text-gray-800 italic text-lg">"{businessConcept}"</p>
                  </div>
                )}

                <Progress value={modulePercentage} className="h-3 mb-4" />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{features.length}</div>
                    <div className="text-sm text-gray-600">Features Defined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userFlows.length}</div>
                    <div className="text-sm text-gray-600">User Flows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{requirements.length}</div>
                    <div className="text-sm text-gray-600">Requirements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Feature & Requirements Definition
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none border-b">
                  <TabsTrigger value="features" className="gap-2">
                    <Target className="w-4 h-4" />
                    Features ({features.length})
                  </TabsTrigger>
                  <TabsTrigger value="flows" className="gap-2">
                    <Users className="w-4 h-4" />
                    User Flows ({userFlows.length})
                  </TabsTrigger>
                  <TabsTrigger value="requirements" className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Requirements ({requirements.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="features" className="m-0 p-6">
                  <FeatureClarificationPanel
                    features={features}
                    onUpdateFeature={(updatedFeatures) => setFeatures(updatedFeatures)}
                  />
                </TabsContent>

                <TabsContent value="flows" className="m-0 p-6">
                  <UserFlowPanel
                    userFlows={userFlows}
                    onUpdateFlows={(updatedFlows) => setUserFlows(updatedFlows)}
                  />
                </TabsContent>

                <TabsContent value="requirements" className="m-0 p-6">
                  <RequirementsPanel
                    requirements={requirements}
                    onUpdateRequirements={(updatedRequirements) => setRequirements(updatedRequirements)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-600" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {/* Button modified to call the new async handler and removed Link wrapper */}
                <Button 
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={handleGenerateAndNavigate}
                  // Disable if processing or if no features have been defined (as a basic check for readiness)
                  disabled={isProcessing || features.length === 0} 
                >
                  {isProcessing ? "Finalizing with AI..." : (
                    <>
                      <Wrench className="w-4 h-4" />
                      Generate Code Architecture
                    </>
                  )}
                </Button>
                
                <Link to={createPageUrl("BusinessValidation")}>
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Validation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
