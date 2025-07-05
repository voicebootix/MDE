import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Palette, Loader2, Zap, AlertTriangle, Figma, Code, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvokeLLM } from '@/api/integrations';

export default function FigmaStyleGenerator({ projectContext }) {
  const [designSystem, setDesignSystem] = useState(null);
  const [screens, setScreens] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingScreen, setCurrentGeneratingScreen] = useState("");
  const [viewMode, setViewMode] = useState("desktop");

  useEffect(() => {
    if (projectContext && !designSystem) {
      handleGenerate();
    }
  }, [projectContext]);

  const getScreensToGenerate = (context) => {
    const baseScreens = [
      { name: 'Dashboard', description: 'Main analytics and overview screen' },
      { name: 'User Profile', description: 'User account and settings management' }
    ];

    // Add feature-specific screens based on project context
    if (context.features) {
      context.features.slice(0, 3).forEach(feature => {
        baseScreens.push({
          name: `${feature.name} Interface`,
          description: `Main interface for ${feature.description}`
        });
      });
    }

    return baseScreens;
  };

  const handleGenerate = async () => {
    if (!projectContext) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    const screensToGenerate = getScreensToGenerate(projectContext);
    const featureSummary = projectContext.features?.map(f => `- ${f.name}: ${f.description}`).join('\n') || '';
    const userFlowSummary = projectContext.userFlows?.map(f => `- ${f.flowName}: ${f.steps?.join(' -> ')}`).join('\n') || '';

    try {
      // Step 1: Generate Design System
      setCurrentGeneratingScreen("Design System");
      setGenerationProgress(10);

      const designSystemResponse = await InvokeLLM({
        prompt: `
          Create a comprehensive design system for "${projectContext.businessConcept}".
          
          Based on the project context:
          - Business Concept: ${projectContext.businessConcept}
          - Features: ${featureSummary}
          
          Generate a professional design system with:
          1. Color palette (primary, secondary, accent, neutral tones, success, warning, error)
          2. Typography scale (font families, sizes, weights)
          3. Component specifications (buttons, cards, forms, etc.)
          4. Spacing system
          5. Branding guidelines
        `,
        response_json_schema: {
          type: "object",
          properties: {
            branding: {
              type: "object",
              properties: {
                projectName: { type: "string" },
                tagline: { type: "string" },
                personality: { type: "string" }
              }
            },
            colors: {
              type: "object",
              properties: {
                primary: { type: "string" },
                secondary: { type: "string" },
                accent: { type: "string" },
                neutralLight: { type: "string" },
                neutralDark: { type: "string" },
                success: { type: "string" },
                warning: { type: "string" },
                error: { type: "string" },
                background: { type: "string" },
                surface: { type: "string" }
              }
            },
            typography: {
              type: "object",
              properties: {
                primaryFont: { type: "string" },
                secondaryFont: { type: "string" },
                h1: { type: "string" },
                h2: { type: "string" },
                h3: { type: "string" },
                body: { type: "string" },
                caption: { type: "string" }
              }
            },
            spacing: {
              type: "object",
              properties: {
                xs: { type: "string" },
                sm: { type: "string" },
                md: { type: "string" },
                lg: { type: "string" },
                xl: { type: "string" }
              }
            }
          }
        }
      });

      setDesignSystem(designSystemResponse);
      setGenerationProgress(30);

      // Step 2: Generate Individual Screens
      const generatedScreens = [];
      
      for (let i = 0; i < screensToGenerate.length; i++) {
        const screen = screensToGenerate[i];
        setCurrentGeneratingScreen(screen.name);
        setGenerationProgress(30 + (i / screensToGenerate.length) * 60);

        const screenResponse = await InvokeLLM({
          prompt: `
            Create a complete, interactive HTML page for "${screen.name}" screen.
            
            Project Context:
            - Business: ${projectContext.businessConcept}
            - Features: ${featureSummary}
            - User Flows: ${userFlowSummary}
            
            Design System to Follow:
            - Primary Color: ${designSystemResponse?.colors?.primary || '#3B82F6'}
            - Secondary Color: ${designSystemResponse?.colors?.secondary || '#8B5CF6'}
            - Font: ${designSystemResponse?.typography?.primaryFont || 'Inter'}
            
            Requirements:
            1. Create a COMPLETE, self-contained HTML page
            2. Use TailwindCSS for all styling (include CDN)
            3. Add realistic content specific to this project
            4. Include interactive elements (buttons, forms, modals if relevant)
            5. Make it responsive and professional
            6. Add some JavaScript for basic interactions
            7. The screen should specifically address: ${screen.description}
            
            Return ONLY the complete HTML code as a string.
          `,
        });

        generatedScreens.push({
          name: screen.name,
          description: screen.description,
          htmlContent: screenResponse || generateFallbackHTML(screen.name, designSystemResponse)
        });

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setScreens(generatedScreens);
      setActiveScreen(generatedScreens[0]);
      setGenerationProgress(100);
      setCurrentGeneratingScreen("Complete!");

    } catch (err) {
      console.error('Error generating design system:', err);
      setError('Failed to generate design system. This could be due to network issues or AI service limits. Please try again.');
      
      // Provide fallback content
      setDesignSystem(generateFallbackDesignSystem());
      setScreens(generateFallbackScreens());
      setActiveScreen(generateFallbackScreens()[0]);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentGeneratingScreen("");
      }, 1000);
    }
  };

  const generateFallbackDesignSystem = () => ({
    branding: {
      projectName: projectContext?.businessConcept || "Your Project",
      tagline: "Transforming ideas into reality",
      personality: "Modern, Professional, Innovative"
    },
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
      neutralLight: "#F8FAFC",
      neutralDark: "#1E293B",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      background: "#FFFFFF",
      surface: "#F1F5F9"
    },
    typography: {
      primaryFont: "Inter",
      secondaryFont: "Crimson Pro",
      h1: "2.5rem",
      h2: "2rem",
      h3: "1.5rem",
      body: "1rem",
      caption: "0.875rem"
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem"
    }
  });

  const generateFallbackHTML = (screenName, designSystem) => {
    const colors = designSystem?.colors || generateFallbackDesignSystem().colors;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${screenName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${colors.primary}',
                        secondary: '${colors.secondary}',
                        accent: '${colors.accent}'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 font-sans">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
                        <h1 class="text-xl font-bold text-gray-900">${projectContext?.businessConcept || 'Your Platform'}</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V12h5v5z"></path>
                            </svg>
                        </button>
                        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </header>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-sm h-screen">
                <nav class="p-6">
                    <ul class="space-y-2">
                        <li><a href="#" class="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                            <div class="w-5 h-5 bg-blue-500 rounded"></div>
                            <span>Dashboard</span>
                        </a></li>
                        <li><a href="#" class="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                            <div class="w-5 h-5 bg-green-500 rounded"></div>
                            <span>Analytics</span>
                        </a></li>
                        <li><a href="#" class="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                            <div class="w-5 h-5 bg-purple-500 rounded"></div>
                            <span>Settings</span>
                        </a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-8">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">${screenName}</h2>
                    <p class="text-gray-600">Welcome to your ${screenName.toLowerCase()} interface</p>
                </div>

                <!-- Content Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900">Total Users</h3>
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <div class="w-4 h-4 bg-blue-500 rounded"></div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold text-gray-900 mb-2">2,847</div>
                        <div class="text-sm text-green-600">↗ +12% from last month</div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900">Revenue</h3>
                            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <div class="w-4 h-4 bg-green-500 rounded"></div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold text-gray-900 mb-2">$45,280</div>
                        <div class="text-sm text-green-600">↗ +8% from last month</div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-900">Active Sessions</h3>
                            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <div class="w-4 h-4 bg-purple-500 rounded"></div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold text-gray-900 mb-2">1,284</div>
                        <div class="text-sm text-green-600">↗ +15% from last hour</div>
                    </div>
                </div>

                <!-- Feature-specific content -->
                <div class="bg-white rounded-xl shadow-sm border p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">A</div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">New user registered</p>
                                <p class="text-sm text-gray-600">2 minutes ago</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">B</div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">Payment processed</p>
                                <p class="text-sm text-gray-600">5 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        // Add some basic interactivity
        document.querySelectorAll('button, a').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.transition = 'transform 0.2s ease';
            });
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    </script>
</body>
</html>`;
  };

  const generateFallbackScreens = () => [
    {
      name: 'Dashboard',
      description: 'Main analytics and overview screen',
      htmlContent: generateFallbackHTML('Dashboard', generateFallbackDesignSystem())
    },
    {
      name: 'User Profile',
      description: 'User account and settings management',
      htmlContent: generateFallbackHTML('User Profile', generateFallbackDesignSystem())
    }
  ];

  const viewportSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '500px' },
    mobile: { width: '375px', height: '600px' }
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
            className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Figma className="w-8 h-8 text-white" />
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Professional UI System</h2>
            <p className="text-gray-600 mb-4">Creating design system and interactive screens for your project...</p>
            <p className="text-sm text-purple-600 font-medium">{currentGeneratingScreen}</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Progress value={generationProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">{generationProgress}% Complete</p>
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
            <Figma className="w-6 h-6 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-900">Professional UI Generator</h2>
          </div>
          <p className="text-gray-600">
            Complete design system and interactive prototypes for your project
          </p>
        </div>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3"
        >
          <Zap className="mr-2 h-4 w-4" />
          Regenerate UI System
        </Button>
      </div>

      {error && (
        <motion.div 
          className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {designSystem && screens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Design System Showcase */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-500" />
                  {designSystem.branding?.projectName || 'Design System'}
                </CardTitle>
                {designSystem.branding?.tagline && (
                  <p className="text-gray-600 italic">"{designSystem.branding.tagline}"</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Color Palette */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-blue-400 rounded"></div>
                      Color Palette
                    </h4>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(designSystem.colors || {}).map(([name, color]) => (
                        <div key={name} className="text-center">
                          <div 
                            className="w-12 h-12 rounded-lg border shadow-sm mb-2 mx-auto" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <p className="text-xs font-medium capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-xs text-gray-500">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 rounded"></div>
                      Typography
                    </h4>
                    <div className="space-y-3" style={{ fontFamily: designSystem.typography?.primaryFont }}>
                      <div>
                        <p className="text-xs text-gray-500">Heading 1</p>
                        <p style={{ fontSize: designSystem.typography?.h1 }} className="font-bold">The quick brown fox</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Heading 2</p>
                        <p style={{ fontSize: designSystem.typography?.h2 }} className="font-semibold">The quick brown fox</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Body Text</p>
                        <p style={{ fontSize: designSystem.typography?.body }}>The quick brown fox jumps over the lazy dog</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Screens */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    Interactive Prototypes
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                      <Button
                        variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('desktop')}
                        className="px-3 py-1"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('tablet')}
                        className="px-3 py-1"
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('mobile')}
                        className="px-3 py-1"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeScreen?.name} onValueChange={(val) => setActiveScreen(screens.find(s => s.name === val))}>
                  <div className="border-b bg-gray-50 px-6 py-2">
                    <TabsList className="bg-white">
                      {screens.map(screen => (
                        <TabsTrigger key={screen.name} value={screen.name} className="px-4">
                          {screen.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  {screens.map(screen => (
                    <TabsContent key={screen.name} value={screen.name} className="m-0">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{screen.name}</h3>
                            <p className="text-gray-600 text-sm">{screen.description}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const newWindow = window.open();
                              newWindow.document.write(screen.htmlContent);
                              newWindow.document.close();
                            }}
                          >
                            <Code className="w-4 h-4 mr-2" />
                            View Code
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
                          <div 
                            className="mx-auto bg-white rounded shadow-lg overflow-hidden"
                            style={viewportSizes[viewMode]}
                          >
                            <iframe
                              srcDoc={screen.htmlContent}
                              title={screen.name}
                              className="w-full h-full border-0"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}