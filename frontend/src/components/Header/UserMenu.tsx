import {
   Box,
   Menu,
   MenuButton,
   MenuDivider,
   MenuItem,
   MenuList,
   Text,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Power, Settings } from 'react-feather';

import Avatar from '@/components/common/Avatar';

const UserMenu = (): React.ReactElement => {
   const router = useRouter();
   const { data: session } = useSession();

   return (
      <Menu>
         <MenuButton>
            <Avatar
               showBorder
               src={session?.user?.profile?.picture}
               name={`${session?.user?.firstName || ''} ${session?.user?.lastName || ''
                  }`}
            />
         </MenuButton>

         <MenuList>
            <Box p=".5rem">
               <Text fontWeight="500">{session?.user?.email || ''}</Text>
               <Text fontSize=".75rem" lineHeight="1rem" mt=".125rem">
                  Admin
               </Text>
            </Box>

            <MenuDivider />

            <MenuItem
               icon={<Settings />}
               onClick={() => router.push('/profile')}
            >
               Settings
            </MenuItem>

            <MenuItem icon={<Power />} onClick={() => signOut()}>
               Log out
            </MenuItem>
         </MenuList>
      </Menu>
   );
};

export default UserMenu;
