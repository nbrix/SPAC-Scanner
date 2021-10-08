/* eslint-disable no-use-before-define */

import React, { useState } from "react";

import { fade, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Table } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createFilterOptions, FilterOptionsState } from "@material-ui/lab";
import InputAdornment from "@material-ui/core/InputAdornment";

import { AllCompaniesURL, AddPortfolioURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import authHeader from "../../services/Api/authHeader";
import Snackbar from "../../components/Snackbar";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "300px",
    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 3),
    transition: theme.transitions.create("width"),
    width: "100%",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
}));

const resultRenderer = (company) => (
  <Table basic="very">
    <Table.Row>
      <Table.Cell textAlign="left">{company.name}</Table.Cell>
      <Table.Cell style={{ fontWeight: "bold" }} textAlign="right">
        {company.common_ticker_symbol}
      </Table.Cell>
    </Table.Row>
  </Table>
);

const AddCompany = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  addCompanyHandler,
}) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [clear, setClear] = React.useState(false);
  const loading = open && options.length === 0;
  const [companyName, setCompanyNames] = useState();
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });

  const [response, , hasError] = useAxios({
    method: "post",
    url: AddPortfolioURL,
    headers: authHeader(),
    body: companyName,
  });

  const MessageSuccess = () => {
    return (
      <Snackbar
        message={message.message}
        type={message.type}
        onClose={setIsMessage}
      />
    );
  };

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
    setIsMessage(false);
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (response) {
      setIsMessage(true);
      if (response.error === "max size") {
        setMessage({
          message: "Portfolio exceeds maximum of 50.",
          type: "warning",
        });
      } else if (response.length > 0) {
        addCompanyHandler(response[0]);
        setMessage({
          message: companyName.companies + " added.",
          type: "success",
        });
      } else {
        if (hasError) {
          setMessage({
            message: "Something went wrong.",
            type: "error",
          });
        } else {
          setMessage({
            message: companyName.companies + " is already in portfolio.",
            type: "warning",
          });
        }
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [response]);

  const onChange = (e, value) => {
    setIsMessage(false);
    if (value) {
      setCompanyNames({ companies: [value.name] });
      setInputValue("");
      setOpen(false);
      setClear(true);
    }
  };

  React.useEffect(() => {
    if (!inputValue) {
      setOptions([]);
    }
  }, [inputValue]);

  const handleInputChange = (event, newInputValue) => {
    let inputDifference = newInputValue.length <= inputValue.length + 1;
    if (!clear && inputDifference) {
      setInputValue(newInputValue);
      if (newInputValue.length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setClear(false);
    }
  };

  return (
    <React.Fragment>
      <div className={classes.search}>
        <Autocomplete
          id="spac-search"
          className={classes.textField}
          size="small"
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
                    <AddIcon />
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
        {isMessage ? <MessageSuccess /> : null}
      </div>
    </React.Fragment>
  );
};

export default AddCompany;
