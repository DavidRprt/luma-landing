import { leerCaptura } from "@/lib/landings";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const c = await leerCaptura((await params).token);
  if (!c) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(c.data), {
    headers: { "Content-Type": c.tipo, "Cache-Control": "private, max-age=86400", "X-Robots-Tag": "noindex" },
  });
}
