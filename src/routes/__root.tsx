import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <TooltipProvider>
    <Toaster />
    <Outlet />
    {/*<TanStackRouterDevtools  />*/}
  </TooltipProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async () => {
    const authSession: string | null =
      ((await invoke("retrive_verify_auth_token")
        .then((data) => data)
        .catch((_err) => {
          return null;
        })) as string) || null;

    return {
      authSession,
    };
  },
});
