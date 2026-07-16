import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { api } from "@/services/api";
import { Button, Card } from "@/components/ui";
import { MemoryCard } from "@/components/memories/MemoryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import type { Memory } from "@/types";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { memories } = await api.memories(200);
      setMemories(memories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remember = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      await api.ingestManual(draft.trim());
      setDraft("");
      setTimeout(load, 800);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    await api.deleteMemory(id);
    setMemories((m) => m.filter((x) => x.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Memories"
        subtitle={`${memories.length} memories stored locally in Supermemory`}
      />

      <Card hover={false} className="mb-6 flex items-center gap-2 p-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && remember()}
          placeholder="Remember something manually…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted"
        />
        <Button onClick={remember} disabled={saving || !draft.trim()}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Remember
        </Button>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20 text-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map((m) => (
            <MemoryCard
              key={m.id}
              memory={m}
              onDelete={del}
              onChanged={(u) => setMemories((prev) => prev.map((x) => (x.id === u.id ? u : x)))}
            />
          ))}
          {memories.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              No memories yet. Work in your editor/browser or add one above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
