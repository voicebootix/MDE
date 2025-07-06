// =============================================================================
// AI Service Abstraction Layer
// =============================================================================
// This module replaces Base44 InvokeLLM with Claude/OpenAI integration
// Maintains exact same interface to ensure compatibility with existing code

/**
 * AI Service Configuration
 * Environment variables needed:
 * - VITE_AI_SERVICE_TYPE: 'openai' | 'claude' | 'mixed'
 * - VITE_OPENAI_API_KEY: OpenAI API key
 * - VITE_CLAUDE_API_KEY: Claude API key
 */

const AI_CONFIG = {
  service: import.meta.env.VITE_AI_SERVICE_TYPE || 'openai',
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini'
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20241022'
  }
};

/**
 * Main AI LLM invocation function
 * Maintains exact same interface as Base44 InvokeLLM
 * @param {Object} params - Parameters object
 * @param {string} params.prompt - The prompt to send to the AI
 * @param {Object} params.response_json_schema - JSON schema for structured response
 * @param {string} params.model - Optional model override
 * @returns {Promise<Object>} - AI response object
 */
export async function InvokeLLM({ prompt, response_json_schema, model, ...otherParams }) {
  console.log('🔄 [AI Service] InvokeLLM called with:', { 
    promptLength: prompt?.length, 
    hasSchema: !!response_json_schema,
    service: AI_CONFIG.service
  });

  // In development, return mock responses to prevent API calls
  if (import.meta.env.DEV && !AI_CONFIG.openai.apiKey && !AI_CONFIG.claude.apiKey) {
    console.log('🔧 [AI Service] Development mode - returning mock response');
    return generateMockResponse(prompt, response_json_schema);
  }

  try {
    // Route to appropriate AI service
    switch (AI_CONFIG.service) {
      case 'openai':
        return await invokeOpenAI({ prompt, response_json_schema, model, ...otherParams });
      case 'claude':
        return await invokeClaude({ prompt, response_json_schema, model, ...otherParams });
      case 'mixed':
        // Use Claude for complex reasoning, OpenAI for structured responses
        return response_json_schema ? 
          await invokeOpenAI({ prompt, response_json_schema, model, ...otherParams }) :
          await invokeClaude({ prompt, response_json_schema, model, ...otherParams });
      default:
        throw new Error(`Unsupported AI service: ${AI_CONFIG.service}`);
    }
  } catch (error) {
    console.error('❌ [AI Service] Error in InvokeLLM:', error);
    
    // Return graceful fallback response
    if (response_json_schema) {
      return generateMockResponse(prompt, response_json_schema);
    }
    
    return {
      response: "I'm temporarily unavailable. Please try again in a moment.",
      error: true,
      message: error.message
    };
  }
}

/**
 * OpenAI API Integration
 */
async function invokeOpenAI({ prompt, response_json_schema, model }) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
  };

  const body = {
    model: model || AI_CONFIG.openai.model,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
  };

  // Add structured output if schema provided
  if (response_json_schema) {
    body.response_format = {
      type: 'json_object'
    };
    body.messages[0].content = `${prompt}\n\nPlease respond with valid JSON matching this schema: ${JSON.stringify(response_json_schema)}`;
  }

  const response = await fetch(`${AI_CONFIG.openai.baseURL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (response_json_schema) {
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn('⚠️ [AI Service] Failed to parse JSON response, returning mock');
      return generateMockResponse(prompt, response_json_schema);
    }
  }

  return { response: content };
}

/**
 * Claude API Integration
 */
async function invokeClaude({ prompt, response_json_schema, model }) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': AI_CONFIG.claude.apiKey,
    'anthropic-version': '2023-06-01'
  };

  let fullPrompt = prompt;
  if (response_json_schema) {
    fullPrompt = `${prompt}\n\nPlease respond with valid JSON matching this schema: ${JSON.stringify(response_json_schema)}`;
  }

  const body = {
    model: model || AI_CONFIG.claude.model,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: fullPrompt
      }
    ]
  };

  const response = await fetch(`${AI_CONFIG.claude.baseURL}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (response_json_schema) {
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn('⚠️ [AI Service] Failed to parse JSON response, returning mock');
      return generateMockResponse(prompt, response_json_schema);
    }
  }

  return { response: content };
}

