import React, { useState } from "react";
import { Heading, Button, VStack } from "@chakra-ui/react";
import Layout from "../components/Layout";
import Table from "@/components/common/Table";

const ProjectsPage = () => {
  const [mockData, setMockData] = useState([
    { id: 1, name: "Project A", description: "Sample project", creation_date: "2023-01-01", acceptation_date: "2023-01-15" },
  ]);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { Header: "Creation date", accessor: "creation_date" },
    { Header: "Acceptation date", accessor: "acceptation_date" },
    {
      Header: "Edition",
      accessor: "edition",
      Cell: ({ row }) => (
        <VStack>
          <Button>Edit</Button>
          <Button onClick={() => deleteRow(row.original.id)}>Delete</Button>
        </VStack>
      ),
    },
  ];

  const deleteRow = (id) => {
    setMockData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const addRow = () => {
    const newRow = { id: mockData.length + 1, name: "New Project", description: "New project description", creation_date: "2024-03-24", acceptation_date: "2024-03-25" };
    setMockData((prevData) => [...prevData, newRow]);
  };

  return (
    <Layout>
      <Heading marginBottom="30px">Projects</Heading>
      <Button marginBottom="10px" onClick={() => addRow()}>Add</Button> {}
      <Table columns={columns} data={mockData} searchBar={false} pagination={false} />
    </Layout>
  );
};

ProjectsPage.auth = true;

export default ProjectsPage;
