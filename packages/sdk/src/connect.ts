import connectToParent from 'penpal/lib/connectToParent';
import type { AssetSourcesHook } from './hooks/assetSources';
import type { BuildItemPresentationInfoHook } from './hooks/buildItemPresentationInfo';
import type { ContentAreaSidebarItemsHook } from './hooks/contentAreaSidebarItems';
import type { CustomBlockStylesForStructuredTextFieldHook } from './hooks/customBlockStylesForStructuredTextField';
import type { CustomMarksForStructuredTextFieldHook } from './hooks/customMarksForStructuredTextField';
import type { ExecuteFieldDropdownActionHook } from './hooks/executeFieldDropdownAction';
import type { ExecuteItemFormDropdownActionHook } from './hooks/executeItemFormDropdownAction';
import type { ExecuteItemsDropdownActionHook } from './hooks/executeItemsDropdownAction';
import type { ExecuteSchemaItemTypeDropdownActionHook } from './hooks/executeSchemaItemTypeDropdownAction';
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
import type { OnBeforeItemUpsertHook } from './hooks/onBeforeItemUpsert';
import type { OnBeforeItemsDestroyHook } from './hooks/onBeforeItemsDestroy';
import type { OnBeforeItemsPublishHook } from './hooks/onBeforeItemsPublish';
import type { OnBeforeItemsUnpublishHook } from './hooks/onBeforeItemsUnpublish';
import type { OnBootHook } from './hooks/onBoot';
import type { OverrideFieldExtensionsHook } from './hooks/overrideFieldExtensions';
import {
  RenderAssetSourceHook,
  renderAssetSourceBootstrapper,
} from './hooks/renderAssetSource';
import {
  RenderConfigScreenHook,
  renderConfigScreenBootstrapper,
} from './hooks/renderConfigScreen';
import {
  RenderFieldExtensionHook,
  renderFieldExtensionBootstrapper,
} from './hooks/renderFieldExtension';
import {
  RenderItemCollectionOutletHook,
  renderItemCollectionOutletBootstrapper,
} from './hooks/renderItemCollectionOutlet';
import {
  RenderItemFormOutletHook,
  renderItemFormOutletBootstrapper,
} from './hooks/renderItemFormOutlet';
import {
  RenderItemFormSidebarHook,
  renderItemFormSidebarBootstrapper,
} from './hooks/renderItemFormSidebar';
import {
  RenderItemFormSidebarPanelHook,
  renderItemFormSidebarPanelBootstrapper,
} from './hooks/renderItemFormSidebarPanel';
import {
  RenderManualFieldExtensionConfigScreenHook,
  renderManualFieldExtensionConfigScreenBootstrapper,
} from './hooks/renderManualFieldExtensionConfigScreen';
import { RenderModalHook, renderModalBootstrapper } from './hooks/renderModal';
import { RenderPageHook, renderPageBootstrapper } from './hooks/renderPage';
import {
  RenderUploadSidebarHook,
  renderUploadSidebarBootstrapper,
} from './hooks/renderUploadSidebar';
import {
  RenderUploadSidebarPanelHook,
  renderUploadSidebarPanelBootstrapper,
} from './hooks/renderUploadSidebarPanel';
import type { SchemaItemTypeDropdownActionsHook } from './hooks/schemaItemTypeDropdownActions';
import type { SettingsAreaSidebarItemGroupsHook } from './hooks/settingsAreaSidebarItemGroups';
import { UploadSidebarPanelsHook } from './hooks/uploadSidebarPanels';
import { UploadSidebarsHook } from './hooks/uploadSidebars';
import type { UploadsDropdownActionsHook } from './hooks/uploadsDropdownActions';
import type { ValidateManualFieldExtensionParametersHook } from './hooks/validateManualFieldExtensionParameters';
import {
  Bootstrapper,
  ExtractRenderHooks,
  fromOneFieldIntoMultipleAndResultsById,
  omit,
} from './utils';

/** The full options you can pass to the `connect` function */
export type FullConnectParameters = AssetSourcesHook &
  BuildItemPresentationInfoHook &
  ContentAreaSidebarItemsHook &
  CustomBlockStylesForStructuredTextFieldHook &
  CustomMarksForStructuredTextFieldHook &
  ExecuteFieldDropdownActionHook &
  ExecuteItemFormDropdownActionHook &
  ExecuteItemsDropdownActionHook &
  ExecuteSchemaItemTypeDropdownActionHook &
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
  RenderUploadSidebarHook &
  RenderUploadSidebarPanelHook &
  SchemaItemTypeDropdownActionsHook &
  SettingsAreaSidebarItemGroupsHook &
  UploadsDropdownActionsHook &
  UploadSidebarPanelsHook &
  UploadSidebarsHook &
  ValidateManualFieldExtensionParametersHook;

