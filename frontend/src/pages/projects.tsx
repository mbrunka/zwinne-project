import { Heading } from "@chakra-ui/react";
import Layout from "../components/Layout";
import Table from "@/components/common/Table";

const mockData = [
  { id: 1, name: "project1" },
  { id: 2, name: "project2" },
  { id: 3, name: "project3" },
];

const ProjectsPage = () => {
  const columns = [
      { Header: "ID", accessor: "id" },
      {
        Header: "Name",
        accessor: "name",
      },
    ];
  return (
    <Layout>
      <Heading marginBottom="30px">Projects</Heading>
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
