import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface RouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => (
  <TooltipProvider>
    <Toaster />
    <Outlet />
    {/*<TanStackRouterDevtools  />*/}
  </TooltipProvider>
);

export const Route = createRootRouteWithContext<RouterContext>()({
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
