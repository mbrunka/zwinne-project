import CustomAlertDialog from "@/components/common/AlertDialog";
import Table from "@/components/common/Table";
import { useToastPromise } from "@/hooks/useToast";
import {
  Button,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import Teachers from "@/components/Users/Teachers";
import Students from "@/components/Users/Students";

const UsersPage = () => {
  return (
    <Layout>
      <Heading marginBottom="30px">Users</Heading>
      <Tabs isLazy>
        <TabList>
          <Tab>Teachers</Tab>
          <Tab>Students</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Teachers/>
          </TabPanel>
          <TabPanel>
            <Students/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

UsersPage.auth = true;
UsersPage.roles = ["NAUCZYCIEL"];

export default UsersPage;
