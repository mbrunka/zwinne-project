import { Badge, Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Icon as IconType } from "react-feather";
import Link from "../common/Link";

type NavItem = {
  ico: IconType;
  label: string;
  href?: string;
  isExternal?: true;
};
type NavItemProp = {
  ico?: IconType;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  subNavItems?: NavItem[];
  count?: number;
};

// eslint-disable-next-line react/display-name
const NavItem = React.forwardRef(
  ({ ico, href, label, onClick, subNavItems, count }: NavItemProp, ref) => {
    const router = useRouter();

    const isHighlited =
      (router?.pathname?.includes("/issue") && href === "/feedback") ||
      href == router.pathname;

    return (
      <>
        {subNavItems && subNavItems?.length > 0 ? (
          <Flex
            role="group"
            px="20px"
            py="10px"
            align="center"
            fontWeight="500"
            borderLeft="2px solid #FFFFFF"
            fontSize="14px"
            justifyContent="space-between"
          >
            <Flex>
              <Icon as={ico} w="17px" h="17px" mr="15px" color="red.700" />
              {label}
            </Flex>
            {!!count && <Badge colorScheme="red">{count}</Badge>}
          </Flex>
        ) : (
          <Link to={href}>
            <Flex
              justifyContent="space-between"
              width="100%"
              role="group"
              px="20px"
              py="10px"
              fontSize="14px"
              transition="all .25s ease-in-out"
              align="center"
              _hover={{
                borderColor: "red",
                background: "#FFEEEE",
              }}
              fontWeight="500"
              borderLeft="2px solid #FFFFFF"
              style={
                isHighlited ? { borderColor: "red", background: "#FFEEEE" } : {}
              }
            >
              <Flex>
                <Icon as={ico} w="17px" h="17px" mr="15px" color="red.700" />
                {label}
              </Flex>
              {!!count && <Badge colorScheme="red">{count}</Badge>}
            </Flex>
          </Link>
        )}
        {subNavItems?.map((subNavItem) => (
          <Link to={subNavItem?.href} key={subNavItem.href}>
            <Flex
              role="group"
              px="20px"
              py="10px"
              align="center"
              fontSize="14px"
              transition="all .25s ease-in-out"
              _hover={{
                borderColor: "red",
                background: "#FFEEEE",
              }}
              fontWeight="500"
              borderLeft="2px solid #FFFFFF"
              style={
                subNavItem?.href == router.pathname
                  ? { borderColor: "red", background: "#FFEEEE" }
                  : {}
              }
            >
              <Icon
                ml="20px"
                as={subNavItem.ico}
                w="17px"
                h="17px"
                mr="15px"
                color="red.700"
              />
              {subNavItem.label}
            </Flex>
          </Link>
        ))}
      </>
    );
  }
);

export default NavItem;
