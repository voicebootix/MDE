
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/api/integrations";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarLabel, SidebarProvider
} from "@/components/ui/sidebar-reimagined";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Search, Wrench, FileText, Rocket, BarChart3, Users, Settings, User, Bell, LifeBuoy, Brain, Lightbulb
} from "lucide-react";

import HorizontalChatPanel from "@/components/layout/HorizontalChatPanel";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
    stage: "overview",
    description: "Project overview & metrics"
  },
  {
    title: "Co-Founder Workspace",
    url: createPageUrl("CoFounderWorkspace"),
    icon: Lightbulb,
    stage: "ideation",
    description: "Organize & develop your business concept"
  },
  {
    title: "Business Validation",
    url: createPageUrl("BusinessValidation"),
    icon: TrendingUp,
    stage: "validation",
    description: "Validate market opportunity"
  },
  {
    title: "Clarification Engine",
    url: createPageUrl("ClarificationEngine"),
    icon: Search,
    stage: "clarification",
    description: "Define features & requirements"
  },
  {
    title: "CTO Studio",
    url: createPageUrl("CTOStudio"),
    icon: Wrench,
    stage: "development",
    description: "Technical architecture & code"
  },
  {
    title: "Docs Generator",
    url: createPageUrl("DocsGenerator"),
    icon: FileText,
    stage: "documentation",
    description: "Generate project documentation"
  },
  {
    title: "Developer Launcher",
    url: createPageUrl("DeveloperLauncher"),
    icon: Rocket,
    stage: "deployment",
    description: "Deploy your application"
  },
  {
    title: "Investor Mode",
    url: createPageUrl("InvestorMode"),
    icon: Users,
    stage: "funding",
    description: "Pitch deck & investor materials"
  },
];

const proactiveMessages = {
  "Dashboard": "Welcome to your Dream Factory! I'm your AI Co-Founder. What business idea would you like to explore?",
  "CoFounderWorkspace": "I'm here to help structure your business concept. Tell me about the problem you want to solve.",
  "BusinessValidation": "Let's validate your market opportunity. I'll analyze your concept against real market data.",
  "ClarificationEngine": "Time to define precise features. I'll help clarify exactly what we're building.",
  "CTOStudio": "I'm your technical co-founder now. Let's architect and build your solution.",
  "DocsGenerator": "Ready to create professional documentation for your project.",
  "DeveloperLauncher": "Let's deploy your application and make it live.",
  "InvestorMode": "Time to create materials that attract investors and partnerships.",
  "default": "I'm your AI Co-Founder. Ready to turn your vision into reality?"
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  // Simple state management
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  useEffect(() => {
    initializeChat();
  }, [currentPageName]);

  const initializeChat = () => {
    const welcomeContent = proactiveMessages[currentPageName] || proactiveMessages.default;
    const welcomeMessage = {
      role: "assistant",
      content: welcomeContent,
      timestamp: new Date().toISOString(),
      agentType: "FoundryAI-Central"
    };
    
    // Only set welcome message if chat is empty
    if (conversationHistory.length === 0) {
      setConversationHistory([welcomeMessage]);
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || isProcessing) return;

    setIsProcessing(true);
    
    const userMessage = {
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [...conversationHistory, userMessage];
    setConversationHistory(newHistory);

    try {
      const response = await InvokeLLM({
        prompt: `
          You are an AI Co-Founder helping with business development.
          
          User said: "${messageContent}"
          Current page: ${currentPageName}
          
          Provide helpful business guidance and extract any business information to structure it properly.
          
          If the user mentions a business idea, concept, or solution, extract:
          - The core business concept
          - Target market/customers
          - Key features or solutions
          - Any technical requirements
        `,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            businessConcept: { type: "string" },
            targetMarket: { type: "string" },
            keyFeatures: { type: "array", items: { type: "string" } },
            nextSteps: { type: "array", items: { type: "string" } }
          },
          required: ["response"]
        }
      });

      const assistantMessage = {
        role: "assistant",
        content: response.response || "I'm here to help you build your business!",
        timestamp: new Date().toISOString(),
        agentType: "FoundryAI-Central"
      };

      setConversationHistory([...newHistory, assistantMessage]);

      // Auto-populate components if we have business data
      if (response.businessConcept || response.keyFeatures?.length > 0) {
        // Broadcast to all components
        window.dispatchEvent(new CustomEvent('aiPageAction', {
          detail: {
            action: {
              type: 'auto_populate',
              data: {
                businessConcept: response.businessConcept,
                targetMarket: response.targetMarket,
                keyFeatures: response.keyFeatures,
                nextSteps: response.nextSteps
              }
            }
          }
        }));

        // Save to session storage
        const workspaceData = {
          dreamStatement: response.businessConcept || "",
          targetMarket: response.targetMarket || "",
          keyFeatures: response.keyFeatures || [],
          lastUpdate: new Date().toISOString()
        };
        sessionStorage.setItem('foundersWorkspaceData', JSON.stringify(workspaceData));
      }

    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "I'm here and ready to help! What's your business idea?",
        timestamp: new Date().toISOString()
      };
      setConversationHistory([...newHistory, errorMessage]);
    }

    setIsProcessing(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 font-sans">
        {/* Left Navigation Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white"/>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">DreamFactory</span>
                <div className="text-xs text-gray-500">AI Co-Founder</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarLabel>Business Journey</SidebarLabel>
            {navigationItems.map(item => (
              <SidebarItem
                key={item.title}
                icon={item.icon}
                as={Link}
                to={item.url}
                isActive={location.pathname === item.url}
              >
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              </SidebarItem>
            ))}
          </SidebarContent>
          <SidebarContent className="mt-auto">
            <SidebarItem icon={User} as="button">Profile</SidebarItem>
            <SidebarItem icon={Settings} as="button">Settings</SidebarItem>
            <SidebarItem icon={LifeBuoy} as="button">Support</SidebarItem>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Page Content */}
          <main className={`flex-1 overflow-y-auto bg-gray-100/50 transition-all duration-300 ${isChatExpanded ? 'pb-80' : 'pb-20'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Horizontal Chat Panel */}
          <HorizontalChatPanel
            conversationHistory={conversationHistory}
            isProcessing={isProcessing}
            onSendMessage={handleSendMessage}
            userInput={userInput}
            setUserInput={setUserInput}
            isExpanded={isChatExpanded}
            onToggleExpanded={setIsChatExpanded}
            currentPageContext={currentPageName}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
