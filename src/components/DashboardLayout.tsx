import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardLayout({ title, description, children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-semibold">{title}</h1>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 shadow-md rounded-md opacity-50 bg-[#cabdaa]/[0.57]">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
