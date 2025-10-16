// Type definitions for Deno runtime in Supabase Functions
interface DenoNamespace {
  serve(handler: (req: Request) => Promise<Response>): void;
  upgradeWebSocket(request: Request): { socket: WebSocket; response: Response };
  env: {
    get(key: string): string | undefined;
  };
}

declare const Deno: DenoNamespace;

export {};
