import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  FileText, 
  Target, 
  Users, 
  CheckCircle, 
  Star,
  Download,
  Rocket,
  Code2,
  Database,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Layout,
  GitBranch,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContextEngineeringModule({ contextData, setContextData }) {
  const [reportData, setReportData] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(true);

  useEffect(() => {
    // Auto-generate comprehensive context engineering report
    if (contextData) {
      generateComprehensiveReport(contextData);
    }
  }, [contextData]);

  const generateComprehensiveReport = (data) => {
    setIsGeneratingReport(true);
    
    // Simulate comprehensive analysis and report generation
    setTimeout(() => {
      const report = {
        projectOverview: {
          title: extractProjectTitle(data.projectVision),
          vision: data.projectVision,
          complexity: calculateComplexity(data.featureModules),
          estimatedTimeline: calculateTimeline(data.featureModules),
          teamSize: calculateTeamSize(data.featureModules)
        },
        technicalArchitecture: {
          coreComponents: generateCoreComponents(data.featureModules),
          dataModels: generateDataModels(data.featureModules),
          apiEndpoints: generateAPIEndpoints(data.featureModules),
          integrationPoints: generateIntegrations(data.featureModules)
        },
        developmentPlan: {
          phases: generateDevelopmentPhases(data.featureModules),
          milestones: generateMilestones(data.featureModules),
          riskAssessment: generateRiskAssessment(data.featureModules),
          successCriteria: generateSuccessCriteria(data.featureModules)
        },
        deploymentStrategy: {
          infrastructure: generateInfrastructure(data.featureModules),
          scalingPlan: generateScalingPlan(data.featureModules),
          monitoringStrategy: generateMonitoring(data.featureModules),
          securityMeasures: generateSecurity(data.featureModules)
        },
        contextPrompts: {
          systemPrompt: generateSystemPrompt(data),
          userPrompts: generateUserPrompts(data.featureModules),
          errorHandling: generateErrorHandling(data.featureModules),
          testingScenarios: generateTestingScenarios(data.featureModules)
        },
        readinessScore: data.readinessScore || 8.5,
        recommendations: generateRecommendations(data.featureModules)
      };
      
      setReportData(report);
      setIsGeneratingReport(false);
    }, 2000);
  };

  const extractProjectTitle = (vision) => {
    if (!vision) return "Untitled Project";
    // Extract key terms to create a project title
    const words = vision.split(' ').slice(0, 4);
    return words.join(' ').replace(/[^\w\s]/gi, '') + " Platform";
  };

  const calculateComplexity = (features) => {
    if (!features || features.length === 0) return "Medium";
    if (features.length >= 8) return "High";
    if (features.length >= 5) return "Medium";
    return "Low";
  };

  const calculateTimeline = (features) => {
    if (!features) return "12-16 weeks";
    const featureCount = features.length;
    if (featureCount >= 10) return "20-24 weeks";
    if (featureCount >= 7) return "16-20 weeks";
    if (featureCount >= 4) return "12-16 weeks";
    return "8-12 weeks";
  };

  const calculateTeamSize = (features) => {
    if (!features) return "3-4 developers";
    const featureCount = features.length;
    if (featureCount >= 10) return "5-7 developers";
    if (featureCount >= 7) return "4-5 developers";
    return "3-4 developers";
  };

  const generateCoreComponents = (features) => {
    const baseComponents = [
      { name: "Authentication System", description: "User registration, login, and session management", priority: "High" },
      { name: "API Gateway", description: "Central API routing and request handling", priority: "High" },
      { name: "Database Layer", description: "Data persistence and query optimization", priority: "High" },
      { name: "Frontend Framework", description: "User interface and client-side logic", priority: "High" }
    ];

    if (features && features.length > 0) {
      features.forEach(feature => {
        baseComponents.push({
          name: `${feature} Module`,
          description: `Core functionality for ${feature.toLowerCase()} features`,
          priority: "Medium"
        });
      });
    }

    return baseComponents;
  };

  const generateDataModels = (features) => {
    const baseModels = [
      { entity: "User", fields: ["id", "email", "profile", "preferences", "created_at"], relationships: ["UserSessions", "UserPreferences"] },
      { entity: "Session", fields: ["id", "user_id", "token", "expires_at"], relationships: ["User"] }
    ];

    if (features && features.length > 0) {
      features.forEach(feature => {
        baseModels.push({
          entity: feature.replace(/\s+/g, ''),
          fields: ["id", "user_id", "name", "description", "status", "created_at"],
          relationships: ["User"]
        });
      });
    }

    return baseModels;
  };

  const generateAPIEndpoints = (features) => {
    const baseEndpoints = [
      { method: "POST", path: "/api/auth/login", description: "User authentication" },
      { method: "POST", path: "/api/auth/register", description: "User registration" },
      { method: "GET", path: "/api/user/profile", description: "Get user profile" },
      { method: "PUT", path: "/api/user/profile", description: "Update user profile" }
    ];

    if (features && features.length > 0) {
      features.forEach(feature => {
        const endpoint = feature.toLowerCase().replace(/\s+/g, '-');
        baseEndpoints.push(
          { method: "GET", path: `/api/${endpoint}`, description: `List ${feature.toLowerCase()}` },
          { method: "POST", path: `/api/${endpoint}`, description: `Create ${feature.toLowerCase()}` },
          { method: "PUT", path: `/api/${endpoint}/:id`, description: `Update ${feature.toLowerCase()}` },
          { method: "DELETE", path: `/api/${endpoint}/:id`, description: `Delete ${feature.toLowerCase()}` }
        );
      });
    }

    return baseEndpoints;
  };

  const generateIntegrations = (features) => {
    const integrations = [
      { service: "Email Service", purpose: "Transactional emails and notifications", provider: "SendGrid/Mailgun" },
      { service: "File Storage", purpose: "Asset and document management", provider: "AWS S3/Cloudinary" },
      { service: "Analytics", purpose: "User behavior and performance tracking", provider: "Google Analytics/Mixpanel" }
    ];

    if (features && features.some(f => f.toLowerCase().includes('payment'))) {
      integrations.push({ service: "Payment Gateway", purpose: "Payment processing", provider: "Stripe/PayPal" });
    }

    if (features && features.some(f => f.toLowerCase().includes('chat'))) {
      integrations.push({ service: "Real-time Communication", purpose: "Live chat and messaging", provider: "Socket.io/Pusher" });
    }

    return integrations;
  };

  const generateDevelopmentPhases = (features) => {
    return [
      {
        phase: "Phase 1: Foundation",
        duration: "3-4 weeks",
        deliverables: ["User authentication", "Database setup", "API structure", "Basic UI framework"],
        completion: 0
      },
      {
        phase: "Phase 2: Core Features",
        duration: "6-8 weeks",
        deliverables: features && features.length > 0 ? features.slice(0, 3).map(f => f) : ["Main functionality", "User dashboard", "Admin panel"],
        completion: 0
      },
      {
        phase: "Phase 3: Advanced Features",
        duration: "4-5 weeks",
        deliverables: features && features.length > 3 ? features.slice(3).map(f => f) : ["Integrations", "Analytics", "Optimization"],
        completion: 0
      },
      {
        phase: "Phase 4: Testing & Deployment",
        duration: "2-3 weeks",
        deliverables: ["Quality assurance", "Performance optimization", "Production deployment", "Documentation"],
        completion: 0
      }
    ];
  };

  const generateMilestones = (features) => {
    return [
      { milestone: "MVP Launch", target: "Week 8", status: "pending", description: "Basic functionality ready for beta users" },
      { milestone: "Beta Testing", target: "Week 12", status: "pending", description: "User feedback collection and iteration" },
      { milestone: "Feature Complete", target: "Week 16", status: "pending", description: "All planned features implemented" },
      { milestone: "Production Launch", target: "Week 20", status: "pending", description: "Full public release" }
    ];
  };

  const generateRiskAssessment = (features) => {
    return [
      { risk: "Technical Complexity", probability: "Medium", impact: "High", mitigation: "Experienced team and thorough planning" },
      { risk: "Scope Creep", probability: "High", impact: "Medium", mitigation: "Clear requirements and change management process" },
      { risk: "Third-party Dependencies", probability: "Low", impact: "Medium", mitigation: "Fallback options and vendor evaluation" },
      { risk: "Security Vulnerabilities", probability: "Medium", impact: "High", mitigation: "Regular security audits and best practices" }
    ];
  };

  const generateSuccessCriteria = (features) => {
    return [
      { criteria: "Performance", target: "< 2s page load time", measurement: "Automated performance testing" },
      { criteria: "Reliability", target: "99.9% uptime", measurement: "Monitoring and alerting systems" },
      { criteria: "User Satisfaction", target: "> 4.5 star rating", measurement: "User feedback and surveys" },
      { criteria: "Security", target: "Zero critical vulnerabilities", measurement: "Regular security audits" }
    ];
  };

  const generateInfrastructure = (features) => {
    return {
      hosting: "Cloud-based infrastructure (AWS/GCP/Azure)",
      database: "PostgreSQL with Redis caching",
      cdn: "CloudFlare for global content delivery",
      monitoring: "Comprehensive logging and alerting system",
      backup: "Automated daily backups with point-in-time recovery"
    };
  };

  const generateScalingPlan = (features) => {
    return [
      { stage: "Initial Launch", users: "0-1K", infrastructure: "Single server deployment" },
      { stage: "Growth Phase", users: "1K-10K", infrastructure: "Load balancer + multiple servers" },
      { stage: "Scale Phase", users: "10K-100K", infrastructure: "Microservices + auto-scaling" },
      { stage: "Enterprise", users: "100K+", infrastructure: "Multi-region deployment" }
    ];
  };

  const generateMonitoring = (features) => {
    return [
      "Application performance monitoring (APM)",
      "Real-time error tracking and alerting",
      "User behavior analytics",
      "Infrastructure health monitoring",
      "Security event monitoring"
    ];
  };

  const generateSecurity = (features) => {
    return [
      "HTTPS/TLS encryption for all communications",
      "JWT-based authentication with refresh tokens",
      "Input validation and sanitization",
      "Regular security audits and penetration testing",
      "GDPR and privacy compliance measures"
    ];
  };

  const generateSystemPrompt = (data) => {
    return `You are an AI assistant for ${extractProjectTitle(data.projectVision)}. 

Your role is to help users with:
${data.featureModules ? data.featureModules.map(f => `- ${f}: Provide assistance and guidance`).join('\n') : '- General platform assistance'}

Core Principles:
- Be helpful, accurate, and user-focused
- Understand the context of ${data.projectVision || 'the platform'}
- Provide specific, actionable guidance
- Maintain a professional yet friendly tone

Always prioritize user success and provide clear, step-by-step instructions when needed.`;
  };

  const generateUserPrompts = (features) => {
    const prompts = [];
    if (features && features.length > 0) {
      features.slice(0, 3).forEach(feature => {
        prompts.push({
          scenario: `Using ${feature}`,
          userInput: `How do I ${feature.toLowerCase()}?`,
          expectedResponse: `I'll help you ${feature.toLowerCase()}. Here's how to get started: [Step-by-step guidance]`
        });
      });
    }
    return prompts;
  };

  const generateErrorHandling = (features) => {
    return [
      { error: "Authentication Failed", response: "Please check your credentials and try again. If you've forgotten your password, use the reset option." },
      { error: "Network Connection", response: "It seems there's a connection issue. Please check your internet and try again." },
      { error: "Server Error", response: "We're experiencing technical difficulties. Our team has been notified and we're working on a fix." },
      { error: "Permission Denied", response: "You don't have permission to perform this action. Please contact your administrator if you believe this is an error." }
    ];
  };

  const generateTestingScenarios = (features) => {
    return [
      { scenario: "Happy Path", description: "User successfully completes primary workflow", expectedOutcome: "Full functionality works as designed" },
      { scenario: "Error Handling", description: "System gracefully handles invalid inputs", expectedOutcome: "Clear error messages guide user to resolution" },
      { scenario: "Edge Cases", description: "Boundary conditions and unusual usage patterns", expectedOutcome: "System remains stable and provides appropriate responses" },
      { scenario: "Performance", description: "System performance under normal and peak loads", expectedOutcome: "Response times meet performance criteria" }
    ];
  };

  const generateRecommendations = (features) => {
    return [
      { category: "Architecture", recommendation: "Implement microservices for better scalability", priority: "High" },
      { category: "Security", recommendation: "Add multi-factor authentication for enhanced security", priority: "High" },
      { category: "Performance", recommendation: "Implement caching strategy for frequently accessed data", priority: "Medium" },
      { category: "Monitoring", recommendation: "Set up comprehensive logging and alerting", priority: "Medium" },
      { category: "Testing", recommendation: "Implement automated testing pipeline", priority: "High" }
    ];
  };

  if (isGeneratingReport) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
          >
            <BrainCircuit className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Context Engineering Report</h2>
          <p className="text-gray-600">AI is analyzing your project and creating comprehensive technical documentation...</p>
        </motion.div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Project Data Available</h3>
          <p className="text-gray-600">Complete the Clarification Engine first to generate your context engineering report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">{reportData.projectOverview.title}</h1>
              <p className="text-lg text-gray-600">Context Engineering Report</p>
            </div>
          </div>
        </motion.div>

        {/* Project Overview */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{reportData.readinessScore}/10</div>
                <div className="text-sm text-gray-600">Readiness Score</div>
                <Progress value={reportData.readinessScore * 10} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{reportData.projectOverview.complexity}</div>
                <div className="text-sm text-gray-600">Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-2">{reportData.projectOverview.estimatedTimeline}</div>
                <div className="text-sm text-gray-600">Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">{reportData.projectOverview.teamSize}</div>
                <div className="text-sm text-gray-600">Team Size</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Project Vision</h4>
              <p className="text-gray-700 italic">"{reportData.projectOverview.vision}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              Technical Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="components">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="components">Core Components</TabsTrigger>
                <TabsTrigger value="data">Data Models</TabsTrigger>
                <TabsTrigger value="api">API Endpoints</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="mt-4">
                <div className="space-y-3">
                  {reportData.technicalArchitecture.coreComponents.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{component.name}</h4>
                        <p className="text-sm text-gray-600">{component.description}</p>
                      </div>
                      <Badge className={component.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {component.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-4">
                <div className="space-y-3">
                  {reportData.technicalArchitecture.dataModels.map((model, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{model.entity}</h4>
                      <div className="text-sm text-gray-600">
                        <strong>Fields:</strong> {model.fields.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Relationships:</strong> {model.relationships.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-4">
                <div className="space-y-2">
                  {reportData.technicalArchitecture.apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm bg-gray-200 px-2 py-1 rounded">{endpoint.path}</code>
                      </div>
                      <span className="text-sm text-gray-600">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="mt-4">
                <div className="space-y-3">
                  {reportData.technicalArchitecture.integrationPoints.map((integration, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{integration.service}</h4>
                        <Badge variant="outline">{integration.provider}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{integration.purpose}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Development Plan */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-600" />
              Development Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reportData.developmentPlan.phases.map((phase, index) => (
                <div key={index} className="border-l-4 border-emerald-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{phase.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {phase.deliverables.map((deliverable, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        {deliverable}
                      </div>
                    ))}
                  </div>
                  <Progress value={phase.completion} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Context Prompts */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-violet-600" />
              AI Context Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <h4 className="font-semibold text-violet-900 mb-2">System Prompt</h4>
                <pre className="text-sm text-violet-800 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
{reportData.contextPrompts.systemPrompt}
                </pre>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Example User Prompts</h4>
                  <div className="space-y-2">
                    {reportData.contextPrompts.userPrompts.map((prompt, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-blue-800">Input: "{prompt.userInput}"</div>
                        <div className="text-blue-600 mt-1">Response: {prompt.expectedResponse}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-3">Error Handling</h4>
                  <div className="space-y-2">
                    {reportData.contextPrompts.errorHandling.slice(0, 3).map((error, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-amber-800">{error.error}:</div>
                        <div className="text-amber-600">{error.response}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Strategy */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-600" />
              Deployment Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Infrastructure</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><strong>Hosting:</strong> {reportData.deploymentStrategy.infrastructure.hosting}</div>
                  <div><strong>Database:</strong> {reportData.deploymentStrategy.infrastructure.database}</div>
                  <div><strong>CDN:</strong> {reportData.deploymentStrategy.infrastructure.cdn}</div>
                  <div><strong>Monitoring:</strong> {reportData.deploymentStrategy.infrastructure.monitoring}</div>
                  <div><strong>Backup:</strong> {reportData.deploymentStrategy.infrastructure.backup}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Scaling Plan</h4>
                <div className="space-y-2">
                  {reportData.deploymentStrategy.scalingPlan.map((stage, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{stage.stage} ({stage.users} users)</div>
                      <div className="text-gray-600">{stage.infrastructure}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations & Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Ready for Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Next Steps</h4>
                <div className="space-y-2">
                  {reportData.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>{rec.recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">{reportData.readinessScore}/10</div>
                <div className="text-purple-100 mb-4">Context Engineering Score</div>
                <div className="flex gap-2 justify-end">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 border border-purple-400">
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Development
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}