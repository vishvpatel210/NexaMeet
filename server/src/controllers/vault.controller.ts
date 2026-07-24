import { Request, Response } from 'express';
import { VaultService } from '../services/vault.service.js';

export const getVaultStatus = async (_req: Request, res: Response) => {
  try {
    const status = VaultService.getMaskedStatus();
    res.status(200).json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch vault status', message: error.message });
  }
};

export const updateVaultKeys = async (req: Request, res: Response) => {
  try {
    const { openRouterApiKey, openAiApiKey, geminiApiKey } = req.body;

    VaultService.saveKeys({
      openRouterApiKey,
      openAiApiKey,
      geminiApiKey
    });

    res.status(200).json({
      success: true,
      message: 'API keys encrypted and saved successfully in secure vault',
      data: VaultService.getMaskedStatus()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update vault keys', message: error.message });
  }
};
