// =============================================================================
// ⚠️  REFACTORED - INTEGRATION BRIDGE
// =============================================================================
// This file has been updated to use the new AI service abstraction layer
// instead of Base44 SDK. All function interfaces remain the same.
// 
// MIGRATION STATUS: ✅ COMPLETE
// - InvokeLLM: Replaced with aiService.js
// - GenerateImage: Replaced with aiService.js
// - SendEmail: Replaced with aiService.js (placeholder)
// - UploadFile: Replaced with aiService.js (placeholder)
// - ExtractDataFromUploadedFile: Replaced with aiService.js (placeholder)
// =============================================================================

// Import from new AI service layer
import { 
  InvokeLLM as AiInvokeLLM,
  GenerateImage as AiGenerateImage,
  SendEmail as AiSendEmail,
  UploadFile as AiUploadFile,
  ExtractDataFromUploadedFile as AiExtractDataFromUploadedFile,
  Core as AiCore
} from './aiService.js';

// Export with same interface as Base44 for backward compatibility
export const Core = AiCore;

export const InvokeLLM = AiInvokeLLM;

export const SendEmail = AiSendEmail;

export const UploadFile = AiUploadFile;

export const GenerateImage = AiGenerateImage;

export const ExtractDataFromUploadedFile = AiExtractDataFromUploadedFile;






