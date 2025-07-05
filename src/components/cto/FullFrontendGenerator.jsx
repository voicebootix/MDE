import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Code2,
  Loader2,
  Zap,
  AlertTriangle,
  Rocket,
  Eye,
  Download,
  GitBranch,
  CheckCircle,
  Settings,
  Database,
  Layout,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvokeLLM } from '@/api/integrations';

export default function FullFrontendGenerator({
  projectContext,
  selectedModules,
  techStack,
  contextData,
  founderCofounderAgreement
}) {
  const [generatedApp, setGeneratedApp] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState(null);
  const [deploymentReady, setDeploymentReady] = useState(false);

  // Enhanced Auto-Generation Trigger with Agreement Validation
  useEffect(() => {
    const agreementComplete = founderCofounderAgreement?.isComplete ||
                             founderCofounderAgreement?.agreementTimestamp;

    if (projectContext &&
        selectedModules.length > 0 &&
        contextData.readinessScore >= 7 &&
        agreementComplete) {
      handleGenerateFullApp();
    }
  }, [projectContext, selectedModules, contextData, founderCofounderAgreement]);

  const handleGenerateFullApp = async () => {
    if (!projectContext) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // Step 0: Validate Founder-Cofounder Agreement
      setCurrentStep("🤝 Validating Founder-Cofounder Agreement...");
      setGenerationProgress(5);

      const agreementValidation = await validateFounderCofounderAgreement();
      if (!agreementValidation.canProceed) {
        throw new Error(agreementValidation.reason);
      }

      // Step 1: Analyze Complete Project Context
      setCurrentStep("🧠 Analyzing complete project context with all validated data...");
      setGenerationProgress(15);

      const projectAnalysis = await analyzeCompleteProject();

      // Step 2: Generate Application Architecture
      setCurrentStep("🏗️ Designing production-ready application architecture...");
      setGenerationProgress(30);

      const appArchitecture = await generateAppArchitecture(projectAnalysis);

      // Step 3: Generate Component Library
      setCurrentStep("🧩 Creating comprehensive component library...");
      setGenerationProgress(50);

      const componentLibrary = await generateComponentLibrary(appArchitecture);

      // Step 4: Generate Core Pages
      setCurrentStep("📄 Building all application pages with full functionality...");
      setGenerationProgress(70);

      const corePages = await generateCorePages(appArchitecture, componentLibrary);

      // Step 5: Generate Module Integrations
      setCurrentStep("🔌 Integrating selected modules and third-party services...");
      setGenerationProgress(85);

      const moduleIntegrations = await generateModuleIntegrations(selectedModules, appArchitecture);

      // Step 6: Generate Complete Application
      setCurrentStep("🚀 Assembling complete, production-ready application...");
      setGenerationProgress(95);

      const completeApp = await assembleCompleteApplication({
        architecture: appArchitecture,
        components: componentLibrary,
        pages: corePages,
        modules: moduleIntegrations,
        context: projectAnalysis,
        agreement: founderCofounderAgreement
      });

      setCurrentStep("✅ Complete! Your production-ready application is generated.");
      setGenerationProgress(100);
      setGeneratedApp(completeApp);
      setDeploymentReady(true);

    } catch (err) {
      console.error('Error generating complete frontend:', err);
      setError(`Generation failed: ${err.message}. This ensures we maintain our agreement standards. Please review the requirements and try again.`);
    } finally {
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  const validateFounderCofounderAgreement = async () => {
    const criticalItemsComplete = founderCofounderAgreement?.criticalItems?.every(item => item.isComplete) || false;
    const hasAgreementTimestamp = founderCofounderAgreement?.agreementTimestamp || false;
    const risksAcknowledged = founderCofounderAgreement?.riskAcknowledgments?.length > 0 || false;

    if (!criticalItemsComplete && !hasAgreementTimestamp) {
      return {
        canProceed: false,
        reason: "Critical items in the Founder-Cofounder Agreement must be completed or risks must be explicitly acknowledged before code generation."
      };
    }

    return {
      canProceed: true,
      reason: "Agreement validated - proceeding with code generation"
    };
  };

  // Enhanced project analysis with agreement context
  const analyzeCompleteProject = async () => {
    const coFounderData = sessionStorage.getItem('coFounderConversations') || '{}';
    const validationData = sessionStorage.getItem('businessValidation') || '{}';
    const clarificationData = sessionStorage.getItem('clarificationData') || '{}';

    return await InvokeLLM({
      prompt: `
        You are the CTO AGENT - an autonomous technical co-founder generating production-ready code.

        VALIDATED FOUNDER-COFOUNDER AGREEMENT:
        Agreement Status: ${founderCofounderAgreement?.isComplete ? 'Complete' : 'Risk-Acknowledged'}
        Critical Items Completed: ${founderCofounderAgreement?.criticalItems?.filter(item => item.isComplete).length || 0}/${founderCofounderAgreement?.criticalItems?.length || 0}
        Acknowledged Risks: ${founderCofounderAgreement?.riskAcknowledgments?.length || 0}
        Agreement Timestamp: ${founderCofounderAgreement?.agreementTimestamp || 'Pending'}

        COMPLETE PROJECT CONTEXT:
        **Co-Founder Conversations & Business Foundation:**
        ${coFounderData}

        **Market Validation & Business Strategy:**
        ${validationData}

        **Feature Clarification & Technical Requirements:**
        ${clarificationData}

        **Selected Tech Stack:**
        - Frontend: ${techStack.frontend || 'React'}
        - Backend: ${techStack.backend || 'Node.js'}
        - Database: ${techStack.database || 'PostgreSQL'}
        - Hosting: ${techStack.hosting || 'Vercel'}

        **Selected Modules & Integrations:**
        ${selectedModules.map(m => `- ${m.name}: ${m.description}`).join('\n')}

        **Context Engineering Readiness:** ${contextData.readinessScore}/10

        MISSION: Create a comprehensive technical specification that will guide the generation of a fully functional frontend application.

        This analysis must be thorough enough to generate an application that:
        1. Implements ALL agreed-upon features completely
        2. Handles ALL specified user flows end-to-end
        3. Meets ALL technical requirements and constraints
        4. Includes proper error handling, loading states, and edge cases
        5. Is immediately deployable and scalable
        6. Reflects the founder's vision with technical excellence
      `,
      response_json_schema: {
        type: "object",
        properties: {
          projectType: { type: "string" },
          businessObjective: { type: "string" },
          targetUsers: { type: "string" },
          coreValueProposition: { type: "string" },
          primaryUserFlows: {
            type: "array",
            items: {
              type: "object",
              properties: {
                flowName: { type: "string" },
                description: { type: "string" },
                steps: { type: "array", items: { type: "string" } },
                requiredComponents: { type: "array", items: { type: "string" } },
                errorHandling: { type: "array", items: { type: "string" } },
                successCriteria: { type: "string" }
              }
            }
          },
          coreFeatures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                priority: { type: "string" },
                requiredPages: { type: "array", items: { type: "string" } },
                requiredComponents: { type: "array", items: { type: "string" } },
                apiEndpoints: { type: "array", items: { type: "string" } },
                dataModels: { type: "array", items: { type: "string" } },
                businessLogic: { type: "string" },
                acceptanceCriteria: { type: "array", items: { type: "string" } }
              }
            }
          },
          dataModels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                entityName: { type: "string" },
                fields: { type: "array", items: { type: "string" } },
                relationships: { type: "array", items: { type: "string" } },
                businessRules: { type: "array", items: { type: "string" } }
              }
            }
          },
          designSystem: {
            type: "object",
            properties: {
              primaryColor: { type: "string" },
              secondaryColor: { type: "string" },
              fontFamily: { type: "string" },
              brandPersonality: { type: "string" },
              uiStyle: { type: "string" },
              responsiveBreakpoints: { type: "array", items: { type: "string" } }
            }
          },
          technicalConstraints: {
            type: "array",
            items: { type: "string" }
          },
          performanceRequirements: {
            type: "array",
            items: { type: "string" }
          },
          securityRequirements: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });
  };

  const generateAppArchitecture = async (analysis) => {
    return await InvokeLLM({
      prompt: `
        Based on this project analysis, create a complete React application architecture:

        ${JSON.stringify(analysis, null, 2)}

        Generate a comprehensive application structure with:
        1. Folder structure and file organization
        2. Routing configuration
        3. State management approach
        4. Component hierarchy
        5. Data flow patterns
        6. Integration points for selected modules

        The architecture should be production-ready and follow modern React best practices.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          folderStructure: {
            type: "object",
            properties: {
              src: {
                type: "object",
                properties: {
                  components: { type: "array", items: { type: "string" } },
                  pages: { type: "array", items: { type: "string" } },
                  hooks: { type: "array", items: { type: "string" } },
                  utils: { type: "array", items: { type: "string" } },
                  context: { type: "array", items: { type: "string" } }
                }
              }
            }
          },
          routingConfig: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                component: { type: "string" },
                protected: { type: "boolean" },
                description: { type: "string" }
              }
            }
          },
          stateManagement: {
            type: "object",
            properties: {
              approach: { type: "string" },
              globalState: { type: "array", items: { type: "string" } },
              contextProviders: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    });
  };

  const generateComponentLibrary = async (architecture) => {
    return await InvokeLLM({
      prompt: `
        Generate a complete component library for this React application architecture:

        ${JSON.stringify(architecture, null, 2)}

        Create reusable components that will be used throughout the application. Each component should be:
        1. Fully functional React code
        2. Responsive and accessible
        3. Styled with Tailwind CSS
        4. Include proper TypeScript interfaces if applicable
        5. Follow modern React patterns (hooks, functional components)

        Focus on creating the most essential components first.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          uiComponents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                filePath: { type: "string" },
                code: { type: "string" },
                description: { type: "string" },
                props: { type: "array", items: { type: "string" } }
              }
            }
          },
          layoutComponents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                filePath: { type: "string" },
                code: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          featureComponents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                filePath: { type: "string" },
                code: { type: "string" },
                description: { type: "string" },
                relatedFeature: { type: "string" }
              }
            }
          }
        }
      }
    });
  };

  const generateCorePages = async (architecture, components) => {
    return await InvokeLLM({
      prompt: `
        Generate complete React page components for this application:

        Architecture: ${JSON.stringify(architecture, null, 2)}
        Available Components: ${JSON.stringify(components, null, 2)}

        Create fully functional page components that:
        1. Use the available component library
        2. Implement the defined user flows
        3. Include realistic data and content
        4. Are responsive and modern
        5. Include proper navigation and state management
        6. Handle loading states and error conditions

        Generate the most important pages first (Dashboard, Landing, Profile, Main Feature pages).
      `,
      response_json_schema: {
        type: "object",
        properties: {
          pages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                filePath: { type: "string" },
                route: { type: "string" },
                code: { type: "string" },
                description: { type: "string" },
                dependencies: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });
  };

  const generateModuleIntegrations = async (modules, architecture) => {
    if (modules.length === 0) return { integrations: [] };

    return await InvokeLLM({
      prompt: `
        Generate integration code for these selected modules:

        ${modules.map(m => `**${m.name}**: ${m.description}\n${m.generationPrompt || ''}`).join('\n\n')}

        Application Architecture: ${JSON.stringify(architecture, null, 2)}

        Create integration code that:
        1. Follows the application's architecture patterns
        2. Includes proper error handling
        3. Is production-ready
        4. Includes configuration and setup instructions
        5. Integrates seamlessly with existing components and pages

        Each integration should include the necessary components, hooks, and utility functions.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          integrations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                moduleName: { type: "string" },
                integrationCode: { type: "string" },
                configurationSteps: { type: "array", items: { type: "string" } },
                dependencies: { type: "array", items: { type: "string" } },
                description: { type: "string" }
              }
            }
          }
        }
      }
    });
  };

  // Enhanced final assembly with agreement validation
  const assembleCompleteApplication = async (appParts) => {
    return await InvokeLLM({
      prompt: `
        FINAL ASSEMBLY - CTO AGENT DELIVERING ON FOUNDER-COFOUNDER AGREEMENT

        You are completing the technical co-founder commitment by assembling these validated components into a complete, production-ready application:

        FOUNDER-COFOUNDER AGREEMENT CONTEXT:
        ${JSON.stringify(appParts.agreement, null, 2)}

        APPLICATION COMPONENTS TO ASSEMBLE:
        ${JSON.stringify(appParts, null, 2)}

        ASSEMBLY REQUIREMENTS (per our agreement):
        1. Generate a COMPLETE, IMMEDIATELY DEPLOYABLE React application
        2. Include ALL dependencies in package.json (no missing imports)
        3. Provide COMPLETE implementation of all features (no placeholder code)
        4. Include proper error handling, loading states, and user feedback
        5. Ensure responsive design that works on all devices
        6. Include comprehensive setup and deployment instructions
        7. Generate environment configuration for immediate deployment
        8. Provide testing setup and basic test coverage
        9. Include proper code organization and documentation
        10. Deliver exactly what was agreed upon in our technical partnership

        OUTPUT SPECIFICATION:
        - Complete file structure with ALL necessary files
        - Production-ready package.json with exact dependencies
        - Fully functional App.js with routing and state management
        - Complete component implementations (no "TODO" comments)
        - Deployment configuration for selected hosting platform
        - Environment setup with all required variables
        - Professional README with setup instructions
        - Basic testing setup and example tests

        This is the culmination of our co-founder partnership - deliver a complete, professional application that fulfills our agreement.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          projectStructure: {
            type: "object",
            properties: {
              packageJson: { type: "string" },
              appJs: { type: "string" },
              indexJs: { type: "string" },
              indexHtml: { type: "string" },
              tailwindConfig: { type: "string" },
              readmeMd: { type: "string" },
              envExample: { type: "string" },
              gitignore: { type: "string" }
            }
          },
          deploymentConfig: {
            type: "object",
            properties: {
              platform: { type: "string" },
              buildCommand: { type: "string" },
              deploymentSteps: { type: "array", items: { type: "string" } },
              environmentVariables: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    required: { type: "boolean" },
                    defaultValue: { type: "string" }
                  }
                }
              }
            }
          },
          completeFileStructure: {
            type: "array",
            items: {
              type: "object",
              properties: {
                filePath: { type: "string" },
                content: { type: "string" },
                description: { type: "string" },
                fileType: { type: "string" }
              }
            }
          },
          setupInstructions: {
            type: "array",
            items: { type: "string" }
          },
          testingSetup: {
            type: "object",
            properties: {
              framework: { type: "string" },
              testFiles: { type: "array", items: { type: "string" } },
              runInstructions: { type: "array", items: { type: "string" } }
            }
          },
          qualityAssurance: {
            type: "object",
            properties: {
              codeCompleteness: { type: "number", minimum: 0, maximum: 100 },
              featureCoverage: { type: "number", minimum: 0, maximum: 100 },
              deploymentReadiness: { type: "number", minimum: 0, maximum: 100 },
              agreementFulfillment: { type: "number", minimum: 0, maximum: 100 }
            }
          }
        }
      }
    });
  };

  if (isGenerating) {
    return (
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <Code2 className="w-10 h-10 text-white" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">CTO Agent: Delivering Your Complete Application</h2>
            <p className="text-gray-600 mb-4">Fulfilling our Founder-Cofounder Agreement with production-ready code...</p>
            <p className="text-sm text-purple-600 font-medium">{currentStep}</p>
          </div>

          <div className="max-w-lg mx-auto">
            <Progress value={generationProgress} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">{generationProgress}% Complete</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Revolutionary Delivery:</strong> Your AI Technical Co-Founder is generating a complete,
              production-ready application that exactly fulfills our agreement - no placeholders, no missing pieces.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Complete Application Generator</h2>
          </div>
          <p className="text-gray-600">
            Your AI Technical Co-Founder delivering on our agreement
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerateFullApp}
            disabled={isGenerating || !projectContext}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Generate Complete App
          </Button>

          {deploymentReady && (
            <Button
              variant="outline"
              className="px-6 py-3 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download & Deploy
            </Button>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Enhanced Agreement Status Display */}
      <Card className="mb-6 border-2 border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Founder-Cofounder Agreement Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {founderCofounderAgreement?.isComplete ? '✅' : '🤝'}
              </div>
              <div className="text-sm text-gray-600">Agreement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {founderCofounderAgreement?.criticalItems?.filter(item => item.isComplete).length || 0}/{founderCofounderAgreement?.criticalItems?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Critical Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {founderCofounderAgreement?.riskAcknowledgments?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Risks Acknowledged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {contextData.readinessScore}/10
              </div>
              <div className="text-sm text-gray-600">Context Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedApp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Application Overview */}
          <Card className="border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-600" />
                Your Complete Application Is Ready!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <Layout className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="font-semibold text-emerald-900">
                    {generatedApp.completeFileStructure?.length || 0} Files
                  </div>
                  <div className="text-sm text-emerald-700">Complete codebase</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900">Production Ready</div>
                  <div className="text-sm text-blue-700">Deployment configured</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-900">Module Integrated</div>
                  <div className="text-sm text-purple-700">All modules included</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Quick Start Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  {generatedApp.setupInstructions?.slice(0, 5).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  )) || [
                    "Download the generated application files",
                    "Run 'npm install' to install dependencies",
                    "Configure environment variables",
                    "Run 'npm start' to launch development server",
                    "Deploy to your chosen hosting platform"
                  ]}
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* File Structure Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-gray-600" />
                Generated Application Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="structure">
                <TabsList>
                  <TabsTrigger value="structure">File Structure</TabsTrigger>
                  <TabsTrigger value="setup">Setup Guide</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                </TabsList>

                <TabsContent value="structure" className="mt-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <pre className="whitespace-pre-wrap">
{generatedApp.completeFileStructure?.slice(0, 15).map(file =>
  `${file.filePath}\n`
).join('') || `
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── pages/
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   └── Landing.jsx
├── hooks/
├── utils/
└── context/
`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="setup" className="mt-4">
                  <div className="space-y-4">
                    {generatedApp.setupInstructions?.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{instruction}</p>
                      </div>
                    )) || (
                      <p className="text-gray-600">Setup instructions will be generated with your application.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="deployment" className="mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Deployment to {generatedApp.deploymentConfig?.platform || techStack.hosting}
                    </h4>
                    <div className="space-y-2">
                      {generatedApp.deploymentConfig?.deploymentSteps?.map((step, index) => (
                        <div key={index} className="text-sm text-blue-800">• {step}</div>
                      )) || (
                        <p className="text-blue-800 text-sm">
                          Deployment steps will be customized for your selected hosting platform.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}