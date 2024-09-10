import { useState } from "react";
import useAfterMount from "./useAfterMount";

export default function usePageLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useAfterMount(() => {
    setIsLoading(false);
  }, []);

  return isLoading;
}
