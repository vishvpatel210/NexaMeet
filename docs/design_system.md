# Design System Specification: Obsidian Glass & Kinetic Cyan

NexaMeet uses a custom, high-contrast visual design system built specifically for AI desktop applications.

## 1. Color Palette Tokens

### 1.1 Canvas & Surfaces
- **Canvas (Body Background)**: `#090D16` (Deep Midnight Obsidian)
- **Surface Level 1 (Sidebar / Navbar)**: `#0F172A` (Prism Dark Slate)
- **Surface Level 2 (Cards & Modules)**: `#151D2F` (Obsidian Card Surface)
- **Surface Level 3 (Elevated / Dialogs)**: `#1E293B` (Elevated Panel)
- **Interactive Hover**: `#2A374E`
- **Borders & Dividers**: `rgba(255, 255, 255, 0.08)` / active `rgba(6, 182, 212, 0.3)`

### 1.2 Accent & Brand Gradients
- **Brand Primary Gradient**: `linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)` (Kinetic Cyan to Electric Cobalt)
- **Recording Glow**: `#F43F5E` (Rose Crimson) with ambient radial pulsing ring `rgba(244, 63, 94, 0.4)`
- **AI Sparkle Pill**: `#10B981` (Emerald Spark) & `#A855F7` (Amethyst Purple)
- **Star / Highlight Tag**: `#F59E0B` (Amber Gold)

---

## 2. Typography System

- **Display Headings**: *Outfit* / *Plus Jakarta Sans* (Bold geometric typography)
- **Interface & Body**: *Inter* / system-ui
- **Code & Timestamps**: *JetBrains Mono* / monospace

### Scale
- **Display 1**: `26px` | Bold `700` | Line height `1.2`
- **Heading 2**: `20px` | SemiBold `600` | Line height `1.3`
- **Heading 3**: `16px` | Medium `500` | Line height `1.4`
- **Body Regular**: `14px` | Regular `400` | Line height `1.5`
- **Caption / Badge**: `12px` | Medium `500` | Line height `1.4`

---

## 3. Reusable Components Specs

### 3.1 Buttons (`.btn`)
- **Primary**: Kinetic Cyan Gradient fill (`#06B6D4` -> `#3B82F6`), white text, shadow `0 4px 14px rgba(6, 182, 212, 0.35)`.
- **Glass Secondary**: Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.1)`, backdrop blur `12px`.
- **Recording Pulse**: Rose fill (`#F43F5E`), white text, pulsing outer glow animation.

### 3.2 Category Pills & Tabs
- Category pills: Height `32px`, border radius `9999px`, padding `0 14px`.
- Active Pill: Dark contrast fill `#1E293B`, Cyan accent ring border `1px solid #06B6D4`.

### 3.3 Audio Waveform Equalizer
- Multi-bar animated vertical bars. Height dynamically scales between `10%` and `100%` using CSS `keyframes` or real-time Web Audio API signal levels.
