import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Users, Wrench, TrendingUp } from "lucide-react";
import MindMapNode from "../workspace/MindMapNode";

const workspaceConfig = {
  vision: { label: "Vision", icon: Target, color: "text-blue-600" },
  market: { label: "Market", icon: Users, color: "text-emerald-600" },
  product: { label: "Product", icon: Wrench, color: "text-purple-600" },
  milestones: { label: "Milestones", icon: TrendingUp, color: "text-orange-600" },
};

export default function GlobalWorkspacePanel({ mindMapData }) {
    const nodesBySection = React.useMemo(() => {
        const grouped = { vision: [], market: [], product: [], milestones: [] };
        (mindMapData?.nodes || []).forEach(node => {
            if (grouped[node.type]) {
                grouped[node.type].push(node);
            } else {
                grouped['product'].push(node);
            }
        });
        return grouped;
    }, [mindMapData?.nodes]);

    return (
        <div className="bg-white/80 backdrop-blur-lg border-l border-gray-100/80 flex flex-col h-full">
            <div className="p-6 border-b border-gray-100/80">
                <h2 className="text-xl font-bold text-gray-900 display-text flex items-center gap-2">
                    <Brain className="w-5 h-5 text-violet-600" />
                    MyDream Workspace
                </h2>
                <p className="text-sm text-gray-500">Your living business canvas.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {(mindMapData?.nodes?.length || 0) === 0 ? (
                    <div className="text-center text-gray-500 pt-16">
                        <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="font-semibold">Your workspace is ready.</p>
                        <p className="text-sm">As you chat with your AI co-founder, your ideas will be organized and appear here automatically.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(nodesBySection).map(([sectionKey, nodes]) => {
                            if (nodes.length === 0) return null;
                            const section = workspaceConfig[sectionKey];
                            const Icon = section.icon;
                            return (
                                <div key={sectionKey}>
                                    <h3 className={`font-bold text-lg mb-3 flex items-center gap-2 ${section.color}`}>
                                        <Icon className="w-5 h-5" />
                                        {section.label}
                                    </h3>
                                    <div className="space-y-3">
                                        {nodes.map((node, index) => (
                                            <MindMapNode
                                                key={node.id}
                                                node={node}
                                                index={index}
                                                sectionType={sectionKey}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}