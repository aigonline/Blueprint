// src/lib/actions.ts
'use server';
import { generateDesignLayout as genLayout, type GenerateDesignLayoutInput, type GenerateDesignLayoutOutput } from '@/ai/flows/generate-design-layout';
import type { DesignLayout } from '@/types/blueprint';

// Re-export types for convenience if needed by client components
export type { GenerateDesignLayoutInput, GenerateDesignLayoutOutput };

export async function generateBlueprintLayout(input: GenerateDesignLayoutInput): Promise<GenerateDesignLayoutOutput> {
  try {
    // The AI flow output structure needs to be compatible or mapped to client-side DesignLayout[]
    // The current AI flow output is GenerateDesignLayoutOutput = { layouts: DesignLayoutSchema[] }
    // DesignLayoutSchema matches our client-side DesignLayout except for the `id` field.
    // We will add IDs on the client side when processing.
    const result = await genLayout(input);
    if (!result || !result.layouts) {
      throw new Error("AI did not return valid layouts.");
    }
    return result;
  } catch (error) {
    console.error("Error generating blueprint layout:", error);
    // Propagate a more user-friendly error or a structured error object
    if (error instanceof Error) {
      throw new Error(`Failed to generate layout: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the layout.");
  }
}
