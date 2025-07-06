// =============================================================================
// ⚠️  DEPRECATED - BASE44 CLIENT
// =============================================================================
// This file is deprecated and will be removed in a future version.
// Base44 SDK has been replaced with local AI services.
// 
// MIGRATION NOTES:
// - All Base44 API calls now use src/api/aiService.js
// - Entity management now uses src/api/localEntities.js
// - Authentication is now handled locally
// 
// TODO: Remove this file after confirming all imports are updated
// =============================================================================

console.warn('⚠️  DEPRECATED: base44Client.js is deprecated. Use src/api/aiService.js instead.');

// Legacy import (will be removed)
// import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Mock Base44 client for backward compatibility during migration
export const base44 = {
  integrations: {
    Core: {
      InvokeLLM: () => {
        throw new Error('Base44 InvokeLLM is deprecated. Use aiService.js instead.');
      },
      GenerateImage: () => {
        throw new Error('Base44 GenerateImage is deprecated. Use aiService.js instead.');
      },
      SendEmail: () => {
        throw new Error('Base44 SendEmail is deprecated. Use aiService.js instead.');
      },
      UploadFile: () => {
        throw new Error('Base44 UploadFile is deprecated. Use aiService.js instead.');
      },
      ExtractDataFromUploadedFile: () => {
        throw new Error('Base44 ExtractDataFromUploadedFile is deprecated. Use aiService.js instead.');
      }
    }
  },
  entities: {
    VoiceConversation: () => {
      throw new Error('Base44 VoiceConversation is deprecated. Use localEntities.js instead.');
    },
    BusinessValidation: () => {
      throw new Error('Base44 BusinessValidation is deprecated. Use localEntities.js instead.');
    },
    Project: () => {
      throw new Error('Base44 Project is deprecated. Use localEntities.js instead.');
    },
    SmartContract: () => {
      throw new Error('Base44 SmartContract is deprecated. Use localEntities.js instead.');
    },
    ComplianceRecord: () => {
      throw new Error('Base44 ComplianceRecord is deprecated. Use localEntities.js instead.');
    }
  },
  auth: {
    login: () => {
      throw new Error('Base44 auth is deprecated. Use localEntities.js User instead.');
    },
    logout: () => {
      throw new Error('Base44 auth is deprecated. Use localEntities.js User instead.');
    }
  }
};
