import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/api/integrations";
import { 
  Code, 
  Server, 
  Database, 
  Globe, 
  Smartphone, 
  Cloud,
  Zap,
  CheckCircle,
  Settings,
  Plus,
  X
} from "lucide-react";
import { motion } from "framer-motion";

const TechStackCard = ({ title, icon: Icon, options, selected, onSelect, description }) => (
  <Card className={`cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="w-4 h-4" />
        {title}
        {selected && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
      </CardTitle>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </CardHeader>
    <CardContent>
      <Select value={selected || ""} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder={`Choose ${title.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span>{option.label}</span>
                {option.recommended && (
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
);

const IntegrationSelector = ({ integrations, onAdd, onRemove }) => {
  const [newIntegration, setNewIntegration] = useState({ name: '', purpose: '' });

  const commonIntegrations = [
    { name: 'Stripe', purpose: 'Payment processing', category: 'payments' },
    { name: 'Twilio', purpose: 'SMS/Voice communication', category: 'communication' },
    { name: 'OpenAI', purpose: 'AI/ML capabilities', category: 'ai' },
    { name: 'Auth0', purpose: 'Authentication service', category: 'auth' },
    { name: 'Sendgrid', purpose: 'Email delivery', category: 'communication' },
    { name: 'Google Maps', purpose: 'Location services', category: 'location' },
    { name: 'Firebase', purpose: 'Real-time database', category: 'database' },
    { name: 'AWS S3', purpose: 'File storage', category: 'storage' }
  ];

  const handleAddIntegration = (integration) => {
    onAdd(integration);
  };

  const handleAddCustom = () => {
    if (newIntegration.name && newIntegration.purpose) {
      onAdd({ ...newIntegration, custom: true });
      setNewIntegration({ name: '', purpose: '' });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Required Integrations</h4>
      
      {/* Selected Integrations */}
      {integrations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {integrations.map((integration, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {integration.name} - {integration.purpose}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-4 w-4 p-0 hover:bg-red-100"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Common Integrations */}
      <div className="grid grid-cols-2 gap-3">
        {commonIntegrations.map(integration => (
          <Button
            key={integration.name}
            variant="outline"
            size="sm"
            onClick={() => handleAddIntegration(integration)}
            className="justify-start gap-2"
            disabled={integrations.some(i => i.name === integration.name)}
          >
            <Plus className="w-3 h-3" />
            {integration.name}
          </Button>
        ))}
      </div>

      {/* Custom Integration */}
      <div className="border-t pt-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Add Custom Integration</h5>
        <div className="flex gap-2">
          <Input
            placeholder="Integration name"
            value={newIntegration.name}
            onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
            className="flex-1"
          />
          <Input
            placeholder="Purpose"
            value={newIntegration.purpose}
            onChange={(e) => setNewIntegration({...newIntegration, purpose: e.target.value})}
            className="flex-1"
          />
          <Button onClick={handleAddCustom} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function TechStackSelector({ feature, onUpdateFeature, businessStrategy }) {
  const [techStack, setTechStack] = useState(
    feature.techStack || {
      frontend: '',
      backend: '',
      database: '',
      hosting: '',
      deployment: '',
      integrations: []
    }
  );

  const [recommendations, setRecommendations] = useState(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  const frontendOptions = [
    { value: 'react', label: 'React', recommended: true },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'next', label: 'Next.js', recommended: true },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'vanilla', label: 'Vanilla JavaScript' }
  ];

  const backendOptions = [
    { value: 'node', label: 'Node.js', recommended: true },
    { value: 'python', label: 'Python (FastAPI/Django)' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java (Spring)' },
    { value: 'php', label: 'PHP (Laravel)' },
    { value: 'ruby', label: 'Ruby on Rails' },
    { value: 'csharp', label: 'C# (.NET)' }
  ];

  const databaseOptions = [
    { value: 'postgresql', label: 'PostgreSQL', recommended: true },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'redis', label: 'Redis' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'firebase', label: 'Firebase Firestore' },
    { value: 'supabase', label: 'Supabase', recommended: true }
  ];

  const hostingOptions = [
    { value: 'vercel', label: 'Vercel', recommended: true },
    { value: 'netlify', label: 'Netlify' },
    { value: 'aws', label: 'AWS' },
    { value: 'gcp', label: 'Google Cloud' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'digitalocean', label: 'DigitalOcean' },
    { value: 'heroku', label: 'Heroku' }
  ];

  const deploymentOptions = [
    { value: 'web', label: 'Web Application', recommended: true },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop Application' },
    { value: 'api', label: 'API Only' },
    { value: 'hybrid', label: 'Hybrid (Web + Mobile)' }
  ];

  useEffect(() => {
    if (!recommendations && feature.clarificationData?.clarified) {
      generateRecommendations();
    }
  }, [feature, recommendations]);

  const generateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    
    try {
      const response = await InvokeLLM({
        prompt: `
          Based on this feature and business context, recommend the optimal tech stack:
          
          Feature: ${feature.name}
          Description: ${feature.description}
          User Interaction: ${feature.clarificationData?.userInteraction || 'Not specified'}
          Expected Inputs: ${feature.clarificationData?.inputs || 'Not specified'}
          Expected Outputs: ${feature.clarificationData?.outputs || 'Not specified'}
          
          Business Context: ${businessStrategy?.marketAnalysis || 'Startup/MVP focus'}
          
          Recommend:
          1. Best frontend framework and why
          2. Suitable backend technology
          3. Database choice
          4. Hosting platform
          5. Deployment approach
          6. Required integrations/APIs
          
          Consider: scalability, development speed, cost, team expertise, maintenance.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            frontend: { 
              type: "object",
              properties: {
                choice: { type: "string" },
                reason: { type: "string" }
              }
            },
            backend: {
              type: "object", 
              properties: {
                choice: { type: "string" },
                reason: { type: "string" }
              }
            },
            database: {
              type: "object",
              properties: {
                choice: { type: "string" },
                reason: { type: "string" }
              }
            },
            hosting: {
              type: "object",
              properties: {
                choice: { type: "string" },
                reason: { type: "string" }
              }
            },
            integrations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  purpose: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            }
          }
        }
      });
      
      setRecommendations(response);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }
    
    setIsGeneratingRecommendations(false);
  };

  const handleStackChange = (category, value) => {
    const newStack = { ...techStack, [category]: value };
    setTechStack(newStack);
    onUpdateFeature(feature.id, { techStack: newStack });
  };

  const handleAddIntegration = (integration) => {
    const newIntegrations = [...techStack.integrations, integration];
    const newStack = { ...techStack, integrations: newIntegrations };
    setTechStack(newStack);
    onUpdateFeature(feature.id, { techStack: newStack });
  };

  const handleRemoveIntegration = (index) => {
    const newIntegrations = techStack.integrations.filter((_, i) => i !== index);
    const newStack = { ...techStack, integrations: newIntegrations };
    setTechStack(newStack);
    onUpdateFeature(feature.id, { techStack: newStack });
  };

  const applyRecommendation = (category, choice) => {
    handleStackChange(category, choice);
  };

  const isStackComplete = techStack.frontend && techStack.backend && techStack.database && techStack.hosting;

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
            <h2 className="text-xl font-bold text-gray-900">Tech Stack Selection</h2>
            <p className="text-gray-600">{feature.name}</p>
          </div>
          {isStackComplete && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Stack Complete
            </Badge>
          )}
        </div>

        {/* AI Recommendations */}
        {isGeneratingRecommendations ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Generating AI recommendations...</p>
            </CardContent>
          </Card>
        ) : recommendations && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(recommendations).filter(([key]) => key !== 'integrations').map(([category, rec]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium capitalize">{category}: {rec.choice}</div>
                    <div className="text-sm text-gray-600">{rec.reason}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyRecommendation(category, rec.choice)}
                    disabled={techStack[category] === rec.choice}
                  >
                    {techStack[category] === rec.choice ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tech Stack Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <TechStackCard
            title="Frontend"
            icon={Globe}
            options={frontendOptions}
            selected={techStack.frontend}
            onSelect={(value) => handleStackChange('frontend', value)}
            description="User interface framework"
          />

          <TechStackCard
            title="Backend"
            icon={Server}
            options={backendOptions}
            selected={techStack.backend}
            onSelect={(value) => handleStackChange('backend', value)}
            description="Server-side technology"
          />

          <TechStackCard
            title="Database"
            icon={Database}
            options={databaseOptions}
            selected={techStack.database}
            onSelect={(value) => handleStackChange('database', value)}
            description="Data storage solution"
          />

          <TechStackCard
            title="Hosting"
            icon={Cloud}
            options={hostingOptions}
            selected={techStack.hosting}
            onSelect={(value) => handleStackChange('hosting', value)}
            description="Deployment platform"
          />
        </div>

        {/* Deployment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Deployment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={techStack.deployment || ""} onValueChange={(value) => handleStackChange('deployment', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose deployment method" />
              </SelectTrigger>
              <SelectContent>
                {deploymentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      {option.recommended && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              APIs & Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IntegrationSelector
              integrations={techStack.integrations}
              onAdd={handleAddIntegration}
              onRemove={handleRemoveIntegration}
            />
          </CardContent>
        </Card>

        {/* Stack Summary */}
        {isStackComplete && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Selected Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Frontend:</strong> {techStack.frontend}</div>
                <div><strong>Backend:</strong> {techStack.backend}</div>
                <div><strong>Database:</strong> {techStack.database}</div>
                <div><strong>Hosting:</strong> {techStack.hosting}</div>
                <div><strong>Deployment:</strong> {techStack.deployment || 'Web'}</div>
                <div><strong>Integrations:</strong> {techStack.integrations.length} selected</div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}