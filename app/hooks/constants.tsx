import { type BreakpointKeys } from "~/hooks/types";

export const breakpoints: { [id in BreakpointKeys]: number } = {
  sm: 700,
  md: 1200,
  lg: 1600,
};
