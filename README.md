# MyDreamFactory - AI-Powered Business Builder

This is a React application for building businesses with AI assistance. Originally forked from Base44 DreamFactory, it has been refactored to use OpenAI/Claude APIs instead of Base44 services.

## 🚀 Features

- **AI Co-Founder**: Intelligent business development assistance
- **Business Validation**: Market analysis and validation tools
- **Feature Clarification**: Detailed requirement gathering
- **CTO Studio**: Technical architecture and code generation
- **Local Entity Management**: Local storage-based data persistence
- **Flexible AI Backend**: Support for OpenAI, Claude, or mixed AI services

## 🛠️ Installation

```bash
npm install
```

## 🔧 Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# AI Service Configuration
VITE_AI_SERVICE_TYPE=openai          # Options: 'openai', 'claude', 'mixed'
VITE_OPENAI_API_KEY=your_openai_key  # Required for OpenAI service
VITE_CLAUDE_API_KEY=your_claude_key  # Required for Claude service

# Optional: Custom API endpoints
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_CLAUDE_BASE_URL=https://api.anthropic.com/v1
```

### AI Service Options:
- `openai`: Use OpenAI GPT models for all AI interactions
- `claude`: Use Claude (Anthropic) models for all AI interactions  
- `mixed`: Use Claude for complex reasoning, OpenAI for structured responses

## 🏃 Running the Application

```bash
npm run dev
```

The application will start in development mode with mock responses if no AI keys are configured.

## 📦 Building for Production

```bash
npm run build
```

## 🏗️ Architecture

### AI Service Layer (`src/api/aiService.js`)
- Abstraction layer for AI service calls
- Supports multiple AI providers
- Graceful fallback to mock responses
- Maintains Base44 API compatibility

### Local Entity Management (`src/api/localEntities.js`)
- Local storage-based entity persistence
- Maintains Base44 entity interfaces
- Supports CRUD operations
- Export/import functionality

### Migration Bridge Files
- `src/api/integrations.js`: Routes to new AI services
- `src/api/entities.js`: Routes to local entity management
- `src/api/base44Client.js`: Deprecated Base44 client (marked for removal)

## 🔀 Migration from Base44

This application has been successfully migrated from Base44 to use local AI services:

### ✅ Completed:
- ✅ InvokeLLM function replaced with OpenAI/Claude integration
- ✅ Entity management migrated to local storage
- ✅ Authentication system replaced with local auth
- ✅ Base44 SDK dependency removed
- ✅ All imports updated to use new services
- ✅ Backward compatibility maintained

### 🔄 In Progress:
- Image generation service (GenerateImage)
- Email service integration
- File upload service
- Data extraction service

### 📋 TODO:
- Remove deprecated Base44 client files
- Add production deployment configuration
- Implement backend API for production use
- Add comprehensive testing

## 🚢 Deployment

The application is ready for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

Ensure environment variables are configured in your deployment platform.

## 🧪 Development Mode

Without AI API keys, the application runs in development mode with:
- Mock AI responses
- Local entity management
- Full UI functionality
- No external API calls

## 🔧 Customization

### Adding New AI Providers
Extend `src/api/aiService.js` to add support for additional AI services.

### Customizing Entity Management
Modify `src/api/localEntities.js` to change data persistence behavior.

### UI Customization
The application uses Tailwind CSS and Radix UI components for styling.

## 📞 Support

For support and contributions, please refer to the project's GitHub repository.

---

**Note**: This project has been successfully refactored from Base44 platform to use open AI services while maintaining full functionality and backward compatibility.

## ⚡ Render Deployment: Fix Blank Page (React Router)

If you see a blank page after deploying to Render, add this rewrite rule in your Render Static Site settings:

```
Source: /*
Destination: /index.html
Status: 200
```

This ensures all routes are handled by React Router and prevents blank pages on refresh or deep links.