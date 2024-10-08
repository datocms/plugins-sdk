export type Manifest = {
  hooks: Record<string, HookInfo>;
  baseCtx: {
    properties: AdditionalPropertiesOrMethods;
    methods: AdditionalPropertiesOrMethods;
  };
  selfResizingPluginFrameCtxSizingUtilities: AdditionalPropertiesOrMethods;
};

/**
 * Type alias for additional parameters or methods in context.
 */
export type AdditionalPropertyOrMethod = {
  comment: Comment | null; // Description of the parameter or method
  location: {
    filePath: string; // File path where the parameter or method is defined
    lineNumber: number; // Line number in the file
  };
  type: string; // Type of the parameter or method
};

export type AdditionalPropertiesOrMethods = Record<
  string,
  AdditionalPropertyOrMethod
>;

/**
 * Type alias for the context argument extracted from hook type.
 */
export type CtxArgument = {
  type: string;
  additionalProperties: AdditionalPropertiesOrMethods | null;
  additionalMethods: AdditionalPropertiesOrMethods | null;
};

/**
 * Type alias for non-context arguments.
 */
export type NonCtxArgument = {
  name: string;
  typeName: string;
};

export interface HookInfo {
  name: string;
  comment: Comment | null; // JSDoc comment and tag
  nonCtxArguments: NonCtxArgument[]; // Non-context arguments
  ctxArgument: CtxArgument | null; // Context argument
  returnType: string; // Return type of the function
  location: {
    filePath: string; // File path where the hook is defined
    lineNumber: number; // Line number in the file
  };
}

export type Comment = { comment: string; tag?: string; example?: string };
