import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    (async () => {
      // We recommend to call `load` at application startup.
      const fp = await FingerprintJS.load();

      // The FingerprintJS agent is ready.
      // Get a visitor identifier when you'd like to.
      const result = await fp.get();

      // This is the visitor identifier:
      const visitorId = result.visitorId;
      setFingerprint(visitorId);
    })();
  }, []);

  return fingerprint;
}
