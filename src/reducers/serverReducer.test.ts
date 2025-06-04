import { evaluateServerConfiguration, validateMemorySize } from './serverReducer';
import { ServerConfiguration } from '../types/server';

describe('Server Configuration Evaluation', () => {
  test('should return no options when memory is below minimum', () => {
    const config: ServerConfiguration = {
      cpu: 'X86',
      memorySize: 1024,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toHaveLength(0);
    expect(result.reason).toContain('Memory is lower than 2,048MB');
  });

  test('should return High Density Server for GPU with ARM CPU and sufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: 'ARM',
      memorySize: 524288,
      hasGpuAccelerator: true,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toEqual(['High Density Server']);
    expect(result.reason).toContain('Match Rule 1');
  });

  test('should return no options for GPU with insufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: 'ARM',
      memorySize: 262144,
      hasGpuAccelerator: true,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toHaveLength(0);
    expect(result.reason).toContain('GPU Accelerator requires');
  });

  test('should return Mainframe for Power CPU with sufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: 'Power',
      memorySize: 262144,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toContain('Mainframe');
    expect(result.models).toContain('Tower Server');
    expect(result.models).toContain('4U Rack Server');
  });

  test('should return only Tower Server for memory below 131072MB', () => {
    const config: ServerConfiguration = {
      cpu: 'X86',
      memorySize: 65536,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toEqual(['Tower Server']);
    expect(result.reason).toContain('Memory < 131,072MB');
  });
});

describe('Memory Size Validation', () => {
  test('should validate correct memory sizes', () => {
    expect(validateMemorySize(2048)).toBe(true);
    expect(validateMemorySize(4096)).toBe(true);
    expect(validateMemorySize(8192)).toBe(true);
  });

  test('should reject invalid memory sizes', () => {
    expect(validateMemorySize(1024)).toBe(false); // Below minimum
    expect(validateMemorySize(3072)).toBe(false); // Not power of 2
    expect(validateMemorySize(8388609)).toBe(false); // Above maximum
  });
}); 