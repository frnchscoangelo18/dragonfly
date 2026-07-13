type NotificationChangeListener = () => void;

const listeners = new Set<WeakRef<NotificationChangeListener>>();

export function notifyNotificationsChanged(): void {
  for (const ref of listeners) {
    const listener = ref.deref();
    if (listener) {
      listener();
    } else {
      listeners.delete(ref);
    }
  }
}

export function subscribeNotificationsChanged(
  listener: NotificationChangeListener,
): () => void {
  const ref = new WeakRef(listener);
  listeners.add(ref);
  return () => {
    listeners.delete(ref);
  };
}
