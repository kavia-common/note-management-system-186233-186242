 // PUBLIC_INTERFACE
export function debounce(fn, wait = 400) {
  /** Returns a debounced wrapper that delays invoking fn until wait ms have elapsed
   * since the last call. The debounced function exposes cancel() to clear pending calls.
   */
  let t = null;
  function debounced(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn.apply(this, args);
    }, wait);
  }
  debounced.cancel = () => t && clearTimeout(t);
  return debounced;
}
