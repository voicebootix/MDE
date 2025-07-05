import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6865f4a8cc5abe6538725fdc", 
  requiresAuth: true // Ensure authentication is required for all operations
});
