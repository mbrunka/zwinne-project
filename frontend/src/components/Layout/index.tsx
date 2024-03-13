import { Box } from '@chakra-ui/react';
import React from 'react';
import { Coffee, Home, Star } from 'react-feather';
import Header from '../Header';
import NavItem from '../common/NavItem';

type LayoutProps = {
   children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {

   return (
      <Box bg="background.light">
         <Header />

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

            <NavItem
               label="label1"
               href="/page1"
               ico={Coffee}
            />
            <NavItem
               label="label2"
               href="/page2"
               ico={Star}
            />
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

         <Box
            bg="white"
            ml="18rem"
            minHeight="calc(100vh - 5rem)"
            p="2rem"
         >
            {children}
         </Box>
      </Box>
   );
};

export default Layout;
