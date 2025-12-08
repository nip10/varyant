import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CopilotClient from "./client";
import { Suspense } from "react";
import { BotIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function CopilotPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/80">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/70 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                AI Copilot
              </h1>
              <p className="text-xs text-muted-foreground">
                Chat with the AI copilot, run tools, and approve actions inline.
              </p>
            </div>
          </div>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <CopilotClient />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
