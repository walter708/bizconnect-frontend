import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadCrumbProps {
  items: {
    label: string;
    href: string;
    isActive?: boolean;
  }[];
  labelClassName?: React.ComponentProps<"div">["className"];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items, labelClassName }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={item.href}
                className={cn(
                  item.isActive
                    ? "font-normal text-blue-200 font-semibold"
                    : "text-muted-foreground text-blue-200/50",
                  labelClassName
                )}
              >
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
