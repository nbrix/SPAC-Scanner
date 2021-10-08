/* eslint-disable no-use-before-define */
import React from "react";
import { Table } from "semantic-ui-react";

import { useHistory } from "react-router-dom";
import { AllCompaniesURL } from "../services/Api/index";
import fetch from "cross-fetch";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createFilterOptions, FilterOptionsState } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

const resultRenderer = (company) => (
  <Table basic="very">
    <Table.Row>
      <Table.Cell style={{ fontWeight: "bold" }} textAlign="left" width={4}>
        {company.common_ticker_symbol}
      </Table.Cell>
      <Table.Cell style={{ fontWeight: "lighter" }} textAlign="left">
        {company.name}
      </Table.Cell>
    </Table.Row>
  </Table>
);

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    background: "white",
  },
}));

const SearchBar = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const history = useHistory();

  const defaultFilterOptions = createFilterOptions({
    stringify: (option) => option.name + option.common_ticker_symbol,
  });
  const filterOptions = (options: options, state: FilterOptionsState) =>
    defaultFilterOptions(options, state).slice(0, 4);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(AllCompaniesURL + "?limit=1000");
      const companies = await response.json();

      if (active) {
        setOptions(Object.keys(companies).map((key) => companies[key]));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const onChange = (e, value) => {
    if (value) {
      history.push("/profile/" + value.common_ticker_symbol);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <Autocomplete
      id="spac-search"
      className={classes.textField}
      size="small"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        if (inputValue.length > 0) {
          setOpen(true);
        }
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      renderOption={(option) => resultRenderer(option)}
      filterOptions={filterOptions}
      options={options}
      loading={loading}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          className={classes.textField}
          variant="outlined"
          placeholder="Company or symbol..."
          InputProps={{
            ...params.InputProps,
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchBar;
