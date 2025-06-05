import { ServerConfiguration, ServerEvaluationResult } from "../types/server";
import { ServerModel } from "../types/serverModel";
import { ConfigRule } from "../types/configRule";
import {
  MIN_MEMORY,
  MAX_MEMORY,
  MIN_MEMORY_GPU_ACCELERATOR,
  MIN_MEMORY_4U,
} from "../constants/memory";

export const evaluateServerConfiguration = (
  config: ServerConfiguration
): ServerEvaluationResult => {
  const { cpu, memorySize, hasGpuAccelerator } = config;
  const models: ServerModel[] = [];
  const reasons: ConfigRule[] = [];

  // Rule 4
  if (memorySize < MIN_MEMORY) {
    return {
      models: [],
      reasons: [ConfigRule.RULE_4],
    };
  }

  // Rule 1
  if (hasGpuAccelerator) {
    if (cpu === "ARM" && memorySize >= MIN_MEMORY_GPU_ACCELERATOR) {
      return {
        models: [ServerModel.HighDensityServer],
        reasons: [ConfigRule.RULE_1],
      };
    }
    return {
      models: [],
      reasons: [ConfigRule.RULE_1],
    };
  }

  // Rules 2 and 3
  if (cpu === "Power") {
    models.push(ServerModel.Mainframe);
    reasons.push(ConfigRule.RULE_2);

    if (memorySize >= MIN_MEMORY_4U) {
      models.push(ServerModel.RackServer4U);
      models.push(ServerModel.TowerServer);
    } else {
      models.push(ServerModel.TowerServer);
    }
    reasons.push(ConfigRule.RULE_3);
  } else {
    if (memorySize >= MIN_MEMORY_4U) {
      models.push(ServerModel.RackServer4U);
      models.push(ServerModel.TowerServer);
    } else {
      models.push(ServerModel.TowerServer);
    }
    reasons.push(ConfigRule.RULE_3);
  }

  // Rule 5
  if (models.length === 0) {
    return {
      models: [],
      reasons: [ConfigRule.RULE_5],
    };
  }

  return {
    models: Array.from(new Set(models)),
    reasons: reasons,
  };
};

export const validateMemorySize = (memorySize: number): boolean => {
  if (memorySize < MIN_MEMORY || memorySize > MAX_MEMORY) {
    return false;
  }

  // Check if it's a power of 2
  return (memorySize & (memorySize - 1)) === 0;
};
