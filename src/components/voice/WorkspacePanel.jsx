import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderKanban, 
  TrendingUp, 
  ClipboardSignature, 
  FileText,
  CheckCircle,
  X,
  Clock,
  Brain,
  Target,
  Users,
  DollarSign,
  Zap,
  Download,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FeatureBuilder from "./FeatureBuilder";
import BusinessStrategist from "./BusinessStrategist";
import AgreementGenerator from "./AgreementGenerator";
import FounderDocs from "./FounderDocs";
import ClarificationEngine from "./ClarificationEngine";

export default function WorkspacePanel({ 
  features, 
  onUpdateFeatureStatus,
  businessStrategy,
  cofounderAgreement,
  onFinalizeAgreement,
  projectDocuments,
  onUpdateFeature,
  onFeatureExecutionReady
}) {
  const [activeTab, setActiveTab] = useState("features");

  const approvedFeatures = features.filter(f => f.status === 'approved').length;
  const pendingFeatures = features.filter(f => f.status === 'pending').length;
  const clarifiedFeatures = features.filter(f => f.clarificationData?.clarified).length;
  const executionReadyFeatures = features.filter(f => f.clarificationData?.executionReady).length;
  const hasStrategy = businessStrategy !== null;
  const hasAgreement = cofounderAgreement !== null;

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-purple-600" />
          Live Project Builder
        </CardTitle>
        
        {/* Quick Stats */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{approvedFeatures} Features</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{pendingFeatures} Pending</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{clarifiedFeatures} Clarified</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>{executionReadyFeatures} Ready</span>
          </div>
          {hasStrategy && (
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-3 h-3 text-blue-500" />
              <span>Strategy Ready</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 bg-gray-50 rounded-none border-b">
            <TabsTrigger value="features" className="gap-2">
              <Target className="w-4 h-4" />
              Features
              {features.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                  {features.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="clarify" className="gap-2">
              <Search className="w-4 h-4" />
              Clarify
              {approvedFeatures > clarifiedFeatures && (
                <div className="w-2 h-2 bg-orange-500 rounded-full ml-1"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Strategy
              {hasStrategy && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="agreement" className="gap-2">
              <ClipboardSignature className="w-4 h-4" />
              Agreement
              {hasAgreement && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2">
              <FileText className="w-4 h-4" />
              Docs
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="features" className="h-full m-0">
              <FeatureBuilder 
                features={features}
                onUpdateFeatureStatus={onUpdateFeatureStatus}
              />
            </TabsContent>

            <TabsContent value="clarify" className="h-full m-0">
              <ClarificationEngine
                features={features}
                onUpdateFeature={onUpdateFeature}
                businessStrategy={businessStrategy}
                onFeatureExecutionReady={onFeatureExecutionReady}
              />
            </TabsContent>

            <TabsContent value="strategy" className="h-full m-0">
              <BusinessStrategist 
                businessStrategy={businessStrategy}
                features={features.filter(f => f.status === 'approved')}
              />
            </TabsContent>

            <TabsContent value="agreement" className="h-full m-0">
              <AgreementGenerator 
                cofounderAgreement={cofounderAgreement}
                features={features.filter(f => f.status === 'approved')}
                businessStrategy={businessStrategy}
                onFinalizeAgreement={onFinalizeAgreement}
              />
            </TabsContent>

            <TabsContent value="docs" className="h-full m-0">
              <FounderDocs 
                projectDocuments={projectDocuments}
                features={features}
                businessStrategy={businessStrategy}
                cofounderAgreement={cofounderAgreement}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}