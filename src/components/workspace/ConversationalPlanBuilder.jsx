import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, TrendingUp, Users, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const PlanSection = ({ title, icon: Icon, content, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="prose prose-lg max-w-none text-gray-700 bg-white p-6 rounded-lg border">
      {content ? (
        <p>{content}</p>
      ) : (
        <p className="text-gray-500 italic">This section hasn't been generated yet. Discuss this topic with your AI Co-Founder to build it out.</p>
      )}
    </div>
  </motion.div>
);

export default function ConversationalPlanBuilder({ businessPlan, onUpdatePlan }) {

  const planStructure = [
    { id: 'executiveSummary', title: 'Executive Summary', icon: Lightbulb, content: businessPlan?.executiveSummary },
    { id: 'marketAnalysis', title: 'Market Analysis', icon: TrendingUp, content: businessPlan?.marketAnalysis },
    { id: 'customerSegments', title: 'Customer Segments', icon: Users, content: businessPlan?.customerSegments },
    { id: 'productStrategy', title: 'Product & Service Strategy', icon: Wrench, content: businessPlan?.productStrategy },
  ];

  return (
    <Card className="h-full border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
      <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-blue-50/30">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900">Conversational Business Plan</span>
            <p className="text-sm text-gray-500 font-normal mt-1">Your comprehensive business plan, built through dialogue.</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 flex-1 overflow-y-auto">
        {!businessPlan ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Your Business Plan is Ready to Grow</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                Use the chat at the bottom of the screen to discuss your business. Your AI Co-Founder will automatically populate this plan as you define your vision.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {planStructure.map((section, index) => (
              <PlanSection 
                key={section.id}
                title={section.title}
                icon={section.icon}
                content={section.content}
                delay={index * 0.15}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}