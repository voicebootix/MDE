import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageCircle, 
  Brain, 
  Code, 
  Github, 
  Zap, 
  BarChart3,
  ArrowRight
} from "lucide-react";

const ActionCard = ({ title, description, icon: Icon, href, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link to={href}>
      <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export default function QuickActions() {
  const actions = [
    {
      title: "Start AI Conversation",
      description: "Begin with your AI cofounder to validate and build your idea",
      icon: MessageCircle,
      href: createPageUrl("VoiceConversation"),
      color: "bg-blue-500"
    },
    {
      title: "Business Intelligence",
      description: "Analyze market opportunities and validate your strategy",
      icon: Brain,
      href: createPageUrl("BusinessValidation"),
      color: "bg-emerald-500"
    },
    {
      title: "Code Editor",
      description: "Professional development environment with AI assistance",
      icon: Code,
      href: createPageUrl("CodeEditor"),
      color: "bg-purple-500"
    },
    {
      title: "GitHub Integration",
      description: "Seamless repository management and deployment",
      icon: Github,
      href: createPageUrl("GitHubIntegration"),
      color: "bg-gray-700"
    },
    {
      title: "Smart Contracts",
      description: "Automate revenue sharing and track performance",
      icon: Zap,
      href: createPageUrl("SmartContracts"),
      color: "bg-orange-500"
    },
    {
      title: "Analytics Dashboard",
      description: "Deep insights into your projects and performance",
      icon: BarChart3,
      href: createPageUrl("Analytics"),
      color: "bg-pink-500"
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <ActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              color={action.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}