import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  Brain,
  Zap
} from "lucide-react";
import { format } from "date-fns";

const getActivityIcon = (type) => {
  switch (type) {
    case 'conversation':
      return MessageCircle;
    case 'validation':
      return Brain;
    case 'completion':
      return CheckCircle;
    case 'contract':
      return Zap;
    default:
      return Activity;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'conversation':
      return 'text-blue-500';
    case 'validation':
      return 'text-emerald-500';
    case 'completion':
      return 'text-purple-500';
    case 'contract':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

const ActivityItem = ({ activity, index }) => {
  const Icon = getActivityIcon(activity.type);
  const colorClass = getActivityColor(activity.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className={`p-2 rounded-full bg-gray-100 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{activity.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ActivityFeed({ conversations, isLoading }) {
  // Transform conversations into activity items
  const activities = conversations.map(conv => ({
    id: conv.id,
    type: conv.business_validation_requested ? 'validation' : 'conversation',
    title: conv.founder_type === 'business' ? 'Business Validation Session' : 'AI Conversation Started',
    description: `${conv.founder_type} founder session with ${conv.conversation_history?.length || 0} messages`,
    timestamp: format(new Date(conv.created_date), 'MMM d, h:mm a')
  }));

  // Add some sample activities for better UX
  const sampleActivities = [
    {
      id: 'sample-1',
      type: 'completion',
      title: 'Project Deployment Complete',
      description: 'TaskMaster Pro successfully deployed to production',
      timestamp: '2 hours ago'
    },
    {
      id: 'sample-2',
      type: 'contract',
      title: 'Smart Contract Activated',
      description: 'Revenue sharing contract deployed for new project',
      timestamp: '4 hours ago'
    }
  ];

  const allActivities = [...activities, ...sampleActivities].slice(0, 8);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : allActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600">Your activity will appear here as you use the platform</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allActivities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}