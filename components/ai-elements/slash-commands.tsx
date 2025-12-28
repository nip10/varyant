"use client";

import { cn } from "@/lib/utils";
import {
  BeakerIcon,
  CameraIcon,
  FlagIcon,
  LayoutTemplateIcon,
  LightbulbIcon,
  TicketIcon,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface SlashCommand {
  command: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/experiment",
    description: "Create a new experiment",
    prompt: "Create a new experiment for ",
    icon: BeakerIcon,
  },
  {
    command: "/template",
    description: "Browse experiment templates",
    prompt: "Show me experiment templates",
    icon: LayoutTemplateIcon,
  },
  {
    command: "/flag",
    description: "Create a feature flag",
    prompt: "Create a feature flag for ",
    icon: FlagIcon,
  },
  {
    command: "/insights",
    description: "Show all PostHog insights",
    prompt: "Show me all PostHog insights",
    icon: LightbulbIcon,
  },
  {
    command: "/ticket",
    description: "Create a Linear ticket",
    prompt: "Create a Linear ticket for ",
    icon: TicketIcon,
  },
  {
    command: "/screenshot",
    description: "Take a screenshot",
    prompt: "Take a screenshot of ",
    icon: CameraIcon,
  },
];

export interface SlashCommandsRef {
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
}

export interface SlashCommandsProps {
  inputValue: string;
  onSelect: (prompt: string) => void;
  onClose: () => void;
  className?: string;
}

export const SlashCommands = forwardRef<SlashCommandsRef, SlashCommandsProps>(
  function SlashCommands({ inputValue, onSelect, onClose, className }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter commands based on input
    const filteredCommands = SLASH_COMMANDS.filter((cmd) =>
      cmd.command.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    // Reset selected index when filtered commands change
    useEffect(() => {
      setSelectedIndex(0);
    }, [inputValue]);

    // Scroll selected item into view
    useEffect(() => {
      const selectedElement = listRef.current?.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    const handleSelect = useCallback(
      (command: SlashCommand) => {
        onSelect(command.prompt);
      },
      [onSelect]
    );

    // Expose keyboard handler to parent
    useImperativeHandle(
      ref,
      () => ({
        handleKeyDown: (e: React.KeyboardEvent) => {
          if (filteredCommands.length === 0) return false;

          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev < filteredCommands.length - 1 ? prev + 1 : 0
              );
              return true;
            case "ArrowUp":
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredCommands.length - 1
              );
              return true;
            case "Enter":
              e.preventDefault();
              if (filteredCommands[selectedIndex]) {
                handleSelect(filteredCommands[selectedIndex]);
              }
              return true;
            case "Escape":
              e.preventDefault();
              onClose();
              return true;
            case "Tab":
              e.preventDefault();
              if (filteredCommands[selectedIndex]) {
                handleSelect(filteredCommands[selectedIndex]);
              }
              return true;
            default:
              return false;
          }
        },
      }),
      [filteredCommands, selectedIndex, handleSelect, onClose]
    );

    if (filteredCommands.length === 0) {
      return (
        <div
          className={cn(
            "absolute bottom-full left-0 right-0 mb-1 rounded-md border border-border bg-popover p-2 shadow-md",
            className
          )}
        >
          <p className="text-sm text-muted-foreground">No commands found</p>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "absolute bottom-full left-0 right-0 mb-1 max-h-64 overflow-y-auto rounded-md border border-border bg-popover shadow-md",
          className
        )}
      >
        <div className="p-1" ref={listRef}>
          {filteredCommands.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                key={command.command}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => handleSelect(command)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{command.command}</span>
                  <span className="text-xs text-muted-foreground">
                    {command.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

export function useSlashCommands(
  inputValue: string,
  onInputChange: (value: string) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const slashCommandsRef = useRef<SlashCommandsRef>(null);

  // Check if we should show slash commands
  const shouldShowSlashCommands = inputValue.startsWith("/");

  useEffect(() => {
    setIsOpen(shouldShowSlashCommands);
  }, [shouldShowSlashCommands]);

  const handleSelect = useCallback(
    (prompt: string) => {
      onInputChange(prompt);
      setIsOpen(false);
    },
    [onInputChange]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isOpen && slashCommandsRef.current) {
        return slashCommandsRef.current.handleKeyDown(e);
      }
      return false;
    },
    [isOpen]
  );

  return {
    isOpen,
    slashCommandsRef,
    handleSelect,
    handleClose,
    handleKeyDown,
  };
}
