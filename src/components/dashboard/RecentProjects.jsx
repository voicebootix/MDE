
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Code, 
  Github, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  Play,
  MessageCircle,
  Lightbulb // Added Lightbulb import
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  planning: "bg-gray-100 text-gray-800",
  building: "bg-blue-100 text-blue-800",
  debugging: "bg-orange-100 text-orange-800",
  deploying: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800"
};

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{project.project_name}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(project.created_date), 'MMM d, yyyy')}
        </p>
      </div>
      <Badge className={statusColors[project.status]}>
        {project.status}
      </Badge>
    </div>
    
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {project.technology_stack?.slice(0, 3).map((tech, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
        {project.technology_stack?.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{project.technology_stack.length - 3} more
          </Badge>
        )}
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <Link to={createPageUrl("CodeEditor", `?project=${project.id}`)}>
        <Button size="sm" variant="outline" className="gap-1">
          <Code className="w-3 h-3" />
          Edit
        </Button>
      </Link>
      {project.github_repo_url && (
        <a 
          href={project.github_repo_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button size="sm" variant="outline" className="gap-1">
            <Github className="w-3 h-3" />
            Repo
          </Button>
        </a>
      )}
      {project.deployment_url && (
        <a 
          href={project.deployment_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
            <Play className="w-3 h-3" />
            Live
          </Button>
        </a>
      )}
    </div>
  </motion.div>
);

export default function RecentProjects({ projects, isLoading }) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Recent Projects
        </CardTitle>
        <Link to={createPageUrl("CoFounderWorkspace")}>
          <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700">
            New Project
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Begin your journey by defining your business idea.</p>
            <Link to={createPageUrl("CoFounderWorkspace")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Lightbulb className="w-4 h-4 mr-2" />
                Start Building Your Idea
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
