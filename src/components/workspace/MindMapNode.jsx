import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Wrench, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const nodeConfig = {
  vision: {
    icon: Target,
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  },
  market: {
    icon: Users,
    color: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  },
  product: {
    icon: Wrench,
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  },
  milestones: {
    icon: TrendingUp,
    color: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
  },
  // Legacy support for old types
  dream: {
    icon: Target,
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  },
  user: {
    icon: Users,
    color: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  },
  idea: {
    icon: Wrench,
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  },
};

export default function MindMapNode({ node, index, sectionType }) {
  // Use sectionType if provided, otherwise fall back to node.type
  const nodeType = sectionType || node.type || 'product';
  const config = nodeConfig[nodeType] || nodeConfig.product;
  const Icon = config.icon;
  const colors = config.color;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border-2 ${colors.bg} ${colors.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-grab`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm leading-snug">{node.label}</h4>
          {node.description && (
            <p className="text-xs text-gray-600 mt-1">{node.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}