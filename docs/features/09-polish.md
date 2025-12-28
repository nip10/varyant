# Feature: Polish & Delight

> Small touches that make the experience memorable

## Overview

A collection of polish features that add personality and delight to the Varyant copilot experience.

---

## 9a. Celebration Animations

### Description
When an experiment wins (reaches statistical significance with positive results), celebrate with confetti or other visual feedback.

### Implementation

```tsx
// lib/hooks/use-confetti.ts
import confetti from 'canvas-confetti';

export function useConfetti() {
  const celebrate = () => {
    // Fire from both sides
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.2 } });
    fire(0.2, { spread: 60, origin: { x: 0.5 } });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0.8 } });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  };

  return { celebrate };
}
```

### Trigger Points
- Experiment reaches 95% significance with winning variant
- Feature flag rolled out to 100%
- Milestone reached (1000th experiment, etc.)

### UX
```tsx
// In ExperimentAnalysisResult when recommendation is SHIP
const { celebrate } = useConfetti();

useEffect(() => {
  if (recommendation === 'SHIP' && stats.significance >= 0.95) {
    celebrate();
  }
}, [recommendation, stats.significance]);
```

### Dependencies
- `canvas-confetti` (3KB)

---

## 9b. Shareable Cards

### Description
Export experiment results, insights, or achievements as beautiful images that can be shared on Slack, Twitter, or saved for presentations.

### Implementation

```tsx
// components/shareable-card.tsx
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ShareIcon, CopyIcon } from 'lucide-react';

interface ShareableCardProps {
  type: 'experiment-win' | 'insight' | 'milestone';
  data: {
    title: string;
    metric: string;
    value: string;
    improvement?: string;
    date: string;
  };
}

export function ShareableCard({ type, data }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2, // High resolution
    });

    const link = document.createElement('a');
    link.download = `varyant-${type}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyToClipboard = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    canvas.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* The card to export */}
      <div ref={cardRef} className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border">
        <div className="flex items-center gap-2 mb-4">
          <img src="/varyant-logo.svg" alt="Varyant" className="h-5" />
          <span className="text-xs text-muted-foreground">Experiment Results</span>
        </div>

        <h3 className="text-xl font-bold">{data.title}</h3>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">{data.value}</span>
          {data.improvement && (
            <span className="text-lg text-green-500">+{data.improvement}</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-1">{data.metric}</p>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          {data.date} • varyant.ai
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={exportAsImage}>
          <DownloadIcon className="size-4 mr-1.5" />
          Save PNG
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <CopyIcon className="size-4 mr-1.5" />
          Copy Image
        </Button>
      </div>
    </div>
  );
}
```

### Card Types

1. **Experiment Win Card**
   - Experiment name
   - Winning variant
   - Improvement percentage
   - Confidence level

2. **Insight Card**
   - Key metric
   - Value
   - Trend indicator
   - Time period

3. **Milestone Card**
   - Achievement badge
   - Description
   - Date achieved

### Dependencies
- `html2canvas` (40KB)

---

## 9c. Command Palette

### Description
A Spotlight-like command palette (`Cmd+P`) for power users to quickly access any feature.

### Implementation

```tsx
// components/command-palette.tsx
import { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import {
  BeakerIcon, FlagIcon, BarChart3Icon, ListTodoIcon,
  CameraIcon, SettingsIcon, HelpCircleIcon
} from 'lucide-react';

interface CommandPaletteProps {
  onCommand: (command: string) => void;
}

export function CommandPalette({ onCommand }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  // Toggle on Cmd+P / Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = useCallback((command: string) => {
    setOpen(false);
    onCommand(command);
  }, [onCommand]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed inset-0 z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <Command className="bg-background border rounded-xl shadow-2xl overflow-hidden">
          <Command.Input
            placeholder="Type a command or search..."
            className="w-full px-4 py-3 border-b outline-none"
          />

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="p-4 text-sm text-muted-foreground text-center">
              No results found.
            </Command.Empty>

            <Command.Group heading="Experiments">
              <CommandItem
                icon={BeakerIcon}
                label="New Experiment"
                shortcut="E"
                onSelect={() => handleSelect('/experiment')}
              />
              <CommandItem
                icon={BeakerIcon}
                label="View Experiments"
                onSelect={() => handleSelect('Show all experiments')}
              />
            </Command.Group>

            <Command.Group heading="Feature Flags">
              <CommandItem
                icon={FlagIcon}
                label="Create Feature Flag"
                shortcut="F"
                onSelect={() => handleSelect('/flag')}
              />
              <CommandItem
                icon={FlagIcon}
                label="View Flags"
                onSelect={() => handleSelect('Show all feature flags')}
              />
            </Command.Group>

            <Command.Group heading="Analytics">
              <CommandItem
                icon={BarChart3Icon}
                label="Query Insights"
                shortcut="I"
                onSelect={() => handleSelect('/insights')}
              />
            </Command.Group>

            <Command.Group heading="Tools">
              <CommandItem
                icon={ListTodoIcon}
                label="Create Linear Ticket"
                shortcut="T"
                onSelect={() => handleSelect('/ticket')}
              />
              <CommandItem
                icon={CameraIcon}
                label="Capture Screenshot"
                shortcut="S"
                onSelect={() => handleSelect('/screenshot')}
              />
            </Command.Group>

            <Command.Group heading="Help">
              <CommandItem
                icon={HelpCircleIcon}
                label="Keyboard Shortcuts"
                onSelect={() => handleSelect('Show keyboard shortcuts')}
              />
              <CommandItem
                icon={SettingsIcon}
                label="Settings"
                onSelect={() => handleSelect('/settings')}
              />
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </Command.Dialog>
  );
}

function CommandItem({
  icon: Icon,
  label,
  shortcut,
  onSelect
}: {
  icon: typeof BeakerIcon;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer data-[selected=true]:bg-muted"
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
```

### Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Open command palette |
| `Cmd+K` | Focus chat input |
| `Cmd+Enter` | Submit message |
| `Escape` | Close/clear |
| `Cmd+E` | New experiment |
| `Cmd+F` | New feature flag |
| `Cmd+I` | Query insights |

### Dependencies
- `cmdk` (command menu library, 10KB)

---

## Implementation Checklist

### Celebration Animations
- [ ] Install `canvas-confetti`
- [ ] Create `useConfetti` hook
- [ ] Add trigger to experiment win state
- [ ] Test on various screens

### Shareable Cards
- [ ] Install `html2canvas`
- [ ] Create `ShareableCard` component
- [ ] Design 3 card types
- [ ] Add export/copy buttons
- [ ] Test image quality

### Command Palette
- [ ] Install `cmdk`
- [ ] Create `CommandPalette` component
- [ ] Define all commands
- [ ] Add keyboard shortcuts
- [ ] Integrate with chat

---

## Estimated Effort

| Feature | Effort | Impact |
|---------|--------|--------|
| Confetti | Low | High (delight) |
| Shareable Cards | Medium | Medium (utility) |
| Command Palette | Medium | High (power users) |

**Total: 2-3 days**

---

## Related Features

- All features (Command Palette provides quick access)
- AI Experiment Analyst (triggers Confetti)
- Live Dashboard (source for Shareable Cards)
