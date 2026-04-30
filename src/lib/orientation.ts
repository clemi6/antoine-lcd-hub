type OrientationCallback = (e: DeviceOrientationEvent) => void;

let granted = false;
let attached = false;
const listeners = new Set<OrientationCallback>();

function globalHandler(e: DeviceOrientationEvent) {
  for (const cb of listeners) cb(e);
}

export function hasPermissionAPI() {
  const anyDO = (DeviceOrientationEvent as any);
  return !!(anyDO && typeof anyDO.requestPermission === "function");
}

export function isGranted() {
  return granted;
}

export function addOrientationListener(cb: OrientationCallback) {
  listeners.add(cb);
  if (!attached) {
    window.addEventListener("deviceorientation", globalHandler as any, true as any);
    attached = true;
  }
}

export function removeOrientationListener(cb: OrientationCallback) {
  listeners.delete(cb);
  if (attached && listeners.size === 0) {
    window.removeEventListener("deviceorientation", globalHandler as any, true as any);
    attached = false;
  }
}

export async function requestPermission(): Promise<boolean> {
  const anyDO = (DeviceOrientationEvent as any);
  try {
    if (anyDO && typeof anyDO.requestPermission === "function") {
      const res = await anyDO.requestPermission();
      granted = res === "granted";
      return granted;
    }
  } catch (e) {
    // ignore
  }
  // If no permission API, consider it granted
  granted = true;
  return true;
}
