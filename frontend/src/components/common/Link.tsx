import React from "react";
import NextLink from "next/link";
import { Link, LinkProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // allow both static and dynamic routes
  to: string | { href: string; as: string };
  prefetch?: boolean;
  children: ReactNode;
  as?: string;
}

const CustomLink = (
  { to, prefetch, children, ...props }: IProps & LinkProps,
  ref: any
) => {
  // when we just have a normal url we just use it
  if (typeof to === "string") {
    return (
      <NextLink passHref href={to} prefetch={prefetch || false} {...props}>
          {children}
      </NextLink>
    );
  }

  // otherwise pass both "href" / "as"
  return (
    <NextLink passHref href={to.href} as={to.as} prefetch={prefetch || false} {...props}>
        {children}
    </NextLink>
  );
};

export default React.forwardRef(CustomLink);
