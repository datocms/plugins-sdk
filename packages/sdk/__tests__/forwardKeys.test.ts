// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { forwardUnhandledKeys } from '../src/forwardKeys';

describe('forwardUnhandledKeys', () => {
  const forwardKeyDown = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    forwardKeyDown.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  forwardUnhandledKeys(forwardKeyDown);

  function press(init: KeyboardEventInit, target: EventTarget = document.body) {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    });
    target.dispatchEvent(event);
    return event;
  }

  test('forwards a key that the plugin does not handle', () => {
    press({ key: 'g', code: 'KeyG' });
    vi.runAllTimers();

    expect(forwardKeyDown).toHaveBeenCalledWith({
      key: 'g',
      code: 'KeyG',
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      repeat: false,
      inField: false,
    });
  });

  test('keeps a key that the plugin handles after the listener of the SDK', () => {
    const event = press({ key: 'g', code: 'KeyG' });
    event.preventDefault();
    vi.runAllTimers();

    expect(forwardKeyDown).not.toHaveBeenCalled();
  });

  test('keeps the plain keys of a text field, and forwards the keys with ⌘ or Ctrl', () => {
    const input = document.createElement('input');
    document.body.append(input);

    press({ key: 'g', code: 'KeyG' }, input);
    press({ key: 's', code: 'KeyS', ctrlKey: true }, input);
    vi.runAllTimers();

    expect(forwardKeyDown).toHaveBeenCalledTimes(1);
    expect(forwardKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ key: 's', ctrlKey: true, inField: true }),
    );
    input.remove();
  });

  test('sees a text field in a shadow root', () => {
    const host = document.createElement('div');
    const input = document.createElement('input');
    host.attachShadow({ mode: 'open' }).append(input);
    document.body.append(host);

    press({ key: 'p', code: 'KeyP', composed: true }, input);
    vi.runAllTimers();

    expect(forwardKeyDown).not.toHaveBeenCalled();
    host.remove();
  });

  test('forwards the key of the palette at once, and cancels its default', () => {
    const event = press({ key: 'k', code: 'KeyK', ctrlKey: true });

    expect(event.defaultPrevented).toBe(true);
    expect(forwardKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'KeyK', ctrlKey: true }),
    );
  });

  test('keeps the modifier keys alone', () => {
    press({ key: 'Shift', code: 'ShiftLeft', shiftKey: true });
    vi.runAllTimers();

    expect(forwardKeyDown).not.toHaveBeenCalled();
  });

  test('does nothing when the host does not give forwardKeyDown', () => {
    expect(() => forwardUnhandledKeys(undefined)).not.toThrow();
  });
});
