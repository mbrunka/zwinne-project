import Table from "@/components/common/Table";
import { Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import useSWR from "swr";

const Teachers = () => {
  const { data, isValidating } = useSWR("/auth/getTeachers");

  const columns = useMemo(
    () => [
      { Header: "Email", accessor: "email" },
      { Header: "Name", accessor: "fullName" },
    ],
    []
  );

  return (
    <>
      {isValidating && !data?.users && <Spinner />}
      {data?.users?.length == 0 && <Text>No teachers</Text>}
      {data?.users?.length > 0 && (
        <Table
          columns={columns}
          data={data?.users}
          searchBar={false}
          pagination={false}
        />
      )}
    </>
  );
};

export default Teachers;
