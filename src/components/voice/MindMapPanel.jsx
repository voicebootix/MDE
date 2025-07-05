import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Move, 
  Link2, 
  Eye,
  Download,
  RefreshCw,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const MindMapNode = ({ node, onNodeUpdate, onNodeDelete, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.label);

  const getNodeColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'category': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'interaction': return 'bg-green-100 border-green-300 text-green-800';
      case 'data': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleSave = () => {
    onNodeUpdate(node.id, { ...node, label });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setLabel(node.label);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute cursor-pointer transition-all ${getNodeColor(node.type)} ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      style={{ 
        left: node.x, 
        top: node.y,
        minWidth: '120px',
        borderRadius: '8px',
        border: '2px solid',
        padding: '8px 12px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="h-6 text-xs p-1 bg-white"
          autoFocus
        />
      ) : (
        <div className="text-sm font-medium text-center">{node.label}</div>
      )}
      
      <Badge variant="secondary" className="text-xs mt-1 block text-center">
        {node.type}
      </Badge>
      
      {isSelected && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onNodeDelete(node.id);
          }}
          className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </motion.div>
  );
};

const ConnectionLine = ({ connection, nodes }) => {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);
  
  if (!fromNode || !toNode) return null;

  const fromX = fromNode.x + 60; // Center of node
  const fromY = fromNode.y + 20;
  const toX = toNode.x + 60;
  const toY = toNode.y + 20;

  return (
    <g>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="#6b7280"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
      />
      {connection.label && (
        <text
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2}
          fill="#374151"
          fontSize="10"
          textAnchor="middle"
          className="font-medium"
        >
          {connection.label}
        </text>
      )}
    </g>
  );
};

