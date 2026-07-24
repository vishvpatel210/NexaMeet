import { Request, Response } from 'express';
import { Meeting } from '../models/Meeting.js';
import { Recording } from '../models/Recording.js';
import { Transcript } from '../models/Transcript.js';
import { Summary } from '../models/Summary.js';
import { ActionItem } from '../models/ActionItem.js';

// Create a new meeting
export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { title, category, scheduledStart, scheduledEnd, location, status, isStarred, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Meeting title is required' });
    }

    const meeting = await Meeting.create({
      title,
      category: category || 'Work',
      scheduledStart,
      scheduledEnd,
      location,
      status: status || 'completed',
      isStarred: isStarred || false,
      tags: tags || []
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create meeting', message: error.message });
  }
};

// Get all meetings (with category & starred filter)
export const getMeetings = async (req: Request, res: Response) => {
  try {
    const { category, starred, search } = req.query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (starred === 'true') {
      filter.isStarred = true;
    }

    if (search) {
      filter.title = { $regex: search as string, $options: 'i' };
    }

    const meetings = await Meeting.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: meetings.length, data: meetings });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch meetings', message: error.message });
  }
};

// Get meeting by ID with linked recordings, transcript, and summary
export const getMeetingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const recordings = await Recording.find({ meetingId: id });
    const transcript = await Transcript.findOne({ meetingId: id });
    const summary = await Summary.findOne({ meetingId: id });
    const actionItems = await ActionItem.find({ meetingId: id });

    res.status(200).json({
      success: true,
      data: {
        meeting,
        recordings,
        transcript,
        summary,
        actionItems
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch meeting details', message: error.message });
  }
};

// Update meeting
export const updateMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.status(200).json({ success: true, data: updatedMeeting });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update meeting', message: error.message });
  }
};

// Delete meeting and cascade delete associated records
export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Cascade delete linked entities
    await Recording.deleteMany({ meetingId: id });
    await Transcript.deleteMany({ meetingId: id });
    await Summary.deleteMany({ meetingId: id });
    await ActionItem.deleteMany({ meetingId: id });

    res.status(200).json({ success: true, message: 'Meeting deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete meeting', message: error.message });
  }
};
