import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "../lib/Utils.mjs"; // adjust path if needed

const Switch = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      ref={ref}
      {...props}
      className={cn(
        "peer inline-flex h-[28px] w-[48px] shrink-0 items-center rounded-full !rounded-full transition-colors duration-200",
        "data-[state=checked]:bg-[#30d158]",
        "data-[state=unchecked]:!bg-[#d6d6d6]",
        "!p-0 !border-none !outline-none !ring-0 !shadow-none",
        className
      )}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "block h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform duration-200",
          "data-[state=checked]:translate-x-[24px] data-[state=unchecked]:translate-x-[2px]",
          "!ring-0 !border-none !outline-none !m-0"
        )}
      />
    </SwitchPrimitives.Root>
  )
);

Switch.displayName = "Switch";
export { Switch };
