import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InvokeLLM } from "@/api/integrations";
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Lock,
  Lightbulb,
  Target,
  Users,
  Settings,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const ClarificationSection = ({ title, icon: Icon, children, isCompleted }) => (
  <Card className={`mb-4 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="w-4 h-4" />
        {title}
        {isCompleted && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const AmbiguityDetector = ({ feature, onResolveAmbiguity }) => {
  const [detectedAmbiguities, setDetectedAmbiguities] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAmbiguities = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await InvokeLLM({
        prompt: `
          Analyze this feature for ambiguities and unclear requirements:
          
          Feature: ${feature.name}
          Description: ${feature.description}
          
          Identify:
          1. Vague or unclear terms
          2. Missing specifications
          3. Assumptions that need confirmation
          4. Potential edge cases not addressed
          5. User interaction ambiguities
          
          Return specific questions that need clarification.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            ambiguities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  issue: { type: "string" },
                  question: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            }
          }
        }
      });
      
      setDetectedAmbiguities(response.ambiguities || []);
    } catch (error) {
      console.error('Failed to analyze ambiguities:', error);
    }
    
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (!feature.clarificationData?.ambiguitiesAnalyzed) {
      analyzeAmbiguities();
    }
  }, [feature]);

  return (
    <div className="space-y-3">
      {isAnalyzing ? (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Analyzing for ambiguities...</p>
        </div>
      ) : (
        <>
          {detectedAmbiguities.map((ambiguity, index) => (
            <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900">{ambiguity.issue}</h4>
                  <p className="text-sm text-orange-700 mt-1">{ambiguity.question}</p>
                </div>
                <Badge variant={ambiguity.priority === 'high' ? 'destructive' : 'secondary'}>
                  {ambiguity.priority}
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onResolveAmbiguity(ambiguity)}
                className="mt-2"
              >
                Resolve This
              </Button>
            </div>
          ))}
          
          {detectedAmbiguities.length === 0 && (
            <div className="text-center py-4 text-green-600">
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">No major ambiguities detected!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function FeatureClarifier({ feature, onUpdateFeature, onLockForExecution }) {
  const [clarificationData, setClarificationData] = useState(
    feature.clarificationData || {
      inputs: '',
      outputs: '',
      userInteraction: '',
      edgeCases: '',
      assumptions: '',
      clarified: false,
      ambiguitiesResolved: false,
      clarityScore: 0
    }
  );

  const [isLocked, setIsLocked] = useState(feature.clarificationData?.executionReady || false);

  const calculateCompletionScore = () => {
    let score = 0;
    if (clarificationData.inputs.trim()) score += 20;
    if (clarificationData.outputs.trim()) score += 20;
    if (clarificationData.userInteraction.trim()) score += 20;
    if (clarificationData.edgeCases.trim()) score += 20;
    if (clarificationData.assumptions.trim()) score += 10;
    if (clarificationData.ambiguitiesResolved) score += 10;
    return Math.min(score, 100);
  };

  const handleInputChange = (field, value) => {
    const updatedData = { ...clarificationData, [field]: value };
    setClarificationData(updatedData);
    
    const score = calculateCompletionScore();
    const isClarified = score >= 80;
    
    const finalData = {
      ...updatedData,
      clarityScore: score,
      clarified: isClarified
    };
    
    onUpdateFeature(feature.id, { clarificationData: finalData });
  };

  const handleResolveAmbiguity = (ambiguity) => {
    // Mark ambiguity as resolved
    handleInputChange('ambiguitiesResolved', true);
  };

  const handleLockFeature = () => {
    if (clarificationData.clarityScore >= 80) {
      onLockForExecution(feature);
      setIsLocked(true);
    }
  };

  const completionScore = calculateCompletionScore();

  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{feature.name}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionScore}%</div>
              <div className="text-xs text-gray-500">Clarity Score</div>
            </div>
            <Progress value={completionScore} className="w-24 h-2" />
          </div>
        </div>

        {/* Lock Status */}
        {isLocked && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Feature Locked for Execution</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                This feature is ready for development and cannot be modified without unlocking.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Input/Output Clarification */}
        <ClarificationSection 
          title="Inputs & Outputs" 
          icon={ArrowRight}
          isCompleted={clarificationData.inputs.trim() && clarificationData.outputs.trim()}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are the expected inputs for this feature?
              </label>
              <Textarea
                value={clarificationData.inputs}
                onChange={(e) => handleInputChange('inputs', e.target.value)}
                placeholder="e.g., User email, product ID, search query..."
                className="h-20"
                disabled={isLocked}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are the expected outputs or results?
              </label>
              <Textarea
                value={clarificationData.outputs}
                onChange={(e) => handleInputChange('outputs', e.target.value)}
                placeholder="e.g., Confirmation message, filtered list, generated report..."
                className="h-20"
                disabled={isLocked}
              />
            </div>
          </div>
        </ClarificationSection>

        {/* User Interaction Clarification */}
        <ClarificationSection 
          title="User Interaction" 
          icon={Users}
          isCompleted={clarificationData.userInteraction.trim()}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How will users trigger or interact with this feature?
            </label>
            <Textarea
              value={clarificationData.userInteraction}
              onChange={(e) => handleInputChange('userInteraction', e.target.value)}
              placeholder="e.g., Click button, voice command, automatic trigger, form submission..."
              className="h-24"
              disabled={isLocked}
            />
          </div>
        </ClarificationSection>

        {/* Edge Cases */}
        <ClarificationSection 
          title="Edge Cases & Exceptions" 
          icon={AlertTriangle}
          isCompleted={clarificationData.edgeCases.trim()}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What edge cases or error scenarios should be handled?
            </label>
            <Textarea
              value={clarificationData.edgeCases}
              onChange={(e) => handleInputChange('edgeCases', e.target.value)}
              placeholder="e.g., Invalid input, network failure, empty results, permission denied..."
              className="h-24"
              disabled={isLocked}
            />
          </div>
        </ClarificationSection>

        {/* Assumptions */}
        <ClarificationSection 
          title="Assumptions & Dependencies" 
          icon={Lightbulb}
          isCompleted={clarificationData.assumptions.trim()}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What assumptions are being made? Any dependencies?
            </label>
            <Textarea
              value={clarificationData.assumptions}
              onChange={(e) => handleInputChange('assumptions', e.target.value)}
              placeholder="e.g., User is logged in, database is available, third-party API is working..."
              className="h-20"
              disabled={isLocked}
            />
          </div>
        </ClarificationSection>

        {/* Ambiguity Detector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Ambiguity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AmbiguityDetector 
              feature={feature} 
              onResolveAmbiguity={handleResolveAmbiguity}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {!isLocked && (
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reset
            </Button>
            <Button
              onClick={handleLockFeature}
              disabled={completionScore < 80}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Lock className="w-4 h-4" />
              Lock for Execution ({completionScore}% ready)
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}