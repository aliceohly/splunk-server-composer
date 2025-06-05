import { MAX_MEMORY, MIN_MEMORY } from "../constants/memory";

export const validateMemorySize = (memorySize: number): boolean => {
  if (memorySize < MIN_MEMORY || memorySize > MAX_MEMORY) {
    return false;
  }

  // Check if it's a power of 2
  return (memorySize & (memorySize - 1)) === 0;
};
