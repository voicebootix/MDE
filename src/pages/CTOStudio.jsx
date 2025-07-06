import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wrench,
  Code,
  Puzzle,
  Settings,
  Download,
  Zap,
  BrainCircuit,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Shield,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/api/integrations";
import { codeGenerationService } from "@/services/codeGenerationService";

import TechStackRecommendations from "../components/cto/TechStackRecommendations";
import FullFrontendGenerator from "../components/cto/FullFrontendGenerator";
import PlugAndPlayModules from "../components/cto/PlugAndPlayModules";
import ContextEngineeringModule from "../components/cto/ContextEngineeringModule";

export default function CTOStudio() {
  const [activeTab, setActiveTab] = useState("context");
  const [selectedModules, setSelectedModules] = useState([]);
  const [techStack, setTechStack] = useState({
    frontend: null,
    backend: null,
    database: null,
    hosting: null
  });
  const [contextData, setContextData] = useState({
    prp: "",
    readinessScore: 0,
  });
  const [projectContext, setProjectContext] = useState(null);
  const [isAutoPopulating, setIsAutoPopulating] = useState(true);

  // Enhanced Smart Handshake Protocol states
  const [founderCofounderAgreement, setFounderCofounderAgreement] = useState({
    criticalItems: [],
    optionalItems: [],
    riskyChoices: [],
    founderChoices: [],
    riskAcknowledgments: [],
    isComplete: false,
    agreementTimestamp: null,
    overallReadiness: 0,
    recommendedAction: "Initializing agreement..."
  });

  const [showRiskDialog, setShowRiskDialog] = useState(false);
  const [pendingRiskyChoices, setPendingRiskyChoices] = useState([]);
  const [technicalData, setTechnicalData] = useState(null);

  useEffect(() => {
    // Listen for live updates first
    const handleAIUpdate = (event) => {
      const { action } = event.detail;
      if (action.type === 'update_technical_data') {
        console.log("CTO Studio received live technical data update:", action.data);
        setTechnicalData(prev => ({ ...(prev || {}), ...action.data }));
        autoPopulateFromData(action.data);
      }
    };
    window.addEventListener('aiPageAction', handleAIUpdate);

    // Then load initial data from session storage
    const workspaceDataJSON = sessionStorage.getItem('foundersWorkspaceData');
    if (workspaceDataJSON) {
      try {
        const data = JSON.parse(workspaceDataJSON);
        setTechnicalData(data);
        autoPopulateFromData(data);
      } catch (error) {
        console.error("Error auto-populating CTO Studio:", error);
        setIsAutoPopulating(false);
      }
    } else {
      setIsAutoPopulating(false);
    }

    return () => window.removeEventListener('aiPageAction', handleAIUpdate);
  }, []);

  const autoPopulateFromData = async (data) => {
    if (!data || !data.clarificationData) {
      setIsAutoPopulating(false);
      return;
    }

    console.log("Auto-populating CTO Studio with clarification data:", data.clarificationData);

    const clarificationData = data.clarificationData;
    setProjectContext(clarificationData);

    try {
      // Use the code generation service for all generation tasks
      const generatedContext = await codeGenerationService.generateProjectContext(data);
      
      if (generatedContext) {
        setContextData(generatedContext.contextData);
        setSelectedModules(generatedContext.suggestedModules);
        setTechStack(generatedContext.suggestedTechStack);
      }

      // Generate founder-cofounder agreement
      const agreement = await codeGenerationService.generateAgreement(clarificationData);
      setFounderCofounderAgreement(prev => ({
        ...prev,
        ...agreement
      }));

      // Identify risky choices that need consent
      const risksToAcknowledge = agreement.riskyChoices?.filter(choice => !choice.founderConsent) || [];
      setPendingRiskyChoices(risksToAcknowledge);
      
    } catch (error) {
      console.error("Error auto-populating CTO Studio:", error);
      setFounderCofounderAgreement({
        criticalItems: [],
        optionalItems: [],
        riskyChoices: [],
        founderChoices: [],  
        riskAcknowledgments: [],
        isComplete: false,
        agreementTimestamp: null,
        overallReadiness: 0,
        recommendedAction: "Failed to generate agreement. Please try again."
      });
    }

    setIsAutoPopulating(false);
  };

  // Note: generateFounderCofounderAgreement moved to codeGenerationService.js

  const handleCriticalItemToggle = (itemId) => {
    setFounderCofounderAgreement(prev => {
      const updatedCriticalItems = prev.criticalItems.map(item =>
        item.id === itemId
          ? { ...item, isComplete: !item.isComplete }
          : item
      );

      const allCriticalComplete = updatedCriticalItems.every(item => item.isComplete);
      const allRisksAcknowledged = pendingRiskyChoices.length === 0;

      return {
        ...prev,
        criticalItems: updatedCriticalItems,
        isComplete: allCriticalComplete && allRisksAcknowledged
      };
    });
  };

  const handleOptionalItemToggle = (itemId) => {
    setFounderCofounderAgreement(prev => ({
      ...prev,
      optionalItems: prev.optionalItems.map(item =>
        item.id === itemId
          ? { ...item, isIncluded: !item.isIncluded }
          : item
      ),
      founderChoices: prev.optionalItems.filter(item => item.isIncluded).map(item => item.id)
    }));
  };

  const handleRiskConsent = (risks) => {
    setFounderCofounderAgreement(prev => {
      const updatedRiskyChoices = prev.riskyChoices.map(risk =>
        risks.some(r => r.id === risk.id)
          ? { ...risk, founderConsent: true }
          : risk
      );

      const newRiskAcknowledgments = [...prev.riskAcknowledgments, ...risks.map(r => r.id)];

      const allCriticalComplete = prev.criticalItems.every(item => item.isComplete);
      const allRisksAcknowledged = updatedRiskyChoices.every(risk => risk.founderConsent);

      return {
        ...prev,
        riskyChoices: updatedRiskyChoices,
        riskAcknowledgments: newRiskAcknowledgments,
        isComplete: allCriticalComplete && allRisksAcknowledged,
        agreementTimestamp: new Date().toISOString()
      };
    });
    setPendingRiskyChoices([]);
    setShowRiskDialog(false);
  };

  const handleProceedWithRisks = () => {
    if (pendingRiskyChoices.length > 0) {
      setShowRiskDialog(true);
    }
  };

  const canProceedToGeneration = () => {
    const allCriticalComplete = founderCofounderAgreement.criticalItems.every(item => item.isComplete);
    const allRisksAcknowledged = pendingRiskyChoices.length === 0;
    return allCriticalComplete && allRisksAcknowledged;
  };

  // Note: All code generation functions moved to @/services/codeGenerationService.js
  // This provides better separation between UI logic and business logic

  if (isAutoPopulating) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <BrainCircuit className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CTO Agent Initializing</h2>
          <p className="text-gray-600">Autonomous technical co-founder analyzing your complete project context...</p>
        </motion.div>
      </div>
    );
  }

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
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">🔧 CTO Studio</h1>
                <p className="text-xl text-gray-600">Autonomous Technical Co-Founder & Smart Handshake Protocol</p>
              </div>
            </motion.div>
          </div>

          {/* Smart Handshake Protocol */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Founder-Cofounder Agreement Protocol
                {founderCofounderAgreement.isComplete && (
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    ✅ Agreement Complete
                  </Badge>
                )}
                {!founderCofounderAgreement.isComplete && (
                  <Badge className="bg-red-100 text-red-800 ml-2">
                    ⚠️ Agreement Pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  As your AI Technical Co-Founder, I require our formal agreement before generating production code.
                  This ensures we're 100% aligned and eliminates assumptions.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Smart Protocol:</strong> Critical items must be completed. Optional items can evolve post-launch with your consent.
                    Risky choices require explicit acknowledgment - you can proceed at your own risk with informed consent.
                  </p>
                </div>
              </div>

              <Tabs defaultValue="critical" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="critical" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Critical Items ({founderCofounderAgreement.criticalItems.filter(item => item.isComplete).length}/{founderCofounderAgreement.criticalItems.length})
                  </TabsTrigger>
                  <TabsTrigger value="optional" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Optional Items ({founderCofounderAgreement.optionalItems.filter(item => item.isIncluded).length}/{founderCofounderAgreement.optionalItems.length})
                  </TabsTrigger>
                  <TabsTrigger value="risks" className="gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risks ({pendingRiskyChoices.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="critical" className="mt-4">
                  <div className="space-y-3">
                    {founderCofounderAgreement.criticalItems.length === 0 ? (
                      <p className="text-gray-500">No critical items identified yet.</p>
                    ) : (
                      founderCofounderAgreement.criticalItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border">
                          <Checkbox
                            checked={item.isComplete}
                            onCheckedChange={() => handleCriticalItemToggle(item.id)}
                            className="mt-1 w-5 h-5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.item}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            <Badge variant="outline" className="mt-2 bg-red-50 text-red-700 border-red-200">
                              {item.category}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-2">
                              <strong>Evidence Required:</strong> {item.evidenceRequired}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="optional" className="mt-4">
                  <div className="space-y-3">
                    {founderCofounderAgreement.optionalItems.length === 0 ? (
                      <p className="text-gray-500">No optional items identified yet.</p>
                    ) : (
                      founderCofounderAgreement.optionalItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border">
                          <Checkbox
                            checked={item.isIncluded}
                            onCheckedChange={() => handleOptionalItemToggle(item.id)}
                            className="mt-1 w-5 h-5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.item}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                              {item.category}
                            </Badge>
                            {item.canEvolvePostLaunch && (
                              <div className="text-xs text-green-600 mt-2">
                                ✓ Can be refined after launch
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="mt-4">
                  <div className="space-y-3">
                    {pendingRiskyChoices.length === 0 && founderCofounderAgreement.riskyChoices?.length > 0 && (
                      <p className="text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> All identified risks have been acknowledged.
                      </p>
                    )}
                    {pendingRiskyChoices.length === 0 && founderCofounderAgreement.riskyChoices?.length === 0 && (
                      <p className="text-gray-500">No specific risks identified for this project at this stage.</p>
                    )}
                    {pendingRiskyChoices.map(risk => (
                      <div key={risk.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{risk.choice}</div>
                            <div className="text-sm text-gray-600 mt-1">{risk.riskDescription}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`${
                                risk.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                  risk.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                    risk.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                }`}>
                                {risk.riskLevel} risk
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                {risk.category}
                              </Badge>
                            </div>
                            <div className="text-sm text-blue-800 mt-2 bg-blue-50 p-2 rounded">
                              <strong>Mitigation:</strong> {risk.mitigationStrategy}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingRiskyChoices.length > 0 && (
                      <Button
                        onClick={handleProceedWithRisks}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        I Accept These Risks & Want to Proceed
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Agreement Status</div>
                    <div className="text-sm text-gray-600">
                      {founderCofounderAgreement.recommendedAction}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {founderCofounderAgreement.overallReadiness || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Readiness</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content - Show with informed consent model */}
          {(canProceedToGeneration() || founderCofounderAgreement.agreementTimestamp) && (
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-600" />
                    Technical Architecture & Complete Code Generation
                  </CardTitle>
                  <Badge className={`${canProceedToGeneration() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {canProceedToGeneration() ? '✅ Ready for Production Code' : '⚠️ Proceeding with Acknowledged Risks'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-50 rounded-none border-b">
                    <TabsTrigger value="context" className="gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                      <BrainCircuit className="w-4 h-4" />
                      Context Engineer
                    </TabsTrigger>
                    <TabsTrigger value="stack" className="gap-2">
                      <Code className="w-4 h-4" />
                      Tech Stack
                    </TabsTrigger>
                    <TabsTrigger value="frontend" className="gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
                      <Rocket className="w-4 h-4" />
                      Complete Frontend
                    </TabsTrigger>
                    <TabsTrigger value="modules" className="gap-2">
                      <Puzzle className="w-4 h-4" />
                      Modules
                      {selectedModules.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5">
                          {selectedModules.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="context" className="m-0">
                    <ContextEngineeringModule
                      contextData={contextData}
                      setContextData={setContextData}
                    />
                  </TabsContent>

                  <TabsContent value="stack" className="m-0">
                    <TechStackRecommendations
                      techStack={techStack}
                      onUpdateTechStack={setTechStack}
                    />
                  </TabsContent>

                  <TabsContent value="frontend" className="m-0">
                    <FullFrontendGenerator
                      projectContext={projectContext}
                      selectedModules={selectedModules}
                      techStack={techStack}
                      contextData={contextData}
                      validationComplete={true}
                      founderCofounderAgreement={founderCofounderAgreement}
                    />
                  </TabsContent>

                  <TabsContent value="modules" className="m-0">
                    <PlugAndPlayModules
                      selectedModules={selectedModules}
                      onUpdateModules={setSelectedModules}
                      techStack={techStack}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Risk Consent Dialog */}
          <AnimatePresence>
            {showRiskDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Founder Consent Required</h3>
                      <p className="text-gray-600">You're choosing to proceed with some identified risks. Please review and acknowledge:</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {pendingRiskyChoices.map(risk => (
                      <div key={risk.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="font-medium text-gray-900 mb-2">{risk.choice}</div>
                        <div className="text-sm text-gray-700 mb-3">{risk.consentLanguage}</div>
                        <div className="text-xs text-blue-800 bg-blue-50 p-2 rounded">
                          <strong>Our mitigation plan:</strong> {risk.mitigationStrategy}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowRiskDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleRiskConsent(pendingRiskyChoices)}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      I Acknowledge These Risks & Consent to Proceed
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}