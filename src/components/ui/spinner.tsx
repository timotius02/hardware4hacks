import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export type SpinnerProps = React.SVGAttributes<SVGElement>;

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2 className={cn(className, "animate-spin")} ref={ref} {...props} />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
