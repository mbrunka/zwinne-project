import Kanban from "@/components/Projects/Kanban";
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const ProjectPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <Heading marginBottom="30px">Projekt details</Heading>
      <Tabs isLazy>
        <TabList>
          <Tab>Kanban</Tab>
          {/* <Tab>List</Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Kanban projectId={id ? +id : 0} />
          </TabPanel>
          {/* <TabPanel>
            <Students/>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

ProjectPage.auth = true;
ProjectPage.roles = ["NAUCZYCIEL", "STUDENT"];

export default ProjectPage;
