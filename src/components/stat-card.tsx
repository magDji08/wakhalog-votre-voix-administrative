import { type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  trend = "up",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-xs ${
            trend === "up"
              ? "text-accent"
              : trend === "down"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
