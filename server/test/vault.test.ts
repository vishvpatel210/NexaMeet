import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { VaultService } from '../src/services/vault.service.js';

describe('Secure Vault API & AES-256-GCM Encryption', () => {
  it('GET /api/v1/vault/status should return masked API key status', async () => {
    const response = await request(app).get('/api/v1/vault/status');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('openRouter');
    expect(response.body.data).toHaveProperty('openAi');
    expect(response.body.data).toHaveProperty('gemini');
  });

  it('POST /api/v1/vault/keys should encrypt and save API keys to vault', async () => {
    const payload = {
      openRouterApiKey: 'sk-or-v1-testkey1234567890abcdef',
      openAiApiKey: 'sk-proj-testkey1234567890abcdef'
    };

    const response = await request(app)
      .post('/api/v1/vault/keys')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.openRouter.configured).toBe(true);

    const decrypted = VaultService.getKeys();
    expect(decrypted.openRouterApiKey).toBe(payload.openRouterApiKey);
    expect(decrypted.openAiApiKey).toBe(payload.openAiApiKey);
  });
});
