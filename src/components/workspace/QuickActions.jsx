
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Search, 
  Wrench, 
  ClipboardSignature, // Changed from FileContract to ClipboardSignature
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const ActionCard = ({ title, description, icon: Icon, href, status, delay, disabled = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link to={href} className={disabled ? 'pointer-events-none' : ''}>
      <Card className={`cursor-pointer transition-all duration-300 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg hover:-translate-y-1 bg-white/60 backdrop-blur-sm'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  {status && (
                    <div className="flex items-center gap-1 mt-1">
                      {status === 'ready' && <CheckCircle className="w-3 h-3 text-green-600" />}
                      {status === 'needed' && <AlertTriangle className="w-3 h-3 text-orange-600" />}
                      <span className={`text-xs ${
                        status === 'ready' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {status === 'ready' ? 'Ready' : 'Recommended'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors mt-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export default function QuickActions({ features, businessStrategy, lastMessage }) {
  const approvedFeatures = features.filter(f => f.status === 'approved');
  const needsClarification = approvedFeatures.filter(f => !f.clarificationData?.clarified);
  const hasStrategy = businessStrategy !== null;
  const suggestedModule = lastMessage?.suggestedModule;

  const actions = [
    {
      title: "Business Validation Zone",
      description: "Research competitors, validate market fit, and get strategic recommendations",
      icon: TrendingUp,
      href: createPageUrl("BusinessValidation"),
      status: suggestedModule === 'BusinessValidation' ? 'needed' : (hasStrategy ? 'ready' : null)
    },
    {
      title: "Clarification Engine",
      description: "Define inputs, outputs, and edge cases for each feature",
      icon: Search,
      href: createPageUrl("ClarificationEngine"),
      status: needsClarification.length > 0 ? 'needed' : (approvedFeatures.length > 0 ? 'ready' : null)
    },
    {
      title: "CTO Studio",
      description: "Choose tech stack, add plug-and-play modules, and design UI mockups",
      icon: Wrench,
      href: createPageUrl("CTOStudio"),
      status: suggestedModule === 'CTOStudio' ? 'needed' : null
    },
    {
      title: "Smart Contracts",
      description: "Generate co-signed agreements for every decision and feature",
      icon: ClipboardSignature, // Changed from FileContract to ClipboardSignature
      href: createPageUrl("SmartContracts"),
      status: approvedFeatures.length > 0 ? 'ready' : null
    },
    {
      title: "Docs Generator",
      description: "Auto-compile business plan, pitch deck, and technical specifications",
      icon: FileText,
      href: createPageUrl("DocsGenerator"),
      status: features.length > 0 ? 'ready' : null
    }
  ];

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600" />
          Suggested Next Steps
        </CardTitle>
        {lastMessage?.moduleReason && (
          <p className="text-sm text-gray-600 mt-2">
            {lastMessage.moduleReason}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-4 overflow-y-auto">
        {actions.map((action, index) => (
          <ActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            href={action.href}
            status={action.status}
            delay={index * 0.1}
          />
        ))}

        {/* Feature Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Current Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Features Identified</span>
              <Badge variant="outline">{features.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ready for Clarification</span>
              <Badge variant="outline">{needsClarification.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Strategy</span>
              <Badge variant="outline" className={hasStrategy ? 'text-green-700' : 'text-gray-500'}>
                {hasStrategy ? 'Complete' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
