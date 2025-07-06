# Backend Integration Guide

This document outlines how the new AI backend services integrate with the current frontend architecture and provides guidance for future backend development.

## 🏗️ Current Architecture Overview

### Frontend Application
- **Framework**: React with Vite
- **State Management**: Local state + sessionStorage
- **AI Integration**: Direct API calls to OpenAI/Claude
- **Data Persistence**: Local storage entities
- **Authentication**: Local mock authentication

### AI Service Layer
- **Location**: `src/api/aiService.js`
- **Purpose**: Abstraction layer for AI service calls
- **Providers**: OpenAI, Claude, Mixed mode
- **Fallback**: Mock responses for development

## 🔄 Current AI Integration Flow

### 1. User Interaction
```
User Input → Component → AI Service → API Call → Response → UI Update
```

### 2. Key Integration Points

#### A. Conversation Management (`src/pages/Layout.jsx`)
- **Function**: Central AI conversation hub
- **Current Flow**: User message → InvokeLLM → Response → UI update
- **Data Flow**: SessionStorage ↔ Conversation History
- **Backend Hook**: Global message routing and context management

#### B. Business Development (`src/pages/CoFounderWorkspace.jsx`)
- **Function**: Business concept development
- **Current Flow**: User input → Business analysis → Structured data
- **Data Flow**: SessionStorage ↔ Business validation data
- **Backend Hook**: Business intelligence and market analysis

#### C. Feature Clarification (`src/pages/ClarificationEngine.jsx`)
- **Function**: Detailed requirement gathering
- **Current Flow**: User needs → Feature specification → Technical requirements
- **Data Flow**: SessionStorage ↔ Clarification data
- **Backend Hook**: Requirements analysis and feature mapping

#### D. Technical Architecture (`src/pages/CTOStudio.jsx`)
- **Function**: Code generation and technical planning
- **Current Flow**: Requirements → Technical analysis → Code generation
- **Data Flow**: SessionStorage ↔ Technical specifications
- **Backend Hook**: Code generation and architecture planning

## 🔌 Backend Integration Points

### 1. API Gateway Pattern
```
Frontend → API Gateway → AI Service Router → Provider APIs
```

**Recommended Implementation:**
- **API Gateway**: Express.js, FastAPI, or Vercel Functions
- **AI Router**: Service selection logic (OpenAI vs Claude)
- **Response Cache**: Redis or in-memory cache
- **Rate Limiting**: Per-user API call limits

### 2. Authentication & Authorization
```
Frontend → Auth Service → JWT/Session → Protected Routes
```

**Current State**: Mock authentication in `src/api/localEntities.js`
**Backend Integration**: Replace with real auth service

### 3. Data Persistence
```
Frontend → API → Database → Entity Management
```

**Current State**: Local storage entities
**Backend Integration**: Replace with database entities

### 4. Real-time Updates
```
Frontend ↔ WebSocket/SSE ↔ Backend ↔ AI Processing
```

**Use Cases**: Live code generation, real-time collaboration, progress updates

## 🚀 Deployment Architecture Options

### Option 1: Serverless (Recommended)
```
Frontend (Vercel) → Vercel Functions → AI APIs
```

**Benefits:**
- No server management
- Auto-scaling
- Cost-effective for variable load
- Easy deployment

**Components:**
- `api/ai-service.js`: AI service proxy
- `api/entities.js`: Entity management
- `api/auth.js`: Authentication

### Option 2: Backend API Server
```
Frontend → Backend API (Express/FastAPI) → AI APIs
```

**Benefits:**
- Full control over backend logic
- Complex business logic support
- WebSocket support
- Better for high-volume usage

**Components:**
- Backend API server
- Database (PostgreSQL/MongoDB)
- Redis cache
- Load balancer

### Option 3: Hybrid
```
Frontend → Static Host + Serverless Functions → AI APIs
```

**Benefits:**
- Best of both worlds
- Serverless for AI calls
- Traditional server for complex logic

## 📋 Implementation Roadmap

### Phase 1: Current State (✅ Complete)
- [x] Frontend AI service abstraction
- [x] Local entity management
- [x] Mock authentication
- [x] Development mode support

### Phase 2: Basic Backend Integration
- [ ] Create API gateway functions
- [ ] Implement proper authentication
- [ ] Add response caching
- [ ] Environment-based configuration

### Phase 3: Production Backend
- [ ] Database integration
- [ ] User management system
- [ ] Usage analytics
- [ ] Performance monitoring

### Phase 4: Advanced Features
- [ ] Real-time collaboration
- [ ] Advanced caching strategies
- [ ] Multi-tenant support
- [ ] Advanced analytics

## 🔧 Backend Service Specifications

### AI Service Endpoints

#### POST `/api/ai/invoke`
```json
{
  "prompt": "string",
  "response_json_schema": "object",
  "service": "openai|claude|mixed",
  "context": "object"
}
```

#### POST `/api/ai/generate-image`
```json
{
  "prompt": "string",
  "width": "number",
  "height": "number",
  "model": "string"
}
```

### Entity Management Endpoints

#### GET/POST/PUT/DELETE `/api/entities/{type}`
- VoiceConversation
- BusinessValidation
- Project
- SmartContract
- ComplianceRecord

### Authentication Endpoints

#### POST `/api/auth/login`
#### POST `/api/auth/logout`
#### GET `/api/auth/user`

## 🔐 Security Considerations

### API Key Management
- **Current**: Environment variables in frontend
- **Backend**: Secure server-side storage
- **Rotation**: Automated key rotation

### Rate Limiting
- **Per User**: Prevent abuse
- **Per API**: Respect provider limits
- **Cost Control**: Monitor usage

### Data Protection
- **Encryption**: At rest and in transit
- **Privacy**: User data isolation
- **Compliance**: GDPR, CCPA considerations

## 📊 Monitoring & Analytics

### Key Metrics
- API response times
- AI service usage
- Error rates
- User engagement
- Cost per user

### Tools
- **Logging**: Winston, Pino
- **Monitoring**: New Relic, DataDog
- **Analytics**: Custom dashboard

## 🧪 Testing Strategy

### Current Testing
- Development mode with mocks
- Manual UI testing
- Component testing

### Backend Testing
- Unit tests for AI service logic
- Integration tests for API endpoints
- Load testing for AI service calls
- Cost monitoring tests

## 📈 Scaling Considerations

### Current Limitations
- Local storage size limits
- Frontend-only AI calls
- No user data persistence

### Scaling Solutions
- Database for entity storage
- Server-side AI processing
- Caching for repeated queries
- Load balancing for high traffic

## 🛠️ Development Environment Setup

### Local Development
```bash
# Frontend
npm run dev

# Backend (when implemented)
npm run dev:backend

# Full Stack
npm run dev:full
```

### Environment Variables
```env
# AI Services
VITE_AI_SERVICE_TYPE=openai
VITE_OPENAI_API_KEY=your_key
VITE_CLAUDE_API_KEY=your_key

# Backend (when implemented)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your_secret
```

---

**Next Steps**: Implement Phase 2 backend integration starting with serverless functions for AI service proxying.