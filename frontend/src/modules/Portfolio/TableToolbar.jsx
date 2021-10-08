import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";

import FilterDialog from "../Table/FilterDialog";
import { Button } from "semantic-ui-react";

import { RemovePortfolioURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import authHeader from "../../services/Api/authHeader";
import AddCompany from "./AddCompany";

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
    deleteCompanyHandler,
    addCompanyHandler,
    setAllFilters,
    hiddenColumns,
    setHiddenColumns,
  } = props;

  const [isChecked, setIsChecked] = useState(false);
  const [companyNames, setCompanyNames] = useState();
  const [isVisible, setIsVisible] = useState(allColumns[0].isVisible);
  const [initialState, setInitialState] = useState(true);
  const [buttonState, setButtonState] = useState({
    name: "Edit Portfolio",
  });
  
  useAxios({
    method: "post",
    url: RemovePortfolioURL,
    headers: authHeader(),
    body: companyNames,
  });

  const EDIT = 0;
  const HIDE = 1;
  const REMOVE = 2;

  const getNewButtonState = () => {
    let state = {
      name: "",
      color: null,
      value: 0,
    };
    // selection visible, nothing checked
    if (!isChecked && isVisible) {
      state.name = "Hide Edit";
      state.value = HIDE;
    }
    // selection visible, something checked
    else if (isChecked) {
      state.name = "Remove from Portfolio";
      state.color = "red";
      state.value = REMOVE;
    }

    // selection hidden
    else if (!isVisible) {
      state.name = "Edit Portfolio";
      state.value = EDIT;
    }

    return state;
  };

  useEffect(() => {
    let checked = !(
      Object.keys(selectedRowIds).length === 0 &&
      selectedRowIds.constructor === Object
    );
    setIsChecked(checked);
  }, [selectedRowIds]);

  useEffect(() => {
    if (!initialState) {
      setButtonState(getNewButtonState());
    } else setInitialState(false);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isChecked, isVisible]);

  const handlePortfolioClick = () => {
    if (buttonState.value === REMOVE) {
      setCompanyNames({
        companies: selectedFlatRows.map((d) => d.original.name),
      });
    }

    let selectionColumn = allColumns[0];

    if (!isChecked) {
      selectionColumn.toggleHidden();
      setIsVisible(!selectionColumn.isVisible);
    }

    if (buttonState.value === REMOVE) {
      deleteCompanyHandler();
    }
  };

  return (
    <Toolbar>
      <AddCompany
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        addCompanyHandler={addCompanyHandler}
      />
      <Button
        basic
        onClick={handlePortfolioClick}
        style={{ marginLeft: "auto", minHeight: "1em" }}
        color={buttonState.color}
        size="mini"
      >
        {buttonState.name}
      </Button>
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
  );
};

TableToolbar.propTypes = {
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;
