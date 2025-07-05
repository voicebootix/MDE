import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvokeLLM } from "@/api/integrations";
import { 
  FileText, 
  Download, 
  Target, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Map,
  Award,
  Loader2,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

const DocumentCard = ({ title, icon: Icon, content, isGenerating, onGenerate, onDownload }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {title}
        {content && (
          <Badge variant="outline" className="ml-auto">
            Ready
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isGenerating ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Generating...</span>
        </div>
      ) : content ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{content}</pre>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onGenerate} className="gap-1">
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </Button>
            <Button size="sm" onClick={onDownload} className="gap-1">
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Document not generated yet</p>
          <Button onClick={onGenerate} className="gap-2">
            <Icon className="w-4 h-4" />
            Generate {title}
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function FounderDocs({ 
  projectDocuments, 
  features, 
  businessStrategy, 
  cofounderAgreement 
}) {
  const [documents, setDocuments] = useState({
    overview: null,
    specifications: null,
    validation: null,
    marketing: null,
    revenue: null,
    roadmap: null,
    agreement: null
  });
  
  const [generatingDocs, setGeneratingDocs] = useState({});

  useEffect(() => {
    // Auto-populate agreement if available
    if (cofounderAgreement && !documents.agreement) {
      setDocuments(prev => ({
        ...prev,
        agreement: formatAgreementDocument(cofounderAgreement)
      }));
    }
  }, [cofounderAgreement, documents.agreement]);

  const formatAgreementDocument = (agreement) => {
    return `COFOUNDER AGREEMENT

Project: ${agreement.projectName}
Founder: ${agreement.founderName}
AI Cofounder: ${agreement.aiSignature}
Date: ${agreement.date}

AGREED FEATURES:
${agreement.finalizedFeatures.map(f => `• ${f.name}: ${f.description}`).join('\n')}

TERMS:
${agreement.additionalTerms || 'Standard cofounder terms apply'}

SIGNATURES:
Founder: ${agreement.founderName}
AI Cofounder: ${agreement.aiSignature}`;
  };

  const generateDocument = async (docType) => {
    setGeneratingDocs(prev => ({ ...prev, [docType]: true }));
    
    try {
      let prompt = "";
      let schema = { type: "object", properties: { content: { type: "string" } } };
      
      const approvedFeatures = features.filter(f => f.status === 'approved');
      const featureList = approvedFeatures.map(f => `${f.name}: ${f.description}`).join('\n');
      
      switch (docType) {
        case 'overview':
          prompt = `Create a professional Project Overview document for a startup project.
          
          Features: ${featureList}
          Business Strategy: ${businessStrategy?.marketAnalysis || 'Not available'}
          
          Include: Vision statement, goals, key features summary, target market, and unique value proposition.
          Make it compelling and investor-ready.`;
          break;
          
        case 'specifications':
          prompt = `Create a detailed Feature Specification document.
          
          Features: ${featureList}
          
          For each feature, include: description, user stories, acceptance criteria, and technical notes.
          Format as a professional product requirements document.`;
          break;
          
        case 'validation':
          prompt = `Create a Business Validation Report.
          
          Market Analysis: ${businessStrategy?.marketAnalysis || 'Not analyzed'}
          Competitors: ${businessStrategy?.competitors?.map(c => c.name).join(', ') || 'Not analyzed'}
          Features: ${featureList}
          
          Include: market size, competitive landscape, SWOT analysis, and validation recommendations.`;
          break;
          
        case 'marketing':
          prompt = `Create a Marketing Plan document.
          
          Features: ${featureList}
          Target Market: ${businessStrategy?.marketAnalysis || 'General market'}
          
          Include: target audience definition, marketing channels, messaging strategy, and launch tactics.`;
          break;
          
        case 'revenue':
          prompt = `Create a Revenue & Pricing Strategy document.
          
          Features: ${featureList}
          Market Context: ${businessStrategy?.marketAnalysis || 'Not available'}
          
          Include: monetization models, pricing recommendations, revenue projections, and competitive pricing analysis.`;
          break;
          
        case 'roadmap':
          prompt = `Create a Launch Roadmap document.
          
          Features: ${featureList}
          
          Include: development phases, feature prioritization, milestone timeline, and success metrics.
          Suggest realistic timelines for MVP launch.`;
          break;
      }
      
      const response = await InvokeLLM({
        prompt,
        response_json_schema: schema
      });
      
      setDocuments(prev => ({
        ...prev,
        [docType]: response.content
      }));
      
    } catch (error) {
      console.error(`Failed to generate ${docType}:`, error);
    }
    
    setGeneratingDocs(prev => ({ ...prev, [docType]: false }));
  };

  const downloadDocument = (docType, title) => {
    const content = documents[docType];
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllDocuments = () => {
    // Create a zip-like bundle by combining all documents
    const allDocs = Object.entries(documents)
      .filter(([_, content]) => content)
      .map(([key, content]) => {
        const titles = {
          overview: 'Project Overview',
          specifications: 'Feature Specifications',
          validation: 'Business Validation Report',
          marketing: 'Marketing Plan',
          revenue: 'Revenue Strategy',
          roadmap: 'Launch Roadmap',
          agreement: 'Cofounder Agreement'
        };
        return `=== ${titles[key]} ===\n\n${content}\n\n`;
      })
      .join('\n');
    
    const blob = new Blob([allDocs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'founder-documents-bundle.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canGenerateDocs = features.length > 0;
  const readyDocs = Object.values(documents).filter(Boolean).length;

  return (
    <div className="p-6 h-full overflow-y-auto">
      {!canGenerateDocs ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Available</h3>
          <p className="text-gray-600">
            Start defining features in your conversation to auto-generate founder documents
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Founder Document Portfolio</h3>
              <p className="text-gray-600">{readyDocs} of 7 documents generated</p>
            </div>
            
            {readyDocs > 0 && (
              <Button onClick={downloadAllDocuments} className="gap-2">
                <Download className="w-4 h-4" />
                Download All ({readyDocs})
              </Button>
            )}
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <DocumentCard
              title="Project Overview"
              icon={Target}
              content={documents.overview}
              isGenerating={generatingDocs.overview}
              onGenerate={() => generateDocument('overview')}
              onDownload={() => downloadDocument('overview', 'Project Overview')}
            />
            
            <DocumentCard
              title="Feature Specifications"
              icon={FileText}
              content={documents.specifications}
              isGenerating={generatingDocs.specifications}
              onGenerate={() => generateDocument('specifications')}
              onDownload={() => downloadDocument('specifications', 'Feature Specifications')}
            />
            
            <DocumentCard
              title="Business Validation Report"
              icon={TrendingUp}
              content={documents.validation}
              isGenerating={generatingDocs.validation}
              onGenerate={() => generateDocument('validation')}
              onDownload={() => downloadDocument('validation', 'Business Validation Report')}
            />
            
            <DocumentCard
              title="Marketing Plan"
              icon={Users}
              content={documents.marketing}
              isGenerating={generatingDocs.marketing}
              onGenerate={() => generateDocument('marketing')}
              onDownload={() => downloadDocument('marketing', 'Marketing Plan')}
            />
            
            <DocumentCard
              title="Revenue Strategy"
              icon={DollarSign}
              content={documents.revenue}
              isGenerating={generatingDocs.revenue}
              onGenerate={() => generateDocument('revenue')}
              onDownload={() => downloadDocument('revenue', 'Revenue Strategy')}
            />
            
            <DocumentCard
              title="Launch Roadmap"
              icon={Calendar}
              content={documents.roadmap}
              isGenerating={generatingDocs.roadmap}
              onGenerate={() => generateDocument('roadmap')}
              onDownload={() => downloadDocument('roadmap', 'Launch Roadmap')}
            />
          </div>

          {/* Agreement Section */}
          {cofounderAgreement && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Cofounder Agreement
                  <Badge className="bg-green-100 text-green-800">Signed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Your virtual cofounder agreement has been finalized and is ready for download.
                </p>
                <Button 
                  onClick={() => downloadDocument('agreement', 'Cofounder Agreement')}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Agreement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}