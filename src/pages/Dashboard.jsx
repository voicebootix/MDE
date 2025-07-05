
import React, { useState, useEffect } from "react";
import { Project, VoiceConversation, SmartContract } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageCircle, 
  Brain, 
  Code, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  ArrowRight,
  Sparkles,
  Github,
  Play,
  Lightbulb,
  Folder,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

import StatsGrid from "../components/dashboard/StatsGrid";
import RecentProjects from "../components/dashboard/RecentProjects";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import RevenueChart from "../components/dashboard/RevenueChart";
import ProjectManager from "../components/layout/ProjectManager";

const defaultProjectData = {
  dreamStatement: "",
  mindMapData: { nodes: [], connections: [] },
  businessCanvas: null,
  businessPlan: null,
  ideaEvolution: [],
  marketData: null,
  competitorData: null,
  clarificationData: null,
  validationScore: 0,
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const [showProjectManager, setShowProjectManager] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadCurrentProject();
  }, []);

  const loadCurrentProject = () => {
    const projectId = sessionStorage.getItem('currentProjectId');
    if (projectId) {
      try {
        const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
        let project = projects.find(p => p.id === projectId);
        if (project) {
          project = { ...project, data: project.data || defaultProjectData };
        }
        setCurrentProject(project);
      } catch (error) {
        console.error('Error loading current project:', error);
      }
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load user projects from localStorage and ensure they have a data object
      const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]').map(p => ({
        ...p,
        data: p.data || defaultProjectData,
      }));
      setProjects(userProjects);

      // Mock data for conversations and contracts
      const mockConversations = [
        {
          id: 'conv1',
          session_id: 'session_123',
          conversation_state: 'completed',
          created_date: new Date().toISOString(),
          summary: "Discussed initial business idea for a new mobile app.",
          type: "voice",
        },
        {
          id: 'conv2',
          session_id: 'session_124',
          conversation_state: 'in-progress',
          created_date: new Date(Date.now() - 3600 * 1000).toISOString(),
          summary: "Brainstormed features for a new SaaS platform.",
          type: "text",
        }
      ];
      
      const mockContracts = [
        {
          id: 'contract1',
          project_id: 'proj1',
          revenue_tracked: 1250,
          contract_status: 'active',
          created_date: new Date().toISOString(),
          contract_name: "Initial Revenue Share",
        },
        {
          id: 'contract2',
          project_id: 'proj2',
          revenue_tracked: 500,
          contract_status: 'pending',
          created_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          contract_name: "Milestone Payment",
        }
      ];
      
      setConversations(mockConversations);
      setContracts(mockContracts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
    setIsLoading(false);
  };

  const calculateProjectProgress = (project) => {
    if (!project?.data) return 0;
    const data = project.data;
    let totalProgress = 0;

    if (data.dreamStatement) totalProgress += 25;
    if (data.mindMapData?.nodes?.length > 0) totalProgress += 25;
    if (data.marketData) totalProgress += 20;
    if (data.competitorData) totalProgress += 20;
    if (data.clarificationData?.features?.length > 0) totalProgress += 10;

    return Math.min(100, totalProgress);
  };

  const totalRevenue = contracts.reduce((sum, contract) => sum + (contract.revenue_tracked || 0), 0);
  const activeProjects = projects.filter(p => {
    const progress = calculateProjectProgress(p);
    return progress > 0 && progress < 100;
  }).length;
  const completedProjects = projects.filter(p => calculateProjectProgress(p) === 100).length;

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">
                    {currentProject ? `Welcome back to ${currentProject.name}` : 'Welcome to MyDreamFactory'}
                  </h1>
                </div>
                <Button
                  variant="outline"
                  className="hidden md:flex border-white text-white hover:bg-white/10"
                  onClick={() => setShowProjectManager(true)}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Manage Projects
                </Button>
              </div>
              
              {currentProject ? (
                <div className="mb-6">
                  <p className="text-lg text-blue-100 mb-2">
                    Project Progress: {calculateProjectProgress(currentProject)}% Complete
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProjectProgress(currentProject)}%` }}
                    ></div>
                  </div>
                  {currentProject?.data?.dreamStatement && (
                    <p className="text-blue-100 italic">"{currentProject.data.dreamStatement}"</p>
                  )}
                </div>
              ) : (
                <p className="text-lg text-blue-100 mb-6 max-w-2xl">
                  Your central hub for turning ideas into reality. Start a new project or manage existing ones.
                </p>
              )}
              
              <div className="flex gap-4">
                <Link to={createPageUrl("CoFounderWorkspace")}>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {currentProject ? 'Continue Project' : 'Start New Project'}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setShowProjectManager(true)}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  All Projects
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Enhanced Stats Grid */}
          <StatsGrid 
            totalRevenue={totalRevenue}
            activeProjects={activeProjects}
            completedProjects={completedProjects}
            conversationCount={conversations.length}
            isLoading={isLoading}
            currentProject={currentProject}
          />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Projects & Actions */}
            <div className="lg:col-span-2 space-y-8">
              <RecentProjects projects={projects} isLoading={isLoading} />
              <QuickActions />
            </div>

            {/* Right Column - Activity & Revenue */}
            <div className="space-y-8">
              <RevenueChart contracts={contracts} isLoading={isLoading} />
              <ActivityFeed conversations={conversations} isLoading={isLoading} />
            </div>
          </div>

          {/* Enhanced Project Overview */}
          {currentProject && (
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-600" />
                  Current Project: {currentProject.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Project Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Business Concept:</span>
                        <span className={`text-sm font-medium ${currentProject?.data?.dreamStatement ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentProject?.data?.dreamStatement ? '✓ Complete' : '○ Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Market Analysis:</span>
                        <span className={`text-sm font-medium ${currentProject?.data?.marketData ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentProject?.data?.marketData ? '✓ Complete' : '○ Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Features Defined:</span>
                        <span className={`text-sm font-medium ${currentProject?.data?.clarificationData?.features?.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentProject?.data?.clarificationData?.features?.length > 0 ? '✓ Complete' : '○ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                    <div className="space-y-1 text-sm">
                      {!currentProject?.data?.dreamStatement && (
                        <Link to={createPageUrl("CoFounderWorkspace")} className="block text-blue-600 hover:text-blue-700">
                          → Define your business concept
                        </Link>
                      )}
                      {currentProject?.data?.dreamStatement && !currentProject?.data?.marketData && (
                        <Link to={createPageUrl("BusinessValidation")} className="block text-blue-600 hover:text-blue-700">
                          → Validate your market
                        </Link>
                      )}
                      {currentProject?.data?.marketData && !currentProject?.data?.clarificationData && (
                        <Link to={createPageUrl("ClarificationEngine")} className="block text-blue-600 hover:text-blue-700">
                          → Define your features
                        </Link>
                      )}
                      {currentProject?.data?.clarificationData && (
                        <Link to={createPageUrl("CTOStudio")} className="block text-blue-600 hover:text-blue-700">
                          → Generate your app
                        </Link>
                      )}
                      {calculateProjectProgress(currentProject) === 100 && (
                        <span className="block text-gray-500">All core steps completed!</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => setShowProjectManager(true)}>
                        <Folder className="w-3 h-3 mr-2" />
                        Switch Project
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Download className="w-3 h-3 mr-2" />
                        Export Project
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revolutionary Features Showcase */}
          <Card className="border-0 bg-gradient-to-r from-gray-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Revolutionary Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">VoiceBotics AI</h3>
                  <p className="text-sm text-gray-600">Natural business conversations</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Smart Validation</h3>
                  <p className="text-sm text-gray-600">Intelligent market analysis</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Smart Contracts</h3>
                  <p className="text-sm text-gray-600">Automated revenue sharing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Code className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Professional Editor</h3>
                  <p className="text-sm text-gray-600">VS Code-level experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Manager Modal */}
      <ProjectManager
        currentProject={currentProject}
        onProjectChange={(project) => {
          setCurrentProject(project);
          if (project) {
            sessionStorage.setItem('currentProjectId', project.id);
          } else {
            sessionStorage.removeItem('currentProjectId');
          }
          setShowProjectManager(false);
          loadDashboardData();
        }}
        onNewProject={() => {
          setShowProjectManager(false);
          window.location.href = createPageUrl("CoFounderWorkspace"); 
        }}
        onDeleteProject={() => {
          setCurrentProject(null);
          sessionStorage.removeItem('currentProjectId');
          loadDashboardData();
        }}
        isVisible={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />
    </>
  );
}
