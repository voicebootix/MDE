import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Info } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const techOptions = {
  frontend: [
    { name: 'React', pros: ['Large ecosystem', 'High performance', 'Component-based'], cons: ['Can be complex', 'Fast-paced evolution'], reasoning: 'Ideal for dynamic UIs and single-page applications. Best for projects needing high interactivity.' },
    { name: 'Vue', pros: ['Gentle learning curve', 'Excellent documentation', 'Flexible'], cons: ['Smaller ecosystem than React', 'Less-suited for huge scale apps'], reasoning: 'Great for projects that need to get to market quickly. Its simplicity is a major advantage.' },
    { name: 'Svelte', pros: ['No virtual DOM', 'Truly reactive', 'Compiles to tiny vanilla JS'], cons: ['Younger framework', 'Smaller community'], reasoning: 'Perfect for performance-critical projects or when bundle size is a major concern.' },
    { name: 'Angular', pros: ['Opinionated framework', 'Backed by Google', 'Great for large enterprise apps'], cons: ['Steep learning curve', 'Verbose'], reasoning: 'A good choice for complex, enterprise-level applications that require a standardized structure.' },
  ],
  backend: [
    { name: 'Node.js (Express)', pros: ['Fast I/O', 'Uses JavaScript everywhere', 'Large npm ecosystem'], cons: ['Single-threaded nature', 'Callback hell without async/await'], reasoning: 'Excellent for real-time applications like chat apps and for building fast, scalable APIs.' },
    { name: 'Python (Django)', pros: ['"Batteries-included" framework', 'Rapid development', 'Great for security'], cons: ['Monolithic', 'Can be slow'], reasoning: 'Best for complex, data-driven web applications that require a high degree of security and structure.' },
    { name: 'Ruby on Rails', pros: ['Convention over configuration', 'High developer productivity', 'Strong community'], cons: ['Slower runtime performance', 'Magic can be confusing'], reasoning: 'Optimized for developer happiness and speed of development. Great for MVPs and startups.' },
    { name: 'Go', pros: ['Extremely high performance', 'Excellent concurrency support', 'Statically typed'], cons: ['Smaller ecosystem', 'Less mature web frameworks'], reasoning: 'Perfect for high-performance microservices and systems that require massive concurrency.' },
  ],
  database: [
    { name: 'PostgreSQL', pros: ['Highly reliable (ACID)', 'Extensible', 'Great for complex queries'], cons: ['Can be harder to scale horizontally', 'More complex to manage'], reasoning: 'The gold standard for relational databases. Use when data integrity and complex transactions are critical.' },
    { name: 'MongoDB', pros: ['Flexible schema', 'Scales horizontally easily', 'Fast for simple queries'], cons: ['No ACID transactions (in some configurations)', 'Less suitable for complex queries'], reasoning: 'Ideal for applications with unstructured or rapidly evolving data models. Great for flexibility.' },
    { name: 'Firebase', pros: ['Real-time database', 'Integrated authentication', 'Serverless'], cons: ['Vendor lock-in', 'Limited querying capabilities'], reasoning: 'Excellent for rapid development of real-time apps, especially mobile apps, without managing a backend.' },
    { name: 'Supabase', pros: ['Open-source Firebase alternative', 'Uses PostgreSQL', 'Provides APIs out-of-the-box'], cons: ['Younger than Firebase', 'Can be more complex to self-host'], reasoning: 'Offers the ease of Firebase but with the power and stability of a PostgreSQL backend.' },
  ],
  hosting: [
    { name: 'Vercel', pros: ['Optimized for Next.js/React', 'Seamless Git integration', 'Global CDN'], cons: ['Can become expensive', 'Focused on frontend'], reasoning: 'The best choice for hosting modern frontend applications, especially those built with Next.js.' },
    { name: 'Netlify', pros: ['Excellent for static sites', 'Great build tools', 'Simple to use'], cons: ['Less flexible for complex backends', 'Build minutes can be a constraint'], reasoning: 'A strong competitor to Vercel, especially for static site generation and JAMstack architectures.' },
    { name: 'AWS', pros: ['Infinitely scalable', 'Huge range of services', 'Mature and reliable'], cons: ['Extremely complex', 'Confusing pricing'], reasoning: 'The go-to for large, complex applications that need fine-grained control over their infrastructure.' },
    { name: 'Google Cloud', pros: ['Excellent for data and ML', 'Strong container support (Kubernetes)', 'Competitive pricing'], cons: ['Complex', 'Documentation can lag behind AWS'], reasoning: 'A great choice for applications that are data-intensive or heavily leverage machine learning services.' },
  ],
};

const TechCard = ({ option, type, isSelected, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={`p-4 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{option.name}</h4>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(type, option.name)}
          className="shrink-0"
        >
          {isSelected ? <CheckCircle className="w-4 h-4 mr-2" /> : null}
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>

      <div className="text-sm space-y-3">
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Pros:</h5>
          <ul className="list-disc list-inside text-gray-600">
            {option.pros.map((pro, i) => <li key={i}>{pro}</li>)}
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Cons:</h5>
          <ul className="list-disc list-inside text-gray-600">
            {option.cons.map((con, i) => <li key={i}>{con}</li>)}
          </ul>
        </div>
        <div>
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h5 className="font-medium text-gray-700 mb-1 flex items-center gap-1 cursor-help">
                  Reasoning <Info className="w-3 h-3 text-gray-400"/>
                </h5>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{option.reasoning}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function TechStackRecommendations({ techStack, onUpdateTechStack }) {
  return (
    <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Tech Stack</h2>
        <p className="text-gray-600 mb-8">Choose the technologies for your project. Our AI provides recommendations with pros and cons based on your project's needs.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(techOptions).map(([type, options]) => (
                <div key={type} className="space-y-4">
                    <h3 className="font-semibold capitalize text-xl text-center">{type}</h3>
                    <div className="space-y-4">
                        {options.map(option => (
                            <TechCard
                                key={option.name}
                                option={option}
                                type={type}
                                isSelected={techStack[type] === option.name}
                                onSelect={onUpdateTechStack}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}