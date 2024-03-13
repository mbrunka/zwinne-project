import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";

const mockData = [
    {id:1, name:"project1"},
    {id:2, name:"project2"},
    {id:3, name:"project3"},
]

const ProjectsPage = () => {
  return (
    <Layout>
      <Heading>Projects</Heading>
      <Table
        columns={columns}
        data={mockData}
        searchBar={false}
        pagination={false}
      />
    </Layout>
  );
};

ProjectsPage.auth = false;

export default ProjectsPage;
