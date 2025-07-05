import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SidebarContext = React.createContext();

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = React.useState(true);
    return <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    return React.useContext(SidebarContext);
}

export function Sidebar({ children }) {
    const { isOpen } = useSidebar();
    return (
        <motion.nav 
            animate={{ width: isOpen ? 256 : 72 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white/90 backdrop-blur-xl border-r border-gray-100/80 flex flex-col h-full relative"
        >
            {children}
        </motion.nav>
    );
}

export function SidebarTrigger() {
    const { isOpen, setIsOpen } = useSidebar();
    return (
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="absolute -right-3 top-10 w-6 h-6 bg-gray-200 hover:bg-violet-100 rounded-full flex items-center justify-center"
        >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronRight className="w-4 h-4 text-gray-600"/>
            </motion.div>
        </button>
    );
}

export function SidebarHeader({ children }) {
    const { isOpen } = useSidebar();
    return (
        <div className="p-4 h-20 flex items-center border-b border-gray-100/80">
            <motion.div 
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }} 
                transition={{ duration: 0.2, delay: isOpen ? 0.15 : 0 }}
                className="flex-1 overflow-hidden"
            >
              {children}
            </motion.div>
        </div>
    );
}

export function SidebarContent({ children, className }) {
    return <div className={`p-4 space-y-2 ${className}`}>{children}</div>;
}

export function SidebarLabel({ children }) {
    const { isOpen } = useSidebar();
    return (
        <motion.h3 
            animate={{ opacity: isOpen ? 1 : 0 }} 
            transition={{ duration: 0.2, delay: isOpen ? 0.2 : 0 }}
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2"
        >
            {isOpen ? children : ''}
        </motion.h3>
    );
}

export function SidebarItem({ icon: Icon, children, isActive, ...props }) {
    const { isOpen } = useSidebar();
    const As = props.as || 'div';

    const itemVariants = {
        open: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.2 } },
        closed: { opacity: 0, x: -10, transition: { duration: 0.1 } }
    };

    return (
        <As {...props} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            isActive ? 'bg-violet-100 text-violet-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
        }`}>
            {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-violet-600' : 'text-gray-500'}`} />}
            <motion.span 
                variants={itemVariants}
                animate={isOpen ? 'open' : 'closed'}
                className="flex-1 whitespace-nowrap"
            >
                {children}
            </motion.span>
        </As>
    );
}