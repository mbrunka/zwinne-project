import {
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Power, Settings } from "react-feather";

import Avatar from "@/components/common/Avatar";
import { signOut } from "@/utils/signOut";
import { getCurrentRole } from "@/utils/cookies";

const UserMenu = (): React.ReactElement => {
  const router = useRouter();
  const role = getCurrentRole();

  return (
    <Menu>
      <MenuButton>
        <Avatar
          showBorder
        />
      </MenuButton>

      <MenuList>
        <Box p=".5rem">
          <Text fontSize=".75rem" lineHeight="1rem" mt=".125rem">
            {role}
          </Text>
        </Box>

        <MenuDivider />

        <MenuItem icon={<Settings />} onClick={() => router.push("/settings")}>
          Settings
        </MenuItem>

        <MenuItem
          icon={<Power />}
          onClick={async () => {
            signOut();
            router.push("/signin");
          }}
        >
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
