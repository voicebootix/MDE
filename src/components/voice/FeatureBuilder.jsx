import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  X, 
  Clock, 
  Star, 
  AlertCircle,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FeatureCard = ({ feature, onUpdateStatus }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "core": return "bg-red-100 text-red-800 border-red-200";
      case "nice-to-have": return "bg-blue-100 text-blue-800 border-blue-200";
      case "to-be-validated": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "border-l-green-500 bg-green-50";
      case "rejected": return "border-l-red-500 bg-red-50";
      case "later": return "border-l-yellow-500 bg-yellow-50";
      default: return "border-l-gray-300 bg-white";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "core": return <Star className="w-4 h-4" />;
      case "nice-to-have": return <Target className="w-4 h-4" />;
      case "to-be-validated": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`border-l-4 rounded-lg p-4 mb-3 transition-all ${getStatusColor(feature.status)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{feature.name}</h3>
            <Badge className={`text-xs ${getCategoryColor(feature.category)}`}>
              <span className="flex items-center gap-1">
                {getCategoryIcon(feature.category)}
                {feature.category.replace('-', ' ')}
              </span>
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={feature.status === 'approved' ? 'default' : 'outline'}
              onClick={() => onUpdateStatus(feature.id, 'approved')}
              className={`gap-1 ${feature.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              <CheckCircle className="w-3 h-3" />
              Approve
            </Button>
            
            <Button
              size="sm"
              variant={feature.status === 'later' ? 'default' : 'outline'}
              onClick={() => onUpdateStatus(feature.id, 'later')}
              className={`gap-1 ${feature.status === 'later' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
            >
              <Clock className="w-3 h-3" />
              Later
            </Button>
            
            <Button
              size="sm"
              variant={feature.status === 'rejected' ? 'default' : 'outline'}
              onClick={() => onUpdateStatus(feature.id, 'rejected')}
              className={`gap-1 ${feature.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              <X className="w-3 h-3" />
              Reject
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function FeatureBuilder({ features, onUpdateFeatureStatus }) {
  const coreFeatures = features.filter(f => f.category === 'core');
  const niceToHaveFeatures = features.filter(f => f.category === 'nice-to-have');
  const toBeValidatedFeatures = features.filter(f => f.category === 'to-be-validated');

  return (
    <div className="p-6 h-full overflow-y-auto">
      {features.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No features extracted yet</h3>
          <p className="text-gray-600">
            Start describing your product idea in the conversation, and I'll extract features automatically
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Core Features */}
          {coreFeatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Core Features</h3>
                <Badge variant="outline">{coreFeatures.length}</Badge>
              </div>
              <AnimatePresence>
                {coreFeatures.map(feature => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onUpdateStatus={onUpdateFeatureStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Nice-to-Have Features */}
          {niceToHaveFeatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Nice-to-Have Features</h3>
                <Badge variant="outline">{niceToHaveFeatures.length}</Badge>
              </div>
              <AnimatePresence>
                {niceToHaveFeatures.map(feature => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onUpdateStatus={onUpdateFeatureStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* To Be Validated Features */}
          {toBeValidatedFeatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-900">To Be Validated</h3>
                <Badge variant="outline">{toBeValidatedFeatures.length}</Badge>
              </div>
              <AnimatePresence>
                {toBeValidatedFeatures.map(feature => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onUpdateStatus={onUpdateFeatureStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Summary */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Feature Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {features.filter(f => f.status === 'approved').length}
                  </div>
                  <div className="text-gray-600">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {features.filter(f => f.status === 'later').length}
                  </div>
                  <div className="text-gray-600">Later</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {features.filter(f => f.status === 'rejected').length}
                  </div>
                  <div className="text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}