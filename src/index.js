import Penpal from 'penpal';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import flattenDeep from 'lodash-es/flattenDeep';
import keys from 'lodash-es/keys';
import entries from 'lodash-es/entries';
import autoBind from 'auto-bind';

import './style/index.sass';

const toPath = (...chunks) => flattenDeep(chunks).join('.');

const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;
const dashCase = str => str.replace(KEBAB_REGEX, match => `-${match.toLowerCase()}`);

class Extension {
  constructor(parent, settings) {
    autoBind(this);

    this._settings = settings;
    this._parent = parent;
    this._listeners = {};
    this._mutationObserver = new MutationObserver(this._autoUpdateHeight);
    this._oldHeight = null;

    entries(settings.theme).forEach(([varName, color]) => {
      document.body.style.setProperty(
        `--${dashCase(varName)}`,
        color,
      );
    });

    keys(this._settings).forEach((key) => {
      if (key !== 'itemValue') {
        Object.defineProperty(this, key, {
          get: () => cloneDeep(this._settings[key]),
        });
      }
    });
  }

  _autoUpdateHeight() {
    this.updateHeight();
  }

  getFieldValue(...pathChunks) {
    if (pathChunks.length === 0) {
      console.error('getFieldValue requires a path');
      return undefined;
    }

    return cloneDeep(get(this._settings.itemValue, toPath(pathChunks)));
  }

  setFieldValue(...args) {
    if (args.length < 2) {
      console.error('setFieldValue requires path and a new value');
      return;
    }

    const pathChunks = args.slice(0, -1);
    const value = args[args.length - 1];
    const path = toPath(pathChunks);

    this._parent.setFieldValue(path, value);
  }

  addChangeListener(...args) {
    if (args.length < 2) {
      console.error('addChangeListener requires a path an a callback function');
      return;
    }

    const pathChunks = args.slice(0, -1);
    const cb = args[args.length - 1];
    const path = toPath(pathChunks);

    this._listeners[path] = this._listeners[path] || [];
    this._listeners[path].push(cb);

    return () => {
      this._listeners[path].filter(x => x !== cb);
    };
  }

  addFieldChangeListener(...args) {
    if (args.length < 2) {
      console.error('addFieldChangeListener requires a path an a callback function');
      return;
    }

    this.addChangeListener('itemValue', ...args);
  }

  startAutoResizer() {
    this.updateHeight();

    if (this._isAutoResizing) {
      return;
    }

    this._isAutoResizing = true;

    this._mutationObserver.observe(window.document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.addEventListener('resize', this._autoUpdateHeight);
  }

  stopAutoResizer() {
    if (!this._isAutoResizing) {
      return;
    }

    this._isAutoResizing = false;
    this._mutationObserver.disconnect();
    window.removeEventListener('resize', this._autoUpdateHeight);
  }

  updateHeight(height) {
    const realHeight = height == null
      ? Math.ceil(document.documentElement.getBoundingClientRect().height)
      : height;

    if (realHeight !== this._oldHeight) {
      this._parent.setHeight(realHeight);
      this._oldHeight = realHeight;
    }
  }
}

export default {
  init: (cb) => {
    let extensionPromise;

    const connection = Penpal.connectToParent({
      methods: {
        onChange(newSettings) {
          extensionPromise.then((ext) => {
            const oldSettings = ext._settings;

            /* eslint-disable-next-line no-param-reassign */
            ext._settings = newSettings;

            entries(ext._listeners).forEach(([path, listeners]) => {
              const newValue = get(newSettings, path);
              const oldValue = get(oldSettings, path);

              if (!isEqual(oldValue, newValue)) {
                listeners.forEach(l => l(newValue, oldValue));
              }
            });
          });
        },
      },
    });

    extensionPromise = connection.promise
      .then(parent => (
        parent.getSettings()
          .then(settings => new Extension(parent, settings))
      ));

    if (typeof cb === 'undefined') {
      return extensionPromise;
    }

    return extensionPromise.then(cb);
  },
};
