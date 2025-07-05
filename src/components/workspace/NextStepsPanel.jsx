
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Search, 
  Wrench, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Lightbulb,
  Users,
  Heart,
  Brain,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

const Insight = ({ icon: Icon, text, color, count }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-100"
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-800">{text}</span>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-2 text-xs">{count}</Badge>
      )}
    </div>
  </motion.div>
);

export default function NextStepsPanel({ dreamStatement, mindMapData, sessionSummary }) {
  const dreamElements = mindMapData.nodes.filter(n => n.type === 'vision');
  const userPersonas = mindMapData.nodes.filter(n => n.type === 'market');
  const solutionIdeas = mindMapData.nodes.filter(n => n.type === 'product');

  const isReadyForValidation = sessionSummary.readyForValidation;
  const hasSubstantialContent = dreamElements.length > 0 || userPersonas.length > 0 || solutionIdeas.length > 1;

  // Save data for Business Validation continuity
  React.useEffect(() => {
    if (dreamStatement && mindMapData) {
      const workspaceData = {
        dreamStatement,
        mindMapData,
        sessionSummary,
        timestamp: new Date().toISOString()
      };
      
      // Save to sessionStorage for immediate use
      sessionStorage.setItem('foundersWorkspaceData', JSON.stringify(workspaceData));
      
      // Also save to localStorage as backup
      localStorage.setItem('foundersWorkspaceData', JSON.stringify(workspaceData));
    }
  }, [dreamStatement, mindMapData, sessionSummary]);

  const handleValidationClick = () => {
    // Ensure data is saved before navigation
    if (dreamStatement && mindMapData) {
      const workspaceData = {
        dreamStatement,
        mindMapData,
        sessionSummary,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('foundersWorkspaceData', JSON.stringify(workspaceData));
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm flex flex-col">
      <CardHeader className="border-b border-gray-100/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          AI Handoff Zone
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Your AI Co-Founder tracks progress and guides you to the next strategic step.
        </p>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Session Progress
          </h3>
          <div className="space-y-3">
            {dreamStatement ? (
              <Insight 
                icon={CheckCircle} 
                text={`Vision: "${dreamStatement.substring(0, 50)}${dreamStatement.length > 50 ? '...' : ''}"`}
                color="bg-emerald-500"
              />
            ) : (
              <Insight 
                icon={AlertTriangle} 
                text="Core vision still being defined..."
                color="bg-gray-400"
              />
            )}
            
            <Insight 
              icon={Heart} 
              text="Vision Elements identified" 
              color="bg-pink-500"
              count={sessionSummary.dreamElements}
            />
            
            <Insight 
              icon={Users} 
              text="Market Insights identified" 
              color="bg-emerald-500"
              count={sessionSummary.userPersonas}
            />
            
            <Insight 
              icon={Lightbulb} 
              text="Product Ideas captured" 
              color="bg-purple-500"
              count={sessionSummary.generalIdeas}
            />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className={`p-6 rounded-2xl transition-all ${
            isReadyForValidation 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-50 border-2 border-dashed border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isReadyForValidation ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {isReadyForValidation ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <Brain className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${
                  isReadyForValidation ? 'text-white' : 'text-gray-900'
                }`}>
                  {isReadyForValidation ? 'Ready for Market Validation!' : 'Keep Building Your Vision'}
                </h3>
                <p className={`text-sm ${
                  isReadyForValidation ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {isReadyForValidation 
                    ? "Your concept is organized and ready for strategic market analysis." 
                    : "Share more details with your AI Co-Founder to unlock validation."
                  }
                </p>
              </div>
            </div>

            <p className={`text-sm mb-4 ${
              isReadyForValidation ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {isReadyForValidation 
                ? "Take your organized business concept to our AI Market Strategist for competitor analysis, market sizing, and validation scoring."
                : "Continue your conversation above. The AI will automatically organize your ideas and determine when you're ready for market validation."
              }
            </p>

            <Link to={createPageUrl("BusinessValidation")} onClick={handleValidationClick}>
              <Button
                disabled={!isReadyForValidation}
                className={`w-full gap-2 transition-all ${
                  isReadyForValidation 
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Go to Business Validation Zone
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>

          {/* AI Tip */}
          {!isReadyForValidation && hasSubstantialContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">AI Co-Founder Tip</p>
                  <p className="text-sm text-blue-700">
                    You're making great progress! Try asking about your target users or potential solutions to help me understand your vision better.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
