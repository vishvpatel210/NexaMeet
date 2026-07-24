# UI & UX Architecture: NexaMeet AI Desktop Notepad

## 1. Design System & Aesthetics

### 1.1 Visual Identity & Color Palette
NexaMeet features a modern, high-contrast, premium aesthetic supporting both dark and light modes. The design utilizes subtle glassmorphism backdrop blurs, soft card shadows, rounded corners (8px - 16px radius), and crisp typography.

#### Palette Tokens
- **Background Primary**: `#FFFFFF` (Light) / `#0F172A` (Dark Slate)
- **Background Secondary / Surface**: `#F8FAFC` (Light) / `#1E293B` (Dark)
- **Border / Divider**: `#E2E8F0` / `#334155`
- **Text Primary**: `#0F172A` / `#F8FAFC`
- **Text Secondary**: `#64748B` / `#94A3B8`
- **Accent Brand (Primary)**: `#2563EB` (Royal Blue) / `#3B82F6`
- **Accent Recording Active**: `#EF4444` (Vivid Crimson Red with ambient pulse glow)
- **Accent Success / Active Indicator**: `#10B981` (Emerald Green)
- **Accent Highlight Tag / Star**: `#F59E0B` (Amber Gold)

### 1.2 Typography
- **Primary Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Monospace Font (Timestamps & Code)**: JetBrains Mono, "Fira Code", monospace.
- **Scale**:
  - Display Title: `24px` | Bold (`700`)
  - Section Header: `18px` | SemiBold (`600`)
  - Subheader / Card Title: `15px` | Medium (`500`)
  - Body Text: `13px` / `14px` | Regular (`400`)
  - Caption / Badge: `11px` / `12px` | Medium (`500`)

---

## 2. Layout Structure & Window Architecture

```
+-----------------------------------------------------------------------------------+
|  [App Icon] NexaMeet     [ Search Bar (Cmd+K) ]            [Rec Status] [Settings] |
+-----------------------------------------------------------------------------------+
| Sidebar       | Main Content Area                                                 |
|               |                                                                   |
| [Meetings]    | Header: Meetings                                                  |
|  - All        | Category Pills: (All) (Work) (Personal) (★ Important)              |
|  - Work       | Date Tabs: [Today] [This Week] [This Month]                       |
|  - Personal   | ----------------------------------------------------------------- |
|  - Important  | Meeting Card 1: Recording Riley's Changes    (7:00 PM) (2 recs) >  |
|               | Meeting Card 2: Podcast Prep                 (7:45 PM) (1 rec)  > |
| [Templates]   | Meeting Card 3: Podcast with Riley  ★VIBECODE (9:00 PM) (mic)  > |
| [Calendar]    |                                                                   |
| [Trash]       |                                                                   |
|               |                                                                   |
| (● Record)    |                                                                   |
+---------------+-------------------------------------------------------------------+
```

---

## 3. Screen Specifications

### 3.1 Screen 1: Meetings Library Dashboard

#### Structural Elements
1. **Top Navigation & Filters**:
   - Header title: `Meetings`
   - Category Filter Pills:
     - `All` (Default, selected state: Solid Pill fill `#334155` or dark contrast)
     - `Work` (Icon: briefcase)
     - `Personal` (Icon: user)
     - `★ Important` (Icon: star)
   - Date Scope Tabs: `Today` | `This Week` | `This Month` with active animated underline sliding indicator.
   - Sync / Refresh button in top right.

2. **Meeting List Items**:
   - Vertical list of card items with hover elevate effect.
   - Left side: Meeting Title (e.g., *Recording Riley's Changes*), Meeting Time Range (e.g., `7:00 PM - 8:00 PM`).
   - Location / Sub-metadata (e.g., `Vibecode HQ`, calendar icon).
   - Right side: 
     - Star / Custom Badge (e.g., `★ VIBECODE` amber pill).
     - Recording count badge (e.g., blue circular badge `2`).
     - Active microphone pulse dot (green indicator if live or ready).
     - Chevron disclosure indicator (`>`).

---

### 3.2 Screen 2: Meeting Detail View

#### Structural Elements
1. **Header Navigation**:
   - Back button (`< Back`).
   - Title: Dynamic editable meeting title (*Recording Riley's Changes*).
   - Action menu button (`...` overflow menu: Delete, Rename, Export, Re-summarize).

2. **Recordings Carousel / Bar**:
   - Section header: `Recordings`
   - Horizontal pill cards for audio clips associated with the meeting:
     - `Recording 1` (Duration: `00:06`, Status: green dot, audio wave icon).
     - `Recording 2` (Duration: `00:08`, Status: green dot, audio wave icon).
   - Interactive: Clicking a recording pill opens audio playback controls at bottom or plays inline waveform.

3. **View Switcher Tabs**:
   - Segmented control tabs: `Transcription` | `Summary` (Selected tab highlighted with bold text and indicator line).

4. **Summary Tab Content Area**:
   - **AI Summary Section**:
     - Header: `📄 Summary` (Purple icon).
     - Paragraph text: Concise executive summary of meeting discussion.
   - **Key Points Section**:
     - Header: `★ Key Points` (Amber star icon).
     - Bulleted list with highlighted keywords.
   - **Action Items Section**:
     - Header: `☑ Action Items` (Checkbox list with assignee tags).

5. **Floating Action Bar**:
   - Centered bottom floating pill button: `🎙️ Add Recording` (Light blue / cyan text with audio mic icon).

---

### 3.3 Screen 3: Live Recording Overlay Modal

#### Structural Elements
1. **Modal Container**:
   - Floating modal dialog with blurred backdrop scrim (`backdrop-filter: blur(8px)`).
   - Header controls: `Cancel` text button on left, Modal title `New Recording` in center.

2. **Title Input**:
   - Optional text placeholder field: `Recording Title (optional)`.

3. **Audio Spectrum Visualizer**:
   - Central animated Microphone orb with pulsating radial glow gradient.
   - Status text: `Recording...` (Crimson red pulsing text).
   - Equalizer waveform bar chart: Multi-bar audio level spectrum analyzer (gradient cyan to emerald green).

4. **Timer**:
   - Display: Large digital monospace clock (`00:06` / `HH:MM:SS`).

5. **Recording Controls**:
   - `Pause / Resume` button: Orange/amber circular button with `||` icon.
   - `Stop & Save` button: Crimson red circular button with `■` stop icon.

---

### 3.4 Screen 4: Settings & Integration Modal

#### Tabs
1. **Audio Devices**: Select Microphone input device, System Audio loopback driver, input gain slider, test mic audio meter.
2. **AI Provider Configuration**:
   - Radio selector: `Local (Ollama / Whisper.cpp)` vs `Cloud (OpenAI / Anthropic / Deepgram)`.
   - API Key fields with secure masked password inputs (`sk-...`).
   - Model selector dropdown (`gpt-4o-mini`, `claude-3-5-sonnet`, `whisper-large-v3-turbo`).
3. **Templates Manager**: Create, edit, or delete custom prompt templates.
4. **Integrations**: Connect Google Calendar / Outlook OAuth status, Notion export workspace selector.

---

## 4. Keyboard Shortcuts & Gestures

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Cmd/Ctrl + N` | Global | New Meeting |
| `Cmd/Ctrl + Shift + R` | Global | Start/Stop Live Recording |
| `Cmd/Ctrl + K` | App | Open Command Palette / Universal Search |
| `Space` | Detail View | Play / Pause selected audio recording |
| `Cmd/Ctrl + E` | Detail View | Export Summary to Notion / Markdown |
| `Esc` | Modal | Dismiss Recording Modal / Settings |
