"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  BarChart3Icon,
  BeakerIcon,
  BotIcon,
  CameraIcon,
  FlagIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  LightbulbIcon,
  MicIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TicketIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { experimentTemplates } from "@/lib/templates";

interface CommandPaletteProps {
  /** Optional callback when navigating to copilot with a preset message */
  onCopilotMessage?: (message: string) => void;
}

export function CommandPalette({ onCopilotMessage }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  const navigateTo = useCallback(
    (path: string) => {
      runCommand(() => router.push(path));
    },
    [router, runCommand]
  );

  const sendToCopilot = useCallback(
    (message: string) => {
      runCommand(() => {
        if (onCopilotMessage) {
          onCopilotMessage(message);
        } else {
          // Navigate to copilot with the message as a query param
          router.push(`/copilot?message=${encodeURIComponent(message)}`);
        }
      });
    },
    [router, runCommand, onCopilotMessage]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigateTo("/")}>
            <HomeIcon className="mr-2 size-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/copilot")}>
            <BotIcon className="mr-2 size-4" />
            <span>Copilot</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/dashboard")}>
            <LayoutDashboardIcon className="mr-2 size-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => sendToCopilot("Create a new experiment for ")}>
            <BeakerIcon className="mr-2 size-4 text-blue-500" />
            <span>Create Experiment</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("Create a feature flag for ")}>
            <FlagIcon className="mr-2 size-4 text-purple-500" />
            <span>Create Feature Flag</span>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("Create a Linear ticket for ")}>
            <TicketIcon className="mr-2 size-4 text-indigo-500" />
            <span>Create Linear Ticket</span>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("Show me experiment templates")}>
            <LayoutTemplateIcon className="mr-2 size-4 text-green-500" />
            <span>Browse Templates</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Analytics */}
        <CommandGroup heading="Analytics">
          <CommandItem onSelect={() => sendToCopilot("Show me all PostHog insights")}>
            <LightbulbIcon className="mr-2 size-4 text-orange-500" />
            <span>View Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("How many users signed up last week?")}>
            <BarChart3Icon className="mr-2 size-4 text-orange-500" />
            <span>Query Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("Analyze my experiments and suggest next steps")}>
            <TrendingUpIcon className="mr-2 size-4 text-green-500" />
            <span>Analyze Experiments</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Research */}
        <CommandGroup heading="Research">
          <CommandItem onSelect={() => sendToCopilot("Take a screenshot of ")}>
            <CameraIcon className="mr-2 size-4 text-cyan-500" />
            <span>Capture Screenshot</span>
          </CommandItem>
          <CommandItem onSelect={() => sendToCopilot("Analyze competitor ")}>
            <SearchIcon className="mr-2 size-4 text-cyan-500" />
            <span>Analyze Competitor</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Popular Templates */}
        <CommandGroup heading="Popular Templates">
          {experimentTemplates.slice(0, 4).map((template) => (
            <CommandItem
              key={template.id}
              onSelect={() =>
                sendToCopilot(`Use the ${template.name} template to create an experiment`)
              }
            >
              <BeakerIcon className="mr-2 size-4 text-muted-foreground" />
              <span>{template.name}</span>
              <span className="ml-2 text-xs text-muted-foreground truncate max-w-[200px]">
                {template.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Hook to use command palette state
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
