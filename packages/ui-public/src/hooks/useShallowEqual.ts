import { useRef } from 'react';
import { shallowEqualArrays, shallowEqualObjects } from 'shallow-equal';

// These hooks return the previous value when the new value has the same
// contents. Thus, the value stays the same object between renders, and
// React.memo can skip renders (see SLATE_PERF_NOTES in SlateInput/Inner.tsx).
//
// The hooks compare the two values during the render. Do not move the
// comparison into an effect. An effect runs after the render. Thus, for one
// render, the hook gives the previous value, but all other data is new.
//
// This problem caused a bug in ItemForm: after some saves, the record stayed
// locked. The bug occurred when the save created a block record. Examples:
// a save with a new block, or a save after "add locale" with copied blocks.
//
// BEFORE: the hook compared the values in an effect
//
//   Store          useShallowEqualArray       ItemForm              LockingContext
//     │            (in useDeeplyNestedItems)    │                         │
//     │ The save adds block B to the item.      │ The form is dirty and   │
//     │ The store gets the item and block B.    │ has the lock.           │
//     │──────────────────── Render 1 ──────────►│                         │
//     │                    │◄── Get blocks ─────│                         │
//     │                    │─── Old list ──────►│                         │
//     │                    │    (no block B)    │ Block B is missing.     │
//     │                    │                    │ ItemForm shows a        │
//     │                    │                    │ spinner in place of     │
//     │                    │                    │ the form.               │
//     │                    │                    │─── Remove the form ────►│ ✕
//     │                    │ The effect keeps   │                         │
//     │                    │ the new list and   │                         │
//     │                    │ starts a render.   │                         │
//     │──────────────────── Render 2 ──────────►│                         │
//     │                    │─── New list ──────►│                         │
//     │                    │    (with block B)  │─── Add a new form ─────►│ The new form is
//     │                    │                    │                         │ not dirty. It
//     │                    │                    │                         │ sees no change
//     │                    │                    │                         │ from dirty to
//     │                    │                    │                         │ not dirty. Thus,
//     │                    │                    │                         │ it does not
//     │                    │                    │                         │ unlock.
//
//   Every 30 seconds, the keep-alive request keeps the lock. The record stays
//   locked until the user closes it. CMA writes fail with ITEM_LOCKED.
//
// NOW: the hook compares the values during the render
//
//   Store          useShallowEqualArray       ItemForm              LockingContext
//     │──────────────────── Render 1 ──────────►│                         │
//     │                    │◄── Get blocks ─────│                         │
//     │                    │ The list changed.  │                         │
//     │                    │ Keep the new list. │                         │
//     │                    │─── New list ──────►│                         │
//     │                    │    (with block B)  │ The form stays.         │
//     │                    │                    │─── Reset the form ─────►│ The form changes
//     │                    │                    │                         │ from dirty to
//     │                    │                    │                         │ not dirty.
//     │                    │                    │                         │─── unlockItem ──► API
//
// It is safe to write the ref during the render. The comparison gives the
// same result each time. Thus, StrictMode can render two times with no
// problem. React can also stop a render and not use it. Then, the ref keeps
// the value of that render. The next render compares the current value with
// it. If the contents are different, the hook keeps the current value.

export const useShallowEqualObject = <T>(value: T): T => {
  const ref = useRef<T>(value);

  if (!shallowEqualObjects(ref.current as object, value as object)) {
    ref.current = value;
  }

  return ref.current;
};

export const useShallowEqualArray = <T>(value: T[]): T[] => {
  const ref = useRef<T[]>(value);

  if (!shallowEqualArrays(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};
