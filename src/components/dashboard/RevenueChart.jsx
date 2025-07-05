import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

export default function RevenueChart({ contracts, isLoading }) {
  // Generate sample revenue data for the chart
  const revenueData = [
    { month: 'Jan', revenue: 2400, projects: 3 },
    { month: 'Feb', revenue: 3200, projects: 4 },
    { month: 'Mar', revenue: 4800, projects: 6 },
    { month: 'Apr', revenue: 6400, projects: 8 },
    { month: 'May', revenue: 8200, projects: 10 },
    { month: 'Jun', revenue: 12400, projects: 12 }
  ];

  const totalRevenue = contracts.reduce((sum, contract) => sum + (contract.revenue_tracked || 0), 0);
  const monthlyGrowth = '+24.5%';

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Revenue Analytics
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span>{monthlyGrowth} growth</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total revenue generated</p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Active Contracts</p>
                  <p className="font-semibold text-gray-900">{contracts.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Revenue</p>
                  <p className="font-semibold text-gray-900">
                    ${contracts.length > 0 ? (totalRevenue / contracts.length).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}