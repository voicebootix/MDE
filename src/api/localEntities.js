// =============================================================================
// Local Entity Management System
// =============================================================================
// This module replaces Base44 entities with local storage-based entity management
// Maintains exact same interface for compatibility with existing code

/**
 * Base Entity Class
 * Provides common functionality for all entity types
 */
class BaseEntity {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.data = data.data || {};
    
    // Assign all other properties
    Object.assign(this, data);
  }

  generateId() {
    return `${this.constructor.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  save() {
    this.updatedAt = new Date().toISOString();
    const storageKey = this.getStorageKey();
    
    try {
      // Get existing entities
      const existingEntities = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Find and update existing entity or add new one
      const existingIndex = existingEntities.findIndex(e => e.id === this.id);
      
      if (existingIndex >= 0) {
        existingEntities[existingIndex] = this.toJSON();
      } else {
        existingEntities.push(this.toJSON());
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingEntities));
      
      console.log(`✅ [Local Entity] ${this.constructor.name} saved:`, this.id);
      return this;
    } catch (error) {
      console.error(`❌ [Local Entity] Error saving ${this.constructor.name}:`, error);
      throw error;
    }
  }

  delete() {
    const storageKey = this.getStorageKey();
    
    try {
      const existingEntities = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filteredEntities = existingEntities.filter(e => e.id !== this.id);
      
      localStorage.setItem(storageKey, JSON.stringify(filteredEntities));
      
      console.log(`🗑️ [Local Entity] ${this.constructor.name} deleted:`, this.id);
      return true;
    } catch (error) {
      console.error(`❌ [Local Entity] Error deleting ${this.constructor.name}:`, error);
      return false;
    }
  }

  static find(id) {
    const storageKey = this.getStorageKey();
    
    try {
      const existingEntities = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const entityData = existingEntities.find(e => e.id === id);
      
      if (entityData) {
        return new this(entityData);
      }
      
      return null;
    } catch (error) {
      console.error(`❌ [Local Entity] Error finding ${this.name}:`, error);
      return null;
    }
  }

  static findAll() {
    const storageKey = this.getStorageKey();
    
    try {
      const existingEntities = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return existingEntities.map(data => new this(data));
    } catch (error) {
      console.error(`❌ [Local Entity] Error finding all ${this.name}:`, error);
      return [];
    }
  }

  static where(criteria = {}) {
    const allEntities = this.findAll();
    
    return allEntities.filter(entity => {
      return Object.entries(criteria).every(([key, value]) => {
        return entity[key] === value;
      });
    });
  }

  getStorageKey() {
    return `entities_${this.constructor.name.toLowerCase()}`;
  }

  static getStorageKey() {
    return `entities_${this.name.toLowerCase()}`;
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      data: this.data,
      ...this.getEntityData()
    };
  }

  getEntityData() {
    // Override in subclasses to return specific entity data
    return {};
  }
}

/**
 * Voice Conversation Entity
 * Replaces Base44 VoiceConversation
 */
class VoiceConversation extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.messages = data.messages || [];
    this.status = data.status || 'active';
    this.projectId = data.projectId || null;
    this.context = data.context || {};
  }

  addMessage(message) {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...message
    };
    
    this.messages.push(newMessage);
    this.save();
    
    return newMessage;
  }

  getEntityData() {
    return {
      messages: this.messages,
      status: this.status,
      projectId: this.projectId,
      context: this.context
    };
  }
}

/**
 * Business Validation Entity
 * Replaces Base44 BusinessValidation
 */
class BusinessValidation extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.businessConcept = data.businessConcept || '';
    this.targetMarket = data.targetMarket || '';
    this.competitorAnalysis = data.competitorAnalysis || [];
    this.marketSize = data.marketSize || null;
    this.validationScore = data.validationScore || 0;
    this.recommendations = data.recommendations || [];
    this.projectId = data.projectId || null;
  }

  getEntityData() {
    return {
      businessConcept: this.businessConcept,
      targetMarket: this.targetMarket,
      competitorAnalysis: this.competitorAnalysis,
      marketSize: this.marketSize,
      validationScore: this.validationScore,
      recommendations: this.recommendations,
      projectId: this.projectId
    };
  }
}

/**
 * Project Entity
 * Replaces Base44 Project
 */
class Project extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.name = data.name || 'Untitled Project';
    this.description = data.description || '';
    this.dreamStatement = data.dreamStatement || '';
    this.status = data.status || 'active';
    this.progress = data.progress || 0;
    this.clarificationData = data.clarificationData || {};
    this.technicalData = data.technicalData || {};
    this.validationData = data.validationData || {};
    this.deploymentData = data.deploymentData || {};
  }

  updateProgress() {
    let completedSections = 0;
    const totalSections = 4;

    if (this.dreamStatement) completedSections++;
    if (this.clarificationData && Object.keys(this.clarificationData).length > 0) completedSections++;
    if (this.technicalData && Object.keys(this.technicalData).length > 0) completedSections++;
    if (this.validationData && Object.keys(this.validationData).length > 0) completedSections++;

    this.progress = Math.round((completedSections / totalSections) * 100);
    this.save();
    
    return this.progress;
  }

  getEntityData() {
    return {
      name: this.name,
      description: this.description,
      dreamStatement: this.dreamStatement,
      status: this.status,
      progress: this.progress,
      clarificationData: this.clarificationData,
      technicalData: this.technicalData,
      validationData: this.validationData,
      deploymentData: this.deploymentData
    };
  }
}

/**
 * Smart Contract Entity
 * Replaces Base44 SmartContract
 */
class SmartContract extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.name = data.name || 'Smart Contract';
    this.code = data.code || '';
    this.language = data.language || 'solidity';
    this.network = data.network || 'ethereum';
    this.deploymentAddress = data.deploymentAddress || null;
    this.status = data.status || 'draft';
    this.projectId = data.projectId || null;
  }

  getEntityData() {
    return {
      name: this.name,
      code: this.code,
      language: this.language,
      network: this.network,
      deploymentAddress: this.deploymentAddress,
      status: this.status,
      projectId: this.projectId
    };
  }
}

/**
 * Compliance Record Entity
 * Replaces Base44 ComplianceRecord
 */
class ComplianceRecord extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.complianceType = data.complianceType || 'general';
    this.requirements = data.requirements || [];
    this.status = data.status || 'pending';
    this.documents = data.documents || [];
    this.projectId = data.projectId || null;
  }

  getEntityData() {
    return {
      complianceType: this.complianceType,
      requirements: this.requirements,
      status: this.status,
      documents: this.documents,
      projectId: this.projectId
    };
  }
}

/**
 * User Authentication Mock
 * Replaces Base44 User/auth
 */
class UserAuth {
  constructor() {
    this.currentUser = null;
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    try {
      const userData = localStorage.getItem('current_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  async login(email, password) {
    // Mock login - in real implementation, this would call your auth service
    console.log('🔐 [Local Auth] Mock login attempt:', email);
    
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      loginAt: new Date().toISOString(),
      isDevelopmentMock: true
    };

    this.currentUser = mockUser;
    localStorage.setItem('current_user', JSON.stringify(mockUser));
    
    return {
      success: true,
      user: mockUser,
      token: 'mock_token_' + Date.now()
    };
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('current_user');
    
    return {
      success: true
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Create singleton instance for User auth
const User = new UserAuth();

// Utility functions for easy entity management
export const EntityManager = {
  // Clear all entities (useful for testing/reset)
  clearAll() {
    const entityKeys = Object.keys(localStorage).filter(key => key.startsWith('entities_'));
    entityKeys.forEach(key => localStorage.removeItem(key));
    console.log('🧹 [Local Entity] Cleared all entities');
  },

  // Get storage size
  getStorageSize() {
    const entityKeys = Object.keys(localStorage).filter(key => key.startsWith('entities_'));
    let totalSize = 0;
    entityKeys.forEach(key => {
      totalSize += localStorage.getItem(key).length;
    });
    return totalSize;
  },

  // Export all entities
  exportAll() {
    const entityKeys = Object.keys(localStorage).filter(key => key.startsWith('entities_'));
    const allEntities = {};
    
    entityKeys.forEach(key => {
      allEntities[key] = JSON.parse(localStorage.getItem(key) || '[]');
    });
    
    return allEntities;
  },

  // Import entities
  importAll(entities) {
    Object.entries(entities).forEach(([key, value]) => {
      if (key.startsWith('entities_')) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    
    console.log('📥 [Local Entity] Imported entities');
  }
};

// Export entities with same interface as Base44
export {
  VoiceConversation,
  BusinessValidation,
  Project,
  SmartContract,
  ComplianceRecord,
  User
};

// Export default for convenience
export default {
  VoiceConversation,
  BusinessValidation,
  Project,
  SmartContract,
  ComplianceRecord,
  User,
  EntityManager
};