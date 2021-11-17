import { useEffect } from 'react';
import { RenderPluginParametersFormCtx } from 'datocms-plugins-sdk';
import './style.css';

type PropTypes = {
  ctx: RenderPluginParametersFormCtx;
};

export default function PluginParametersForm({ ctx }: PropTypes) {
  useEffect(ctx.startAutoResizer, [ctx]);

  return <>Hi!</>;
}
