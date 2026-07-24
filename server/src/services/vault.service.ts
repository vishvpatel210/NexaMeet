import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const VAULT_FILE = path.join(process.cwd(), 'uploads', 'vault.json.enc');
const ALGORITHM = 'aes-256-gcm';

// Master key derived from system secret or environment
const MASTER_SECRET = process.env.VAULT_MASTER_SECRET || 'NexaMeet-Secure-Vault-Master-Key-2026';
const KEY = crypto.scryptSync(MASTER_SECRET, 'salt-nexameet-vault', 32);

export interface IVaultKeys {
  openRouterApiKey?: string;
  openAiApiKey?: string;
  geminiApiKey?: string;
}

export class VaultService {
  /**
   * Save and encrypt API keys into secure vault on disk
   */
  static saveKeys(keys: IVaultKeys): void {
    const existing = this.getKeys();
    const updated: IVaultKeys = {
      ...existing,
      ...keys
    };

    const text = JSON.stringify(updated);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const payload = JSON.stringify({
      iv: iv.toString('hex'),
      authTag,
      data: encrypted
    });

    const uploadDir = path.dirname(VAULT_FILE);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(VAULT_FILE, payload, 'utf8');

    // Also update runtime process.env
    if (updated.openRouterApiKey) process.env.OPENROUTER_API_KEY = updated.openRouterApiKey;
    if (updated.openAiApiKey) process.env.OPENAI_API_KEY = updated.openAiApiKey;
    if (updated.geminiApiKey) process.env.GEMINI_API_KEY = updated.geminiApiKey;
  }

  /**
   * Decrypt and load API keys from secure vault
   */
  static getKeys(): IVaultKeys {
    if (!fs.existsSync(VAULT_FILE)) {
      return {
        openRouterApiKey: process.env.OPENROUTER_API_KEY,
        openAiApiKey: process.env.OPENAI_API_KEY,
        geminiApiKey: process.env.GEMINI_API_KEY
      };
    }

    try {
      const raw = fs.readFileSync(VAULT_FILE, 'utf8');
      const { iv, authTag, data } = JSON.parse(raw);

      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const keys: IVaultKeys = JSON.parse(decrypted);
      return keys;
    } catch (err) {
      console.warn('Failed to decrypt vault file, falling back to process.env:', err);
      return {
        openRouterApiKey: process.env.OPENROUTER_API_KEY,
        openAiApiKey: process.env.OPENAI_API_KEY,
        geminiApiKey: process.env.GEMINI_API_KEY
      };
    }
  }

  /**
   * Return masked key status for UI display (e.g. sk-or-v1-...93199)
   */
  static getMaskedStatus(): Record<string, { configured: boolean; maskedKey?: string }> {
    const keys = this.getKeys();

    const mask = (k?: string) => {
      if (!k || k.length < 8) return undefined;
      return `${k.slice(0, 8)}...${k.slice(-5)}`;
    };

    return {
      openRouter: {
        configured: Boolean(keys.openRouterApiKey),
        maskedKey: mask(keys.openRouterApiKey)
      },
      openAi: {
        configured: Boolean(keys.openAiApiKey),
        maskedKey: mask(keys.openAiApiKey)
      },
      gemini: {
        configured: Boolean(keys.geminiApiKey),
        maskedKey: mask(keys.geminiApiKey)
      }
    };
  }
}
