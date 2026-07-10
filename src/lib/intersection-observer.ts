type ObserverCallback = (entry: IntersectionObserverEntry) => void;

const observerCache = new Map<string, IntersectionObserver>();
const elementCallbacks = new WeakMap<Element, ObserverCallback>();

function getCacheKey(options: IntersectionObserverInit): string {
  const root = options.root instanceof Element ? options.root.id || "el" : "window";
  return `${root}|${options.rootMargin ?? ""}|${String(options.threshold ?? "")}`;
}

function getSharedObserver(options: IntersectionObserverInit): IntersectionObserver {
  const key = getCacheKey(options);
  let observer = observerCache.get(key);

  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const callback = elementCallbacks.get(entry.target);
        callback?.(entry);
      }
    }, options);
    observerCache.set(key, observer);
  }

  return observer;
}

export function observeIntersection(
  element: Element,
  callback: ObserverCallback,
  options: IntersectionObserverInit = { threshold: 0.15 },
  once = false,
): () => void {
  const observer = getSharedObserver(options);

  const wrapped: ObserverCallback = (entry) => {
    callback(entry);
    if (once) {
      observer.unobserve(element);
      elementCallbacks.delete(element);
    }
  };

  elementCallbacks.set(element, wrapped);
  observer.observe(element);

  return () => {
    observer.unobserve(element);
    elementCallbacks.delete(element);
  };
}
