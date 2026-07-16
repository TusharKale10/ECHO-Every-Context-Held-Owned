import { useState } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { MemoryCard } from "@/components/memories/MemoryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import type { Memory } from "@/types";

const examples = [
  "Where did I fix OAuth?",
  "docker command",
  "JWT refresh token",
  "authentication middleware",
];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Memory[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setQ(term);
    setLoading(true);
    try {
      const { results } = await api.search(term);
      setResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Semantic Search"
        subtitle="Search meaning, not keywords — powered by Supermemory Local."
      />

      <Card hover={false} className="mb-4 flex items-center gap-2 p-2">
        <SearchIcon size={17} className="ml-2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(q)}
          placeholder="Ask your memory anything…"
          className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted"
          autoFocus
        />
        {loading && <Loader2 size={16} className="mr-2 animate-spin text-muted" />}
      </Card>

      <div className="mb-6 flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e}
            onClick={() => run(e)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-text"
          >
            {e}
          </button>
        ))}
      </div>

      {results && (
        <div className="space-y-3">
          <p className="text-xs text-muted">
            {results.length} results, ranked by semantic relevance
          </p>
          {results.map((m) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
          {results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
