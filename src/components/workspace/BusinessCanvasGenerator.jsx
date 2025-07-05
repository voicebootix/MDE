import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Layout, Edit3, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { InvokeLLM } from "@/api/integrations";

export default function BusinessCanvasGenerator({ businessCanvas, onUpdateCanvas }) {
  const [canvas, setCanvas] = useState(businessCanvas || {});
  const [editingSection, setEditingSection] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setCanvas(businessCanvas || {});
  }, [businessCanvas]);

  // Enhanced AI-assisted editing
  const handleSectionEdit = async (sectionId, currentContent) => {
    setEditingSection(sectionId);
    setEditContent(Array.isArray(currentContent) ? currentContent.join('\n') : currentContent || '');
  };

  const handleSaveEdit = async () => {
    if (!editingSection) return;
    
    setIsGenerating(true);
    try {
      // AI validation and enhancement of user input
      const response = await InvokeLLM({
        prompt: `
          The user is editing the "${editingSection}" section of their Business Model Canvas.
          
          Current business context: ${JSON.stringify(canvas)}
          User's new input: "${editContent}"
          
          Please:
          1. Validate and enhance their input for the "${editingSection}" section
          2. Ensure consistency with other canvas sections
          3. Provide structured output appropriate for this section
          4. Suggest any missing elements or improvements
        `,
        response_json_schema: {
          type: "object",
          properties: {
            enhancedContent: { 
              type: (
                editingSection === 'keyPartners' ||
                editingSection === 'keyActivities' ||
                editingSection === 'keyResources' ||
                editingSection === 'customerRelationships' ||
                editingSection === 'channels' ||
                editingSection === 'customerSegments' ||
                editingSection === 'costStructure' ||
                editingSection === 'revenueStreams'
              ) ? "array" : "string",
              items: { type: "string" }
            },
            feedback: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
          },
          required: ["enhancedContent"]
        }
      });

      const updatedCanvas = {
        ...canvas,
        [editingSection]: response.enhancedContent
      };

      setCanvas(updatedCanvas);
      onUpdateCanvas?.(updatedCanvas);
      
      if (response.feedback) {
        console.log("AI Feedback:", response.feedback);
      }

    } catch (error) {
      console.error("Error enhancing canvas section:", error);
      // Fallback to user input
      const isArraySection = (
        editingSection === 'keyPartners' ||
        editingSection === 'keyActivities' ||
        editingSection === 'keyResources' ||
        editingSection === 'customerRelationships' ||
        editingSection === 'channels' ||
        editingSection === 'customerSegments' ||
        editingSection === 'costStructure' ||
        editingSection === 'revenueStreams'
      );
      
      let finalUserInput;
      if (isArraySection) {
        finalUserInput = editContent.split('\n').filter(item => item.trim() !== '');
        if (finalUserInput.length === 0 && editContent.trim() !== '') {
          finalUserInput = [editContent.trim()];
        }
      } else {
        finalUserInput = editContent.trim();
      }

      const updatedCanvas = {
        ...canvas,
        [editingSection]: finalUserInput
      };
      setCanvas(updatedCanvas);
      onUpdateCanvas?.(updatedCanvas);
    }
    
    setEditingSection(null);
    setEditContent('');
    setIsGenerating(false);
  };

  const canvasStructure = [
    {
      id: 'keyPartners',
      title: 'Key Partners',
      description: 'Who are your key partners and suppliers?',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800'
    },
    {
      id: 'keyActivities', 
      title: 'Key Activities',
      description: 'What key activities does your value proposition require?',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      id: 'keyResources',
      title: 'Key Resources', 
      description: 'What key resources does your value proposition require?',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      id: 'valueProposition',
      title: 'Value Proposition',
      description: 'What value do you deliver to customers?',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      isCenter: true
    },
    {
      id: 'customerRelationships',
      title: 'Customer Relationships',
      description: 'What type of relationship do you establish with customers?',
      color: 'bg-pink-50 border-pink-200', 
      textColor: 'text-pink-800'
    },
    {
      id: 'channels',
      title: 'Channels',
      description: 'Through which channels do you reach customers?',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-800'
    },
    {
      id: 'customerSegments',
      title: 'Customer Segments',
      description: 'For whom are you creating value?',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-800'
    },
    {
      id: 'costStructure',
      title: 'Cost Structure', 
      description: 'What are the most important costs in your business model?',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-800'
    },
    {
      id: 'revenueStreams',
      title: 'Revenue Streams',
      description: 'For what value are customers willing to pay?',
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-800'
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-purple-600" />
            Business Model Canvas
          </CardTitle>
          <Badge className="bg-purple-100 text-purple-700">
            Interactive & AI-Enhanced
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-5 gap-4 h-auto">
          {/* Row 1 */}
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'keyPartners')}
            content={canvas.keyPartners}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'keyPartners'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
          />
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'keyActivities')}
            content={canvas.keyActivities}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'keyActivities'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
          />
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'valueProposition')}
            content={canvas.valueProposition}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'valueProposition'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
            className="row-span-2"
          />
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'customerRelationships')}
            content={canvas.customerRelationships}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'customerRelationships'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
          />
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'customerSegments')}
            content={canvas.customerSegments}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'customerSegments'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
            className="row-span-2"
          />

          {/* Row 2 */}
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'keyResources')}
            content={canvas.keyResources}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'keyResources'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
          />
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'channels')}
            content={canvas.channels}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'channels'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
          />

          {/* Row 3 - Cost Structure and Revenue Streams */}
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'costStructure')}
            content={canvas.costStructure}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'costStructure'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
            className="col-span-2"
          />
          
          <div></div> {/* Empty space for alignment */}
          
          <CanvasSection
            section={canvasStructure.find(s => s.id === 'revenueStreams')}
            content={canvas.revenueStreams}
            onEdit={handleSectionEdit}
            isEditing={editingSection === 'revenueStreams'}
            editContent={editContent}
            setEditContent={setEditContent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingSection(null)}
            isGenerating={isGenerating}
            className="col-span-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}

const CanvasSection = ({ 
  section, 
  content, 
  onEdit, 
  isEditing, 
  editContent, 
  setEditContent, 
  onSave, 
  onCancel, 
  isGenerating,
  className = "" 
}) => {
  const displayContent = Array.isArray(content) ? content : [content].filter(Boolean);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${section.color} border-2 rounded-lg p-3 min-h-[120px] cursor-pointer transition-all relative group ${className}`}
      onClick={() => !isEditing && onEdit(section.id, content)}
    >
      <h3 className={`font-semibold text-xs mb-2 ${section.textColor}`}>
        {section.title}
      </h3>
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder={section.description}
            className="text-xs min-h-[60px]"
            disabled={isGenerating}
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={onSave}
              disabled={isGenerating}
              className="text-xs px-2 py-1 h-6"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />}
              {isGenerating ? "Processing..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="text-xs px-2 py-1 h-6"
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {displayContent.length > 0 ? (
            displayContent.map((item, index) => (
              <div key={index} className={`text-xs ${section.textColor} opacity-80 leading-snug`}>
                • {item}
              </div>
            ))
          ) : (
            <div className={`text-xs ${section.textColor} opacity-60 italic leading-snug`}>
              Click to add {section.title.toLowerCase()}
            </div>
          )}
        </div>
      )}
      
      {!isEditing && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-3 h-3 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
};