/**
 * Generate mock responses for development and fallback
 */
function generateMockResponse(prompt, schema) {
  if (!schema) {
    return {
      response: "This is a mock response for development. Configure AI service keys for live responses.",
      isDevelopmentMock: true
    };
  }

  // Generate mock data based on schema
  const mockData = generateMockFromSchema(schema);
  return {
    ...mockData,
    isDevelopmentMock: true
  };
}

/**
 * Generate mock data structure from JSON schema
 */
function generateMockFromSchema(schema) {
  if (!schema || !schema.properties) {
    return { response: "Mock response" };
  }

  const mock = {};
  
  for (const [key, prop] of Object.entries(schema.properties)) {
    mock[key] = generateMockValue(prop);
  }

  return mock;
}

function generateMockValue(property) {
  switch (property.type) {
    case 'string':
      if (property.enum) {
        return property.enum[0];
      }
      return key === 'response' ? 'This is a mock response for development' : 'Mock value';
    case 'number':
      return property.minimum || 0;
    case 'boolean':
      return true;
    case 'array':
      if (property.items) {
        return [generateMockValue(property.items)];
      }
      return ['Mock item'];
    case 'object':
      if (property.properties) {
        return generateMockFromSchema(property);
      }
      return { mockKey: 'Mock object' };
    default:
      return 'Mock value';
  }
}

/**
 * Image Generation Service
 * Replaces Base44 GenerateImage function
 */
export async function GenerateImage({ prompt, width = 1024, height = 1024, model = 'dall-e-3' }) {
  console.log('🖼️ [AI Service] GenerateImage called with:', { prompt, width, height, model });

  // Return mock image URL in development
  if (import.meta.env.DEV && !AI_CONFIG.openai.apiKey) {
    return {
      url: `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
      prompt: prompt,
      isDevelopmentMock: true
    };
  }

  try {
    const response = await fetch(`${AI_CONFIG.openai.baseURL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: `${width}x${height}`,
        quality: 'standard'
      })
    });

    if (!response.ok) {
      throw new Error(`Image generation error: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.data[0].url,
      prompt: prompt
    };
  } catch (error) {
    console.error('❌ [AI Service] Error generating image:', error);
    return {
      url: `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
      prompt: prompt,
      error: true,
      isDevelopmentMock: true
    };
  }
}

/**
 * Email Service Placeholder
 * Replaces Base44 SendEmail function
 */
export async function SendEmail({ to, subject, body, from }) {
  console.log('📧 [AI Service] SendEmail called - placeholder implementation');
  
  // TODO: Implement with preferred email service (SendGrid, AWS SES, etc.)
  return {
    success: true,
    message: 'Email service not yet implemented',
    isDevelopmentMock: true
  };
}

/**
 * File Upload Service Placeholder
 * Replaces Base44 UploadFile function
 */
export async function UploadFile({ file, destination }) {
  console.log('📁 [AI Service] UploadFile called - placeholder implementation');
  
  // TODO: Implement with preferred file storage (AWS S3, Cloudinary, etc.)
  return {
    success: true,
    url: 'https://example.com/uploaded-file',
    message: 'File upload service not yet implemented',
    isDevelopmentMock: true
  };
}

/**
 * Data Extraction Service Placeholder
 * Replaces Base44 ExtractDataFromUploadedFile function
 */
export async function ExtractDataFromUploadedFile({ fileUrl, extractionType }) {
  console.log('📊 [AI Service] ExtractDataFromUploadedFile called - placeholder implementation');
  
  // TODO: Implement with OCR/document processing service
  return {
    success: true,
    data: { extracted: 'sample data' },
    message: 'Data extraction service not yet implemented',
    isDevelopmentMock: true
  };
}

// Export Core service for backward compatibility
export const Core = {
  InvokeLLM,
  GenerateImage,
  SendEmail,
  UploadFile,
  ExtractDataFromUploadedFile
};

// Default export for convenience
export default {
  InvokeLLM,
  GenerateImage,
  SendEmail,
  UploadFile,
  ExtractDataFromUploadedFile,
  Core
};