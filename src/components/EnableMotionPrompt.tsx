import { useEffect, useState } from "react";
import * as orientation from "../lib/orientation";

export default function EnableMotionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (orientation.hasPermissionAPI() && !orientation.isGranted()) {
      setVisible(true);
    } else {
      // If platform doesn't require permission, ensure manager marks granted and attaches
      orientation.requestPermission().catch(() => {});
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-w-sm rounded-lg bg-[#0b0b0f] p-6 text-center">
        <h3 className="mb-3 text-xl font-semibold text-white">Enable Motion</h3>
        <p className="mb-4 text-sm text-white/80">Tap the button below to allow device motion for interactive effects.</p>
        <button
          onClick={async () => {
            const ok = await orientation.requestPermission();
            if (ok) setVisible(false);
          }}
          className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-6 py-2 text-sm font-medium text-white"
        >
          Enable Motion
        </button>
      </div>
    </div>
  );
}
