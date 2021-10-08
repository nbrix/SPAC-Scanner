import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import GlobalFilter from "./GlobalFilter";
import FilterDialog from "./FilterDialog";
import { Button, Icon } from "semantic-ui-react";

import { AddPortfolioURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import authHeader from "../../services/Api/authHeader";
import Snackbar from "../../components/Snackbar";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";

import { useSelector } from "react-redux";

const TableToolbar = (props) => {
  const {
    columns,
    getToggleHideAllColumnsProps,
    allColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter = "",
    selectedFlatRows,
    selectedRowIds,
    setFilter,
    exportData,
    setAllFilters,
    hiddenColumns,
    setHiddenColumns,
  } = props;

  const [isChecked, setIsChecked] = useState(false);
  const [companyNames, setCompanyNames] = useState();
  const [response, , hasError] = useAxios({
    method: "post",
    url: AddPortfolioURL,
    headers: authHeader(),
    body: companyNames,
  });
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });
  const isMember = useSelector((state) => state.auth.member);

  const MessageSuccess = () => {
    return (
      <Snackbar
        message={message.message}
        type={message.type}
        onClose={setIsMessage}
      />
    );
  };

  useEffect(() => {
    setIsChecked(
      Object.keys(selectedRowIds).length === 0 &&
        selectedRowIds.constructor === Object
    );
  }, [selectedRowIds]);

  useEffect(() => {
    if (response) {
      setIsMessage(true);
      if (response.error === "max size") {
        setMessage({
          message: "Portfolio exceeds maximum of 50.",
          type: "warning",
        });
      } else if (response.length > 5) {
        setMessage({
          message: "Companies added.",
          type: "success",
        });
      } else if (response.length > 0) {
        setMessage({
          message: companyNames.companies + " added.",
          type: "success",
        });
      } else {
        if (hasError) {
          setMessage({
            message: "Something went wrong.",
            type: "error",
          });
        } else if (companyNames.companies.length > 5) {
          setMessage({
            message: "Companies are already in portfolio.",
            type: "warning",
          });
        } else {
          setMessage({
            message: companyNames.companies + " is already in portfolio.",
            type: "warning",
          });
        }
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [response]);

  const handlePortfolioClick = () => {
    setCompanyNames({
      companies: selectedFlatRows.map((d) => d.original.name),
    });
  };

  return (
    <React.Fragment>
      {isMessage ? <MessageSuccess /> : null}

      <Toolbar>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Button
          basic
          disabled={isChecked}
          onClick={handlePortfolioClick}
          style={{ marginLeft: "auto" }}
        >
          Add to Portfolio
        </Button>
        <Tooltip title={isMember ? "" : "Sign up for Pro to download"}>
          <span>
            <Button
              onClick={() => {
                exportData("csv", false);
              }}
              size="small"
              disabled={!isMember}
            >
              <Icon name="download" style={{ paddingLeft: 5 }} />
              <Hidden smDown> Download</Hidden>
            </Button>
          </span>
        </Tooltip>
        <FilterDialog
          columns={columns}
          getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
          allColumns={allColumns}
          setFilter={setFilter}
          setAllFilters={setAllFilters}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </Toolbar>
    </React.Fragment>
  );
};

TableToolbar.propTypes = {
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;
