
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Users, Wrench, TrendingUp, Brain, Lightbulb, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MindMapNode from "./MindMapNode";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";

const workspaceConfig = {
  vision: {
    label: "Vision & Mission",
    icon: Target,
    color: "text-blue-600",
    description: "Your why - the problem you're solving and your purpose",
    prompt: "What's your core mission? What problem are you passionate about solving?"
  },
  market: {
    label: "Market & Customers",
    icon: Users,
    color: "text-emerald-600",
    description: "Who you're building for and what they need",
    prompt: "Who are your ideal customers? What are their biggest pain points?"
  },
  product: {
    label: "Product Features",
    icon: Wrench,
    color: "text-purple-600",
    description: "What you're building and how it works",
    prompt: "What are the key features your customers need most?"
  },
  milestones: {
    label: "Next Milestones",
    icon: TrendingUp,
    color: "text-orange-600",
    description: "Clear next steps to move forward",
    prompt: "What are the most important things to tackle first?"
  }
};

const workspaceOrder = ['vision', 'market', 'product', 'milestones'];

export default function MindMapWorkspace({ mindMapData, onUpdateMindMap, sessionSummary }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState("product");

  const nodesBySection = useMemo(() => {
    const grouped = {};
    workspaceOrder.forEach(section => grouped[section] = []);

    (mindMapData?.nodes || []).forEach(node => {
      // Map old types to new workspace sections
      let sectionKey = node.type;
      if (node.type === 'dream') sectionKey = 'vision';
      if (node.type === 'user') sectionKey = 'market';
      if (node.type === 'idea') sectionKey = 'product';

      if (grouped[sectionKey]) {
        grouped[sectionKey].push(node);
      } else {
        // Default to product if unknown type
        grouped['product'].push(node);
      }
    });
    return grouped;
  }, [mindMapData?.nodes]);

  const addNode = () => {
    if (!newNodeLabel.trim()) return;

    const newNode = {
      id: `node-${Date.now()}`,
      label: newNodeLabel,
      type: newNodeType,
      description: ""
    };

    onUpdateMindMap({
      ...mindMapData,
      nodes: [...(mindMapData?.nodes || []), newNode],
    });

    setNewNodeLabel("");
    setIsEditing(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColKey = source.droppableId;
    const destColKey = destination.droppableId;

    const newNodes = [...(mindMapData?.nodes || [])];
    const sourceNodes = nodesBySection[sourceColKey];
    const draggedNode = sourceNodes[source.index];

    // Update node type if moved to different section
    if (sourceColKey !== destColKey) {
      const nodeIndex = newNodes.findIndex(n => n.id === draggedNode.id);
      if (nodeIndex !== -1) {
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], type: destColKey };
      }
    }

    onUpdateMindMap({ ...mindMapData, nodes: newNodes });
  };

  return (
    <Card className="h-full border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
      <CardHeader className="border-b border-gray-100/50 flex-shrink-0 bg-gradient-to-r from-white to-blue-50/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="display-text text-2xl font-bold text-gray-900">🚀 Founder's Workspace</span>
              <p className="text-sm text-gray-500 font-normal mt-1">Your AI Co-Founder organizes your startup as you talk</p>
            </div>
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2 hover:bg-blue-50/50 hover:border-blue-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 space-y-4 shadow-sm">
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 border border-gray-200/80 rounded-lg text-sm bg-white/80 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(workspaceConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <Button
                        key={key}
                        size="sm"
                        variant={newNodeType === key ? 'default' : 'outline'}
                        onClick={() => setNewNodeType(key)}
                        className={`gap-2 ${newNodeType === key ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-white/80 hover:bg-gray-50'}`}
                      >
                        <Icon className={`w-4 h-4 ${newNodeType === key ? 'text-white' : config.color}`} />
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-3">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={addNode} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <DragDropContext onDragEnd={onDragEnd}>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {(mindMapData?.nodes?.length || 0) === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Brain className="w-20 h-20 text-blue-400 mx-auto mb-6 floating-element" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Startup Canvas Awaits</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Start chatting with your AI Co-Founder about your business idea. I'll automatically organize your thoughts into <strong>Vision</strong>, <strong>Market</strong>, <strong>Product</strong>, and <strong>Milestones</strong> as we talk.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(workspaceConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={key}
                        className="text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 * Object.keys(workspaceConfig).indexOf(key) }}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                          <Icon className={`w-8 h-8 ${config.color}`} />
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">{config.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{config.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8 space-y-8">
              {workspaceOrder.map(sectionKey => {
                const section = workspaceConfig[sectionKey];
                const nodes = nodesBySection[sectionKey] || [];
                const Icon = section.icon;

                return (
                  <motion.div
                    key={sectionKey}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * workspaceOrder.indexOf(sectionKey) }}
                  >
                    <div className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${section.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{section.label}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-sm font-bold px-3 py-1">{nodes.length}</Badge>
                    </div>

                    <Droppable droppableId={sectionKey}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-4 rounded-2xl transition-all duration-300 p-4 min-h-[150px] ${
                            snapshot.isDraggingOver ? 'bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-2 border-dashed border-blue-300 shadow-inner' : 'bg-transparent'
                          }`}
                        >
                          {nodes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AnimatePresence>
                                {nodes.map((node, index) => (
                                  <Draggable key={node.id} draggableId={node.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`${snapshot.isDragging ? 'transform rotate-2 shadow-2xl scale-105' : ''} transition-all duration-200`}
                                      >
                                        <MindMapNode
                                          node={node}
                                          index={index}
                                          sectionType={sectionKey}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </AnimatePresence>
                            </div>
                          ) : (
                            !snapshot.isDraggingOver && (
                              <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50/30 to-white/50">
                                <div className="text-center">
                                  <Icon className={`w-8 h-8 ${section.color} opacity-40 mx-auto mb-2`} />
                                  <p className="text-xs text-center text-gray-500 font-medium">{section.prompt}</p>
                                </div>
                              </div>
                            )
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </DragDropContext>
    </Card>
  );
}
