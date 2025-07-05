import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CreditCard, 
  Calendar, 
  Brain, 
  Mail, 
  Video, 
  BarChart3,
  FileText,
  Lock,
  Users,
  MessageSquare,
  Plus,
  Check,
  Settings,
  Zap,
  Smartphone,
  Palette,
  Database,
  Clock,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modules = [
  {
    id: 'stripe-payments',
    name: 'Stripe Payment Gateway',
    description: 'Accept credit cards, handle subscriptions, and manage revenue streams',
    icon: CreditCard,
    tag: 'Monetization',
    tagColor: 'emerald',
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    dependencies: ['Backend API'],
    features: ['Credit card processing', 'Subscription management', 'Invoice generation', 'Webhook handling'],
    popularity: 95,
    generationPrompt: `
## Build Prompt: Stripe Payment Gateway Module

**Objective:** Create a secure, reusable module for processing payments using Stripe.

**Core Requirements:**
1.  **Backend API Endpoints:**
    -   \`POST /api/payments/create-payment-intent\`: Takes an amount and currency, returns a client secret.
    -   \`POST /api/webhooks/stripe\`: Handles incoming webhooks from Stripe to confirm payment status.
2.  **Frontend Component:**
    -   A React component that embeds the Stripe Card Element.
    -   It should handle form submission, call the backend to create a payment intent, and use the client secret to confirm the payment with Stripe.js.
3.  **Security:**
    -   Never expose secret keys on the frontend.
    -   Use environment variables for Stripe keys.
    -   Validate webhook signatures.
4.  **User Experience:**
    -   Display clear loading states and error messages.
    -   Show a success message upon completion.
`
  },
  {
    id: 'calendar-booking',
    name: 'Calendar Booking System',  
    description: 'Let users schedule appointments and manage availability seamlessly',
    icon: Calendar,
    tag: 'Services',
    tagColor: 'blue',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    dependencies: ['User Authentication'],
    features: ['Available time slots', 'Email confirmations', 'Calendar sync', 'Rescheduling'],
    popularity: 88,
    generationPrompt: `
## Build Prompt: Calendar Booking System

**Objective:** Implement a full-featured calendar booking system.

**Core Requirements:**
1.  **Data Models (Entities):**
    -   \`Availability\`: Stores provider's available time slots (e.g., day of week, start time, end time).
    -   \`Booking\`: Stores scheduled appointments (e.g., providerId, clientId, startTime, endTime, status).
2.  **API Endpoints:**
    -   \`GET /api/availability/{providerId}\`: Returns available slots for a given provider.
    -   \`POST /api/bookings\`: Creates a new booking. Requires authentication.
    -   \`PUT /api/bookings/{bookingId}\`: Updates or cancels a booking.
3.  **Frontend UI:**
    -   A calendar view (e.g., using react-big-calendar or similar) to display available slots.
    -   A booking form to collect user details.
    -   A dashboard for users to view and manage their upcoming appointments.
4.  **Integrations:**
    -   Send email confirmations upon booking and cancellation (e.g., using SendGrid).
`
  },
  {
    id: 'ai-monetization',
    name: 'AI Monetization Engine',
    description: 'Charge users per AI query, content generation, or analysis',
    icon: Brain,
    tag: 'AI + Revenue',
    tagColor: 'violet',
    difficulty: 'Medium',
    estimatedTime: '3 hours',
    dependencies: ['Payment Gateway', 'AI Integration'],
    features: ['Usage tracking', 'Credit system', 'Rate limiting', 'Analytics dashboard'],
    popularity: 92,
    generationPrompt: `
## Build Prompt: AI Monetization Engine

**Objective:** Build a flexible system to monetize AI features based on usage.

**Core Requirements:**
1.  **Credit System:**
    -   Modify the \`User\` entity to include a \`credits\` field (integer).
    -   Create an API endpoint \`POST /api/credits/purchase\` that integrates with a payment gateway to add credits to a user's account.
2.  **Usage Tracking Middleware:**
    -   Create a middleware for AI-related API routes.
    -   Before processing the request, the middleware checks if the user has enough credits.
    -   If yes, it deducts the required credits (e.g., 1 credit per query) and allows the request to proceed.
    -   If no, it returns a 402 Payment Required error.
3.  **Rate Limiting:**
    -   Implement rate limiting for non-paying or free-tier users.
4.  **Frontend Components:**
    -   A "Buy Credits" page with different packages.
    -   Display the user's current credit balance in the UI.
`
  },
  {
    id: 'whatsapp-voicebotix',
    name: 'WhatsApp/VoiceBotix',
    description: 'Deploy WhatsApp bots and AI voice agents for customer engagement',
    icon: Smartphone,
    tag: 'Communication',
    tagColor: 'emerald',
    difficulty: 'Medium', 
    estimatedTime: '5 hours',
    dependencies: ['Backend API'],
    features: ['WhatsApp integration', 'Voice bot deployment', 'Multi-language support', 'Analytics'],
    popularity: 85,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'email-sms',
    name: 'Email + SMS System',
    description: 'Automated notifications via Mailgun, SendGrid, and Twilio',
    icon: Mail,
    tag: 'Notifications',
    tagColor: 'yellow',  
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    dependencies: ['Backend API'],
    features: ['Email templates', 'SMS notifications', 'Delivery tracking', 'Opt-out management'],
    popularity: 90,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'zoom-integration',
    name: 'Zoom SDK Integration',
    description: 'Create and manage video meetings directly from your application',
    icon: Video,
    tag: 'Communication',
    tagColor: 'red',
    difficulty: 'Medium',
    estimatedTime: '3 hours', 
    dependencies: ['User Authentication', 'Calendar System'],
    features: ['Meeting creation', 'Auto-join links', 'Recording management', 'Participant tracking'],
    popularity: 78,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator',
    description: 'Create captions, posts, blogs, and marketing content automatically',
    icon: Palette,
    tag: 'Content Creation',
    tagColor: 'pink',
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    dependencies: ['AI Integration'],
    features: ['Blog post generation', 'Social media captions', 'Marketing copy', 'SEO optimization'],
    popularity: 87,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Real-time usage metrics, user behavior, and growth insights',
    icon: BarChart3,
    tag: 'Growth',
    tagColor: 'indigo',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    dependencies: ['Frontend Framework'],
    features: ['Real-time metrics', 'User behavior tracking', 'Custom dashboards', 'Export reports'],
    popularity: 82,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'crm-integration',
    name: 'CRM Integration',
    description: 'Connect with GoHighLevel, HubSpot, and popular CRM systems',
    icon: Database,
    tag: 'Business Tools',
    tagColor: 'teal',
    difficulty: 'Medium',
    estimatedTime: '3 hours',
    dependencies: ['Backend API', 'User Authentication'],
    features: ['Contact synchronization', 'Lead management', 'Pipeline tracking', 'Automated workflows'],
    popularity: 75,
    generationPrompt: '' // Add prompt later
  },
  {
    id: 'landing-page-generator',
    name: 'Landing Page Generator',
    description: 'Auto-generate beautiful startup websites and landing pages',
    icon: Palette,
    tag: 'Marketing',
    tagColor: 'orange',
    difficulty: 'Easy',
    estimatedTime: '1 hour',
    dependencies: ['Frontend Framework'],
    features: ['Template selection', 'Auto-content generation', 'SEO optimization', 'Mobile responsive'],
    popularity: 89,
    generationPrompt: '' // Add prompt later
  }
];

