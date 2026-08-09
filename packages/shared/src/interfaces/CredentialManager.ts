export interface CredentialManager {
  // Retrieve credentials for a provider or agent in a secure way.
  // Implementations MUST never expose raw credentials to browser contexts.
  getCredentials(providerId: string): Promise<Record<string, string> | null>;
  // Store credentials (server-side only)
  storeCredentials(providerId: string, secret: Record<string, string>): Promise<void>;
  // Remove credentials
  removeCredentials(providerId: string): Promise<void>;
}