export async function connect(
  rawConfiguration: Partial<FullConnectParameters> = {},
): Promise<void> {
  let onChangeListener: ((newSettings: any) => void) | null = null;

  let callMethodMergingBootCtxExecutor:
    | ((
        methodName: string,
        methodArgs: unknown[],
        extraCtxProperties: Record<string, unknown>,
        extraCtxMethodKeys: string[],
        methodCallId: string,
      ) => void)
    | null = null;

  const configuration = {
    ...rawConfiguration,
    overrideFieldExtensions: fromOneFieldIntoMultipleAndResultsById(
      rawConfiguration.overrideFieldExtensions,
    ),
    customMarksForStructuredTextField: fromOneFieldIntoMultipleAndResultsById(
      rawConfiguration.customMarksForStructuredTextField,
    ),
    customBlockStylesForStructuredTextField:
      fromOneFieldIntoMultipleAndResultsById(
        rawConfiguration.customBlockStylesForStructuredTextField,
      ),
  };

  const penpalConnection = connectToParent({
    methods: {
      sdkVersion: () => '0.3.0',
      implementedHooks: () =>
        Object.fromEntries(
          Object.keys(rawConfiguration).map((hook) => {
            return [hook, true];
          }),
        ),
      // What hooks should we expose via penpal as direct callable methods by CMS?
      // * all renderXXX hooks will be called via onChange() -> bootstrapper, so not needed
      // * all non-render hooks ending with ctx will be called via callMethodMergingBootCtx(), so not needed
      // * only the non-render hooks NOT ending with ctx need to be directly called by the CMS!
      // In the following lines we're exposing more than needed (all non-render hooks).. but it's OK.
      ...Object.fromEntries(
        Object.entries(configuration).filter(
          ([key]) => !key.startsWith('render'),
        ),
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
        extraCtxMethodKeys: string[],
        methodCallId: string,
      ) {
        if (!callMethodMergingBootCtxExecutor) {
          return null;
        }
        return callMethodMergingBootCtxExecutor(
          methodName,
          methodArgs,
          extraCtxProperties,
          extraCtxMethodKeys,
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
      extraCtxMethodKeys: string[],
      methodCallId: string,
    ) => {
      if (!(methodName in configuration)) {
        return undefined;
      }

      return (configuration as any)[methodName](...methodArgs, {
        ...omit(methods, ['getSettings', 'setHeight']),
        ...omit(currentProperties, ['mode', 'bodyPadding']),
        ...Object.fromEntries(
          extraCtxMethodKeys.map((methodName) => [
            methodName,
            function createAdditionalMethodProxy(...args: any[]) {
              return (methods as any).callAdditionalCtxMethod(
                methodCallId,
                methodName,
                args,
              );
            },
          ]),
        ),
        ...extraCtxProperties,
      });
    };

    if (configuration.onBoot) {
      configuration.onBoot({
        ...methods,
        ...currentProperties,
      });
    }
  }

  type EnsureAllBootstrappers = {
    [K in keyof ExtractRenderHooks<FullConnectParameters>]: Bootstrapper<K>;
  };

  const availableBootstrappers: EnsureAllBootstrappers = {
    renderAssetSource: renderAssetSourceBootstrapper,
    renderConfigScreen: renderConfigScreenBootstrapper,
    renderFieldExtension: renderFieldExtensionBootstrapper,
    renderItemCollectionOutlet: renderItemCollectionOutletBootstrapper,
    renderItemFormOutlet: renderItemFormOutletBootstrapper,
    renderItemFormSidebar: renderItemFormSidebarBootstrapper,
    renderItemFormSidebarPanel: renderItemFormSidebarPanelBootstrapper,
    renderManualFieldExtensionConfigScreen:
      renderManualFieldExtensionConfigScreenBootstrapper,
    renderModal: renderModalBootstrapper,
    renderPage: renderPageBootstrapper,
    renderUploadSidebar: renderUploadSidebarBootstrapper,
    renderUploadSidebarPanel: renderUploadSidebarPanelBootstrapper,
  };

  for (const bootstrapper of Object.values(availableBootstrappers)) {
    const result = bootstrapper(configuration, methods, initialProperties);

    if (result) {
      onChangeListener = result;
      break;
    }
  }
}
