import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("handles conditional classes and tailwind conflicts", () => {
    expect(cn("px-2 py-1", false && "hidden", true && "text-sm", "px-4")).toBe(
      "py-1 text-sm px-4"
    );
  });
});
