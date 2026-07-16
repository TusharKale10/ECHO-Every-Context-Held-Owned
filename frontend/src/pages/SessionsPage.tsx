import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { SessionCard } from "@/components/sessions/SessionCard";
import type { Session } from "@/types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.sessions().then(({ sessions }) => setSessions(sessions)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Context Sessions"
        subtitle="Related activity grouped into resumable work sessions — from your real memories."
      />
      {loading ? (
        <div className="flex justify-center py-20 text-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No sessions yet — as you work across projects, ECHO groups the activity here.
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
