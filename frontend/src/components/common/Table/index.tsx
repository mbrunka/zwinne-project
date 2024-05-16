import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Card from "../Card";
import BottomSection from "../Card/CardFooter";
import TopSection from "../Card/CardHeader";
import { GlobalFilter, fuzzyTextFilterFn } from "./filter";
import { TableVirtuoso } from "react-virtuoso";
import {
  StyledTable,
  TableCell,
  TableHead,
  TableIconButton,
  TableRow,
} from "./styles";

type TableProps<D extends object = {}> = {
  data: any;
  pageSize?: number;
  tableHeading?: React.ReactNode;
  columns: Column<D>[];
  onRowClick?: (row: Row<D>) => void;
  getRowId?: (row: Row<D>) => any;
  canFilter?: boolean;
  searchBar?: boolean;
  pagination?: boolean;
  pageCount?: number;
  count?: number;
  isLoading?: boolean;
  moreButton?: JSX.Element;
  variant?: "pagination" | "infinite";
  fetchData?: (params) => void;
  hidePagesNum?: boolean;
  onHeaderClick?: Function;
};

const Table = <D extends {}>({
  columns,
  data,
  tableHeading,
  pageSize: initialPageSize,
  onRowClick,
  getRowId,
  canFilter,
  pageCount: controlledPageCount,
  count: controlledCount,
  searchBar = true,
  pagination = true,
  moreButton,
  fetchData,
  isLoading = false,
  variant = "pagination",
  hidePagesNum = false,
  onHeaderClick,
}: TableProps<D>): JSX.Element => {
  const [showFilters, setShowFilters] = React.useState(false);
  const tableColumns = React.useMemo(() => columns, [columns]);
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter, sortBy },
  } = useTable<D>(
    {
      data,
      columns: tableColumns,
      manualPagination: !!fetchData,
      manualGlobalFilter: !!fetchData,
      manualSortBy: !!onHeaderClick,
      autoResetPage: !fetchData,
      autoResetSortBy: false,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
      pageCount: controlledPageCount,
      filterTypes,
      globalFilter: "fuzzyText",
      getRowId,
      // defaultColumn,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const pageNr = pageIndex + 1;
  const pagesNr = pageOptions.length;

  React.useEffect(() => {
    fetchData && fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  React.useEffect(() => {
    fetchData && fetchData({ search: globalFilter, sortBy });
    gotoPage(0);
  }, [fetchData, globalFilter, gotoPage, sortBy]);

  return (
    <Card
      flexDirection="column"
      flex={{ base: "none", md: 1 }}
      width={{ base: "100%", md: "auto" }}
    >
      {canFilter && (
        <>
          <Button
            size="sm"
            variant="unstyled"
            borderRadius="0"
            outline="none"
            boxShadow="none"
            textAlign="left"
            width="100px"
            mb={5}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
            <Icon as={showFilters ? ChevronUp : ChevronDown} size={20} ml={2} />
          </Button>
          {showFilters && (
            <Grid templateColumns="repeat(4, 1fr)" mb={5} gap={5}>
              {headerGroups.map((headerGroup) => (
                <Box
                  key={headerGroup.id}
                  display="table-row"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <>
                      {!!onHeaderClick ? (
                        <TableCell
                          px={4}
                          py={3}
                          key={column.id}
                          {...column.getHeaderProps()}
                          justifyContent="space-between"
                          // {...column.getSortByToggleProps()}
                          onClick={() => {onHeaderClick(column)}}
                        >
                          <Flex align="center" justify="space-between" w="100%">
                            <Text fontWeight="bold">
                              {column.render("Header")}
                            </Text>
                            {column.sortDirection === "desc" ||
                            column.sortDirection === "asc" ? (
                              column.sortDirection === "desc" ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronUp size={20} />
                              )
                            ) : (
                              <ChevronUp size={20} opacity={0.2} />
                            )}
                          </Flex>
                        </TableCell>
                      ) : (
                        <TableCell
                          px={4}
                          py={3}
                          key={column.id}
                          {...column.getHeaderProps()}
                          justifyContent="space-between"
                          {...column.getSortByToggleProps({ title: undefined })}
                        >
                          <Flex align="center" justify="space-between" w="100%">
                            <Text fontWeight="bold">
                              {column.render("Header")}
                            </Text>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronUp size={20} />
                              )
                            ) : (
                              <ChevronUp size={20} opacity={0.1} />
                            )}
                          </Flex>
                        </TableCell>
                      )}
                    </>
                  ))}
                </Box>
              ))}
            </Grid>
          )}
        </>
      )}
      {!!tableHeading && <TopSection>{tableHeading}</TopSection>}
      {searchBar && (
        <Flex
          backgroundColor="white"
          flex={1}
          px={4}
          py={3}
          justifyContent="space-between"
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Flex>
      )}
      <Box maxWidth="100%" width="100%" overflowX="auto">
        {variant === "infinite" && (
          <TableVirtuoso
            key={fetchData && globalFilter}
            useWindowScroll
            totalCount={rows.length}
            components={{
              Table: ({ style, ...props }) => (
                <StyledTable
                  {...getTableProps()}
                  {...props}
                  style={{
                    ...style,
                    width: 800,
                    tableLayout: pagination ? "fixed" : "auto",
                  }}
                />
              ),
              // eslint-disable-next-line react/display-name
              TableBody: React.forwardRef(({ style, ...props }, ref) => (
                <Box
                  display="table-row-group"
                  {...getTableBodyProps()}
                  {...props}
                  ref={ref}
                />
              )),
              TableRow: (props) => {
                const index = props["data-index"];
                const row = rows[index];

                return (
                  <TableRow
                    onClick={() => onRowClick && onRowClick(row)}
                    key={row.id}
                    display="table-row"
                    {...props}
                    {...row.getRowProps()}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#edf2f7" : "#fff",
                    }}
                    data-testid="table-row"
                  />
                );
              },
            }}
            fixedHeaderContent={() => {
              return headerGroups.map((headerGroup) => (
                <Box
                  key={headerGroup.id}
                  display="table-row"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      px={4}
                      py={3}
                      key={column.id}
                      width={column.width || "unset"}
                      {...column.getHeaderProps()}
                      justifyContent="space-between"
                      {...column.getSortByToggleProps({ title: undefined })}
                    >
                      <Text textTransform="uppercase" fontWeight="500">
                        {column.render("Header")}
                      </Text>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDown size={15} />
                        ) : (
                          <ChevronUp size={15} />
                        )
                      ) : (
                        ""
                      )}
                    </TableCell>
                  ))}
                </Box>
              ));
            }}
            itemContent={(index) => {
              const row = rows[index];
              prepareRow(row);

              return row.cells.map((cell) => {
                return (
                  <TableCell
                    key={cell.row.index}
                    justifyContent="flex-start"
                    px={4}
                    py={3}
                    minWidth={cell.column.minWidth}
                    maxWidth={cell.column.maxWidth}
                    {...cell.getCellProps()}
                  >
                    
                    {cell.render("Cell")}
                  </TableCell>
                );
              });
            }}
            endReached={nextPage}
          />
        )}
        {variant == "pagination" && (
          <StyledTable {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <Box
                  key={headerGroup.id}
                  display="table-row"
                  {...headerGroup.getHeaderGroupProps()}
                  bg="gray.700"
                >
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      px="15px"
                      py="10px"
                      key={column.id}
                      maxWidth={column.maxWidth}
                      {...column.getHeaderProps()}
                      justifyContent="space-between"
                      {...column.getSortByToggleProps({ title: undefined })}
                      // {...column.getSortByToggleProps()}
                      onClick={() => {onHeaderClick(column)}}
                    >
                      <Flex justify="space-between">
                        <Text fontWeight="600" color="white">
                          {column.render("Header")}
                        </Text>
                        <Box w="15px" h="15px">
                          {column.sortDirection &&
                            (column.sortDirection=="desc" ? (
                              <ChevronDown size={15} />
                            ) : (
                              <ChevronUp size={15} />
                            ))}
                        </Box>
                      </Flex>
                    </TableCell>
                  ))}
                </Box>
              ))}
            </TableHead>
            <Box display="table-row-group">
              {page.map(
                (row) =>
                  // @ts-ignore
                  prepareRow(row) || (
                    <TableRow
                      onClick={() => onRowClick && onRowClick(row)}
                      key={row.id}
                      display="table-row"
                      {...row.getRowProps()}
                      data-testid="table-row"
                    >
                      {row.cells.map((cell) => {
                        return (
                          <TableCell
                            key={cell.row.index}
                            justifyContent="flex-start"
                            px="15px"
                            py="10px"
                            maxWidth={cell.column.maxWidth}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
              )}
            </Box>
          </StyledTable>
        )}
        {isLoading && (
          <Center mt={2}>
            <Spinner />
          </Center>
        )}
      </Box>
      <BottomSection justifyContent="flex-end" flexDirection="row">
        {!pagination && moreButton}
        {pagination && variant === "pagination" && !hidePagesNum && (
          <>
            <Flex flexDirection="row">
              <TableIconButton
                mx="2px"
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ChevronsLeft size={17} />}
              />
              <TableIconButton
                mx="2px"
                isDisabled={!canPreviousPage}
                onClick={() => previousPage()}
                icon={<ChevronLeft size={17} />}
              />
            </Flex>
            <Flex justifyContent="center" alignItems="center">
              <Text
                mx="7px"
                color="gray.500"
                fontSize="13px"
                textAlign="center"
                lineHeight="1.2"
              >
                Stron{" "}
                <strong>
                  {pageNr} z {pagesNr}
                </strong>
              </Text>
            </Flex>
            <Flex flexDirection="row">
              <TableIconButton
                mx="2px"
                isDisabled={!canNextPage}
                onClick={() => nextPage()}
                icon={<ChevronRight size={17} />}
              />
              <TableIconButton
                mx="2px"
                onClick={() => gotoPage(pageCount ? pageCount - 1 : 1)}
                isDisabled={!canNextPage}
                icon={<ChevronsRight size={17} />}
              />
            </Flex>
          </>
        )}
      </BottomSection>
    </Card>
  );
};

export default React.memo(Table);

Table.defaultProps = {
  pageSize: 30,
};
