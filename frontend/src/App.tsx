import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/Toaster";
import { useContextStore } from "@/stores/useContextStore";
import ContextPage from "@/pages/ContextPage";
import ActivityPage from "@/pages/ActivityPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PassportPage from "@/pages/PassportPage";
import SessionsPage from "@/pages/SessionsPage";
import MemoriesPage from "@/pages/MemoriesPage";
import TimelinePage from "@/pages/TimelinePage";
import GraphPage from "@/pages/GraphPage";
import SearchPage from "@/pages/SearchPage";
import PrivacyPage from "@/pages/PrivacyPage";

export default function App() {
  const connect = useContextStore((s) => s.connect);
  const refreshStatus = useContextStore((s) => s.refreshStatus);

  useEffect(() => {
    connect();
    refreshStatus();
    const t = setInterval(refreshStatus, 5000);
    return () => clearInterval(t);
  }, [connect, refreshStatus]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text overflow-x-hidden">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<ContextPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}
