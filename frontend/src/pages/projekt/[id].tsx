import Kanban from "@/components/Projects/Kanban";
import TasksList from "@/components/Projects/TasksList";
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const ProjectPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <Heading marginBottom="30px">Project details</Heading>
      <Tabs isLazy>
        <TabList>
          <Tab>Kanban</Tab>
          <Tab>List</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Kanban projectId={id ? +id : 0} />
          </TabPanel>
          <TabPanel>
            <TasksList projectId={id ? +id : 0} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

ProjectPage.auth = true;
ProjectPage.roles = ["NAUCZYCIEL", "STUDENT"];

export default ProjectPage;
