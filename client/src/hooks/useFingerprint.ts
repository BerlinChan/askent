import { useState, useEffect } from "react";
import Fingerprint2 from "fingerprintjs2";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    setTimeout(async () => {
      const components = await Fingerprint2.getPromise({
        excludes: {
          adBlock: true,
          enumerateDevices: true
        }
      });
      const values = components.map(component => component.value);
      const murmur = Fingerprint2.x64hash128(values.join(""), 31);
      setFingerprint(murmur);
    }, 500);
  }, []);

  return fingerprint;
}
