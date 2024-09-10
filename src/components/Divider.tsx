import { cn } from "@/lib/utils";
import React from "react";

export default function Divider({
  className,
}: {
  className?: React.ComponentProps<"div">["className"];
}) {
  return (
    <div
      className={cn(
        "w-full border border-gray-203 border-dashed mb-4 mt-2",
        className
      )}
    />
  );
}
