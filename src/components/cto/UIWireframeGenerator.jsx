
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Loader2, Zap, AlertTriangle, Monitor, Smartphone, Layout, Settings, Users, BarChart3, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenerateImage } from '@/api/integrations';

const screenTypes = {
  dashboard: {
    name: 'Admin Dashboard',
    icon: BarChart3,
    description: 'Analytics, metrics, and management overview'
  },
  userInterface: {
    name: 'User Interface',
    icon: Users,
    description: 'Main user-facing screens and workflows'
  },
  controlPanel: {
    name: 'Control Panel',
    icon: Settings,
    description: 'Configuration and admin controls'
  },
  mobileApp: {
    name: 'Mobile Views',
    icon: Smartphone,
    description: 'Mobile-responsive layouts'
  }
};

export default function UIWireframeGenerator({ techStack, projectContext }) {
  const [generatedScreens, setGeneratedScreens] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerating, setCurrentGenerating] = useState(null);
  const [error, setError] = useState(null);
  const [screenPrompts, setScreenPrompts] = useState({});

  useEffect(() => {
    if (projectContext) {
      const prompts = generateIntelligentPrompts(projectContext);
      setScreenPrompts(prompts);
    }
  }, [projectContext]);

  const generateIntelligentPrompts = (context) => {
    const features = context.features || [];
    const userFlows = context.userFlows || [];
    const businessConcept = context.businessConcept || '';

    // Analyze project type and generate contextual prompts
    const projectType = analyzeProjectType(businessConcept, features);
    
    return {
      dashboard: generateDashboardPrompt(features, businessConcept, projectType),
      userInterface: generateUserInterfacePrompt(features, userFlows, businessConcept, projectType),
      controlPanel: generateControlPanelPrompt(features, businessConcept, projectType),
      mobileApp: generateMobilePrompt(features, userFlows, businessConcept, projectType)
    };
  };

  const analyzeProjectType = (concept, features) => {
    const conceptLower = concept.toLowerCase();
    const featureText = JSON.stringify(features).toLowerCase();
    
    if (conceptLower.includes('marketplace') || conceptLower.includes('e-commerce')) {
      return 'marketplace';
    } else if (conceptLower.includes('saas') || conceptLower.includes('software') || featureText.includes('subscription')) {
      return 'saas';
    } else if (conceptLower.includes('social') || featureText.includes('chat') || featureText.includes('community')) {
      return 'social';
    } else if (conceptLower.includes('analytics') || featureText.includes('dashboard') || featureText.includes('report')) {
      return 'analytics';
    } else if (conceptLower.includes('booking') || conceptLower.includes('appointment') || featureText.includes('calendar')) {
      return 'booking';
    }
    return 'general';
  };

  const generateDashboardPrompt = (features, concept, projectType) => {
    let basePrompt = `Design a comprehensive admin dashboard for "${concept}". The dashboard should be modern, clean, and data-rich.

SPECIFIC REQUIREMENTS:
- Header with logo, user profile, and notifications
- Sidebar navigation with icons for main sections
- Main content area with key metrics cards
- Real-time charts and graphs showing business performance
- Recent activity feed or notifications panel
- Quick action buttons for common tasks

FEATURES TO INCLUDE BASED ON PROJECT:`;

    features.forEach(feature => {
      basePrompt += `\n- ${feature.name}: Add relevant metrics and controls for "${feature.description}"`;
    });

    // Add project-type specific elements
    switch (projectType) {
      case 'marketplace':
        basePrompt += `\n\nMARKETPLACE SPECIFIC:
- Total sales, active listings, and user activity metrics
- Seller performance charts
- Payment processing status
- Inventory management section`;
        break;
      case 'saas':
        basePrompt += `\n\nSAAS SPECIFIC:
- Monthly recurring revenue (MRR) chart
- User subscription status and churn metrics
- Feature usage analytics
- Support ticket status`;
        break;
      case 'social':
        basePrompt += `\n\nSOCIAL PLATFORM SPECIFIC:
- User engagement metrics (posts, likes, comments)
- Content moderation queue
- Community growth charts
- User reports and safety metrics`;
        break;
      case 'analytics':
        basePrompt += `\n\nANALYTICS PLATFORM SPECIFIC:
- Multiple dashboard views and data visualizations
- Custom report builder interface
- Data source connection status
- Real-time data processing metrics`;
        break;
    }

    basePrompt += `\n\nSTYLE: Professional, modern dashboard with proper spacing, consistent color scheme, and intuitive information hierarchy. Show actual data visualizations, not placeholders.`;

    return basePrompt;
  };

  const generateUserInterfacePrompt = (features, userFlows, concept, projectType) => {
    let basePrompt = `Design the main user-facing interface for "${concept}". Show the primary user journey and key functionality.

MAIN USER SCREENS TO SHOW:`;

    if (userFlows.length > 0) {
      const mainFlow = userFlows[0];
      basePrompt += `\n\nPRIMARY USER FLOW: ${mainFlow.flowName}`;
      mainFlow.steps.forEach((step, i) => {
        basePrompt += `\n${i + 1}. ${step}`;
      });
    }

    basePrompt += `\n\nFEATURE SCREENS:`;
    features.slice(0, 4).forEach(feature => {
      basePrompt += `\n- ${feature.name}: ${feature.userStory}`;
    });

    // Add project-type specific UI elements
    switch (projectType) {
      case 'marketplace':
        basePrompt += `\n\nMARKETPLACE UI ELEMENTS:
- Product grid/list view with filters
- Individual product detail pages
- Shopping cart and checkout process
- User profile and order history`;
        break;
      case 'saas':
        basePrompt += `\n\nSAAS UI ELEMENTS:
- Clean application interface with navigation
- Feature-rich main workspace
- Settings and account management
- Onboarding flow elements`;
        break;
      case 'social':
        basePrompt += `\n\nSOCIAL PLATFORM UI:
- News feed or timeline interface
- User profiles and connections
- Content creation tools
- Messaging or communication interface`;
        break;
      case 'booking':
        basePrompt += `\n\nBOOKING INTERFACE:
- Calendar view with available slots
- Booking form and confirmation
- User appointment management
- Service provider profiles`;
        break;
    }

    basePrompt += `\n\nSTYLE: Modern, user-friendly interface with clear navigation, consistent branding, and intuitive user experience. Show realistic content and interactions.`;

    return basePrompt;
  };

  const generateControlPanelPrompt = (features, concept, projectType) => {
    let basePrompt = `Design a comprehensive control panel/admin interface for "${concept}". This should show configuration, management, and operational controls.

CONTROL SECTIONS TO INCLUDE:
- System configuration and settings
- User management and permissions
- Content/data management tools
- Integration and API management
- Security and compliance controls

FEATURE-SPECIFIC CONTROLS:`;

    features.forEach(feature => {
      basePrompt += `\n- ${feature.name}: Administrative controls for managing "${feature.description}"`;
    });

    switch (projectType) {
      case 'marketplace':
        basePrompt += `\n\nMARKETPLACE CONTROLS:
- Seller approval and verification
- Product catalog management
- Payment and transaction monitoring
- Dispute resolution interface`;
        break;
      case 'saas':
        basePrompt += `\n\nSAAS CONTROLS:
- Feature flag management
- Subscription plan configuration
- API usage monitoring
- Customer support tools`;
        break;
    }

    basePrompt += `\n\nSTYLE: Professional administrative interface with clear organization, bulk actions, search/filter capabilities, and detailed configuration options.`;

    return basePrompt;
  };

  const generateMobilePrompt = (features, userFlows, concept, projectType) => {
    let basePrompt = `Design mobile-responsive views for "${concept}". Show how the main functionality adapts to mobile screens.

MOBILE SCREENS TO SHOW:
- Mobile navigation (hamburger menu or bottom tabs)
- Key feature screens optimized for mobile
- Touch-friendly interactions and buttons
- Mobile-specific user flows

MOBILE-OPTIMIZED FEATURES:`;

    features.slice(0, 3).forEach(feature => {
      basePrompt += `\n- ${feature.name}: Mobile-optimized version showing "${feature.description}"`;
    });

    basePrompt += `\n\nMOBILE UX CONSIDERATIONS:
- Large touch targets and easy navigation
- Simplified layouts for small screens
- Mobile-specific gestures and interactions
- Fast loading and minimal data usage

STYLE: Clean mobile interface with proper spacing, readable text sizes, and thumb-friendly navigation. Show both portrait orientations.`;

    return basePrompt;
  };

  const generateScreen = async (screenType) => {
    if (!screenPrompts[screenType]) return;

    setIsGenerating(true);
    setCurrentGenerating(screenType);
    setError(null);

    try {
      const response = await GenerateImage({
        prompt: `UI/UX wireframe design: ${screenPrompts[screenType]}

TECHNICAL SPECIFICATIONS:
- Modern web application design
- Clean, professional layout
- Consistent design system
- Proper visual hierarchy
- Realistic content and data
- High-fidelity mockup quality

Create a detailed, comprehensive interface design that shows actual functionality, not generic placeholders.`
      });

      if (response && response.url) {
        setGeneratedScreens(prev => ({
          ...prev,
          [screenType]: response.url
        }));
      } else {
        throw new Error("Failed to generate screen design");
      }
    } catch (err) {
      console.error(`Error generating ${screenType}:`, err);
      setError(`Failed to generate ${screenTypes[screenType].name}. Please try again.`);
      // Fallback images for different screen types
      const fallbackImages = {
        dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        userInterface: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?q=80&w=2070&auto=format&fit=crop',
        controlPanel: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        mobileApp: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop'
      };
      setGeneratedScreens(prev => ({
        ...prev,
        [screenType]: fallbackImages[screenType]
      }));
    }

    setIsGenerating(false);
    setCurrentGenerating(null);
  };

  const generateAllScreens = async () => {
    for (const screenType of Object.keys(screenTypes)) {
      await generateScreen(screenType);
      // Add small delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layout className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Figma-Style UI System Generator</h2>
          </div>
          <p className="text-gray-600">
            AI analyzes your project context to generate high-fidelity, interactive-ready UI designs for all major interfaces.
          </p>
        </div>
        
        <Button 
          onClick={generateAllScreens}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate All Screens
            </>
          )}
        </Button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(screenTypes).map(([key, screenType]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <screenType.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{screenType.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">{screenType.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {generatedScreens[key] ? (
                  <div className="space-y-4">
                    <img 
                      src={generatedScreens[key]} 
                      alt={`${screenType.name} Design`}
                      className="w-full rounded-lg shadow-md border"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateScreen(key)}
                        disabled={isGenerating}
                      >
                        {currentGenerating === key ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                          <Palette className="w-3 h-3 mr-1" />
                        )}
                        Regenerate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(generatedScreens[key], '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <screenType.icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">{screenType.name} will be generated based on your project context</p>
                    
                    {screenPrompts[key] && (
                      <div className="text-left mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Generation Prompt Preview:</h4>
                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
                          {screenPrompts[key].substring(0, 200)}...
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => generateScreen(key)}
                      disabled={isGenerating}
                      variant="outline"
                    >
                      {currentGenerating === key ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Palette className="mr-2 h-3 w-3" />
                          Generate {screenType.name}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {Object.keys(generatedScreens).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                UI System Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Screens Generated</h4>
                  <p className="text-2xl font-bold text-blue-600">{Object.keys(generatedScreens).length}/4</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Type Detected</h4>
                  <Badge variant="outline" className="capitalize">
                    {projectContext ? analyzeProjectType(projectContext.businessConcept, projectContext.features) : 'General'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                  <p className="text-sm text-gray-600">Review designs and export for development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
