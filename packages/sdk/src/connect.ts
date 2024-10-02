import connectToParent from 'penpal/lib/connectToParent';
import type { AssetSourcesHook } from './hooks/assetSources';
import type { BuildItemPresentationInfoHook } from './hooks/buildItemPresentationInfo';
import type { ContentAreaSidebarItemsHook } from './hooks/contentAreaSidebarItems';
import type { CustomBlockStylesForStructuredTextFieldHook } from './hooks/customBlockStylesForStructuredTextField';
import type { CustomMarksForStructuredTextFieldHook } from './hooks/customMarksForStructuredTextField';
import type { ExecuteFieldDropdownActionHook } from './hooks/executeFieldDropdownAction';
import type { ExecuteItemFormDropdownActionHook } from './hooks/executeItemFormDropdownAction';
import type { ExecuteItemsDropdownActionHook } from './hooks/executeItemsDropdownAction';
import type { ExecuteUploadsDropdownActionHook } from './hooks/executeUploadsDropdownAction';
import type { FieldDropdownActionsHook } from './hooks/fieldDropdownActions';
import type { InitialLocationQueryForItemSelectorHook } from './hooks/initialLocationQueryForItemSelector';
import type { ItemCollectionOutletsHook } from './hooks/itemCollectionOutlets';
import type { ItemFormDropdownActionsHook } from './hooks/itemFormDropdownActions';
import type { ItemFormOutletsHook } from './hooks/itemFormOutlets';
import type { ItemFormSidebarPanelsHook } from './hooks/itemFormSidebarPanels';
import type { ItemFormSidebarsHook } from './hooks/itemFormSidebars';
import type { ItemsDropdownActionsHook } from './hooks/itemsDropdownActions';
import type { MainNavigationTabsHook } from './hooks/mainNavigationTabs';
import type { ManualFieldExtensionsHook } from './hooks/manualFieldExtensions';
import type { OnBeforeItemsDestroyHook } from './hooks/onBeforeItemsDestroy';
import type { OnBeforeItemsPublishHook } from './hooks/onBeforeItemsPublish';
import type { OnBeforeItemsUnpublishHook } from './hooks/onBeforeItemsUnpublish';
import type { OnBeforeItemUpsertHook } from './hooks/onBeforeItemUpsert';
import type { OnBootHook } from './hooks/onBoot';
import type { OverrideFieldExtensionsHook } from './hooks/overrideFieldExtensions';
import {
  renderAssetSourceBootstrapper,
  RenderAssetSourceHook,
} from './hooks/renderAssetSource';
import {
  renderConfigScreenBootstrapper,
  RenderConfigScreenHook,
} from './hooks/renderConfigScreen';
import {
  renderFieldExtensionBootstrapper,
  RenderFieldExtensionHook,
} from './hooks/renderFieldExtension';
import {
  renderItemCollectionOutletBootstrapper,
  RenderItemCollectionOutletHook,
} from './hooks/renderItemCollectionOutlet';
import {
  renderItemFormOutletBootstrapper,
  RenderItemFormOutletHook,
} from './hooks/renderItemFormOutlet';
import {
  renderItemFormSidebarBootstrapper,
  RenderItemFormSidebarHook,
} from './hooks/renderItemFormSidebar';
import {
  renderItemFormSidebarPanelBootstrapper,
  RenderItemFormSidebarPanelHook,
} from './hooks/renderItemFormSidebarPanel';
import {
  renderManualFieldExtensionConfigScreenBootstrapper,
  RenderManualFieldExtensionConfigScreenHook,
} from './hooks/renderManualFieldExtensionConfigScreen';
import { renderModalBootstrapper, RenderModalHook } from './hooks/renderModal';
import { renderPageBootstrapper, RenderPageHook } from './hooks/renderPage';
import type { SettingsAreaSidebarItemGroupsHook } from './hooks/settingsAreaSidebarItemGroups';
import type { UploadsDropdownActionsHook } from './hooks/uploadsDropdownActions';
import type { ValidateManualFieldExtensionParametersHook } from './hooks/validateManualFieldExtensionParameters';
import { fromOneFieldIntoMultipleAndResultsById } from './utils';

