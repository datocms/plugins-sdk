import { RenderPluginParametersFormCtx } from 'datocms-plugins-sdk';
import { Canvas, Button } from 'datocms-react-ui';
import './style.css';

type PropTypes = {
  ctx: RenderPluginParametersFormCtx;
};

export default function PluginParametersForm({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Hi!
      <Button>Click me!</Button>
    </Canvas>
  );
}
