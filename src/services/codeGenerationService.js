// =============================================================================
// Code Generation Service
// =============================================================================
// This module contains all the code generation logic extracted from CTOStudio.jsx
// Provides a clean separation between UI components and business logic

import { InvokeLLM } from '@/api/integrations';

/**
 * Complete Product Requirement Prompt Generator
 * Generates comprehensive PRP based on clarification data
 */
export function generateCompletePRP(data) {
  return `# Product Requirement Prompt (PRP)

## Project Vision
${data.businessConcept || 'AI-powered business solution'}

## Core Features & Requirements
${(data.features || []).map(f => `
### ${f.name}
**Description:** ${f.description}
**Priority:** ${f.priority}
**User Story:** ${f.userStory}
**Acceptance Criteria:**
${f.acceptanceCriteria?.map(c => `- ${c}`).join('\n') || '- To be defined'}
**Technical Complexity:** ${f.complexity}
`).join('\n')}

## User Flows
${(data.userFlows || []).map(flow => `
### ${flow.flowName}
**Steps:**
${flow.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'Steps to be defined'}

**Pain Points to Address:**
${flow.painPoints?.map(p => `- ${p}`).join('\n') || '- To be identified'}
`).join('\n')}

## Technical Requirements
${(data.requirements || []).map(req => `
### ${req.category}
**Requirement:** ${req.requirement}
**Justification:** ${req.justification}
`).join('\n')}

## Success Metrics
- User engagement: Track feature adoption rates
- Performance: Sub-2s load times
- Reliability: 99.9% uptime
- User satisfaction: 4.5+ rating

## Integration Points
- Authentication system
- Payment processing (if applicable)
- Third-party APIs as needed
- Analytics and monitoring

## Deployment Requirements
- Scalable architecture
- Security best practices
- Mobile-responsive design
- SEO optimization
`;
}

/**
 * Module Suggestions Generator
 * Analyzes features and suggests relevant modules
 */
export function generateModuleSuggestions(data) {
  const modules = [];
  const featuresText = JSON.stringify(data.features || []).toLowerCase();
  const conceptText = (data.businessConcept || '').toLowerCase();

  if (featuresText.includes('payment') || conceptText.includes('payment')) {
    modules.push({
      id: 'stripe-payments',
      name: 'Stripe Payment Gateway',
      description: 'Accept credit cards and handle payments',
      icon: 'CreditCard'
    });
  }

  if (featuresText.includes('user') || featuresText.includes('auth')) {
    modules.push({
      id: 'auth-system',
      name: 'User Authentication',
      description: 'Secure user login and registration',
      icon: 'Lock'
    });
  }

  if (featuresText.includes('email') || featuresText.includes('notification')) {
    modules.push({
      id: 'email-system',
      name: 'Email Notifications',
      description: 'Automated email system',
      icon: 'Mail'
    });
  }

  if (featuresText.includes('analytics') || featuresText.includes('dashboard')) {
    modules.push({
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Track user behavior and metrics',
      icon: 'BarChart3'
    });
  }

  return modules;
}

/**
 * Tech Stack Suggestions Generator
 * Recommends technology stack based on requirements
 */
export function generateTechStackSuggestions(data) {
  const requirements = data.requirements || [];
  const features = data.features || [];

  const hasRealTimeFeatures = requirements.some(r =>
    r.requirement.toLowerCase().includes('real-time') ||
    r.requirement.toLowerCase().includes('live')
  );

  const hasComplexBackend = features.some(f =>
    f.complexity === 'complex' ||
    f.description.toLowerCase().includes('algorithm')
  );

  return {
    frontend: hasRealTimeFeatures ? 'React' : 'React',
    backend: hasComplexBackend ? 'Python (Django)' : 'Node.js (Express)',
    database: hasComplexBackend ? 'PostgreSQL' : 'MongoDB',
    hosting: 'Vercel'
  };
}

/**
 * API Documentation Generator
 * Creates API documentation based on features
 */
export function generateAPIDocumentation(data) {
  return `# API Documentation

## Authentication
\`\`\`bash
curl -X POST https://api.yourapp.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password"}'
\`\`\`

## Core Endpoints
${(data.features || []).map(f => `
### ${f.name} API
\`\`\`bash
curl -X GET https://api.yourapp.com/${f.name.toLowerCase().replace(/\s+/g, '-')} \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`
`).join('\n')}
`;
}

/**
 * Prompt Examples Generator
 * Creates training examples for AI context
 */
export function generatePromptExamples(data) {
  return (data.features || []).slice(0, 3).map(f => ({
    input: `How do I use the ${f.name} feature?`,
    output: `${f.description}. ${f.userStory}`
  }));
}

/**
 * Use Case Scenarios Generator
 * Creates comprehensive testing scenarios
 */
