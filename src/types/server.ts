import { CpuType } from './cpu';
import { ServerModel } from './serverModel';

export interface ServerConfiguration {
  cpu: CpuType;
  memorySize: number;
  hasGpuAccelerator: boolean;
}

export interface ServerEvaluationResult {
  models: ServerModel[];
  reasons: string[];
} 