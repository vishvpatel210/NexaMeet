export interface IMeetingTemplate {
  id: string;
  name: string;
  description: string;
  promptInstructions: string;
}

export class TemplateService {
  private static templates: IMeetingTemplate[] = [
    {
      id: 'executive-brief',
      name: 'Executive Brief',
      description: 'High-level executive summary, critical decisions, key risks, and strategic action items.',
      promptInstructions: 'Synthesize the conversation into an Executive Brief. Focus on core high-level takeaways, executive decisions, strategic risks, and top priority action items.'
    },
    {
      id: 'one-on-one',
      name: '1-on-1 Sync',
      description: 'Objectives, constructive feedback, progress updates, and personal follow-ups.',
      promptInstructions: 'Organize notes into a 1-on-1 meeting summary. Highlight accomplishments, blockers, constructive feedback, and mutual commitments.'
    },
    {
      id: 'tech-review',
      name: 'Product & Architecture Review',
      description: 'Technical decisions, trade-offs, database/API specs, blockers, and engineering tasks.',
      promptInstructions: 'Summarize from a Senior Software Architect perspective. List technical decisions made, architectural trade-offs, API/database updates, and engineering tasks with assignees.'
    },
    {
      id: 'podcast-prep',
      name: 'Podcast & Interview Prep',
      description: 'Main discussion topics, key speaker quotes, highlights, and follow-up questions.',
      promptInstructions: 'Extract key podcast/interview highlights, memorable quotes from speakers, main discussion topics, and suggested follow-up questions.'
    }
  ];

  static getAllTemplates(): IMeetingTemplate[] {
    return this.templates;
  }

  static getTemplateById(id: string): IMeetingTemplate {
    return this.templates.find(t => t.id === id) || this.templates[0];
  }
}
