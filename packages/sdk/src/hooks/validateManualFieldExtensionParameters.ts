export type ValidateManualFieldExtensionParametersHook = {
  /**
   * This function will be called each time the configuration object changes. It
   * must return an object containing possible validation errors
   *
   * @tag manualFieldExtensions
   */
  validateManualFieldExtensionParameters: (
    fieldExtensionId: string,
    parameters: Record<string, unknown>,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
};
