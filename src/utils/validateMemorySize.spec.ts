import { validateMemorySize } from "./validateMemorySize";

describe("Memory Size Validation", () => {
  test("should validate correct memory sizes", () => {
    expect(validateMemorySize(2048)).toBe(true);
    expect(validateMemorySize(4096)).toBe(true);
    expect(validateMemorySize(8192)).toBe(true);
  });

  test("should reject invalid memory sizes", () => {
    expect(validateMemorySize(1024)).toBe(false);
    expect(validateMemorySize(3072)).toBe(false);
    expect(validateMemorySize(8388609)).toBe(false);
  });
});
