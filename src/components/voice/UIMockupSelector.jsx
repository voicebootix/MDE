import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/api/integrations";
import { 
  Palette, 
  Eye, 
  CheckCircle, 
  RefreshCw, 
  Download,
  Grid,
  List,
  Layout,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MockupCard = ({ mockup, isSelected, onSelect, onRefine }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`cursor-pointer transition-all ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}
    onClick={() => onSelect(mockup)}
  >
    <Card className={isSelected ? 'border-blue-500 bg-blue-50' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{mockup.name}</CardTitle>
          {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
        </div>
        <Badge variant="secondary" className="w-fit">
          {mockup.type}
        </Badge>
      </CardHeader>
      
      <CardContent>
        {/* Visual Mockup Preview */}
        <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <mockup.icon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-xs">{mockup.layout}</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{mockup.description}</p>
        
        <div className="space-y-2 text-xs text-gray-500">
          <div><strong>Components:</strong> {mockup.components.join(', ')}</div>
          <div><strong>Best for:</strong> {mockup.bestFor}</div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(mockup);
            }}
            className="flex-1"
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRefine(mockup);
            }}
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DevicePreview = ({ selectedMockup, device }) => {
  const getDeviceFrame = () => {
    switch (device) {
      case 'mobile':
        return 'w-64 h-96 border-8 border-gray-800 rounded-3xl';
      case 'tablet':
        return 'w-80 h-64 border-4 border-gray-600 rounded-2xl';
      case 'desktop':
        return 'w-96 h-64 border-2 border-gray-400 rounded-lg';
      default:
        return 'w-96 h-64 border-2 border-gray-400 rounded-lg';
    }
  };

  if (!selectedMockup) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-4" />
          <p>Select a mockup to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <div className={`bg-white ${getDeviceFrame()} flex items-center justify-center`}>
        <div className="text-center p-4">
          <selectedMockup.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-medium">{selectedMockup.name}</div>
          <div className="text-xs text-gray-500 mt-1">{selectedMockup.layout}</div>
          
          {/* Simple component layout visualization */}
          <div className="mt-3 space-y-1">
            {selectedMockup.components.slice(0, 3).map((component, index) => (
              <div key={index} className="h-2 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UIMockupSelector({ feature, onUpdateFeature }) {
  const [mockups, setMockups] = useState([]);
  const [selectedMockup, setSelectedMockup] = useState(feature.uiSpec?.selected || null);
  const [customRequirements, setCustomRequirements] = useState(feature.uiSpec?.customRequirements || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  useEffect(() => {
    if (mockups.length === 0) {
      generateMockups();
    }
  }, []);

  const generateMockups = async () => {
    setIsGenerating(true);
    
    try {
      const response = await InvokeLLM({
        prompt: `
          Generate 3 different UI mockup suggestions for this feature:
          
          Feature: ${feature.name}
          Description: ${feature.description}
          User Interaction: ${feature.clarificationData?.userInteraction || 'Not specified'}
          Inputs: ${feature.clarificationData?.inputs || 'Not specified'}
          Outputs: ${feature.clarificationData?.outputs || 'Not specified'}
          
          For each mockup, suggest:
          1. Layout type (dashboard, form, list, card, modal, etc.)
          2. Key UI components needed
          3. Visual arrangement
          4. Best use case
          
          Make them distinctly different approaches to the same feature.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            mockups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["dashboard", "form", "list", "card", "modal", "sidebar", "full-page"] },
                  layout: { type: "string" },
                  description: { type: "string" },
                  components: { type: "array", items: { type: "string" } },
                  bestFor: { type: "string" },
                  responsive: { type: "boolean" }
                }
              }
            }
          }
        }
      });
      
      // Add icons and enhance mockups
      const enhancedMockups = response.mockups.map(mockup => ({
        ...mockup,
        id: `mockup_${Date.now()}_${Math.random()}`,
        icon: getIconForType(mockup.type)
      }));
      
      setMockups(enhancedMockups);
    } catch (error) {
      console.error('Failed to generate mockups:', error);
      // Fallback mockups
      setMockups([
        {
          id: 'fallback_1',
          name: 'Dashboard View',
          type: 'dashboard',
          layout: 'Grid Layout',
          description: 'Card-based dashboard with metrics and actions',
          components: ['Header', 'Stats Cards', 'Action Buttons', 'Data Table'],
          bestFor: 'Overview and management',
          icon: Grid
        },
        {
          id: 'fallback_2',
          name: 'Form Interface',
          type: 'form',
          layout: 'Single Column',
          description: 'Clean form layout with progressive disclosure',
          components: ['Form Fields', 'Validation', 'Submit Button', 'Progress Indicator'],
          bestFor: 'Data input and configuration',
          icon: Layout
        },
        {
          id: 'fallback_3',
          name: 'List View',
          type: 'list',
          layout: 'Vertical List',
          description: 'Scannable list with actions and filters',
          components: ['Search Bar', 'Filter Options', 'List Items', 'Pagination'],
          bestFor: 'Browsing and selection',
          icon: List
        }
      ]);
    }
    
    setIsGenerating(false);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'dashboard': return Grid;
      case 'form': return Layout;
      case 'list': return List;
      case 'card': return Grid;
      case 'modal': return Layout;
      default: return Layout;
    }
  };

  const handleSelectMockup = (mockup) => {
    setSelectedMockup(mockup);
    
    const uiSpec = {
      selected: mockup,
      customRequirements,
      selectedAt: new Date().toISOString()
    };
    
    onUpdateFeature(feature.id, { uiSpec });
  };

  const handleRefineMockup = async (mockup) => {
    setIsGenerating(true);
    
    try {
      const response = await InvokeLLM({
        prompt: `
          Refine and improve this UI mockup:
          
          Current Mockup: ${mockup.name}
          Type: ${mockup.type}
          Description: ${mockup.description}
          
          Feature Context: ${feature.name} - ${feature.description}
          
          Create an improved version with:
          1. Better component organization
          2. Enhanced user experience
          3. Modern design patterns
          4. Accessibility considerations
          
          Keep the same general type but improve the approach.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
            layout: { type: "string" },
            description: { type: "string" },
            components: { type: "array", items: { type: "string" } },
            bestFor: { type: "string" }
          }
        }
      });
      
      const refinedMockup = {
        ...response,
        id: `refined_${Date.now()}`,
        icon: getIconForType(response.type)
      };
      
      // Replace the original mockup
      const updatedMockups = mockups.map(m => 
        m.id === mockup.id ? refinedMockup : m
      );
      setMockups(updatedMockups);
      
    } catch (error) {
      console.error('Failed to refine mockup:', error);
    }
    
    setIsGenerating(false);
  };

  const handleCustomRequirementsChange = (value) => {
    setCustomRequirements(value);
    
    if (selectedMockup) {
      const uiSpec = {
        selected: selectedMockup,
        customRequirements: value,
        selectedAt: selectedMockup.selectedAt || new Date().toISOString()
      };
      
      onUpdateFeature(feature.id, { uiSpec });
    }
  };

  const exportUISpec = () => {
    const spec = {
      feature: {
        name: feature.name,
        description: feature.description
      },
      selectedMockup,
      customRequirements,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(spec, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ui-spec-${feature.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">UI Design & Mockups</h3>
            <p className="text-gray-600">{feature.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedMockup && (
              <Button size="sm" variant="outline" onClick={exportUISpec}>
                <Download className="w-3 h-3 mr-1" />
                Export UI Spec
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={generateMockups}
              disabled={isGenerating}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </Button>
          </div>
        </div>

        {selectedMockup && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">UI Selected: {selectedMockup.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid lg:grid-cols-2 gap-6 p-6">
        {/* Mockup Options */}
        <div className="space-y-6 overflow-y-auto">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Choose UI Approach</h4>
            
            {isGenerating ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-600">Generating UI mockups...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {mockups.map(mockup => (
                    <MockupCard
                      key={mockup.id}
                      mockup={mockup}
                      isSelected={selectedMockup?.id === mockup.id}
                      onSelect={handleSelectMockup}
                      onRefine={handleRefineMockup}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Custom Requirements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Custom Requirements</h4>
            <Textarea
              placeholder="Any specific UI requirements, preferences, or constraints..."
              value={customRequirements}
              onChange={(e) => handleCustomRequirementsChange(e.target.value)}
              className="h-24"
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Preview</h4>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <DevicePreview selectedMockup={selectedMockup} device={previewDevice} />

          {selectedMockup && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selected Design Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong className="text-sm">Layout:</strong>
                  <p className="text-sm text-gray-600">{selectedMockup.layout}</p>
                </div>
                <div>
                  <strong className="text-sm">Components:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMockup.components.map((component, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="text-sm">Best For:</strong>
                  <p className="text-sm text-gray-600">{selectedMockup.bestFor}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}