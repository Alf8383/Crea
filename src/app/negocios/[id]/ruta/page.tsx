import Link from "next/link";
import { notFound } from "next/navigation";
import { RouteDashboard } from "@/components/route-dashboard";
import { toContext } from "@/lib/business-context";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function RoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "demo") return <RouteDashboard />;
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await getSupabaseServer();
  if (!supabase) notFound();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data } = await supabase.from("businesses").select("questionnaire").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!data) notFound();
  if (!data.questionnaire) return <main className="mx-auto max-w-3xl space-y-5 p-8">
    <h1 className="text-2xl font-bold">Evaluación anterior</h1>
    <p>Este registro se creó antes de guardar respuestas con la evaluación gastronómica.</p>
    <Link href="/negocios" className="font-bold text-[#1464f6] underline">Volver a Mi espacio</Link>
  </main>;
  return <RouteDashboard initialContext={toContext(data.questionnaire)} />;
}
