import { breakpoints } from "./constants";
import type { BreakpointKeys } from "./types";

import useWindowSize from "./useWindowsSize";

const useCurrentBreakpoint = (): BreakpointKeys => {
  const { width } = useWindowSize();

  const breakpointEntries = Object.entries(breakpoints);
  const fallBackBreakpoint = breakpointEntries[0][0];

  for (const [index, breakpointEntry] of breakpointEntries.entries()) {
    const [key, value] = breakpointEntry;
    const isWidthSmaller = width < value;
    const isLastBreakpoint = index === breakpointEntries.length - 1;

    if (isWidthSmaller || isLastBreakpoint) return key as BreakpointKeys;
  }

  return fallBackBreakpoint as BreakpointKeys;
};

export default useCurrentBreakpoint;
