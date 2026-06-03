import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UserPlus, Shield, User, Briefcase } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Utilisateurs · Wakhalog" }] }),
  component: UsersPage,
});

const USERS = [
  { name: "Mamadou Diop", phone: "+221 77 123 45 67", role: "Citoyen", conv: 14, last: "Il y a 2 min" },
  { name: "Awa Sow", phone: "+221 76 555 11 22", role: "Citoyen", conv: 8, last: "Il y a 25 min" },
  { name: "Cheikh Bâ", phone: "+221 77 800 90 12", role: "Consultant", conv: 156, last: "Il y a 1h" },
  { name: "Aminata Ndiaye", phone: "+221 77 999 88 77", role: "Super Admin", conv: 0, last: "Hier" },
  { name: "Ibrahima Fall", phone: "+221 78 222 33 44", role: "Citoyen", conv: 3, last: "Il y a 3h" },
];

const ROLE_ICON = {
  "Citoyen": User,
  "Consultant": Briefcase,
  "Super Admin": Shield,
} as const;

function UsersPage() {
  return (
    <AppShell
      title="Utilisateurs"
      subtitle="Citoyens, consultants administratifs et super-admins"
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <UserPlus className="h-4 w-4" /> Inviter
        </button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <RoleCard role="Citoyens" count={1180} icon={User} />
        <RoleCard role="Consultants" count={12} icon={Briefcase} color="secondary" />
        <RoleCard role="Super Admins" count={3} icon={Shield} color="accent" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Téléphone</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Conversations</th>
              <th className="px-6 py-4">Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => {
              const Icon = ROLE_ICON[u.role as keyof typeof ROLE_ICON];
              return (
                <tr key={u.phone} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{u.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs">
                      <Icon className="h-3 w-3" /> {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.conv}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.last}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function RoleCard({ role, count, icon: Icon, color = "primary" }: { role: string; count: number; icon: typeof User; color?: "primary" | "secondary" | "accent" }) {
  const cls = color === "primary" ? "bg-primary/10 text-primary" : color === "secondary" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent";
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${cls}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="font-display text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
}
