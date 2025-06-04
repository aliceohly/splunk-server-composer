import { evaluateServerConfiguration, validateMemorySize } from './serverReducer';
import { ServerConfiguration } from '../types/server';
import { CpuType } from '../types/cpu';
import { ServerModel } from '../types/serverModel';
import { ConfigRule } from '../types/configRule';

describe('Server Configuration Evaluation', () => {
  test('should return no options when memory is below minimum', () => {
    const config: ServerConfiguration = {
      cpu: CpuType.X86,
      memorySize: 1024,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toHaveLength(0);
    expect(result.reasons).toContain(ConfigRule.RULE_4);
  });

  test('should return High Density Server for GPU with ARM CPU and sufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: CpuType.ARM,
      memorySize: 524288,
      hasGpuAccelerator: true,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toEqual([ServerModel.HighDensityServer]);
    expect(result.reasons).toContain(ConfigRule.RULE_1);
  });

  test('should return no options for GPU with insufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: CpuType.ARM,
      memorySize: 262144,
      hasGpuAccelerator: true,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toHaveLength(0);
    expect(result.reasons).toContain(ConfigRule.RULE_1);
  });

  test('should return Mainframe for Power CPU with sufficient memory', () => {
    const config: ServerConfiguration = {
      cpu: CpuType.Power,
      memorySize: 262144,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toContain(ServerModel.Mainframe);
    expect(result.models).toContain(ServerModel.TowerServer);
    expect(result.models).toContain(ServerModel.RackServer4U);
    expect(result.reasons).toContain(ConfigRule.RULE_2);
    expect(result.reasons).toContain(ConfigRule.RULE_3);
  });

  test('should return only Tower Server for memory below 131072MB', () => {
    const config: ServerConfiguration = {
      cpu: CpuType.X86,
      memorySize: 65536,
      hasGpuAccelerator: false,
    };
    const result = evaluateServerConfiguration(config);
    expect(result.models).toEqual([ServerModel.TowerServer]);
    expect(result.reasons).toContain(ConfigRule.RULE_3);
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