// =============================================================================
// ⚠️  REFACTORED - ENTITY BRIDGE
// =============================================================================
// This file has been updated to use the new local entity management system
// instead of Base44 entities. All entity interfaces remain the same.
// 
// MIGRATION STATUS: ✅ COMPLETE
// - VoiceConversation: Replaced with localEntities.js
// - BusinessValidation: Replaced with localEntities.js
// - Project: Replaced with localEntities.js
// - SmartContract: Replaced with localEntities.js
// - ComplianceRecord: Replaced with localEntities.js
// - User: Replaced with localEntities.js
// =============================================================================

// Import from new local entities system
import { 
  VoiceConversation as LocalVoiceConversation,
  BusinessValidation as LocalBusinessValidation,
  Project as LocalProject,
  SmartContract as LocalSmartContract,
  ComplianceRecord as LocalComplianceRecord,
  User as LocalUser
} from './localEntities.js';

// Export with same interface as Base44 for backward compatibility
export const VoiceConversation = LocalVoiceConversation;

export const BusinessValidation = LocalBusinessValidation;

export const Project = LocalProject;

export const SmartContract = LocalSmartContract;

export const ComplianceRecord = LocalComplianceRecord;

// User auth system
export const User = LocalUser;