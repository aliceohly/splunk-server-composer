export type CPUType = 'X86' | 'Power' | 'ARM';

export type ServerModel = 'Tower Server' | '4U Rack Server' | 'Mainframe' | 'High Density Server';

export interface ServerConfiguration {
  cpu: CPUType;
  memorySize: number;
  hasGpuAccelerator: boolean;
}

export interface ServerEvaluationResult {
  models: ServerModel[];
  reason: string;
} 