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

import TablePaginationActions from "./TablePaginationActions";
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
import { useExportData } from "react-table-plugins";
import Papa from "papaparse";
import Hidden from "@material-ui/core/Hidden";

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

function extractData(data) {
  let newData = [];

  for (const dataPoint of data) {
    let row = [];
    let arrayLength = dataPoint.length;
    for (var i = 0; i < arrayLength; i++) {
      if (!dataPoint[i]) {
        continue;
      }
      if (!dataPoint[i].props) {
        row.push(dataPoint[i]);
      } else if (dataPoint[i].props.children.props) {
        if (Array.isArray(dataPoint[i].props.children.props.children)) {
          let arrayData = dataPoint[i].props.children.props.children.map(
            (x) => {
              return x.props.children;
            }
          );
          row.push(arrayData.join());
        } else {
          row.push(dataPoint[i].props.children.props.children);
        }
      } else {
        if (Array.isArray(dataPoint[i].props.children)) {
          let arrayData = dataPoint[i].props.children.map((x) => {
            return x.props.children;
          });
          row.push(arrayData.join());
        } else {
          row.push(dataPoint[i].props.children);
        }
      }
    }

    newData.push(row);
  }

  return newData;
}

function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === "csv") {
    data = extractData(data);
    const headerNames = columns.map((col) => col.heading);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  }

  // Other formats goes here
  return false;
}

const defaultPropGetter = () => ({});

const TableScreener = ({
  columns,
  data,
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
    exportData,
    rows,
  } = useTable(
    {
      columns,
      data,
      getExportFileBlob,
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
    useExportData,
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
        exportData={exportData}
        setAllFilters={setAllFilters}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
      <TableContainer>
        <MaUTable {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key="header">
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
                rowsPerPageOptions={[25, 50, 100]}
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
    </React.Fragment>
  );
};

export default TableScreener;
