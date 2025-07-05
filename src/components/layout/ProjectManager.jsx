
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Folder, 
  Trash2, 
  Check,
  X,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function ProjectManager({ 
  currentProject, 
  onProjectChange, 
  isVisible,
  onClose 
}) {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const storedProjects = localStorage.getItem('userProjects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const saveProjects = (updatedProjects) => {
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const generateProjectId = () => {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const clearAllProjectData = () => {
    // Clear all session storage completely
    sessionStorage.clear();
    
    // Clear all localStorage project data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('validation') || 
          key.startsWith('clarification') || 
          key.startsWith('project_') ||
          key.startsWith('conversationHistory') ||
          key.includes('Data')) {
        localStorage.removeItem(key);
      }
    });
  };

  const createNewProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: generateProjectId(),
      name: newProjectName.trim(),
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      progress: {
        coFounderWorkspace: 0,
        businessValidation: 0,
        clarificationEngine: 0,
        ctoStudio: 0,
        overall: 0
      },
      data: {
        dreamStatement: "",
        mindMapData: { nodes: [], connections: [] },
        businessCanvas: null,
        businessPlan: null,
        ideaEvolution: [],
        marketData: null,
        competitorData: null,
        clarificationData: null,
        validationScore: 0
      }
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    
    // Switch to new project. The reload will handle loading the fresh state.
    switchToProject(newProject);
    
    setIsCreating(false);
    setNewProjectName("");
  };

  const switchToProject = (project) => {
    // Set new project as current
    sessionStorage.setItem('currentProjectId', project.id);
    
    // Update project's last modified date
    const updatedProjects = projects.map(p => 
      p.id === project.id 
        ? { ...p, lastModified: new Date().toISOString() }
        : p
    );
    saveProjects(updatedProjects);
    
    // Notify parent component
    onProjectChange?.(project);
    
    // Trigger page refresh to load new project data
    window.location.reload();
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    
    // Clear data for deleted project (if any specific keys are tied to its ID)
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes(projectId)) { // This specifically targets keys containing the deleted project's ID
        localStorage.removeItem(key);
      }
    });
    
    // If deleting current project, clear everything and reload to a fresh state
    if (currentProject?.id === projectId) {
      clearAllProjectData(); // This clears the data for the just-deleted current project
      onProjectChange?.(null);
      window.location.reload();
    }
    
    setProjectToDelete(null);
  };

  const calculateProgress = (project) => {
    const data = project.data;
    let totalProgress = 0;

    if (data.dreamStatement) totalProgress += 25;
    if (data.mindMapData?.nodes?.length > 0) totalProgress += 25;
    if (data.marketData) totalProgress += 20;
    if (data.competitorData) totalProgress += 20;
    if (data.clarificationData?.features?.length > 0) totalProgress += 10;

    return Math.min(100, totalProgress);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Manager</h2>
                <p className="text-sm text-gray-500">Manage your AI Co-Founder projects</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6">
            {/* Create New Project */}
            <div className="mb-6">
              {!isCreating ? (
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Start New Project
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && createNewProject()}
                    autoFocus
                  />
                  <Button onClick={createNewProject} disabled={!newProjectName.trim()}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => { setIsCreating(false); setNewProjectName(""); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Projects List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-500">Create your first AI Co-Founder project to get started</p>
                </div>
              ) : (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          {currentProject?.id === project.id && (
                            <Badge className="bg-green-100 text-green-800">Current</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {format(new Date(project.createdDate), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Modified: {format(new Date(project.lastModified), 'MMM d, yyyy')}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium text-gray-700">
                              {calculateProgress(project)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(project)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.data.dreamStatement && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Business Concept ✓
                            </Badge>
                          )}
                          {project.data.marketData && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Market Analysis ✓
                            </Badge>
                          )}
                          {project.data.clarificationData?.features?.length > 0 && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                              Features Defined ✓
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {currentProject?.id !== project.id && (
                          <Button
                            size="sm"
                            onClick={() => switchToProject(project)}
                            className="gap-1"
                          >
                            <Folder className="w-3 h-3" />
                            Open
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setProjectToDelete(project.id)}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {projectToDelete && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete Project</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this project? All data will be permanently removed.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setProjectToDelete(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => deleteProject(projectToDelete)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
