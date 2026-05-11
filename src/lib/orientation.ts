type OrientationCallback = (e: DeviceOrientationEvent) => void;

let granted = false;
let attached = false;
const listeners = new Set<OrientationCallback>();

function globalHandler(ev: Event) {
  const e = ev as DeviceOrientationEvent;
  for (const cb of listeners) cb(e);
}

type DeviceOrientationEventWithRequest = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function hasPermissionAPI(): boolean {
  const anyDO = DeviceOrientationEvent as unknown as DeviceOrientationEventWithRequest | undefined;
  return !!(anyDO && typeof anyDO.requestPermission === "function");
}

export function isGranted(): boolean {
  return granted;
}

export function addOrientationListener(cb: OrientationCallback) {
  listeners.add(cb);
  if (!attached) {
    window.addEventListener("deviceorientation", globalHandler as EventListener, true);
    attached = true;
  }
}

export function removeOrientationListener(cb: OrientationCallback) {
  listeners.delete(cb);
  if (attached && listeners.size === 0) {
    window.removeEventListener("deviceorientation", globalHandler as EventListener, true);
    attached = false;
  }
}

export async function requestPermission(): Promise<boolean> {
  const anyDO = DeviceOrientationEvent as unknown as DeviceOrientationEventWithRequest | undefined;
  try {
    if (anyDO && typeof anyDO.requestPermission === "function") {
      const res = await anyDO.requestPermission();
      granted = res === "granted";
      return granted;
    }
  } catch (_) {
    // ignore
  }
  // If no permission API, consider it granted
  granted = true;
  return true;
}
