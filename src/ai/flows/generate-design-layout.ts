
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

const ElementStyleSchema = z.object({
  fontFamily: z.string().optional().describe("The font family for text elements."),
  fontSize: z.string().optional().describe("The font size for text elements (e.g., '24px', '1.5em')."),
  color: z.string().optional().describe("The text color or general element color (hex, rgb, hsl)."),
  backgroundColor: z.string().optional().describe("The background color for elements."),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional().describe("Text alignment."),
  fontWeight: z.string().optional().describe("Font weight (e.g., 'normal', 'bold', '400', '700')."),
  textShadow: z.string().optional().describe("CSS text-shadow string (e.g., '2px 2px 5px red')."),
  border: z.string().optional().describe("CSS border string (e.g., '1px solid black')."),
  borderRadius: z.string().optional().describe("CSS border-radius string (e.g., '10px')."),
  opacity: z.number().min(0).max(1).optional().describe("Element opacity from 0 (transparent) to 1 (opaque)."),
  zIndex: z.number().int().optional().describe("Stacking order (z-index)."),
  rotation: z.number().optional().describe("Rotation in degrees."),
  // For shapes
  fill: z.string().optional().describe("Fill color, primarily for shapes (hex, rgb, hsl)."),
  stroke: z.string().optional().describe("Stroke color, primarily for shapes (hex, rgb, hsl)."),
  strokeWidth: z.string().optional().describe("Stroke width, primarily for shapes (e.g., '2px').")
})
.catchall(z.any()) // Allows any other CSS properties the AI might generate
.optional()
.describe('Styling information for the element. If this "style" object is included, it must contain at least one valid CSS property and not be an empty object. Omit this field entirely if no specific styles are needed.');


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
          width: z.number().gt(0, "Width must be greater than 0.").describe('The width of the element, must be greater than 0.'),
          height: z.number().gt(0, "Height must be greater than 0.").describe('The height of the element, must be greater than 0.'),
        })
        .describe('The size of the element. Both width and height must be positive values (>0).'),
      content: z.string().optional().describe('The content of the element (e.g., text).'),
      source: z.string().optional().describe('The source URL of the element (e.g., image).'),
      style: ElementStyleSchema,
    })
  ).describe('A list of design elements in the layout.'),
  canvasBackgroundColor: z.string().optional().describe('Optional background color for the entire canvas (hex, rgb, hsl). Defaults to a light theme color if not provided.'),
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

Return three different design layout options in the layouts array. Each layout must follow the DesignLayout schema. Each layout should contain at least 3 elements.
All elements must have a width and height greater than 0.
All elements should be positioned within a 1000x1000 bounding box.
For the 'style' property of elements: if you include the 'style' object, it must not be empty. It should contain specific CSS properties. If no styles are needed for an element, omit the 'style' property entirely.
For 'canvasBackgroundColor', you can suggest a suitable background color for the entire design, or omit it to use a default.
For image elements, provide a relevant 'data-ai-hint' attribute with one or two keywords for Unsplash search if 'source' is a placeholder.

Example:
{
  "layouts": [
    {
      "description": "A layout with a large image and a text overlay.",
      "canvasBackgroundColor": "#F0F8FF",
      "elements": [
        {
          "type": "image",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1000, "height": 500 },
          "source": "https://placehold.co/1000x500.png"
        },
        {
          "type": "text",
          "position": { "x": 100, "y": 600 },
          "size": { "width": 800, "height": 100 },
          "content": "Your Amazing Text Here",
          "style": {
            "fontFamily": "Arial, sans-serif",
            "fontSize": "48px",
            "color": "#333333",
            "textAlign": "center"
          }
        },
         {
          "type": "shape",
          "position": { "x": 50, "y": 750 },
          "size": { "width": 900, "height": 150 },
          "style": {
            "backgroundColor": "#FFD700",
            "borderRadius": "10px"
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

