import { connect } from 'datocms-plugins-sdk';
import { render } from './utils/render';
import PluginConfig from './entrypoints/PluginConfig';
import './global.css';

connect({
  renderPluginParametersForm(ctx) {
    return render(<PluginConfig ctx={ctx} />);
  },
});
