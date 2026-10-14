import { leerCaptura } from "@/lib/analisis/limites";

export const dynamic = "force-dynamic";

// La captura (JPEG) de un sitio ya analizado. El token es largo y se entrega solo dentro del análisis.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const jpeg = await leerCaptura((await params).token);
  if (!jpeg) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400", "X-Robots-Tag": "noindex" },
  });
}
