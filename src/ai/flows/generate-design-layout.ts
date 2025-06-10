'use server';

/**
 * @fileOverview Generates design layouts based on user prompts.
 *
 * - generateDesignLayout - A function that generates design layouts based on a user prompt.
 * - GenerateDesignLayoutInput - The input type for the generateDesignLayout function.
 * - GenerateDesignLayoutOutput - The return type for the generateDesignLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDesignLayoutInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired graphic, e.g., marketing material for a new bakery.'
    ),
});
export type GenerateDesignLayoutInput = z.infer<typeof GenerateDesignLayoutInputSchema>;

const DesignLayoutSchema = z.object({
  description: z.string().describe('A description of the design layout.'),
  elements: z.array(
    z.object({
      type: z.string().describe('The type of element (e.g., text, image, shape).'),
      position: z
        .object({
          x: z.number().describe('The x coordinate of the element.'),
          y: z.number().describe('The y coordinate of the element.'),
        })
        .describe('The position of the element.'),
      size: z
        .object({
          width: z.number().describe('The width of the element.'),
          height: z.number().describe('The height of the element.'),
        })
        .describe('The size of the element.'),
      content: z.string().optional().describe('The content of the element (e.g., text).'),
      source: z.string().optional().describe('The source URL of the element (e.g., image).'),
      style: z.record(z.any()).optional().describe('Styling information for the element.'),
    })
  ).describe('A list of design elements in the layout.'),
});

const GenerateDesignLayoutOutputSchema = z.object({
  layouts: z.array(DesignLayoutSchema).describe('An array of design layouts.'),
});

export type GenerateDesignLayoutOutput = z.infer<typeof GenerateDesignLayoutOutputSchema>;

export async function generateDesignLayout(
  input: GenerateDesignLayoutInput
): Promise<GenerateDesignLayoutOutput> {
  return generateDesignLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDesignLayoutPrompt',
  input: {schema: GenerateDesignLayoutInputSchema},
  output: {schema: GenerateDesignLayoutOutputSchema},
  prompt: `You are an expert graphic designer. You will generate several design layouts based on the user's prompt. Consider design best practices for layout, colors, and fonts.

User Prompt: {{{prompt}}}

Return three different design layout options in the layouts array. Each layout must follow the DesignLayout schema. Each layout should contain at least 3 elements. All of the elements should be positioned within a 1000x1000 bounding box.

Example:
{
  "layouts": [
    {
      "description": "A layout with a large image and a text overlay.",
      "elements": [
        {
          "type": "image",
          "position": {
            "x": 0,
            "y": 0
          },
          "size": {
            "width": 1000,
            "height": 500
          },
          "source": "https://example.com/image.jpg"
        },
        {
          "type": "text",
          "position": {
            "x": 100,
            "y": 600
          },
          "size": {
            "width": 800,
            "height": 200
          },
          "content": "Your Text Here",
          "style": {
            "fontFamily": "Arial",
            "fontSize": "48px",
            "color": "#000000"
          }
        },
         {
          "type": "shape",
          "position": {
            "x": 100,
            "y": 800
          },
          "size": {
            "width": 800,
            "height": 200
          },
          "style": {
            "fill": "#FFFFFF"
          }
        }
      ]
    }
  ]
}
`,
});

const generateDesignLayoutFlow = ai.defineFlow(
  {
    name: 'generateDesignLayoutFlow',
    inputSchema: GenerateDesignLayoutInputSchema,
    outputSchema: GenerateDesignLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
