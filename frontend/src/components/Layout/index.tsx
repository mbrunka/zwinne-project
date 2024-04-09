import { getCurrentRole } from "@/utils/cookies";
import { Box } from "@chakra-ui/react";
import React from "react";
import { Home, Layers, Users } from "react-feather";
import Header from "../Header";
import NavItem from "../common/NavItem";

type LayoutProps = {
  hideSideBar?: boolean;
  children: React.ReactNode;
};

const Layout = ({ hideSideBar = false, children }: LayoutProps) => {
  const role = getCurrentRole();
  return (
    <Box bg="background.light">
      <Header />

      {!hideSideBar && (
        <Box
          display="flex"
          flexDir="column"
          as="aside"
          bg="background.light"
          w="18rem"
          position="fixed"
          pt="6rem"
          top={0}
          left={0}
        >
          <NavItem label="Dashboard" href="/" ico={Home} />

          <NavItem label="Projects" href="/projects" ico={Layers} />
          {role == "NAUCZYCIEL" && (
            <NavItem
              label="Teachers verification"
              href="/teachers-verification"
              ico={Users}
            />
          )}
          {/* <NavItem
               label={t('navigation.subitems')}
               href="/products"
               ico={ShoppingBag}
               subNavItems={[
                  {
                     ico: Layers,
                     label: t('navigation.sth'),
                     href: '/products',
                  },
                  {
                     ico: Sun,
                     label: t('navigation.sth'),
                     href: '/products/success',
                  },
                  {
                     ico: Clock,
                     label: t('navigation.sth'),
                     href: '/products/waiting',
                  },
               ]}
            /> */}
        </Box>
      )}

      <Box
        bg="white"
        ml={!hideSideBar ? "18rem" : 0}
        minHeight="calc(100vh - 5rem)"
        p="2rem"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
