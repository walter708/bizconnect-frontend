import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ITooltipCompProps {
  text?: string;
  children: React.ReactNode;
}

export default function TooltipComp({ text, children }: ITooltipCompProps) {
  return (
    <TooltipProvider delayDuration={20}>
      <Tooltip>
        <TooltipTrigger className="w-auto">{children}</TooltipTrigger>
        {text && (
          <TooltipContent>
            <p className="font-archivo text-xs">{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
