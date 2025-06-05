import { ServerComposition, ServerComposerResult } from "../types/server";
import { ServerModel } from "../types/serverModel";
import {
  MIN_MEMORY,
  MIN_MEMORY_GPU_ACCELERATOR,
  MIN_MEMORY_4U,
} from "../constants/memory";
import { ComposeRule } from "../constants/composeRule";

export const runServerComposer = (
  serverComposition: ServerComposition
): ServerComposerResult => {
  const { cpu, memorySize, hasGpuAccelerator } = serverComposition;
  const models: ServerModel[] = [];
  const reasons: (typeof ComposeRule)[keyof typeof ComposeRule][] = [];

  // Rule 4
  if (memorySize < MIN_MEMORY) {
    return {
      models: [],
      reasons: [ComposeRule.RULE_4],
    };
  }

  // Rule 1
  if (hasGpuAccelerator) {
    if (cpu === "ARM" && memorySize >= MIN_MEMORY_GPU_ACCELERATOR) {
      return {
        models: [ServerModel.HighDensityServer],
        reasons: [ComposeRule.RULE_1],
      };
    }
    return {
      models: [],
      reasons: [ComposeRule.RULE_1],
    };
  }

  // Rules 2 and 3
  if (cpu === "Power") {
    models.push(ServerModel.Mainframe);
    reasons.push(ComposeRule.RULE_2);

    if (memorySize >= MIN_MEMORY_4U) {
      models.push(ServerModel.RackServer4U);
      models.push(ServerModel.TowerServer);
    } else {
      models.push(ServerModel.TowerServer);
    }
    reasons.push(ComposeRule.RULE_3);
  } else {
    if (memorySize >= MIN_MEMORY_4U) {
      models.push(ServerModel.RackServer4U);
      models.push(ServerModel.TowerServer);
    } else {
      models.push(ServerModel.TowerServer);
    }
    reasons.push(ComposeRule.RULE_3);
  }

  // Rule 5
  if (models.length === 0) {
    return {
      models: [],
      reasons: [ComposeRule.RULE_5],
    };
  }

  return {
    models: Array.from(new Set(models)),
    reasons: reasons,
  };
};
