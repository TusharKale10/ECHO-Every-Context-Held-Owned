export interface ContextEvent {
  id: string;
  source_type: string;
  application?: string | null;
  title?: string | null;
  content?: string | null;
  project_name?: string | null;
  repository?: string | null;
  branch?: string | null;
  file_path?: string | null;
  folder?: string | null;
  url?: string | null;
  domain?: string | null;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface Memory {
  id: string;
  title?: string | null;
  content?: string | null;
  source_type?: string | null;
  project_name?: string | null;
  repository?: string | null;
  file_path?: string | null;
  domain?: string | null;
  url?: string | null;
  created_at?: string | null;
  metadata: Record<string, unknown>;
  score?: number | null;
  pinned?: boolean;
  important?: boolean;
  irrelevant?: boolean;
  note?: string | null;
  action?: string | null;
}

export interface AskResponse {
  question: string;
  query: string;
  answer: string;
  grounded: boolean;
  time_filter?: string | null;
  evidence: Memory[];
}

export interface Session {
  id: string;
  title: string;
  auto_title: string;
  project: string;
  pinned: boolean;
  start: number;
  last_activity: number;
  count: number;
  sources: string[];
  files: string[];
  memory_ids: string[];
  preview: string[];
  memories?: Memory[];
}

export interface Profile {
  total_memories: number;
  pinned: number;
  top_projects: { name: string; count: number }[];
  top_sources: { name: string; count: number }[];
  top_domains: { name: string; count: number }[];
  recent_files: string[];
}

export interface DerivedItem {
  kind: string;
  text: string;
  memory_id?: string | null;
  source?: string | null;
  project?: string | null;
  created_at?: string | null;
}

export interface Passport {
  generated_at: number;
  goal?: string | null;
  project?: string | null;
  repository?: string | null;
  branch?: string | null;
  task?: string | null;
  active_session?: { id: string; title: string; count: number; last_activity: number } | null;
  recent_work: { text: string; id: string; source?: string | null; created_at?: string | null }[];
  recent_files: string[];
  decisions: DerivedItem[];
  blockers: DerivedItem[];
  related_context: { text: string; id: string; score?: number | null; source?: string | null }[];
  last_known_state?: string | null;
  suggested_next_action?: string | null;
  corrections_applied: Record<string, unknown>;
}

export interface SessionResume {
  session_id: string;
  title: string;
  project: string;
  what_you_were_doing?: string | null;
  relevant_files: string[];
  decisions: DerivedItem[];
  blockers: DerivedItem[];
  last_problem?: string | null;
  suggested_next_action?: string | null;
  memory_count: number;
}

export interface Analytics {
  period: string;
  days: number;
  total_events: number;
  generated_at: number;
  by_source: { name: string; count: number; pct: number }[];
  by_project: { name: string; count: number; pct: number }[];
  by_kind: { name: string; count: number; pct: number }[];
  day_series: { date: string; label: string; count: number }[];
  hour_series: { hour: number; count: number }[];
  most_active_source?: string | null;
  most_active_project?: string | null;
  busiest_hour?: number | null;
  busiest_day?: string | null;
}

export interface WatchedLocations {
  roots: string[];
  existing_roots: string[];
  excludes: string[];
  default_excludes: string[];
  paused: boolean;
}

export interface ProactiveSuggestion {
  text: string;
  project: string;
  memory_id: string;
  confidence: number;
  created_at: number;
}

export interface SurfacedMemory {
  memory: Memory;
  context_confidence: number;
  semantic_score?: number | null;
  reasons: string[];
}

export interface AmbientUpdate {
  context?: ContextEvent | null;
  surfaced: SurfacedMemory[];
  query?: string | null;
  generated_at: number;
}

export interface SourceStatus {
  available: boolean;
  enabled: boolean;
}

export interface SystemStatus {
  supermemory: { reachable: boolean; base_url: string; status?: string };
  user_container: string;
  sources: Record<string, SourceStatus>;
  surface_threshold: number;
}

export type Phase = "idle" | "detected" | "checking" | "surfaced" | "none";

export interface IngestInfo {
  id: string;
  source_type: string;
  preview: string;
}

export interface Diagnostics {
  supermemory: { reachable: boolean; base_url: string; status?: string };
  phase: string;
  ws_clients: number;
  sources: Record<string, SourceStatus>;
  pipeline: {
    last_event: ContextEvent | null;
    detected_at: number | null;
    last_filter: { meaningful: boolean; signature: string } | null;
    last_dedup: { significant: boolean; signature: string } | null;
    last_query: string | null;
    last_result_count: number | null;
    last_ranked_count: number | null;
    last_surfaced_ids: string[];
    last_ingest: Record<string, unknown> | null;
    phase: string;
    updated_at: number | null;
  };
}

export interface GraphData {
  nodes: {
    id: string;
    label: string;
    source_type: string;
    project?: string | null;
    repository?: string | null;
    file_path?: string | null;
    domain?: string | null;
    created_at?: string | null;
  }[];
  edges: { source: string; target: string; signals: string[]; weight: number }[];
}
