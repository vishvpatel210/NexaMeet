# UI & UX Architecture: NexaMeet (Electron + React)

## 1. Interface Design Architecture

NexaMeet's desktop interface is built with React inside Electron's renderer process. It follows the **Obsidian Glass & Kinetic Cyan** design system specification (`docs/design_system.md`).

```
+-----------------------------------------------------------------------------------+
|  [Logo] NexaMeet       [ Search (Cmd+K) ]               [Live Rec Status] [Settings] |
+-----------------------------------------------------------------------------------+
| Sidebar         | Main Content View                                               |
|                 |                                                                 |
| [Meetings]      | Header: Meetings                                                |
|  - All          | Categories: (All) (Work) (Personal) (★ Important)                |
|  - Work         | Tabs: [Today] [This Week] [This Month]                          |
|  - Personal     | --------------------------------------------------------------- |
|  - Important    | Meeting Card 1: Recording Riley's Changes    (7:00 PM) (2 recs) >|
|                 | Meeting Card 2: Podcast Prep                 (7:45 PM) (1 rec)  >|
| [Templates]     | Meeting Card 3: Podcast with Riley  ★VIBECODE (9:00 PM) (mic)  >|
| [Calendar]      |                                                                 |
| [Settings]      |                                                                 |
|                 |                                                                 |
| (● New Rec)     |                                                                 |
+-----------------+-----------------------------------------------------------------+
```

---

## 2. Main Desktop Screens
1. **Meetings Dashboard**: Category filters, date scope selectors, quick recording action, meeting cards list.
2. **Meeting Detail Split View**: Left pane audio recordings carousel + verbatim transcript with timestamp seek; right pane structured AI summary (Executive Brief, Key Points, Action Items).
3. **Live Recording Glass Modal**: Audio spectrum visualizer bars, HH:MM:SS timer, pause/resume, and stop/save triggers.
4. **Settings & Integrations Modal**: API keys (Gemini / OpenAI / Whisper / Vector DB), audio input devices, calendar OAuth.
