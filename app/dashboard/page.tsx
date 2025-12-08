import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/components/dashboard";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart2 } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardPage() {
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
            <BarChart2 className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Analytics Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Live PostHog data for the demo
              </p>
            </div>
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
