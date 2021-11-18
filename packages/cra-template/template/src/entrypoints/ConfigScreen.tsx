import { RenderConfigScreenCtx } from 'datocms-plugins-sdk';
import { Canvas, Button } from 'datocms-react-ui';
import './style.css';

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Welcome to your plugin! This is your config screen!
    </Canvas>
  );
}
