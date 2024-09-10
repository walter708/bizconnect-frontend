import { useEffect, useRef, type DependencyList } from "react";

/**
 * @param cb - The callback function to be called after the component has mounted.
 *
 * This hook is used to call a callback function after the component has mounted.
 * It is useful for calling API calls after the component has mounted.
 */

export default function useAfterMount(fn: () => void, deps: any[] = []) {
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    fn();
  }, deps);
}
