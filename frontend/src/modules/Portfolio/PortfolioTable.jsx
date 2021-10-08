import React from "react";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import Hidden from "@material-ui/core/Hidden";

import TablePaginationActions from "../Table/TablePaginationActions";
import TableToolbar from "./TableToolbar";

import { useSticky } from "react-table-sticky";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useBlockLayout,
  useRowSelect,
} from "react-table";

const hiddenColumns = [
  "volume",
  "changeWarrant",
  "changesPercentageWarrant",
  "volumeWarrant",
  "avgVolumeWarrant",
  "unitSymbol",
  "priceUnit",
  "changeUnit",
  "changesPercentageUnit",
  "volumeUnit",
  "avgVolumeUnit",
  "rightsSymbol",
  "priceRights",
  "changeRights",
  "changesPercentageRights",
  "volumeRights",
  "avgVolumeRights",
];

const handleOnClick = () => {};

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          onClick={handleOnClick}
          ref={resolvedRef}
          {...rest}
        />
      </>
    );
  }
);

const defaultPropGetter = () => ({});

const PortfolioTable = ({
  columns,
  data,
  setData,
  getHeaderProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    page,
    state: { pageIndex, pageSize, globalFilter, selectedRowIds },
    gotoPage,
    setPageSize,
    allColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    setAllFilters,
    setHiddenColumns,
    getToggleHideAllColumnsProps,
    rows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 25,
        hiddenColumns: hiddenColumns,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useBlockLayout,
    useSticky,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
          sticky: "left",
          width: "50",
          category: "",
        },
        ...columns,
      ]);
    }
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  const removeByIndexs = (array, indexs) =>
    array.filter((_, i) => !indexs.includes(i));

  const deleteCompanyHandler = (event) => {
    const newData = removeByIndexs(
      data,
      Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
    );
    setData(newData);
  };

  const addCompanyHandler = (company) => {
    const newData = data.concat([company]);
    setData(newData);
  };

  return (
    <React.Fragment>
      <TableToolbar
        columns={columns}
        getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
        allColumns={allColumns}
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter === undefined ? "" : globalFilter}
        selectedFlatRows={selectedFlatRows}
        selectedRowIds={selectedRowIds}
        setFilter={setFilter}
        deleteCompanyHandler={deleteCompanyHandler}
        addCompanyHandler={addCompanyHandler}
        setAllFilters={setAllFilters}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />

      {data ? (
        <>
          <TableContainer>
            <MaUTable {...getTableProps()} size="small">
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        width={column.width}
                        {...column.getHeaderProps([
                          column.getSortByToggleProps(),
                          getHeaderProps(column),
                        ])}
                      >
                        {column.isSorted ? (
                          <TableSortLabel
                            style={{ float: "left" }}
                            active={column.isSorted}
                            direction={column.isSortedDesc ? "desc" : "asc"}
                          />
                        ) : null}
                        {column.render("Header")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <TableCell
                            {...cell.getCellProps([
                              {
                                className: cell.column.className,
                              },
                              getCellProps(cell),
                            ])}
                          >
                            {cell.render("Cell")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </MaUTable>
          </TableContainer>
          <MaUTable>
            <TableFooter>
              <TableRow>
                <Hidden only={["xl", "lg", "md"]}>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    colSpan={12}
                    count={rows.length}
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    style={{ borderBottom: "none" }}
                  />
                </Hidden>
                <Hidden smDown>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, { label: "All", value: -1 }]}
                    colSpan={12}
                    count={rows.length}
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    style={{ borderBottom: "none" }}
                  />
                </Hidden>
              </TableRow>
            </TableFooter>
          </MaUTable>
        </>
      ) : (
        <p>Portfolio Empty</p>
      )}
    </React.Fragment>
  );
};

export default PortfolioTable;
