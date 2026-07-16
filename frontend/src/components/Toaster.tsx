import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToast } from "@/stores/useToast";

const TONE = {
  success: { icon: CheckCircle2, color: "#16a34a" },
  info: { icon: Info, color: "#2f5bff" },
  error: { icon: XCircle, color: "#ea580c" },
};

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => {
        const { icon: Icon, color } = TONE[t.tone];
        return (
          <div
            key={t.id}
            className="toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border border-border bg-elevated/95 px-4 py-2.5 text-sm text-text shadow-lg backdrop-blur"
          >
            <Icon size={16} style={{ color }} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
