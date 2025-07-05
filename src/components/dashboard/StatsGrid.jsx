import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Activity, 
  CheckCircle, 
  MessageCircle, 
  TrendingUp 
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, isLoading, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && (
              <div className="flex items-center text-sm text-emerald-600 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function StatsGrid({ 
  totalRevenue, 
  activeProjects, 
  completedProjects, 
  conversationCount, 
  isLoading 
}) {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      trend: "+12.3% this month"
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Activity,
      color: "bg-blue-500",
      trend: "+5 new this week"
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      icon: CheckCircle,
      color: "bg-purple-500",
      trend: "100% success rate"
    },
    {
      title: "AI Conversations",
      value: conversationCount,
      icon: MessageCircle,
      color: "bg-orange-500",
      trend: "+8 today"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          isLoading={isLoading}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}