export function generateUseCaseScenarios(data) {
  return {
    normal: `User successfully uses the main features: ${(data.features || []).map(f => f.name).join(', ')}`,
    edge: `User encounters slow internet or partial feature failures`,
    fail: `System handles gracefully when core services are unavailable`
  };
}

/**
 * Context Memory Generator
 * Creates AI assistant context based on project data
 */
export function generateContextMemory(workspaceData) {
  const clarificationData = workspaceData.clarificationData;
  if (!clarificationData) return "";

  return `You are an AI assistant for ${clarificationData.businessConcept || 'this project'}.

Your role is to help users with:
${(clarificationData.features || []).map(f => `- ${f.name}: ${f.description}`).join('\n')}

Always be helpful, accurate, and focused on the user's goals.`;
}

/**
 * Success Metrics Generator
 * Creates measurable success criteria
 */
export function generateSuccessMetrics(data) {
  return (data.features || []).slice(0, 3).map(f => ({
    test: `Does the ${f.name} feature work as expected?`,
    expected: `Yes, ${f.userStory.toLowerCase()}`
  }));
}

/**
 * UI Reference Generator
 * Creates UI development guidelines
 */
export function generateUIReference(data) {
  return `UI should support: ${(data.features || []).map(f => f.name).join(', ')}`;
}

/**
 * Readiness Score Calculator
 * Calculates project development readiness
 */
export function calculateReadinessScore(data) {
  let score = 0;
  if (data.businessConcept) score += 2;
  if (data.features && data.features.length > 0) score += 3;
  if (data.userFlows && data.userFlows.length > 0) score += 2;
  if (data.requirements && data.requirements.length > 0) score += 3;
  return Math.min(score, 10);
}

/**
 * Founder-Cofounder Agreement Generator
 * Creates comprehensive agreement protocol using AI
 */
