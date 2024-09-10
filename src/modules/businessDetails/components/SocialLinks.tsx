"use client";
import { FlexColStart, FlexRowStartBtw } from "@/components/Flex";
import RenderSocialLinks from "@/components/RenderSocialLink";
import { cn } from "@/lib/utils";
import type { ValidSocialMedia } from "@/types/business";

interface SocialLinkProps {
  socialLinks: { name: ValidSocialMedia; url: string | undefined }[];
  className?: React.ComponentProps<"div">["className"];
  labelClassName?: React.ComponentProps<"label">["className"];
}

export default function SocialLinks({
  socialLinks,
  className,
  labelClassName,
}: SocialLinkProps) {
  return (
    <FlexColStart className={cn("w-full mt-[15px] pb-[30px]", className)}>
      <label
        className={cn(
          "text-[13px] sm:hidden leading-[15px] font-semibold font-archivo text-blue-200 my-2",
          labelClassName
        )}
      >
        Follow our social media
      </label>
      <FlexRowStartBtw className="w-auto gap-[20px] mt-[10px]">
        {socialLinks.map((link) => (
          <RenderSocialLinks
            url={link.url!}
            name={link.name as any}
            key={link.name}
          />
        ))}
      </FlexRowStartBtw>
    </FlexColStart>
  );
}
