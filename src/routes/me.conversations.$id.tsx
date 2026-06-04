import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, User as UserIcon, Mic, Volume2 } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { getConversation, type Conversation } from "@/lib/citizen-store";
import { useTTS } from "@/lib/use-tts";

export const Route = createFileRoute("/me/conversations/$id")({
  head: ({ params }) => ({ meta: [{ title: `Conversation · Wakhalog` }] }),
  component: ConvView,
});

function ConvView() {
  const { id } = Route.useParams();
  const [conv, setConv] = useState<Conversation | undefined>();
  const [loaded, setLoaded] = useState(false);
  const { speak } = useTTS();

  useEffect(() => {
    setConv(getConversation(id));
    setLoaded(true);
  }, [id]);

  if (loaded && !conv) {
    return (
      <MeShell title="Conversation introuvable">
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">Cette conversation n'existe plus.</p>
          <Link
            to="/me/conversations"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à mes conversations
          </Link>
        </div>
      </MeShell>
    );
  }

  if (!conv) return <MeShell title="Chargement…"><div /></MeShell>;

  return (
    <MeShell
      title={conv.title}
      subtitle={`${conv.messages.length} message${conv.messages.length > 1 ? "s" : ""} · ${new Date(
        conv.createdAt,
      ).toLocaleDateString("fr-FR")}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/me/conversations"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Toutes mes conversations
        </Link>
        <Link
          to="/chat"
          search={{ c: conv.id } as never}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
        >
          <Mic className="h-4 w-4" /> Continuer cette conversation
        </Link>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 md:p-6">
        {conv.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Cette conversation est vide. Cliquez sur « Continuer » pour démarrer.
          </p>
        ) : (
          conv.messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-2xl rounded-tl-sm border border-border/60 bg-muted text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                  {!isUser && (
                    <button
                      onClick={() => void speak(m.text, m.lang ?? "fr")}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      <Volume2 className="h-3 w-3" /> Écouter
                    </button>
                  )}
                </div>
                {isUser && (
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </MeShell>
  );
}
