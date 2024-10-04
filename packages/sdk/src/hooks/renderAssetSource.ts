import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderAssetSourceHook = {
  /**
   * This function will be called when the user selects one of the plugin's
   * asset sources to upload a new media file.
   *
   * @tag assetSources
   */
  renderAssetSource: (assetSourceId: string, ctx: RenderAssetSourceCtx) => void;
};

export type RenderAssetSourceCtx = SelfResizingPluginFrameCtx<
  'renderAssetSource',
  {
    /** The ID of the assetSource that needs to be rendered */
    assetSourceId: string;
  },
  {
    /**
     * Function to be called when the user selects the asset: it will trigger the
     * creation of a new `Upload` that will be added in the Media Area.
     *
     * @example
     *
     * ```js
     * await ctx.select({
     *   resource: {
     *     url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',
     *     filename: 'man-drinking-coffee.jpg',
     *   },
     *   copyright: 'Royalty free (Unsplash)',
     *   author: 'Jeff Sheldon',
     *   notes: 'A man drinking a coffee',
     *   tags: ['man', 'coffee'],
     * });
     * ```
     */
    select: (newUpload: NewUpload) => void;
  }
>;

export type NewUploadResourceAsUrl = {
  /**
   * URL for the resource. The URL must respond with a
   * `Access-Control-Allow-Origin` header — for instance `*`, which will allow
   * all hosts — allowing the image to be read by DatoCMS
   */
  url: string;
  /** Any additional headers to pass when making the request to the URL */
  headers?: Record<string, string>;
  /**
   * Optional filename to be used to generate the final DatoCMS URL. If not
   * passed, the URL will be used
   */
  filename?: string;
};

export type NewUploadResourceAsBase64 = {
  /**
   * Base64 encoded data URI for the resource.
   *
   * Format:
   *
   * `data:[<mime type>][;charset=<charset>];base64,<encoded data>`
   */
  base64: string;
  /** Filename to be used to generate the final DatoCMS URL */
  filename: string;
};

export type NewUpload = {
  /** The actual resource that will be uploaded */
  resource: NewUploadResourceAsUrl | NewUploadResourceAsBase64;
  /** Copyright to apply to the asset */
  copyright?: string;
  /** Author to apply to the asset */
  author?: string;
  /** Notes to apply to the asset */
  notes?: string;
  /** Tags to apply to the asset */
  tags?: string[];
  /**
   * An hash containing, for each locale of the project, the default metadata to
   * apply to the asset
   */
  default_field_metadata?: {
    [k: string]: {
      /** Alternate text for the asset */
      alt: string | null;
      /** Title for the asset */
      title: string | null;
      /** Object with arbitrary metadata */
      custom_data: {
        [k: string]: unknown;
      };
      /** Focal point (only for image assets) */
      focal_point?: {
        /** Horizontal position expressed as float between 0 and 1 */
        x: number;
        /** Vertical position expressed as float between 0 and 1 */
        y: number;
      } | null;
    };
  };
};

export const renderAssetSourceBootstrapper =
  containedRenderModeBootstrapper<RenderAssetSourceCtx>(
    'renderAssetSource',
    (configuration, ctx) => {
      if (!configuration.renderAssetSource) {
        return;
      }

      configuration.renderAssetSource(ctx.assetSourceId, ctx);
    },
  );
