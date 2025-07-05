import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from "@/api/integrations";
import { 
  FileText, 
  Download, 
  X, 
  Code, 
  Sparkles,
  CheckCircle,
  Calendar,
  Zap,
  Target,
  DollarSign
} from "lucide-react";

export default function PlanGenerator({ 
  features, 
  validationData, 
  agreements, 
  onClose, 
  onCreateProject 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  useEffect(() => {
    generateInitialPlan();
  }, []);

  const generateInitialPlan = async () => {
    setIsGenerating(true);
    
    try {
      const approvedFeatures = features.filter(f => f.status === 'approved');
      const coreFeatures = features.filter(f => f.category === 'core');
      
      const response = await InvokeLLM({
        prompt: `
        Generate a comprehensive MVP plan based on this conversation data:

        Approved Features: ${JSON.stringify(approvedFeatures)}
        Core Features: ${JSON.stringify(coreFeatures)}
        Business Validation: ${JSON.stringify(validationData)}
        Agreements: ${JSON.stringify(agreements)}

        Create a structured plan with:
        1. Executive Summary (2-3 sentences)
        2. MVP Feature List (prioritized)
        3. Technical Architecture recommendations
        4. Development Timeline (phases)
        5. Success Metrics
        6. Risk Mitigation strategies
        7. Next Steps (actionable items)

        Make it practical and actionable for a startup team.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            projectName: { type: "string" },
            executiveSummary: { type: "string" },
            mvpFeatures: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "number" },
                  estimatedHours: { type: "number" }
                }
              }
            },
            technicalArchitecture: {
              type: "object",
              properties: {
                frontend: { type: "string" },
                backend: { type: "string" },
                database: { type: "string" },
                hosting: { type: "string" },
                additionalTools: { type: "array", items: { type: "string" } }
              }
            },
            developmentTimeline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase: { type: "string" },
                  duration: { type: "string" },
                  deliverables: { type: "array", items: { type: "string" } }
                }
              }
            },
            successMetrics: { type: "array", items: { type: "string" } },
            riskMitigation: { type: "array", items: { type: "string" } },
            nextSteps: { type: "array", items: { type: "string" } }
          }
        }
      });

      setGeneratedPlan(response);
      setProjectName(response.projectName || "My AI-Generated Project");
    } catch (error) {
      console.error('Failed to generate plan:', error);
    }
    
    setIsGenerating(false);
  };

  const handleCreateProject = () => {
    const projectData = {
      projectName,
      generatedPlan,
      features: features.filter(f => f.status === 'approved'),
      validationData,
      agreements,
      customNotes
    };
    
    onCreateProject(projectData);
  };

  const downloadPlan = () => {
    const planText = `
# ${projectName} - MVP Plan

## Executive Summary
${generatedPlan.executiveSummary}

## MVP Features
${generatedPlan.mvpFeatures.map(f => `- **${f.name}**: ${f.description} (${f.estimatedHours}h)`).join('\n')}

## Technical Architecture
- Frontend: ${generatedPlan.technicalArchitecture.frontend}
- Backend: ${generatedPlan.technicalArchitecture.backend}
- Database: ${generatedPlan.technicalArchitecture.database}
- Hosting: ${generatedPlan.technicalArchitecture.hosting}

## Development Timeline
${generatedPlan.developmentTimeline.map(phase => `### ${phase.phase} (${phase.duration})\n${phase.deliverables.map(d => `- ${d}`).join('\n')}`).join('\n\n')}

## Success Metrics
${generatedPlan.successMetrics.map(m => `- ${m}`).join('\n')}

## Risk Mitigation
${generatedPlan.riskMitigation.map(r => `- ${r}`).join('\n')}

## Next Steps
${generatedPlan.nextSteps.map(s => `- ${s}`).join('\n')}

---
Generated by AI Debugger Factory
    `;
    
    const blob = new Blob([planText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-mvp-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">MVP Plan Generator</h2>
              <p className="text-sm text-gray-600">Your comprehensive product roadmap</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {isGenerating ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 text-blue-600"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <span className="ml-3 text-lg text-gray-600">Generating your MVP plan...</span>
            </div>
          ) : generatedPlan ? (
            <div className="p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>

              {/* Executive Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{generatedPlan.executiveSummary}</p>
                </CardContent>
              </Card>

              {/* MVP Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    MVP Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedPlan.mvpFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Badge className="mt-1">{feature.priority}</Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <span className="text-xs text-gray-500">{feature.estimatedHours} hours</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technical Architecture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-600" />
                    Technical Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Stack</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Frontend:</strong> {generatedPlan.technicalArchitecture.frontend}</div>
                        <div><strong>Backend:</strong> {generatedPlan.technicalArchitecture.backend}</div>
                        <div><strong>Database:</strong> {generatedPlan.technicalArchitecture.database}</div>
                        <div><strong>Hosting:</strong> {generatedPlan.technicalArchitecture.hosting}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPlan.technicalArchitecture.additionalTools.map((tool, index) => (
                          <Badge key={index} variant="outline">{tool}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Development Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Development Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedPlan.developmentTimeline.map((phase, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{phase.phase}</h4>
                        <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {phase.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <Textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Add any additional requirements or notes..."
                  rows={3}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={downloadPlan}
                disabled={!generatedPlan}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Plan
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!generatedPlan || !projectName.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}