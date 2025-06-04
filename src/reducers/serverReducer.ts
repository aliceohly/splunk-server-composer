import { ServerConfiguration, ServerEvaluationResult, ServerModel } from '../types/server';

// Constants for memory size validation
const MIN_MEMORY = 2048;
const MAX_MEMORY = 8388608;
const MIN_MEMORY_GPU = 524288;
const MIN_MEMORY_4U = 131072;

export const evaluateServerConfiguration = (config: ServerConfiguration): ServerEvaluationResult => {
  const { cpu, memorySize, hasGpuAccelerator } = config;
  const models: ServerModel[] = [];
  const reasons: string[] = [];

  // Rule 4: Minimum memory check
  if (memorySize < MIN_MEMORY) {
    return {
      models: [],
      reason: 'Match Rule 4: Memory is lower than 2,048MB'
    };
  }

  // Rule 1: GPU Accelerator Card check
  if (hasGpuAccelerator) {
    if (cpu === 'ARM' && memorySize >= MIN_MEMORY_GPU) {
      return {
        models: ['High Density Server'],
        reason: 'Match Rule 1'
      };
    }
    return {
      models: [],
      reason: 'GPU Accelerator requires ARM CPU and memory >= 524,288MB'
    };
  }

  // Rule 2: Power CPU check
  if (cpu === 'Power') {
    models.push('Mainframe');
    reasons.push('Power CPU can build Mainframe');
  }

  // Rule 3: Memory size check for Tower and 4U Rack
  if (memorySize >= MIN_MEMORY_4U) {
    models.push('4U Rack Server');
    models.push('Tower Server');
    reasons.push('Memory >= 131,072MB can be both 4U Rack Server and Tower Server');
  } else {
    models.push('Tower Server');
    reasons.push('Memory < 131,072MB can only be Tower Server');
  }

  // Additional Power CPU models
  if (cpu === 'Power' && !hasGpuAccelerator) {
    reasons.push('Power CPU can build other Server Models except High Density');
  }

  return {
    models: Array.from(new Set(models)),
    reason: reasons.join(' and ')
  };
};

export const validateMemorySize = (memorySize: number): boolean => {
  if (memorySize < MIN_MEMORY || memorySize > MAX_MEMORY) {
    return false;
  }
  
  // Check if it's a power of 2
  return (memorySize & (memorySize - 1)) === 0;
}; 