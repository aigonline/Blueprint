
export interface DesignElement {
  id: string; // Added for client-side management
  type: 'text' | 'image' | 'shape' | string; // Allow string for future AI-generated types
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  content?: string;
  source?: string;
  style?: React.CSSProperties & {
    // Ensure these properties are available for styling and editor controls
    zIndex?: number;
    rotation?: number; // in degrees
    fontWeight?: React.CSSProperties['fontWeight'];
    letterSpacing?: string;
    lineHeight?: string | number;
    textAlign?: React.CSSProperties['textAlign'];
    textShadow?: string; // e.g., "2px 2px 5px red"
    borderRadius?: string; // Added for ShapeEditor
    opacity?: number; // Added for ShapeEditor
    // Allow any other AI-provided or future style properties
    [key: string]: any;
  };
}

export interface DesignLayout {
  id: string; // Added for client-side management
  description: string;
  elements: DesignElement[];
  // Optional canvas-level properties
  canvasBackgroundColor?: string;
}
