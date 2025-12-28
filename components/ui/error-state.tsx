import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm",
          "animate-in fade-in duration-200",
          className
        )}
      >
        <AlertCircleIcon className="size-4 shrink-0 text-red-500" />
        <span className="text-red-700 dark:text-red-400 flex-1">{message}</span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <RefreshCwIcon className="size-3.5" />
            <span className="sr-only md:not-sr-only md:ml-1.5">Retry</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center",
        "animate-in fade-in duration-200",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircleIcon className="size-6 text-red-500" />
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
          <RefreshCwIcon className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3",
        "animate-in fade-in slide-in-from-bottom-1 duration-200",
        className
      )}
    >
      <AlertCircleIcon className="size-4 shrink-0 text-red-500 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
        {onRetry && (
          <Button
            variant="link"
            size="sm"
            onClick={onRetry}
            className="h-auto p-0 mt-1 text-red-600 hover:text-red-700"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