/** The full options you can pass to the `connect` function */
export type FullConnectParameters = AssetSourcesHook &
  BuildItemPresentationInfoHook &
  ContentAreaSidebarItemsHook &
  CustomBlockStylesForStructuredTextFieldHook &
  CustomMarksForStructuredTextFieldHook &
  ExecuteFieldDropdownActionHook &
  ExecuteItemFormDropdownActionHook &
  ExecuteItemsDropdownActionHook &
  ExecuteUploadsDropdownActionHook &
  FieldDropdownActionsHook &
  InitialLocationQueryForItemSelectorHook &
  ItemCollectionOutletsHook &
  ItemFormDropdownActionsHook &
  ItemFormOutletsHook &
  ItemFormSidebarPanelsHook &
  ItemFormSidebarsHook &
  ItemsDropdownActionsHook &
  MainNavigationTabsHook &
  ManualFieldExtensionsHook &
  OnBeforeItemsDestroyHook &
  OnBeforeItemsPublishHook &
  OnBeforeItemsUnpublishHook &
  OnBeforeItemUpsertHook &
  OnBootHook &
  OverrideFieldExtensionsHook &
  RenderAssetSourceHook &
  RenderConfigScreenHook &
  RenderFieldExtensionHook &
  RenderItemCollectionOutletHook &
  RenderItemFormOutletHook &
  RenderItemFormSidebarHook &
  RenderItemFormSidebarPanelHook &
  RenderManualFieldExtensionConfigScreenHook &
  RenderModalHook &
  RenderPageHook &
  SettingsAreaSidebarItemGroupsHook &
  UploadsDropdownActionsHook &
  ValidateManualFieldExtensionParametersHook;

export async function connect(
  configuration: Partial<FullConnectParameters> = {},
): Promise<void> {
  let onChangeListener: ((newSettings: any) => void) | null = null;

  let callMethodMergingBootCtxExecutor:
    | ((
        methodName: string,
        methodArgs: unknown[],
        extraCtxProperties: Record<string, unknown>,
        methodCallId: string,
      ) => void)
    | null = null;

  const hooksWithNoRendering = Object.fromEntries(
    Object.entries(configuration).filter(([key]) => !key.startsWith('render')),
  );

  const penpalConnection = connectToParent({
    methods: {
      sdkVersion: () => '0.2.0',
      implementedHooks: () =>
        Object.fromEntries(
          Object.entries(configuration).map(([key, value]) => {
            if (typeof value === 'function') {
              return [key, true];
            }

            return [key, value];
          }),
        ),
      ...hooksWithNoRendering,
      overrideFieldExtensions: fromOneFieldIntoMultipleAndResultsById(
        configuration.overrideFieldExtensions,
      ),
      customMarksForStructuredTextField: fromOneFieldIntoMultipleAndResultsById(
        configuration.customMarksForStructuredTextField,
      ),
      customBlockStylesForStructuredTextField:
        fromOneFieldIntoMultipleAndResultsById(
          configuration.customBlockStylesForStructuredTextField,
        ),
      onChange(newSettings: unknown) {
        if (onChangeListener) {
          onChangeListener(newSettings);
        }
      },
      callMethodMergingBootCtx(
        methodName: string,
        methodArgs: unknown[],
        extraCtxProperties: Record<string, unknown>,
        methodCallId: string,
      ) {
        if (!callMethodMergingBootCtxExecutor) {
          return null;
        }
        return callMethodMergingBootCtxExecutor(
          methodName,
          methodArgs,
          extraCtxProperties,
          methodCallId,
        );
      },
    },
  });

  const methods = await penpalConnection.promise;
  const initialProperties = await methods.getSettings();

  if (initialProperties.mode === 'onBoot') {
    let currentProperties = initialProperties;

    onChangeListener = (newProperties) => {
      currentProperties = newProperties;
    };

    callMethodMergingBootCtxExecutor = (
      methodName: string,
      methodArgs: unknown[],
      extraCtxProperties: Record<string, unknown>,
      methodCallId: string,
    ) => {
      if (!(methodName in configuration)) {
        return undefined;
      }

      const ctxCatchingMissingMethods = new Proxy(
        {
          ...methods,
          ...currentProperties,
          ...extraCtxProperties,
        },
        {
          get(target, property, receiver) {
            if (property in target) {
              return Reflect.get(target, property, receiver);
            }

            return (...args: any[]) => {
              return (methods as any).missingMethodOnCtx(
                methodCallId,
                property,
                args,
              );
            };
          },
        },
      );

      return (configuration as any)[methodName](
        ...methodArgs,
        ctxCatchingMissingMethods,
      );
    };

    if (configuration.onBoot) {
      configuration.onBoot({
        ...methods,
        ...currentProperties,
      });
    }
  }

  const availableBootstrappers = [
    renderAssetSourceBootstrapper,
    renderConfigScreenBootstrapper,
    renderFieldExtensionBootstrapper,
    renderItemCollectionOutletBootstrapper,
    renderItemFormOutletBootstrapper,
    renderItemFormSidebarBootstrapper,
    renderItemFormSidebarPanelBootstrapper,
    renderManualFieldExtensionConfigScreenBootstrapper,
    renderModalBootstrapper,
    renderPageBootstrapper,
  ];

  for (const bootstrapper of availableBootstrappers) {
    const result = bootstrapper(configuration, methods, initialProperties);

    if (result) {
      onChangeListener = result;
      break;
    }
  }
}
