import { Types } from 'mongoose';
import { VectorChunk, IVectorChunkDocument } from '../models/VectorChunk.js';
import { Meeting } from '../models/Meeting.js';
import { Summary } from '../models/Summary.js';
import { Transcript } from '../models/Transcript.js';

export interface ISearchResultItem {
  meetingId: string;
  title: string;
  category: string;
  chunkType: string;
  matchedSnippet: string;
  score: number;
}

export class VectorService {
  /**
   * Index meeting text content (Summary & Transcript) into vector embeddings database
   */
  static async indexMeetingContent(meetingId: string): Promise<number> {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID ${meetingId} not found`);
    }

    // Delete existing vector chunks for this meeting
    await VectorChunk.deleteMany({ meetingId: new Types.ObjectId(meetingId) });

    const chunksToIndex: Array<{ chunkType: 'transcript' | 'summary' | 'user_notes'; text: string }> = [];

    // Fetch Summary
    const summary = await Summary.findOne({ meetingId: new Types.ObjectId(meetingId) });
    if (summary) {
      if (summary.executiveSummary) {
        chunksToIndex.push({ chunkType: 'summary', text: summary.executiveSummary });
      }
      if (summary.keyPoints && summary.keyPoints.length > 0) {
        chunksToIndex.push({ chunkType: 'summary', text: summary.keyPoints.join(' ') });
      }
      if (summary.rawUserNotes) {
        chunksToIndex.push({ chunkType: 'user_notes', text: summary.rawUserNotes });
      }
    }

    // Fetch Transcript
    const transcript = await Transcript.findOne({ meetingId: new Types.ObjectId(meetingId) });
    if (transcript && transcript.segments && transcript.segments.length > 0) {
      const fullTranscriptText = transcript.segments.map(s => `${s.speakerLabel}: ${s.content}`).join(' ');
      chunksToIndex.push({ chunkType: 'transcript', text: fullTranscriptText });
    }

    let indexedCount = 0;
    for (const chunk of chunksToIndex) {
      const embedding = await this.generateEmbedding(chunk.text);
      await VectorChunk.create({
        meetingId: new Types.ObjectId(meetingId),
        chunkType: chunk.chunkType,
        chunkText: chunk.text,
        embedding
      });
      indexedCount++;
    }

    return indexedCount;
  }

  /**
   * Perform semantic vector similarity search across all indexed meetings
   */
  static async searchSemantic(query: string, options?: { category?: string; limit?: number }): Promise<ISearchResultItem[]> {
    const limit = options?.limit || 10;
    const queryEmbedding = await this.generateEmbedding(query);

    // Fetch all vector chunks from DB
    const allChunks = await VectorChunk.find().populate('meetingId', 'title category status');

    const scoredResults: Array<{ chunk: IVectorChunkDocument; meeting: any; score: number }> = [];

    for (const chunk of allChunks) {
      const meeting = chunk.meetingId as any;
      if (!meeting) continue;

      if (options?.category && options.category !== 'All' && meeting.category !== options.category) {
        continue;
      }

      const similarityScore = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      if (similarityScore > 0.05) {
        scoredResults.push({
          chunk,
          meeting,
          score: Number(similarityScore.toFixed(4))
        });
      }
    }

    // Sort by similarity score descending
    scoredResults.sort((a, b) => b.score - a.score);

    // Group by meetingId to return highest scoring snippet per meeting
    const meetingMap = new Map<string, ISearchResultItem>();

    for (const item of scoredResults) {
      const meetingIdStr = item.meeting._id.toString();
      if (!meetingMap.has(meetingIdStr)) {
        meetingMap.set(meetingIdStr, {
          meetingId: meetingIdStr,
          title: item.meeting.title,
          category: item.meeting.category,
          chunkType: item.chunk.chunkType,
          matchedSnippet: item.chunk.chunkText.length > 200 ? item.chunk.chunkText.slice(0, 200) + '...' : item.chunk.chunkText,
          score: item.score
        });
      }
      if (meetingMap.size >= limit) break;
    }

    return Array.from(meetingMap.values());
  }

  /**
   * Calculate Cosine Similarity between vector A and vector B
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate text embedding vector (384 dimensions)
   */
  private static async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/text-embedding-3-small',
            input: text
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          if (data.data && data.data[0] && data.data[0].embedding) {
            return data.data[0].embedding;
          }
        }
      } catch (err) {
        // Fallback to local embedding vector math
      }
    }

    // Local 384-dimensional term frequency vector generator fallback
    return this.generateLocalVector(text, 384);
  }

  /**
   * Local normalized term frequency vector embedding (384-dim)
   */
  private static generateLocalVector(text: string, dimensions: number): number[] {
    const vector = new Array(dimensions).fill(0);
    const cleanedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanedText.split(/\s+/).filter(w => w.length > 1);

    if (words.length === 0) return vector;

    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % dimensions;
      vector[index] += 1;
    }

    // Normalize vector L2 norm
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  }
}