const ModuleCard = ({ module, isSelected, onToggle, techStack }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTagColorClass = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      violet: 'bg-violet-100 text-violet-800 border-violet-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canInstall = () => {
    if (module.dependencies.includes('Backend API') && !techStack.backend) return false;
    if (module.dependencies.includes('Payment Gateway') && !isSelected) return false; // Fixed logic
    return true;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass-morphism rounded-2xl transition-all duration-300 hover-lift ${
        isSelected 
          ? 'border-2 border-violet-300 bg-violet-50/50' 
          : 'border border-gray-200/50 hover:border-gray-300/50'
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSelected ? 'bg-violet-500' : 'bg-gray-100'
            } transition-colors`}>
              <module.icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{module.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs border ${getTagColorClass(module.tagColor)}`}>
                  {module.tag}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          i < Math.floor(module.popularity / 20) ? 'bg-yellow-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{module.popularity}% use this</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => onToggle(module)}
            disabled={!canInstall()}
            className={`${
              isSelected 
                ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            } transition-all duration-200`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty} setup
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {module.features.length} features
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm p-0 h-auto text-violet-600 hover:text-violet-700"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {module.dependencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Dependencies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {module.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {module.generationPrompt && (
                   <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Code className="w-4 h-4"/>Build Prompt</h4>
                    <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{module.generationPrompt.trim()}</code>
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </motion.div>
  );
};

export default function PlugAndPlayModules({ selectedModules, onUpdateModules, techStack }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const tags = [...new Set(modules.map(m => m.tag))];
  
  const filteredModules = modules
    .filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = filterTag === "all" || module.tag === filterTag;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return a.name.localeCompare(b.name);
    });

  const handleToggleModule = (module) => {
    const isSelected = selectedModules.some(m => m.id === module.id);
    if (isSelected) {
      onUpdateModules(selectedModules.filter(m => m.id !== module.id));
    } else {
      onUpdateModules([...selectedModules, module]);
      // Trigger celebration animation could be added here
    }
  };

  return (
    <div className="p-8">
      {/* Enhanced Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3 display-text">🔌 Plug & Play Module Library</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Add powerful features instantly. Each module includes code, documentation, and integration guides.
        </p>
      </motion.div>

      {/* Enhanced Search and Filter */}
      <motion.div 
        className="flex gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search modules, features, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base glass-morphism border-gray-200"
          />
        </div>
        
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white glass-morphism min-w-40"
        >
          <option value="all">All Categories</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white glass-morphism min-w-40"
        >
          <option value="popularity">Most Popular</option>
          <option value="difficulty">Easiest First</option>
          <option value="name">Alphabetical</option>
        </select>
      </motion.div>

      {/* Enhanced Selected Modules Summary */}
      {selectedModules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="glass-morphism border-2 border-violet-200/50 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                Selected Modules ({selectedModules.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedModules.map(module => (
                  <motion.div 
                    key={module.id} 
                    className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-violet-200/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <module.icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="text-sm font-medium flex-1">{module.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleModule(module)}
                      className="ml-auto h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      ×
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-violet-200/50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total estimated setup time:</span>
                  <span className="font-semibold">
                    {selectedModules.reduce((total, module) => {
                      const hours = parseInt(module.estimatedTime);
                      return total + hours;
                    }, 0)} hours
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Module Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ModuleCard
                module={module}
                isSelected={selectedModules.some(m => m.id === module.id)}
                onToggle={handleToggleModule}
                techStack={techStack}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredModules.length === 0 && (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No modules found</h3>
          <p className="text-gray-600 text-lg">Try adjusting your search terms or category filter</p>
        </motion.div>
      )}
    </div>
  );
}