export async function generateFounderCofounderAgreement(data) {
  try {
    const response = await InvokeLLM({
      prompt: `
        Generate a comprehensive Founder-Cofounder Agreement protocol for this project based on the following project details:
        
        Business Concept: ${data.businessConcept || 'Not provided'}
        Features: ${JSON.stringify(data.features || [])}
        User Flows: ${JSON.stringify(data.userFlows || [])}
        Requirements: ${JSON.stringify(data.requirements || [])}
        
        Create a smart handshake protocol that ensures maximum clarity and minimizes assumptions. Divide the agreement into three categories:
        
        CRITICAL ITEMS (Must be explicitly agreed upon and completed before code generation for production):
        For each critical item, describe what needs to be defined/finalized and what evidence is required to mark it as complete.
        
        OPTIONAL ITEMS (Can be evolved later with explicit founder choice):
        For each optional item, describe it and indicate if it's something that can reasonably be deferred until after the initial launch (MVP).
        
        RISKY CHOICES (Specific identified risks or incomplete aspects that require explicit founder acknowledgment to proceed with code generation):
        For each risky choice, identify the incomplete aspect, describe the potential risk if proceeding without addressing it, assign a risk level (low, medium, high, critical), provide specific consent language the founder must agree to, and suggest a mitigation strategy if they choose to proceed.
        
        Ensure all items have a unique 'id', a 'category', and clear descriptions.
        The response should also include an 'overallReadiness' score (0-100) reflecting how complete the project definition is according to this agreement, and a 'recommendedAction' based on the current state.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          criticalItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                category: { type: "string" },
                item: { type: "string" },
                description: { type: "string" },
                evidenceRequired: { type: "string" },
                isComplete: { type: "boolean" },
                completionEvidence: { type: "string" }
              },
              required: ["id", "category", "item", "description", "evidenceRequired"]
            }
          },
          optionalItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                category: { type: "string" },
                item: { type: "string" },
                description: { type: "string" },
                canEvolvePostLaunch: { type: "boolean" },
                founderChoiceRequired: { type: "boolean" },
                isIncluded: { type: "boolean" }
              },
              required: ["id", "category", "item", "description", "canEvolvePostLaunch", "founderChoiceRequired"]
            }
          },
          riskyChoices: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                category: { type: "string" },
                choice: { type: "string" },
                riskDescription: { type: "string" },
                riskLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
                consentLanguage: { type: "string" },
                mitigationStrategy: { type: "string" },
                founderConsent: { type: "boolean" }
              },
              required: ["id", "category", "choice", "riskDescription", "riskLevel", "consentLanguage", "mitigationStrategy"]
            }
          },
          overallReadiness: { type: "number", minimum: 0, maximum: 100 },
          recommendedAction: { type: "string" }
        },
        required: ["criticalItems", "optionalItems", "riskyChoices", "overallReadiness", "recommendedAction"]
      }
    });

    // Initialize items with default user interaction states
    const initialCriticalItems = (response.criticalItems || []).map(item => ({
      ...item,
      isComplete: item.isComplete !== undefined ? item.isComplete : false
    }));
    const initialOptionalItems = (response.optionalItems || []).map(item => ({
      ...item,
      isIncluded: item.isIncluded !== undefined ? item.isIncluded : false
    }));
    const initialRiskyChoices = (response.riskyChoices || []).map(item => ({
      ...item,
      founderConsent: item.founderConsent !== undefined ? item.founderConsent : false
    }));

    return {
      criticalItems: initialCriticalItems,
      optionalItems: initialOptionalItems,
      riskyChoices: initialRiskyChoices,
      overallReadiness: response.overallReadiness || 0,
      recommendedAction: response.recommendedAction || "Complete critical items and acknowledge risks to proceed."
    };
  } catch (error) {
    console.error("Error generating Founder-Cofounder Agreement:", error);
    return {
      criticalItems: [],
      optionalItems: [],
      riskyChoices: [],
      founderChoices: [],  
      riskAcknowledgments: [],
      isComplete: false,
      agreementTimestamp: null,
      overallReadiness: 0,
      recommendedAction: "Failed to generate agreement. Please try again."
    };
  }
}

/**
 * Auto-populate Project Context
 * Main orchestration function that uses all generators
 */
export function autoPopulateProjectContext(data) {
  console.log("Auto-populating project context with clarification data:", data.clarificationData);

  const clarificationData = data.clarificationData;
  if (!clarificationData) {
    return null;
  }

  // Generate all context components
  const autoGeneratedPRP = generateCompletePRP(clarificationData);
  const autoSuggestedModules = generateModuleSuggestions(clarificationData);
  const autoTechStack = generateTechStackSuggestions(clarificationData);

  // Create comprehensive context data
  const contextData = {
    prp: autoGeneratedPRP,
    readinessScore: calculateReadinessScore(clarificationData),
    projectVision: data.dreamStatement,
    featureModules: clarificationData.features?.map(f => f.name) || [],
    apiLibrary: generateAPIDocumentation(clarificationData),
    promptExamples: generatePromptExamples(clarificationData),
    useCaseScenarios: generateUseCaseScenarios(clarificationData),
    contextMemory: generateContextMemory(data),
    successMetrics: generateSuccessMetrics(clarificationData),
    referenceUI: generateUIReference(clarificationData)
  };

  return {
    contextData,
    suggestedModules: autoSuggestedModules,
    suggestedTechStack: autoTechStack
  };
}

/**
 * Code Generation Orchestrator
 * Main entry point for all code generation operations
 */
export class CodeGenerationService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate complete project context
   */
  async generateProjectContext(projectData) {
    const cacheKey = `project_${JSON.stringify(projectData).slice(0, 100)}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('🔄 [Code Gen Service] Returning cached project context');
      return this.cache.get(cacheKey);
    }

    const context = autoPopulateProjectContext(projectData);
    this.cache.set(cacheKey, context);
    
    console.log('✅ [Code Gen Service] Generated project context');
    return context;
  }

  /**
   * Generate founder-cofounder agreement
   */
  async generateAgreement(clarificationData) {
    console.log('🤝 [Code Gen Service] Generating founder-cofounder agreement');
    return await generateFounderCofounderAgreement(clarificationData);
  }

  /**
   * Calculate project readiness
   */
  calculateReadiness(data) {
    return calculateReadinessScore(data);
  }

  /**
   * Generate specific components
   */
  generateComponent(type, data) {
    const generators = {
      prp: generateCompletePRP,
      modules: generateModuleSuggestions,
      techstack: generateTechStackSuggestions,
      api: generateAPIDocumentation,
      prompts: generatePromptExamples,
      scenarios: generateUseCaseScenarios,
      context: generateContextMemory,
      metrics: generateSuccessMetrics,
      ui: generateUIReference
    };

    const generator = generators[type];
    if (!generator) {
      throw new Error(`Unknown component type: ${type}`);
    }

    console.log(`🔧 [Code Gen Service] Generating ${type} component`);
    return generator(data);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 [Code Gen Service] Cache cleared');
  }
}

// Export singleton instance
export const codeGenerationService = new CodeGenerationService();

// Export individual functions for direct use
export default {
  generateCompletePRP,
  generateModuleSuggestions,
  generateTechStackSuggestions,
  generateAPIDocumentation,
  generatePromptExamples,
  generateUseCaseScenarios,
  generateContextMemory,
  generateSuccessMetrics,
  generateUIReference,
  calculateReadinessScore,
  generateFounderCofounderAgreement,
  autoPopulateProjectContext,
  codeGenerationService
};