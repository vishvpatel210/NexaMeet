import { Request, Response } from 'express';
import { VectorService } from '../services/vector.service.js';
import { Meeting } from '../models/Meeting.js';

// Hybrid & Semantic Vector Search across all meetings
export const searchMeetings = async (req: Request, res: Response) => {
  try {
    const { query, category, limit } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query parameter is required' });
    }

    const results = await VectorService.searchSemantic(query, {
      category: category as string,
      limit: limit ? parseInt(limit as string, 10) : 10
    });

    res.status(200).json({
      success: true,
      query,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Search query failed', message: error.message });
  }
};

// Manually trigger vector indexing for a meeting
export const indexMeeting = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const indexedCount = await VectorService.indexMeetingContent(meetingId);

    res.status(200).json({
      success: true,
      message: `Indexed ${indexedCount} vector chunks for meeting ${meetingId}`,
      meetingId,
      indexedChunksCount: indexedCount
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Vector indexing failed', message: error.message });
  }
};
