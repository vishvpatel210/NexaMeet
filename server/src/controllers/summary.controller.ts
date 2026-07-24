import { Request, Response } from 'express';
import { SummaryService } from '../services/summary.service.js';
import { TemplateService } from '../services/template.service.js';
import { ActionItem } from '../models/ActionItem.js';
import { Summary } from '../models/Summary.js';

// Trigger AI summarization for a meeting
export const generateSummary = async (req: Request, res: Response) => {
  try {
    const { meetingId, templateId, rawUserNotes, model } = req.body;

    if (!meetingId) {
      return res.status(400).json({ error: 'meetingId is required' });
    }

    const { summary, actionItems } = await SummaryService.generateSummary({
      meetingId,
      templateId,
      rawUserNotes,
      model
    });

    res.status(201).json({
      success: true,
      message: 'AI Summary and Action Items generated successfully',
      data: {
        summary,
        actionItems
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate AI summary', message: error.message });
  }
};

// Get summary and action items for a meeting
export const getSummaryByMeeting = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const { summary, actionItems } = await SummaryService.getSummaryByMeeting(meetingId);

    if (!summary) {
      return res.status(404).json({ error: 'No summary found for this meeting' });
    }

    res.status(200).json({
      success: true,
      data: {
        summary,
        actionItems
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch summary', message: error.message });
  }
};

// Get all built-in meeting prompt templates
export const getTemplates = async (_req: Request, res: Response) => {
  try {
    const templates = TemplateService.getAllTemplates();
    res.status(200).json({ success: true, count: templates.length, data: templates });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch templates', message: error.message });
  }
};

// Toggle or update action item
export const updateActionItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignee, taskDescription, dueDate } = req.body;

    const updatedItem = await ActionItem.findByIdAndUpdate(
      id,
      { status, assignee, taskDescription, dueDate },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Action item not found' });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update action item', message: error.message });
  }
};

// Delete summary
export const deleteSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const summary = await Summary.findByIdAndDelete(id);

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    await ActionItem.deleteMany({ summaryId: id });

    res.status(200).json({ success: true, message: 'Summary deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete summary', message: error.message });
  }
};
