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
  style?: React.CSSProperties & Record<string, any>; // Use React.CSSProperties and allow additional properties
}

export interface DesignLayout {
  id: string; // Added for client-side management
  description: string;
  elements: DesignElement[];
}
