import { ServerConfiguration, ServerEvaluationResult, ServerModel } from '../types/server';

// Constants for memory size validation
const MIN_MEMORY = 2048;
const MAX_MEMORY = 8388608;
const MIN_MEMORY_GPU_ACCELERATOR = 524288;
const MIN_MEMORY_4U = 131072;

export const evaluateServerConfiguration = (config: ServerConfiguration): ServerEvaluationResult => {
  const { cpu, memorySize, hasGpuAccelerator } = config;
  const models: ServerModel[] = [];
  const reasons: string[] = [];

  // Rule 4: Minimum memory check
  if (memorySize < MIN_MEMORY) {
    return {
      models: [],
      reason: 'Rule 4: Memory is lower than 2,048MB - No Options'
    };
  }

  // Rule 1: GPU Accelerator Card check
  if (hasGpuAccelerator) {
    if (cpu === 'ARM' && memorySize >= MIN_MEMORY_GPU_ACCELERATOR) {
      return {
        models: ['High Density Server'],
        reason: 'Rule 1: Matches GPU Accelerator requirements'
      };
    }
    return {
      models: [],
      reason: 'Rule 1: GPU Accelerator requires ARM CPU and memory >= 524,288MB - No Options'
    };
  }

  // Rules 2 and 3: CPU and Memory combinations
  if (cpu === 'Power') {
    models.push('Mainframe');
    reasons.push('Rule 2: Power CPU can build Mainframe');
    
    if (memorySize >= MIN_MEMORY_4U) {
      models.push('4U Rack Server');
      models.push('Tower Server');
      reasons.push('Rule 3: Memory >= 131,072MB allows 4U Rack Server and Tower Server');
    } else {
      models.push('Tower Server');
      reasons.push('Rule 3: Memory < 131,072MB allows Tower Server');
    }
  } else {
    if (memorySize >= MIN_MEMORY_4U) {
      models.push('4U Rack Server');
      models.push('Tower Server');
      reasons.push('Rule 3: Memory >= 131,072MB allows 4U Rack Server and Tower Server');
    } else {
      models.push('Tower Server');
      reasons.push('Rule 3: Memory < 131,072MB allows Tower Server');
    }
  }

  // Rule 4: Default case - No Options if no models were added
  if (models.length === 0) {
    return {
      models: [],
      reason: 'Rule 5: No matching server configurations found'
    };
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