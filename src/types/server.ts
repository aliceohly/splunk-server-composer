import { CpuType } from "./cpu";
import { ServerModel } from "./serverModel";

export interface ServerComposition {
  cpu: CpuType;
  memorySize: number;
  hasGpuAccelerator: boolean;
}

export interface ServerComposerResult {
  models: ServerModel[];
  reasons: string[];
}
