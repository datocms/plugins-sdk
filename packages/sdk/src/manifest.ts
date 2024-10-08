import type { Manifest } from './manifestTypes';

export const manifest: Manifest = {
  hooks: {
    validateManualFieldExtensionParameters: {
      name: 'validateManualFieldExtensionParameters',
      comment: {
        comment:
          'This function will be called each time the configuration object changes. It\nmust return an object containing possible validation errors',
        tag: 'manualFieldExtensions',
      },
      nonCtxArguments: [
        {
          name: 'fieldExtensionId',
          typeName: 'string',
        },
        {
          name: 'parameters',
          typeName: 'Record<string, unknown>',
        },
      ],
      ctxArgument: null,
      returnType: 'Record<string, unknown> | Promise<Record<string, unknown>>',
      location: {
        filePath: 'src/hooks/validateManualFieldExtensionParameters.ts',
        lineNumber: 8,
      },
    },
    uploadsDropdownActions: {
      name: 'uploadsDropdownActions',
      comment: null,
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'Array<DropdownAction | DropdownActionGroup>',
      location: {
        filePath: 'src/hooks/uploadsDropdownActions.ts',
        lineNumber: 5,
      },
    },
    uploadSidebars: {
      name: 'uploadSidebars',
      comment: {
        comment:
          'Use this function to declare new sidebar to be shown when the user opens\nup an asset in the Media Area',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'UploadSidebar[]',
      location: {
        filePath: 'src/hooks/uploadSidebars.ts',
        lineNumber: 10,
      },
    },
    uploadSidebarPanels: {
      name: 'uploadSidebarPanels',
      comment: {
        comment:
          'Use this function to declare new sidebar panels to be shown when the user\nopens up an asset in the Media Area',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'UploadSidebarPanel[]',
      location: {
        filePath: 'src/hooks/uploadSidebarPanels.ts',
        lineNumber: 10,
      },
    },
    settingsAreaSidebarItemGroups: {
      name: 'settingsAreaSidebarItemGroups',
      comment: {
        comment:
          'Use this function to declare new navigation sections in the Settings Area\nsidebar',
        tag: 'pages',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'SettingsAreaSidebarItemGroup[]',
      location: {
        filePath: 'src/hooks/settingsAreaSidebarItemGroups.ts',
        lineNumber: 11,
      },
    },
    renderUploadSidebarPanel: {
      name: 'renderUploadSidebarPanel',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a sidebar panel\n(see the `uploadSidebarPanels` function)',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'sidebarPaneId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          sidebarPaneId: {
            comment: {
              comment: 'The ID of the sidebar panel that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebarPanel.ts',
              lineNumber: 24,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The arbitrary `parameters` of the panel declared in the\n`uploadSidebarPanels` function',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebarPanel.ts',
              lineNumber: 30,
            },
            type: 'Record<string, unknown>',
          },
          upload: {
            comment: {
              comment: 'The active asset',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebarPanel.ts',
              lineNumber: 33,
            },
            type: 'Upload',
          },
        },
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderUploadSidebarPanel.ts',
        lineNumber: 14,
      },
    },
    renderUploadSidebar: {
      name: 'renderUploadSidebar',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a sidebar (see\nthe `uploadSidebars` function)',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'sidebarId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'ImposedSizePluginFrameCtx',
        additionalProperties: {
          sidebarId: {
            comment: {
              comment: 'The ID of the sidebar that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebar.ts',
              lineNumber: 21,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The arbitrary `parameters` of the declared in the `uploadSidebars`\nfunction',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebar.ts',
              lineNumber: 27,
            },
            type: 'Record<string, unknown>',
          },
          upload: {
            comment: {
              comment: 'The active asset',
            },
            location: {
              filePath: 'src/hooks/renderUploadSidebar.ts',
              lineNumber: 30,
            },
            type: 'Upload',
          },
        },
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderUploadSidebar.ts',
        lineNumber: 14,
      },
    },
    renderPage: {
      name: 'renderPage',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a specific\npage (see the `mainNavigationTabs`, `settingsAreaSidebarItemGroups` and\n`contentAreaSidebarItems` functions)',
        tag: 'pages',
      },
      nonCtxArguments: [
        {
          name: 'pageId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'ImposedSizePluginFrameCtx',
        additionalProperties: {
          pageId: {
            comment: {
              comment: 'The ID of the page that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderPage.ts',
              lineNumber: 19,
            },
            type: 'string',
          },
        },
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderPage.ts',
        lineNumber: 12,
      },
    },
    renderModal: {
      name: 'renderModal',
      comment: {
        comment:
          'This function will be called when the plugin requested to open a modal (see\nthe `openModal` function)',
        tag: 'modals',
      },
      nonCtxArguments: [
        {
          name: 'modalId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          modalId: {
            comment: {
              comment: 'The ID of the modal that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderModal.ts',
              lineNumber: 17,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The arbitrary `parameters` of the modal declared in the `openModal`\nfunction',
            },
            location: {
              filePath: 'src/hooks/renderModal.ts',
              lineNumber: 22,
            },
            type: 'Record<string, unknown>',
          },
        },
        additionalMethods: {
          resolve: {
            comment: {
              comment:
                'A function to be called by the plugin to close the modal. The `openModal`\ncall will be resolved with the passed return value',
              example:
                "const returnValue = prompt(\n  'Please specify the value to return to the caller:',\n  'success',\n);\n\nawait ctx.resolve(returnValue);",
            },
            location: {
              filePath: 'src/hooks/renderModal.ts',
              lineNumber: 40,
            },
            type: '(returnValue: unknown) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderModal.ts',
        lineNumber: 11,
      },
    },
    renderManualFieldExtensionConfigScreen: {
      name: 'renderManualFieldExtensionConfigScreen',
      comment: null,
      nonCtxArguments: [
        {
          name: 'fieldExtensionId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          fieldExtensionId: {
            comment: {
              comment:
                'The ID of the field extension for which we need to render the parameters\nform',
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 23,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The current value of the parameters (you can change the value with the\n`setParameters` function)',
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 28,
            },
            type: 'Record<string, unknown>',
          },
          errors: {
            comment: {
              comment:
                'The current validation errors for the parameters (you can set them\nimplementing the `validateManualFieldExtensionParameters` function)',
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 33,
            },
            type: 'Record<string, unknown>',
          },
          pendingField: {
            comment: {
              comment: 'The field entity that is being edited in the form',
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 36,
            },
            type: 'PendingField',
          },
          itemType: {
            comment: {
              comment: 'The model for the field being edited',
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 39,
            },
            type: 'ItemType',
          },
        },
        additionalMethods: {
          setParameters: {
            comment: {
              comment: 'Sets a new value for the parameters',
              example: "await ctx.setParameters({ color: '#ff0000' });",
            },
            location: {
              filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
              lineNumber: 51,
            },
            type: '(params: Record<string, unknown>) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderManualFieldExtensionConfigScreen.ts',
        lineNumber: 9,
      },
    },
    renderItemFormSidebarPanel: {
      name: 'renderItemFormSidebarPanel',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a sidebar panel\n(see the `itemFormSidebarPanels` function)',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'sidebarPaneId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          sidebarPaneId: {
            comment: {
              comment: 'The ID of the sidebar panel that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderItemFormSidebarPanel.ts',
              lineNumber: 25,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The arbitrary `parameters` of the panel declared in the\n`itemFormSidebarPanels` function',
            },
            location: {
              filePath: 'src/hooks/renderItemFormSidebarPanel.ts',
              lineNumber: 31,
            },
            type: 'Record<string, unknown>',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderItemFormSidebarPanel.ts',
        lineNumber: 15,
      },
    },
    renderItemFormSidebar: {
      name: 'renderItemFormSidebar',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a sidebar (see\nthe `itemFormSidebars` function)',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'sidebarId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'ImposedSizePluginFrameCtx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          sidebarId: {
            comment: {
              comment: 'The ID of the sidebar that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderItemFormSidebar.ts',
              lineNumber: 25,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment:
                'The arbitrary `parameters` of the declared in the `itemFormSidebars`\nfunction',
            },
            location: {
              filePath: 'src/hooks/renderItemFormSidebar.ts',
              lineNumber: 30,
            },
            type: 'Record<string, unknown>',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderItemFormSidebar.ts',
        lineNumber: 15,
      },
    },
    renderItemFormOutlet: {
      name: 'renderItemFormOutlet',
      comment: {
        comment:
          'This function will be called when the plugin needs to render an outlet (see\nthe `itemFormOutlets` function)',
        tag: 'itemFormOutlets',
      },
      nonCtxArguments: [
        {
          name: 'itemFormOutletId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          itemFormOutletId: {
            comment: {
              comment: 'The ID of the outlet that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderItemFormOutlet.ts',
              lineNumber: 25,
            },
            type: 'string',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderItemFormOutlet.ts',
        lineNumber: 15,
      },
    },
    renderItemCollectionOutlet: {
      name: 'renderItemCollectionOutlet',
      comment: null,
      nonCtxArguments: [
        {
          name: 'itemCollectionOutletId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          itemCollectionOutletId: {
            comment: {
              comment: 'The ID of the outlet that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderItemCollectionOutlet.ts',
              lineNumber: 15,
            },
            type: 'string',
          },
        },
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderItemCollectionOutlet.ts',
        lineNumber: 5,
      },
    },
    renderFieldExtension: {
      name: 'renderFieldExtension',
      comment: {
        comment:
          'This function will be called when the plugin needs to render a field\nextension (see the `manualFieldExtensions` and `overrideFieldExtensions`\nfunctions)',
        tag: 'forcedFieldExtensions',
      },
      nonCtxArguments: [
        {
          name: 'fieldExtensionId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          disabled: {
            comment: {
              comment: 'Whether the field is currently disabled or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 8,
            },
            type: 'boolean',
          },
          fieldPath: {
            comment: {
              comment:
                'The path in the `formValues` object where to find the current value for the\nfield',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 13,
            },
            type: 'string',
          },
          field: {
            comment: {
              comment: 'The field where the field extension is installed to',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 15,
            },
            type: 'Field',
          },
          parentField: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the top\nlevel Modular Content/Structured Text field containing the block itself',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 20,
            },
            type: 'Field | undefined',
          },
          block: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the ID\nof the block — or `undefined` if the block is still not persisted — and the\nblock model.',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 26,
            },
            type: 'undefined | { id: string | undefined; blockModel: ItemType }',
          },
          fieldExtensionId: {
            comment: {
              comment:
                'The ID of the field extension that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderFieldExtension.ts',
              lineNumber: 29,
            },
            type: 'string',
          },
          parameters: {
            comment: {
              comment: 'The arbitrary `parameters` of the field extension',
            },
            location: {
              filePath: 'src/hooks/renderFieldExtension.ts',
              lineNumber: 31,
            },
            type: 'Record<string, unknown>',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderFieldExtension.ts',
        lineNumber: 18,
      },
    },
    renderConfigScreen: {
      name: 'renderConfigScreen',
      comment: {
        comment:
          "This function will be called when the plugin needs to render the plugin's\nconfiguration form",
        tag: 'configScreen',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderConfigScreen.ts',
        lineNumber: 11,
      },
    },
    renderAssetSource: {
      name: 'renderAssetSource',
      comment: {
        comment:
          "This function will be called when the user selects one of the plugin's\nasset sources to upload a new media file.",
        tag: 'assetSources',
      },
      nonCtxArguments: [
        {
          name: 'assetSourceId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'SelfResizingPluginFrameCtx',
        additionalProperties: {
          assetSourceId: {
            comment: {
              comment: 'The ID of the assetSource that needs to be rendered',
            },
            location: {
              filePath: 'src/hooks/renderAssetSource.ts',
              lineNumber: 18,
            },
            type: 'string',
          },
        },
        additionalMethods: {
          select: {
            comment: {
              comment:
                'Function to be called when the user selects the asset: it will trigger the\ncreation of a new `Upload` that will be added in the Media Area.',
              example:
                "await ctx.select({\n  resource: {\n    url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',\n    filename: 'man-drinking-coffee.jpg',\n  },\n  copyright: 'Royalty free (Unsplash)',\n  author: 'Jeff Sheldon',\n  notes: 'A man drinking a coffee',\n  tags: ['man', 'coffee'],\n});",
            },
            location: {
              filePath: 'src/hooks/renderAssetSource.ts',
              lineNumber: 40,
            },
            type: '(newUpload: NewUpload) => void',
          },
        },
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/renderAssetSource.ts',
        lineNumber: 11,
      },
    },
    overrideFieldExtensions: {
      name: 'overrideFieldExtensions',
      comment: {
        comment:
          'Use this function to automatically force one or more field extensions to a\nparticular field',
        tag: 'forcedFieldExtensions',
      },
      nonCtxArguments: [
        {
          name: 'field',
          typeName: 'Field',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          itemType: {
            comment: null,
            location: {
              filePath: 'src/hooks/overrideFieldExtensions.ts',
              lineNumber: 22,
            },
            type: 'ItemType',
          },
        },
        additionalMethods: null,
      },
      returnType: 'FieldExtensionOverride | undefined',
      location: {
        filePath: 'src/hooks/overrideFieldExtensions.ts',
        lineNumber: 15,
      },
    },
    onBoot: {
      name: 'onBoot',
      comment: {
        comment:
          'This function will be called once at boot time and can be used to perform\nie. some initial integrity checks on the configuration.',
        tag: 'boot',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'ImposedSizePluginFrameCtx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'void',
      location: {
        filePath: 'src/hooks/onBoot.ts',
        lineNumber: 10,
      },
    },
    onBeforeItemsUnpublish: {
      name: 'onBeforeItemsUnpublish',
      comment: {
        comment:
          'This function will be called before unpublishing records. You can stop the\naction by returning `false`',
        tag: 'beforeHooks',
      },
      nonCtxArguments: [
        {
          name: 'items',
          typeName: 'Item[]',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MaybePromise<boolean>',
      location: {
        filePath: 'src/hooks/onBeforeItemsUnpublish.ts',
        lineNumber: 14,
      },
    },
    onBeforeItemsPublish: {
      name: 'onBeforeItemsPublish',
      comment: {
        comment:
          'This function will be called before publishing records. You can stop the\naction by returning `false`',
        tag: 'beforeHooks',
      },
      nonCtxArguments: [
        {
          name: 'items',
          typeName: 'Item[]',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MaybePromise<boolean>',
      location: {
        filePath: 'src/hooks/onBeforeItemsPublish.ts',
        lineNumber: 14,
      },
    },
    onBeforeItemsDestroy: {
      name: 'onBeforeItemsDestroy',
      comment: {
        comment:
          'This function will be called before destroying records. You can stop the\naction by returning `false`',
        tag: 'beforeHooks',
      },
      nonCtxArguments: [
        {
          name: 'items',
          typeName: 'Item[]',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MaybePromise<boolean>',
      location: {
        filePath: 'src/hooks/onBeforeItemsDestroy.ts',
        lineNumber: 14,
      },
    },
    onBeforeItemUpsert: {
      name: 'onBeforeItemUpsert',
      comment: {
        comment:
          'This function will be called before saving a new version of a record. You\ncan stop the action by returning `false`',
        tag: 'beforeHooks',
      },
      nonCtxArguments: [
        {
          name: 'createOrUpdateItemPayload',
          typeName: 'ItemUpdateSchema | ItemCreateSchema',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MaybePromise<boolean>',
      location: {
        filePath: 'src/hooks/onBeforeItemUpsert.ts',
        lineNumber: 15,
      },
    },
    manualFieldExtensions: {
      name: 'manualFieldExtensions',
      comment: {
        comment:
          'Use this function to declare new field extensions that users will be able\nto install manually in some field',
        tag: 'manualFieldExtensions',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ManualFieldExtension[]',
      location: {
        filePath: 'src/hooks/manualFieldExtensions.ts',
        lineNumber: 10,
      },
    },
    mainNavigationTabs: {
      name: 'mainNavigationTabs',
      comment: {
        comment:
          'Use this function to declare new tabs you want to add in the top-bar of the\nUI',
        tag: 'pages',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MainNavigationTab[]',
      location: {
        filePath: 'src/hooks/mainNavigationTabs.ts',
        lineNumber: 11,
      },
    },
    itemsDropdownActions: {
      name: 'itemsDropdownActions',
      comment: null,
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          itemType: {
            comment: null,
            location: {
              filePath: 'src/hooks/itemsDropdownActions.ts',
              lineNumber: 15,
            },
            type: 'ItemType',
          },
        },
        additionalMethods: null,
      },
      returnType: 'Array<DropdownAction | DropdownActionGroup>',
      location: {
        filePath: 'src/hooks/itemsDropdownActions.ts',
        lineNumber: 8,
      },
    },
    itemFormSidebars: {
      name: 'itemFormSidebars',
      comment: {
        comment:
          'Use this function to declare new sidebar to be shown when the user edits\nrecords of a particular model',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ItemFormSidebar[]',
      location: {
        filePath: 'src/hooks/itemFormSidebars.ts',
        lineNumber: 13,
      },
    },
    itemFormSidebarPanels: {
      name: 'itemFormSidebarPanels',
      comment: {
        comment:
          'Use this function to declare new sidebar panels to be shown when the user\nedits records of a particular model',
        tag: 'sidebarPanels',
      },
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ItemFormSidebarPanel[]',
      location: {
        filePath: 'src/hooks/itemFormSidebarPanels.ts',
        lineNumber: 14,
      },
    },
    itemFormOutlets: {
      name: 'itemFormOutlets',
      comment: {
        comment:
          "Use this function to declare custom outlets to be shown at the top of the\nrecord's editing page",
        tag: 'itemFormOutlets',
      },
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ItemFormOutlet[]',
      location: {
        filePath: 'src/hooks/itemFormOutlets.ts',
        lineNumber: 13,
      },
    },
    itemFormDropdownActions: {
      name: 'itemFormDropdownActions',
      comment: null,
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
        },
        additionalMethods: null,
      },
      returnType: 'Array<DropdownAction | DropdownActionGroup>',
      location: {
        filePath: 'src/hooks/itemFormDropdownActions.ts',
        lineNumber: 9,
      },
    },
    itemCollectionOutlets: {
      name: 'itemCollectionOutlets',
      comment: null,
      nonCtxArguments: [
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ItemCollectionOutlet[]',
      location: {
        filePath: 'src/hooks/itemCollectionOutlets.ts',
        lineNumber: 7,
      },
    },
    initialLocationQueryForItemSelector: {
      name: 'initialLocationQueryForItemSelector',
      comment: {
        comment:
          'Use this function to customize the initial filters when opening a record\nselector via a "Single link" or "Multiple links" field',
        tag: 'locationQuery',
      },
      nonCtxArguments: [
        {
          name: 'openerField',
          typeName: 'Field',
        },
        {
          name: 'itemType',
          typeName: 'ItemType',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType:
        'MaybePromise<InitialLocationQueryForItemSelector | undefined>',
      location: {
        filePath: 'src/hooks/initialLocationQueryForItemSelector.ts',
        lineNumber: 16,
      },
    },
    fieldDropdownActions: {
      name: 'fieldDropdownActions',
      comment: null,
      nonCtxArguments: [
        {
          name: 'field',
          typeName: 'Field',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          disabled: {
            comment: {
              comment: 'Whether the field is currently disabled or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 8,
            },
            type: 'boolean',
          },
          fieldPath: {
            comment: {
              comment:
                'The path in the `formValues` object where to find the current value for the\nfield',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 13,
            },
            type: 'string',
          },
          field: {
            comment: {
              comment: 'The field where the field extension is installed to',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 15,
            },
            type: 'Field',
          },
          parentField: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the top\nlevel Modular Content/Structured Text field containing the block itself',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 20,
            },
            type: 'Field | undefined',
          },
          block: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the ID\nof the block — or `undefined` if the block is still not persisted — and the\nblock model.',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 26,
            },
            type: 'undefined | { id: string | undefined; blockModel: ItemType }',
          },
        },
        additionalMethods: null,
      },
      returnType: 'Array<DropdownAction | DropdownActionGroup>',
      location: {
        filePath: 'src/hooks/fieldDropdownActions.ts',
        lineNumber: 10,
      },
    },
    executeUploadsDropdownAction: {
      name: 'executeUploadsDropdownAction',
      comment: null,
      nonCtxArguments: [
        {
          name: 'actionId',
          typeName: 'string',
        },
        {
          name: 'uploads',
          typeName: 'Upload[]',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          parameters: {
            comment: null,
            location: {
              filePath: 'src/hooks/executeUploadsDropdownAction.ts',
              lineNumber: 14,
            },
            type: 'Record<string, unknown> | undefined',
          },
        },
        additionalMethods: null,
      },
      returnType: 'Promise<void>',
      location: {
        filePath: 'src/hooks/executeUploadsDropdownAction.ts',
        lineNumber: 7,
      },
    },
    executeItemsDropdownAction: {
      name: 'executeItemsDropdownAction',
      comment: null,
      nonCtxArguments: [
        {
          name: 'actionId',
          typeName: 'string',
        },
        {
          name: 'items',
          typeName: 'Item[]',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          parameters: {
            comment: null,
            location: {
              filePath: 'src/hooks/executeItemsDropdownAction.ts',
              lineNumber: 15,
            },
            type: 'Record<string, unknown> | undefined',
          },
        },
        additionalMethods: null,
      },
      returnType: 'Promise<void>',
      location: {
        filePath: 'src/hooks/executeItemsDropdownAction.ts',
        lineNumber: 7,
      },
    },
    executeItemFormDropdownAction: {
      name: 'executeItemFormDropdownAction',
      comment: null,
      nonCtxArguments: [
        {
          name: 'actionId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          parameters: {
            comment: null,
            location: {
              filePath: 'src/hooks/executeItemFormDropdownAction.ts',
              lineNumber: 16,
            },
            type: 'Record<string, unknown> | undefined',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'Promise<void>',
      location: {
        filePath: 'src/hooks/executeItemFormDropdownAction.ts',
        lineNumber: 8,
      },
    },
    executeFieldDropdownAction: {
      name: 'executeFieldDropdownAction',
      comment: null,
      nonCtxArguments: [
        {
          name: 'actionId',
          typeName: 'string',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          locale: {
            comment: {
              comment: 'The currently active locale for the record',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 12,
            },
            type: 'string',
          },
          item: {
            comment: {
              comment:
                'If an already persisted record is being edited, returns the full record\nentity',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 17,
            },
            type: 'Item | null',
          },
          itemType: {
            comment: {
              comment: 'The model for the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 19,
            },
            type: 'ItemType',
          },
          formValues: {
            comment: {
              comment: 'The complete internal form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 21,
            },
            type: 'Record<string, unknown>',
          },
          itemStatus: {
            comment: {
              comment: 'The current status of the record being edited',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 23,
            },
            type: "'new' | 'draft' | 'updated' | 'published'",
          },
          isSubmitting: {
            comment: {
              comment: 'Whether the form is currently submitting itself or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 25,
            },
            type: 'boolean',
          },
          isFormDirty: {
            comment: {
              comment: 'Whether the form has some non-persisted changes or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 27,
            },
            type: 'boolean',
          },
          blocksAnalysis: {
            comment: {
              comment: 'Current number of blocks present in form state',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 29,
            },
            type: '{\n    usage: {\n      /** Total number of blocks present in form state */\n      total: number;\n      /** Total number of blocks present in non-localized fields */\n      nonLocalized: number;\n      /** Total number of blocks present in localized fields, per locale */\n      perLocale: Record<string, number>;\n    };\n    /** Maximum number of blocks per item */\n    maximumPerItem: number;\n  }',
          },
          disabled: {
            comment: {
              comment: 'Whether the field is currently disabled or not',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 8,
            },
            type: 'boolean',
          },
          fieldPath: {
            comment: {
              comment:
                'The path in the `formValues` object where to find the current value for the\nfield',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 13,
            },
            type: 'string',
          },
          field: {
            comment: {
              comment: 'The field where the field extension is installed to',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 15,
            },
            type: 'Field',
          },
          parentField: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the top\nlevel Modular Content/Structured Text field containing the block itself',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 20,
            },
            type: 'Field | undefined',
          },
          block: {
            comment: {
              comment:
                'If the field extension is installed in a field of a block, returns the ID\nof the block — or `undefined` if the block is still not persisted — and the\nblock model.',
            },
            location: {
              filePath: 'src/ctx/commonExtras/field.ts',
              lineNumber: 26,
            },
            type: 'undefined | { id: string | undefined; blockModel: ItemType }',
          },
          parameters: {
            comment: null,
            location: {
              filePath: 'src/hooks/executeFieldDropdownAction.ts',
              lineNumber: 18,
            },
            type: 'Record<string, unknown> | undefined',
          },
        },
        additionalMethods: {
          toggleField: {
            comment: {
              comment:
                'Hides/shows a specific field in the form. Please be aware that when a field\nis hidden, the field editor for that field will be removed from the DOM\nitself, including any associated plugins. When it is shown again, its\nplugins will be reinitialized.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.toggleField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 65,
            },
            type: '(path: string, show: boolean) => Promise<void>',
          },
          disableField: {
            comment: {
              comment: 'Disables/re-enables a specific field in the form',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.disableField(fieldPath, true);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 80,
            },
            type: '(path: string, disable: boolean) => Promise<void>',
          },
          scrollToField: {
            comment: {
              comment:
                'Smoothly navigates to a specific field in the form. If the field is\nlocalized it will switch language tab and then navigate to the chosen\nfield.',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.scrollToField(fieldPath);",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 97,
            },
            type: '(path: string, locale?: string) => Promise<void>',
          },
          setFieldValue: {
            comment: {
              comment: 'Changes a specific path of the `formValues` object',
              example:
                "const fieldPath = prompt(\n  'Please insert the path of a field in the form',\n  ctx.fieldPath,\n);\n\nawait ctx.setFieldValue(fieldPath, 'new value');",
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 112,
            },
            type: '(path: string, value: unknown) => Promise<void>',
          },
          formValuesToItem: {
            comment: {
              comment:
                'Takes the internal form state, and transforms it into an Item entity\ncompatible with DatoCMS API.\n\nWhen `skipUnchangedFields`, only the fields that changed value will be\nserialized.\n\nIf the required nested blocks are still not loaded, this method will return\n`undefined`.',
              example: 'await ctx.formValuesToItem(ctx.formValues, false);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 129,
            },
            type: "(\n    formValues: Record<string, unknown>,\n    skipUnchangedFields?: boolean,\n  ) => Promise<Omit<Item, 'id' | 'meta'> | undefined>",
          },
          itemToFormValues: {
            comment: {
              comment:
                'Takes an Item entity, and converts it into the internal form state',
              example: 'await ctx.itemToFormValues(ctx.item);',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 142,
            },
            type: "(\n    item: Omit<Item, 'id' | 'meta'>,\n  ) => Promise<Record<string, unknown>>",
          },
          saveCurrentItem: {
            comment: {
              comment: 'Triggers a submit form for current record',
              example: 'await ctx.saveCurrentItem();',
            },
            location: {
              filePath: 'src/ctx/commonExtras/itemForm.ts',
              lineNumber: 154,
            },
            type: '(showToast?: boolean) => Promise<void>',
          },
        },
      },
      returnType: 'Promise<void>',
      location: {
        filePath: 'src/hooks/executeFieldDropdownAction.ts',
        lineNumber: 9,
      },
    },
    customMarksForStructuredTextField: {
      name: 'customMarksForStructuredTextField',
      comment: {
        comment:
          'Use this function to define a number of custom marks for a specific\nStructured Text field',
        tag: 'structuredText',
      },
      nonCtxArguments: [
        {
          name: 'field',
          typeName: 'Field',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          itemType: {
            comment: null,
            location: {
              filePath: 'src/hooks/customMarksForStructuredTextField.ts',
              lineNumber: 22,
            },
            type: 'ItemType',
          },
        },
        additionalMethods: null,
      },
      returnType: 'StructuredTextCustomMark[] | undefined',
      location: {
        filePath: 'src/hooks/customMarksForStructuredTextField.ts',
        lineNumber: 15,
      },
    },
    customBlockStylesForStructuredTextField: {
      name: 'customBlockStylesForStructuredTextField',
      comment: {
        comment:
          'Use this function to define a number of custom block styles for a specific\nStructured Text field',
        tag: 'structuredText',
      },
      nonCtxArguments: [
        {
          name: 'field',
          typeName: 'Field',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: {
          itemType: {
            comment: null,
            location: {
              filePath: 'src/hooks/customBlockStylesForStructuredTextField.ts',
              lineNumber: 22,
            },
            type: 'ItemType',
          },
        },
        additionalMethods: null,
      },
      returnType: 'StructuredTextCustomBlockStyle[] | undefined',
      location: {
        filePath: 'src/hooks/customBlockStylesForStructuredTextField.ts',
        lineNumber: 15,
      },
    },
    contentAreaSidebarItems: {
      name: 'contentAreaSidebarItems',
      comment: {
        comment:
          'Use this function to declare new items in the content area sidebar',
        tag: 'sidebarItems',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'ContentAreaSidebarItem[]',
      location: {
        filePath: 'src/hooks/contentAreaSidebarItems.ts',
        lineNumber: 10,
      },
    },
    buildItemPresentationInfo: {
      name: 'buildItemPresentationInfo',
      comment: {
        comment:
          'Use this function to customize the presentation of a record in records\ncollections and "Single link" or "Multiple links" field',
        tag: 'presentation',
      },
      nonCtxArguments: [
        {
          name: 'item',
          typeName: 'Item',
        },
      ],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'MaybePromise<ItemPresentationInfo | undefined>',
      location: {
        filePath: 'src/hooks/buildItemPresentationInfo.ts',
        lineNumber: 14,
      },
    },
    assetSources: {
      name: 'assetSources',
      comment: {
        comment:
          'Use this function to declare additional sources to be shown when users want\nto upload new assets',
        tag: 'assetSources',
      },
      nonCtxArguments: [],
      ctxArgument: {
        type: 'Ctx',
        additionalProperties: null,
        additionalMethods: null,
      },
      returnType: 'AssetSource[] | undefined',
      location: {
        filePath: 'src/hooks/assetSources.ts',
        lineNumber: 11,
      },
    },
  },
  baseCtx: {
    properties: {
      site: {
        comment: {
          comment: 'The current DatoCMS project',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 24,
        },
        type: 'Site',
      },
      environment: {
        comment: {
          comment: 'The ID of the current environment',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 26,
        },
        type: 'string',
      },
      itemTypes: {
        comment: {
          comment:
            'All the models of the current DatoCMS project, indexed by ID',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 28,
        },
        type: 'Partial<Record<string, ItemType>>',
      },
      currentUser: {
        comment: {
          comment:
            'The current DatoCMS user. It can either be the owner or one of the\ncollaborators (regular or SSO).',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 33,
        },
        type: 'User | SsoUser | Account | Organization',
      },
      currentRole: {
        comment: {
          comment: 'The role for the current DatoCMS user',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 35,
        },
        type: 'Role',
      },
      currentUserAccessToken: {
        comment: {
          comment:
            'The access token to perform API calls on behalf of the current user. Only\navailable if `currentUserAccessToken` additional permission is granted',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 40,
        },
        type: 'string | undefined',
      },
      plugin: {
        comment: {
          comment: 'The current plugin',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 42,
        },
        type: 'Plugin',
      },
      ui: {
        comment: {
          comment:
            'UI preferences of the current user (right now, only the preferred locale is\navailable)',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 47,
        },
        type: '{\n    /** Preferred locale */\n    locale: string;\n  }',
      },
      fields: {
        comment: {
          comment:
            'All the fields currently loaded for the current DatoCMS project, indexed by\nID. It will always contain the current model fields and all the fields of\nthe blocks it might contain via Modular Content/Structured Text fields. If\nsome fields you need are not present, use the `loadItemTypeFields` function\nto load them.',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 58,
        },
        type: 'Partial<Record<string, Field>>',
      },
      fieldsets: {
        comment: {
          comment:
            'All the fieldsets currently loaded for the current DatoCMS project, indexed\nby ID. It will always contain the current model fields and all the fields\nof the blocks it might contain via Modular Content/Structured Text fields.\nIf some fields you need are not present, use the `loadItemTypeFieldsets`\nfunction to load them.',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 66,
        },
        type: 'Partial<Record<string, Fieldset>>',
      },
      theme: {
        comment: {
          comment:
            'An object containing the theme colors for the current DatoCMS project',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 68,
        },
        type: 'Theme',
      },
      users: {
        comment: {
          comment:
            'All the regular users currently loaded for the current DatoCMS project,\nindexed by ID. It will always contain the current user. If some users you\nneed are not present, use the `loadUsers` function to load them.',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 74,
        },
        type: 'Partial<Record<string, User>>',
      },
      ssoUsers: {
        comment: {
          comment:
            'All the SSO users currently loaded for the current DatoCMS project, indexed\nby ID. It will always contain the current user. If some users you need are\nnot present, use the `loadSsoUsers` function to load them.',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 80,
        },
        type: 'Partial<Record<string, SsoUser>>',
      },
      account: {
        comment: {
          comment: 'The account that is the project owner',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 87,
        },
        type: 'Account | undefined',
      },
      owner: {
        comment: {
          comment: 'The account that is the project owner',
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 89,
        },
        type: 'Account | Organization',
      },
    },
    methods: {
      loadItemTypeFields: {
        comment: {
          comment:
            'Loads all the fields for a specific model (or block). Fields will be\nreturned and will also be available in the the `fields` property.',
          example:
            "const itemTypeId = prompt('Please insert a model ID:');\n\nconst fields = await ctx.loadItemTypeFields(itemTypeId);\n\nctx.notice(\n  `Success! ${fields\n    .map((field) => field.attributes.api_key)\n    .join(', ')}`,\n);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 133,
        },
        type: '(itemTypeId: string) => Promise<Field[]>',
      },
      loadItemTypeFieldsets: {
        comment: {
          comment:
            'Loads all the fieldsets for a specific model (or block). Fieldsets will be\nreturned and will also be available in the the `fieldsets` property.',
          example:
            "const itemTypeId = prompt('Please insert a model ID:');\n\nconst fieldsets = await ctx.loadItemTypeFieldsets(itemTypeId);\n\nctx.notice(\n  `Success! ${fieldsets\n    .map((fieldset) => fieldset.attributes.title)\n    .join(', ')}`,\n);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 152,
        },
        type: '(itemTypeId: string) => Promise<Fieldset[]>',
      },
      loadFieldsUsingPlugin: {
        comment: {
          comment:
            'Loads all the fields in the project that are currently using the plugin for\none of its manual field extensions.',
          example:
            "const fields = await ctx.loadFieldsUsingPlugin();\n\nctx.notice(\n  `Success! ${fields\n    .map((field) => field.attributes.api_key)\n    .join(', ')}`,\n);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 169,
        },
        type: '() => Promise<Field[]>',
      },
      loadUsers: {
        comment: {
          comment:
            'Loads all regular users. Users will be returned and will also be available\nin the the `users` property.',
          example:
            "const users = await ctx.loadUsers();\n\nctx.notice(`Success! ${users.map((user) => user.id).join(', ')}`);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 182,
        },
        type: '() => Promise<User[]>',
      },
      loadSsoUsers: {
        comment: {
          comment:
            'Loads all SSO users. Users will be returned and will also be available in\nthe the `ssoUsers` property.',
          example:
            "const users = await ctx.loadSsoUsers();\n\nctx.notice(`Success! ${users.map((user) => user.id).join(', ')}`);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 195,
        },
        type: '() => Promise<SsoUser[]>',
      },
      updatePluginParameters: {
        comment: {
          comment:
            'Updates the plugin parameters.\n\nAlways check `ctx.currentRole.meta.final_permissions.can_edit_schema`\nbefore calling this, as the user might not have the permission to perform\nthe operation.',
          example:
            "await ctx.updatePluginParameters({ debugMode: true });\nawait ctx.notice('Plugin parameters successfully updated!');",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 217,
        },
        type: '(params: Record<string, unknown>) => Promise<void>',
      },
      updateFieldAppearance: {
        comment: {
          comment:
            'Performs changes in the appearance of a field. You can install/remove a\nmanual field extension, or tweak their parameters. If multiple changes are\npassed, they will be applied sequencially.\n\nAlways check `ctx.currentRole.meta.final_permissions.can_edit_schema`\nbefore calling this, as the user might not have the permission to perform\nthe operation.',
          example:
            "const fields = await ctx.loadFieldsUsingPlugin();\n\nif (fields.length === 0) {\n  ctx.alert('No field is using this plugin as a manual extension!');\n  return;\n}\n\nfor (const field of fields) {\n  const { appearance } = field.attributes;\n  const operations = [];\n\n  if (appearance.editor === ctx.plugin.id) {\n    operations.push({\n      operation: 'updateEditor',\n      newParameters: {\n        ...appearance.parameters,\n        foo: 'bar',\n      },\n    });\n  }\n\n  appearance.addons.forEach((addon, i) => {\n    if (addon.id !== ctx.plugin.id) {\n      return;\n    }\n\n    operations.push({\n      operation: 'updateAddon',\n      index: i,\n      newParameters: { ...addon.parameters, foo: 'bar' },\n    });\n  });\n\n  await ctx.updateFieldAppearance(field.id, operations);\n  ctx.notice(`Successfully edited field ${field.attributes.api_key}`);\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 268,
        },
        type: '(\n    fieldId: string,\n    changes: FieldAppearanceChange[],\n  ) => Promise<void>',
      },
      alert: {
        comment: {
          comment: 'Triggers an "error" toast displaying the selected message',
          example:
            "const message = prompt(\n  'Please insert a message:',\n  'This is an alert message!',\n);\n\nawait ctx.alert(message);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 373,
        },
        type: '(message: string) => Promise<void>',
      },
      notice: {
        comment: {
          comment: 'Triggers a "success" toast displaying the selected message',
          example:
            "const message = prompt(\n  'Please insert a message:',\n  'This is a notice message!',\n);\n\nawait ctx.notice(message);",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 388,
        },
        type: '(message: string) => Promise<void>',
      },
      customToast: {
        comment: {
          comment:
            'Triggers a custom toast displaying the selected message (and optionally a\nCTA)',
          example:
            "const result = await ctx.customToast({\n  type: 'warning',\n  message: 'Just a sample warning notification!',\n  dismissOnPageChange: true,\n  dismissAfterTimeout: 5000,\n  cta: {\n    label: 'Execute call-to-action',\n    value: 'cta',\n  },\n});\n\nif (result === 'cta') {\n  ctx.notice(`Clicked CTA!`);\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 412,
        },
        type: '<CtaValue = unknown>(\n    toast: Toast<CtaValue>,\n  ) => Promise<CtaValue | null>',
      },
      createNewItem: {
        comment: {
          comment:
            'Opens a dialog for creating a new record. It returns a promise resolved\nwith the newly created record or `null` if the user closes the dialog\nwithout creating anything.',
          example:
            "const itemTypeId = prompt('Please insert a model ID:');\n\nconst item = await ctx.createNewItem(itemTypeId);\n\nif (item) {\n  ctx.notice(`Success! ${item.id}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 298,
        },
        type: '(itemTypeId: string) => Promise<Item | null>',
      },
      selectItem: {
        comment: {
          comment:
            'Opens a dialog for selecting one (or multiple) record(s) from a list of\nexisting records of type `itemTypeId`. It returns a promise resolved with\nthe selected record(s), or `null` if the user closes the dialog without\nchoosing any record.',
          example:
            "const itemTypeId = prompt('Please insert a model ID:');\n\nconst items = await ctx.selectItem(itemTypeId, { multiple: true });\n\nif (items) {\n  ctx.notice(`Success! ${items.map((i) => i.id).join(', ')}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 319,
        },
        type: '{\n    (\n      itemTypeId: string,\n      options: { multiple: true; initialLocationQuery?: ItemListLocationQuery },\n    ): Promise<Item[] | null>;\n    (\n      itemTypeId: string,\n      options?: {\n        multiple: false;\n        initialLocationQuery?: ItemListLocationQuery;\n      },\n    ): Promise<Item | null>;\n  }',
      },
      editItem: {
        comment: {
          comment:
            'Opens a dialog for editing an existing record. It returns a promise\nresolved with the edited record, or `null` if the user closes the dialog\nwithout persisting any change.',
          example:
            "const itemId = prompt('Please insert a record ID:');\n\nconst item = await ctx.editItem(itemId);\n\nif (item) {\n  ctx.notice(`Success! ${item.id}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 351,
        },
        type: '(itemId: string) => Promise<Item | null>',
      },
      selectUpload: {
        comment: {
          comment:
            'Opens a dialog for selecting one (or multiple) existing asset(s). It\nreturns a promise resolved with the selected asset(s), or `null` if the\nuser closes the dialog without selecting any upload.',
          example:
            "const item = await ctx.selectUpload({ multiple: false });\n\nif (item) {\n  ctx.notice(`Success! ${item.id}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 439,
        },
        type: '{\n    (options: { multiple: true }): Promise<Upload[] | null>;\n    (options?: { multiple: false }): Promise<Upload | null>;\n  }',
      },
      editUpload: {
        comment: {
          comment:
            'Opens a dialog for editing a Media Area asset. It returns a promise\nresolved with:\n\n- The updated asset, if the user persists some changes to the asset itself\n- `null`, if the user closes the dialog without persisting any change\n- An asset structure with an additional `deleted` property set to true, if\n  the user deletes the asset',
          example:
            "const uploadId = prompt('Please insert an asset ID:');\n\nconst item = await ctx.editUpload(uploadId);\n\nif (item) {\n  ctx.notice(`Success! ${item.id}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 467,
        },
        type: '(\n    uploadId: string,\n  ) => Promise<(Upload & { deleted?: true }) | null>',
      },
      editUploadMetadata: {
        comment: {
          comment:
            'Opens a dialog for editing a "single asset" field structure. It returns a\npromise resolved with the updated structure, or `null` if the user closes\nthe dialog without persisting any change.',
          example:
            "const uploadId = prompt('Please insert an asset ID:');\n\nconst result = await ctx.editUploadMetadata({\n  upload_id: uploadId,\n  alt: null,\n  title: null,\n  custom_data: {},\n  focal_point: null,\n});\n\nif (result) {\n  ctx.notice(`Success! ${JSON.stringify(result)}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 495,
        },
        type: '(\n    /** The "single asset" field structure */\n    fileFieldValue: FileFieldValue,\n    /** Shows metadata information for a specific locale */\n    locale?: string,\n  ) => Promise<FileFieldValue | null>',
      },
      openModal: {
        comment: {
          comment:
            'Opens a custom modal. Returns a promise resolved with what the modal itself\nreturns calling the `resolve()` function',
          example:
            "const result = await ctx.openModal({\n  id: 'regular',\n  title: 'Custom title!',\n  width: 'l',\n  parameters: { foo: 'bar' },\n});\n\nif (result) {\n  ctx.notice(`Success! ${JSON.stringify(result)}`);\n} else {\n  ctx.alert('Closed!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 526,
        },
        type: '(modal: Modal) => Promise<unknown>',
      },
      openConfirm: {
        comment: {
          comment:
            'Opens a UI-consistent confirmation dialog. Returns a promise resolved with\nthe value of the choice made by the user',
          example:
            "const result = await ctx.openConfirm({\n  title: 'Custom title',\n  content:\n    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',\n  choices: [\n    {\n      label: 'Positive',\n      value: 'positive',\n      intent: 'positive',\n    },\n    {\n      label: 'Negative',\n      value: 'negative',\n      intent: 'negative',\n    },\n  ],\n  cancel: {\n    label: 'Cancel',\n    value: false,\n  },\n});\n\nif (result) {\n  ctx.notice(`Success! ${result}`);\n} else {\n  ctx.alert('Cancelled!');\n}",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 563,
        },
        type: '(options: ConfirmOptions) => Promise<unknown>',
      },
      navigateTo: {
        comment: {
          comment: 'Moves the user to another URL internal to the backend',
          example: "await ctx.navigateTo('/');",
        },
        location: {
          filePath: 'src/ctx/base.ts',
          lineNumber: 577,
        },
        type: '(path: string) => Promise<void>',
      },
    },
  },
  selfResizingPluginFrameCtxSizingUtilities: {
    startAutoResizer: {
      comment: {
        comment:
          "Listens for DOM changes and automatically calls `setHeight` when it detects\na change. If you're using `datocms-react-ui` package, the `<Canvas />`\ncomponent already takes care of calling this method for you.",
      },
      location: {
        filePath: 'src/ctx/commonExtras/sizing.ts',
        lineNumber: 7,
      },
      type: '() => void',
    },
    stopAutoResizer: {
      comment: {
        comment: 'Stops resizing the iframe automatically',
      },
      location: {
        filePath: 'src/ctx/commonExtras/sizing.ts',
        lineNumber: 10,
      },
      type: '() => void',
    },
    updateHeight: {
      comment: {
        comment:
          "Triggers a change in the size of the iframe. If you don't explicitely pass\na `newHeight` it will be automatically calculated using the iframe content\nat the moment",
      },
      location: {
        filePath: 'src/ctx/commonExtras/sizing.ts',
        lineNumber: 17,
      },
      type: '(newHeight?: number) => void',
    },
  },
};
