const API_BASE_URL = 'http://localhost:5000/api/v1';
export class ApiService {
    /**
     * Fetch meetings list with optional category, starred, and search query filters
     */
    static async getMeetings(params) {
        try {
            const queryParts = [];
            if (params?.category && params.category !== 'All')
                queryParts.push(`category=${encodeURIComponent(params.category)}`);
            if (params?.starred)
                queryParts.push('starred=true');
            if (params?.search)
                queryParts.push(`search=${encodeURIComponent(params.search)}`);
            const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
            const response = await fetch(`${API_BASE_URL}/meetings${queryString}`);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.data || [];
        }
        catch (err) {
            console.error('Failed to fetch meetings:', err);
            return [];
        }
    }
    /**
     * Create a new meeting
     */
    static async createMeeting(payload) {
        try {
            const response = await fetch(`${API_BASE_URL}/meetings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.data;
        }
        catch (err) {
            console.error('Failed to create meeting:', err);
            return null;
        }
    }
    /**
     * Perform semantic vector search
     */
    static async searchSemantic(query, category) {
        try {
            const categoryParam = category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
            const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}${categoryParam}`);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.data || [];
        }
        catch (err) {
            console.error('Failed to execute semantic search:', err);
            return [];
        }
    }
    /**
     * Toggle meeting starred status
     */
    static async toggleStar(meetingId, currentStarred) {
        try {
            const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isStarred: !currentStarred })
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.data;
        }
        catch (err) {
            console.error('Failed to toggle star:', err);
            return null;
        }
    }
}
