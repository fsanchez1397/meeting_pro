import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

export function getAssetPath(assetName: string): string {
  if (isDev()) {
    // In development, use the assets folder in the project root
    return path.join(app.getAppPath(), 'assets', assetName);
  } else {
    // In production, use the resources folder in the app.asar.unpacked directory
    return path.join(process.resourcesPath, 'assets', assetName);
  }
}