const UserFlowPanel = ({ userFlows, onUpdateFlows }) => {
  const [newFlow, setNewFlow] = useState({ name: '', steps: [''] });

  const addStep = (flowIndex) => {
    const updatedFlows = [...userFlows];
    updatedFlows[flowIndex].steps.push('');
    onUpdateFlows(updatedFlows);
  };

  const updateStep = (flowIndex, stepIndex, value) => {
    const updatedFlows = [...userFlows];
    updatedFlows[flowIndex].steps[stepIndex] = value;
    onUpdateFlows(updatedFlows);
  };

  const removeStep = (flowIndex, stepIndex) => {
    const updatedFlows = [...userFlows];
    updatedFlows[flowIndex].steps.splice(stepIndex, 1);
    onUpdateFlows(updatedFlows);
  };

  const addFlow = () => {
    if (newFlow.name && newFlow.steps[0]) {
      onUpdateFlows([...userFlows, newFlow]);
      setNewFlow({ name: '', steps: [''] });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">User Flows</h4>
      
      {userFlows.map((flow, flowIndex) => (
        <Card key={flowIndex} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">{flow.name}</h5>
              <Button size="sm" variant="ghost" onClick={() => addStep(flowIndex)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {flow.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {stepIndex + 1}
                  </Badge>
                  <Input
                    value={step}
                    onChange={(e) => updateStep(flowIndex, stepIndex, e.target.value)}
                    placeholder="Enter step..."
                    className="flex-1"
                  />
                  {flow.steps.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStep(flowIndex, stepIndex)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add New Flow */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              placeholder="Flow name (e.g., User Registration)"
              value={newFlow.name}
              onChange={(e) => setNewFlow({...newFlow, name: e.target.value})}
            />
            <Input
              placeholder="First step..."
              value={newFlow.steps[0]}
              onChange={(e) => setNewFlow({...newFlow, steps: [e.target.value]})}
            />
            <Button onClick={addFlow} size="sm" className="w-full">
              <Plus className="w-3 h-3 mr-1" />
              Add User Flow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function MindMapPanel({ mindMapData, features, onUpdateMindMap }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState('feature');
  const [viewMode, setViewMode] = useState('mindmap'); // 'mindmap' or 'flows'
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (isAddingNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 60; // Center the node
      const y = e.clientY - rect.top - 20;
      
      const newNode = {
        id: `node_${Date.now()}`,
        label: `New ${newNodeType}`,
        type: newNodeType,
        x,
        y
      };

      const updatedData = {
        ...mindMapData,
        nodes: [...mindMapData.nodes, newNode]
      };
      
      onUpdateMindMap(updatedData);
      setIsAddingNode(false);
    } else {
      setSelectedNodeId(null);
    }
  };

  const handleNodeUpdate = (nodeId, updatedNode) => {
    const updatedNodes = mindMapData.nodes.map(node =>
      node.id === nodeId ? updatedNode : node
    );
    
    onUpdateMindMap({
      ...mindMapData,
      nodes: updatedNodes
    });
  };

  const handleNodeDelete = (nodeId) => {
    const updatedNodes = mindMapData.nodes.filter(node => node.id !== nodeId);
    const updatedConnections = mindMapData.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
    
    onUpdateMindMap({
      ...mindMapData,
      nodes: updatedNodes,
      connections: updatedConnections
    });
    
    setSelectedNodeId(null);
  };

  const addConnection = () => {
    if (selectedNodeId && mindMapData.nodes.length > 1) {
      // Simple connection to the next available node
      const otherNodes = mindMapData.nodes.filter(n => n.id !== selectedNodeId);
      if (otherNodes.length > 0) {
        const newConnection = {
          from: selectedNodeId,
          to: otherNodes[0].id,
          label: 'connects to'
        };

        const updatedData = {
          ...mindMapData,
          connections: [...mindMapData.connections, newConnection]
        };
        
        onUpdateMindMap(updatedData);
      }
    }
  };

  const exportMindMap = () => {
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mind-map.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Mind Map & User Flows</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'mindmap' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mindmap')}
                className="gap-1"
              >
                <MapPin className="w-3 h-3" />
                Mind Map
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'flows' ? 'default' : 'ghost'}
                onClick={() => setViewMode('flows')}
                className="gap-1"
              >
                <Zap className="w-3 h-3" />
                User Flows
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportMindMap}>
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            {viewMode === 'mindmap' && (
              <>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="feature">Feature</option>
                  <option value="category">Category</option>
                  <option value="interaction">Interaction</option>
                  <option value="data">Data Flow</option>
                </select>
                <Button
                  size="sm"
                  onClick={() => setIsAddingNode(!isAddingNode)}
                  variant={isAddingNode ? 'default' : 'outline'}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Node
                </Button>
                {selectedNodeId && (
                  <Button size="sm" variant="outline" onClick={addConnection}>
                    <Link2 className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{mindMapData.nodes.length} nodes</span>
          <span>{mindMapData.connections.length} connections</span>
          <span>{mindMapData.userFlows?.length || 0} user flows</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'mindmap' ? (
          <div className="relative w-full h-full bg-gray-50">
            {isAddingNode && (
              <div className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                Click anywhere to add a {newNodeType} node
              </div>
            )}
            
            <div
              ref={canvasRef}
              className="w-full h-full cursor-crosshair relative overflow-auto"
              onClick={handleCanvasClick}
            >
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6b7280"
                    />
                  </marker>
                </defs>
                {mindMapData.connections.map((connection, index) => (
                  <ConnectionLine
                    key={index}
                    connection={connection}
                    nodes={mindMapData.nodes}
                  />
                ))}
              </svg>

              {/* Nodes */}
              {mindMapData.nodes.map(node => (
                <MindMapNode
                  key={node.id}
                  node={node}
                  onNodeUpdate={handleNodeUpdate}
                  onNodeDelete={handleNodeDelete}
                  isSelected={selectedNodeId === node.id}
                  onSelect={setSelectedNodeId}
                />
              ))}

              {mindMapData.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium mb-2">Empty Mind Map</h4>
                    <p className="text-sm">Click "Add Node" to start building your feature map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 h-full overflow-y-auto">
            <UserFlowPanel
              userFlows={mindMapData.userFlows || []}
              onUpdateFlows={(flows) => onUpdateMindMap({...mindMapData, userFlows: flows})}
            />
          </div>
        )}
      </div>
    </div>
  );
}