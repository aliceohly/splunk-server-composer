import { runServerComposer } from "./runServerComposer";
import { ServerComposition } from "../types/server";
import { ServerModel } from "../types/serverModel";
import { ConfigRule } from "../types/configRule";

describe("Server Configuration Evaluation", () => {
  // Example 1
  test("should return no options when memory is below minimum", () => {
    const config: ServerComposition = {
      cpu: "Power",
      memorySize: 1024,
      hasGpuAccelerator: false,
    };
    const result = runServerComposer(config);
    expect(result.models).toHaveLength(0);
    expect(result.reasons).toContain(ConfigRule.RULE_4);
  });

  // Example 2
  test("should return all models except Mainframe for Power CPU with sufficient memory", () => {
    const config: ServerComposition = {
      cpu: "Power",
      memorySize: 262144,
      hasGpuAccelerator: false,
    };
    const result = runServerComposer(config);
    expect(result.models).toHaveLength(3);
    expect(result.models).toContain(ServerModel.Mainframe);
    expect(result.models).toContain(ServerModel.TowerServer);
    expect(result.models).toContain(ServerModel.RackServer4U);
    expect(result.reasons).toContain(ConfigRule.RULE_2);
    expect(result.reasons).toContain(ConfigRule.RULE_3);
  });

  // Example 3
  test("should return Tower Server and Rack Server 4U for X86 CPU with sufficient memory", () => {
    const config: ServerComposition = {
      cpu: "X86",
      memorySize: 524288,
      hasGpuAccelerator: false,
    };
    const result = runServerComposer(config);
    expect(result.models).toHaveLength(2);
    expect(result.models).toContain(ServerModel.TowerServer);
    expect(result.reasons).toContain(ConfigRule.RULE_3);
  });

  // Example 4
  test("should return High Density Server for GPU with ARM CPU and sufficient memory", () => {
    const config: ServerComposition = {
      cpu: "ARM",
      memorySize: 524288,
      hasGpuAccelerator: true,
    };
    const result = runServerComposer(config);
    expect(result.models).toHaveLength(1);
    expect(result.models).toEqual([ServerModel.HighDensityServer]);
    expect(result.reasons).toContain(ConfigRule.RULE_1);
  });

  // Extra test 1
  test("should return only Tower Server for memory below 131072MB", () => {
    const config: ServerComposition = {
      cpu: "X86",
      memorySize: 65536,
      hasGpuAccelerator: false,
    };
    const result = runServerComposer(config);
    expect(result.models).toHaveLength(1);
    expect(result.models).toEqual([ServerModel.TowerServer]);
    expect(result.reasons).toContain(ConfigRule.RULE_3);
  });
});
