
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input"; // Assuming Input might be needed for project creation
import {
  Send,
  User,
  Bot,
  Loader2,
  Mic,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Target,
  Lightbulb,
  Folder, // Added Folder icon
  PlusCircle, // Added for new project
  Trash2, // Added for delete project
  Check, // Added for select project
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import VoiceInterface from "../voice/VoiceInterface";

const MessageBubble = ({ message, index, isCompact }) => {
  const isUser = message.role === 'user';
  const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
  const messageDate = new Date(message.timestamp);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-6 h-6">
          <AvatarFallback className={isUser ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}>
            {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
          </AvatarFallback>
        </Avatar>
        <div className={`rounded-lg px-3 py-2 ${
          isUser 
            ? 'bg-violet-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-800'
        }`}>
          <div className={isCompact ? 'text-sm' : 'text-sm'}>{message.content}</div>
          {message.navigationSuggestion && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <Link to={createPageUrl(message.navigationSuggestion)}>
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  Go to {message.navigationSuggestion}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          )}
          {message.readinessScores && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div className="text-xs text-gray-600 mb-1">Readiness Update:</div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(message.readinessScores).map(([key, value]) => {
                  if (key === 'overallReadiness') return null;
                  return (
                    <div key={key} className="text-xs">
                      <div className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className={value >= 90 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'}>
                          {value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {isValidDate(messageDate) ? format(messageDate, 'HH:mm') : 'now'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-3 flex justify-start"
  >
    <div className="flex gap-2">
      <Avatar className="w-6 h-6">
        <AvatarFallback className="bg-blue-100 text-blue-700">
          <Bot className="w-3 h-3" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const QuestionnairePanel = ({ questionnaire, onResponse, onDismiss }) => {
  const [responses, setResponses] = useState({});
  
  const handleSubmit = () => {
    onResponse(responses);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <Target className="w-4 h-4" />
          {questionnaire.title}
        </h3>
        <Button size="sm" variant="ghost" onClick={onDismiss}>
          ✕
        </Button>
      </div>
      <p className="text-sm text-blue-700 mb-4">{questionnaire.description}</p>
      
      <div className="space-y-3">
        {questionnaire.questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {index + 1}. {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.type === 'text' && (
              <Textarea
                className="text-sm"
                placeholder="Your answer..."
                value={responses[question.id] || ''}
                onChange={(e) => setResponses(prev => ({
                  ...prev,
                  [question.id]: e.target.value
                }))}
              />
            )}
            
            {question.type === 'choice' && question.options && (
              <div className="flex flex-wrap gap-2">
                {question.options.map(option => (
                  <Button
                    key={option}
                    size="sm"
                    variant={responses[question.id] === option ? "default" : "outline"}
                    onClick={() => setResponses(prev => ({
                      ...prev,
                      [question.id]: option
                    }))}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            
            {question.type === 'scale' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={responses[question.id] || 5}
                  onChange={(e) => setResponses(prev => ({
                    ...prev,
                    [question.id]: parseInt(e.target.value)
                  }))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500">10</span>
                <span className="ml-2 font-medium">{responses[question.id] || 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button size="sm" variant="outline" onClick={onDismiss}>
          Skip for now
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          Submit Responses
        </Button>
      </div>
    </motion.div>
  );
};

const ProjectManager = ({ currentProject, onProjectChange, onNewProject, onDeleteProject, isVisible, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      setProjects(storedProjects);
    } catch (e) {
      console.error("Failed to parse projects from localStorage", e);
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userProjects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }
    const newProject = { id: Date.now().toString(), name: newProjectName.trim() };
    setProjects(prev => [...prev, newProject]);
    setNewProjectName("");
    setError("");
    handleSelectProject(newProject);
    onNewProject(); // Notify parent that a new project was created
  };

  const handleSelectProject = (project) => {
    sessionStorage.setItem('currentProjectId', project.id);
    onProjectChange(project);
    onClose(); // Close modal after selection
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject && currentProject.id === projectId) {
      sessionStorage.removeItem('currentProjectId');
      onDeleteProject(); // Notify parent that current project was deleted
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600" />
            Your Projects
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => {
                setNewProjectName(e.target.value);
                if (error) setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddProject();
              }}
            />
            <Button onClick={handleAddProject} className="flex-shrink-0">
              <PlusCircle className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects yet. Add one above!</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    currentProject && currentProject.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${currentProject && currentProject.id === project.id ? 'text-blue-700' : 'text-gray-800'}`}>
                    {project.name}
                  </span>
                  <div className="flex gap-1">
                    {currentProject && currentProject.id === project.id ? (
                      <Badge className="bg-blue-500 hover:bg-blue-500 cursor-default">
                        <Check className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSelectProject(project)}>
                        Select <Check className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export default function HorizontalChatPanel({ 
  conversationHistory, 
  isProcessing, 
  onSendMessage,
  userInput,
  setUserInput,
  isRecording,
  onToggleRecording,
  isExpanded,
  onToggleExpanded,
  currentPageContext,
  progressData,
  dreamStatement,
  mindMapNodeCount,
  activeQuestionnaire,
  onQuestionnaireResponse
}) {
  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Load current project info
  useEffect(() => {
    const projectId = sessionStorage.getItem('currentProjectId');
    if (projectId) {
      try {
        const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
        const project = projects.find(p => p.id === projectId);
        setCurrentProject(project || null); // Ensure it's null if not found
      } catch (error) {
        console.error('Error loading current project:', error);
        setCurrentProject(null);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(inactivityTimerRef.current);
      if (isExpanded) {
        inactivityTimerRef.current = setTimeout(() => {
          onToggleExpanded(false);
        }, 45000); // Extended to 45 seconds for questionnaires
      }
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearTimeout(inactivityTimerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [isExpanded, onToggleExpanded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  const handleSendMessage = () => {
    if (!userInput.trim() || isProcessing) return;
    onSendMessage(userInput);
    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputFocus = () => {
    if (!isExpanded) {
      onToggleExpanded(true);
    }
  };

  const getStageReadiness = () => {
    const stage = progressData.currentStage;
    const scores = progressData.readinessScores || {};
    
    switch (stage) {
      case 'ideation': return scores.businessConcept || 0;
      case 'validation': return scores.marketValidation || 0;
      case 'clarification': return scores.featureClarification || 0;
      case 'development': return scores.technicalReadiness || 0;
      default: return scores.overallReadiness || 0;
    }
  };

  const stageReadiness = getStageReadiness();

  return (
    <>
      <div className="fixed bottom-0 left-64 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50">
        {/* Enhanced Progress & Stage Info Header */}
        <div className="px-4 py-2 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {progressData.currentStageTitle}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Progress value={stageReadiness} className="w-20 h-2" />
                <span className={`text-xs font-medium ${
                  stageReadiness >= 90 ? 'text-green-600' :
                  stageReadiness >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stageReadiness}%
                </span>
              </div>

              {dreamStatement && (
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-gray-600 truncate max-w-40">
                    {dreamStatement}
                  </span>
                </div>
              )}

              {/* Current Project Display */}
              {currentProject && (
                <div className="flex items-center gap-2 ml-4"> {/* Added ml-4 for spacing */}
                  <Folder className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-gray-600 truncate max-w-32">
                    {currentProject.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {mindMapNodeCount} insights
              </Badge>
              
              {/* Project Manager Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowProjectManager(true)}
                className="gap-1 text-xs"
              >
                <Folder className="w-3 h-3" />
                Projects
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleExpanded(!isExpanded)}
                className="gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Messages - Show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 300 }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="h-72 overflow-y-auto p-4 bg-gray-50/50">
                {/* Active Questionnaire */}
                {activeQuestionnaire && (
                  <QuestionnairePanel
                    questionnaire={activeQuestionnaire}
                    onResponse={onQuestionnaireResponse}
                    onDismiss={() => onQuestionnaireResponse({})}
                  />
                )}
                
                {/* Readiness Alert */}
                {stageReadiness < 70 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">
                        More Information Needed
                      </div>
                      <div className="text-xs text-yellow-700">
                        Let's gather more details to ensure perfect results. Tell me more about your vision!
                      </div>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {conversationHistory.slice(-8).map((message, index) => (
                    <MessageBubble key={`${message.timestamp}-${index}`} message={message} index={index} isCompact={!isExpanded} />
                  ))}
                  {isProcessing && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Chat Input - Always visible */}
        <div className="p-4 bg-white">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={handleInputFocus}
                placeholder={`Tell me more about your ${currentPageContext.toLowerCase()} vision...`}
                className="min-h-[60px] max-h-[120px] resize-none border-gray-300 focus:border-violet-500 focus:ring-violet-500 pr-12"
                disabled={isProcessing}
              />
              <div className="absolute top-2 right-2">
                <VoiceInterface
                  isRecording={isRecording}
                  onToggleRecording={onToggleRecording}
                  onTranscription={(text) => setUserInput(prev => prev + " " + text)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!userInput.trim() || isProcessing} 
              className="gap-2 bg-violet-600 hover:bg-violet-700 h-[60px] px-6"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isProcessing ? 'Processing...' : 'Send'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Manager Modal */}
      <ProjectManager
        currentProject={currentProject}
        onProjectChange={setCurrentProject}
        onNewProject={() => {
            setCurrentProject(prev => { // Attempt to fetch the newly created project if any
              const projectId = sessionStorage.getItem('currentProjectId');
              if (projectId) {
                const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
                return projects.find(p => p.id === projectId) || null;
              }
              return prev;
            });
            setShowProjectManager(false);
        }}
        onDeleteProject={() => setCurrentProject(null)}
        isVisible={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />
    </>
  );
}
