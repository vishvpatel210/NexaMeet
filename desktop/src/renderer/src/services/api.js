const API_BASE_URL = 'http://localhost:5000/api/v1';
export class ApiService {
    /**
     * Fetch meetings list with optional category, starred, and search parameters
     */
    static async getMeetings(params) {
        try {
            const queryParams = new URLSearchParams();
            if (params?.category && params.category !== 'All') {
                queryParams.append('category', params.category);
            }
            if (params?.starred) {
                queryParams.append('starred', 'true');
            }
            if (params?.search) {
                queryParams.append('search', params.search);
            }
            const res = await fetch(`${API_BASE_URL}/meetings?${queryParams.toString()}`);
            if (!res.ok)
                throw new Error('Failed to fetch meetings');
            const data = await res.json();
            return data.data || [];
        }
        catch (err) {
            console.error('ApiService.getMeetings error:', err);
            return [];
        }
    }
    /**
     * Create a new meeting entry
     */
    static async createMeeting(meetingData) {
        try {
            const res = await fetch(`${API_BASE_URL}/meetings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meetingData)
            });
            if (!res.ok)
                throw new Error('Failed to create meeting');
            const data = await res.json();
            return data.data;
        }
        catch (err) {
            console.error('ApiService.createMeeting error:', err);
            return null;
        }
    }
    /**
     * Toggle meeting star status
     */
    static async toggleStar(meetingId, currentStarred) {
        try {
            const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isStarred: !currentStarred })
            });
            return res.ok;
        }
        catch (err) {
            console.error('ApiService.toggleStar error:', err);
            return false;
        }
    }
    /**
     * Delete meeting and cascade delete associated records
     */
    static async deleteMeeting(meetingId) {
        try {
            const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
                method: 'DELETE'
            });
            return res.ok;
        }
        catch (err) {
            console.error('ApiService.deleteMeeting error:', err);
            return false;
        }
    }
    /**
     * Perform vector DB semantic search across meetings and transcripts
     */
    static async searchSemantic(query) {
        try {
            const res = await fetch(`${API_BASE_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            if (!res.ok)
                throw new Error('Search failed');
            const data = await res.json();
            return data.results || [];
        }
        catch (err) {
            console.error('ApiService.searchSemantic error:', err);
            return [];
        }
    }
}
