import { Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";

import Table from "@/components/common/Table";

interface TableWithPaginationProps {
  data: any[];
  columns: any;
  columnHeaderClick?: any;
  pagesNum: number;
  count: number;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  error: boolean;
  hidePagesButtons?: boolean;
}

const TableWithPagination = ({
  data,
  columns,
  columnHeaderClick,
  pagesNum,
  count,
  pageIndex,
  setPageIndex,
  error,
  hidePagesButtons = false,
}: TableWithPaginationProps): React.ReactElement => {
  return (
    <>
      <Table
        columns={columns || []}
        data={data || []}
        pageSize={15}
        canFilter={false}
        onHeaderClick={columnHeaderClick}
        hidePagesNum
        searchBar={false}
      />

      {!error && !data && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}

      {error && (
        <Flex justifyContent="center">
          <Text color="red.500" fontWeight="bold">
            Server error
          </Text>
        </Flex>
      )}

      {data?.length === 0 && !error && (
        <Flex justifyContent="center">
          <Text color="GrayText" fontWeight="bold">
            No data
          </Text>
        </Flex>
      )}

      {count > 0 && !error && !hidePagesButtons && (
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <IconButton
              isDisabled={pageIndex == 0}
              onClick={() => setPageIndex(0)}
              size="sm"
              mr={1}
              aria-label="ChevronsLeft"
              icon={<ChevronsLeft />}
            />
            <IconButton
              isDisabled={pageIndex == 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              size="sm"
              aria-label="ChevronLeft"
              icon={<ChevronLeft />}
            />
          </Flex>
          <Text color="GrayText" fontWeight="bold">
            {t("pageNr", { pageNr: pageIndex + 1, pagesNum: pagesNum })}
          </Text>
          <Flex>
            <IconButton
              isDisabled={pageIndex == pagesNum - 1}
              onClick={() => setPageIndex(pageIndex + 1)}
              size="sm"
              mr={1}
              aria-label="ChevronRight"
              icon={<ChevronRight />}
            />
            <IconButton
              isDisabled={pageIndex == pagesNum - 1}
              onClick={() => setPageIndex(pagesNum - 1)}
              size="sm"
              aria-label="ChevronsRight"
              icon={<ChevronsRight />}
            />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default TableWithPagination;
