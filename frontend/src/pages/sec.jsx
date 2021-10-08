import React, { useState } from "react";
import SECTable from "../modules/SECFilings/SECTable";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import SECToolbar from "../modules/SECFilings/Toolbar";
import { Link } from "react-router-dom";
import { Label, Table } from "semantic-ui-react";
import LaunchIcon from "@material-ui/icons/Launch";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import PlaceholderTemplate from "../components/PlaceholderTemplate";

import { SecFilingsURL } from "../services/Api/index";
import useAxios from "../services/Api/useAxios";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 50,
    marginBottom: 50,
    [theme.breakpoints.up("md")]: {
      width: "85%",
    },
  },
}));

const Screener = () => {
  const classes = useStyles();

  const [apiUrl, setApiUrl] = useState(SecFilingsURL);
  const [filings, loading, hasError] = useAxios({
    method: "get",
    url: apiUrl,
  });

  const handleSubmit = (event) => {
    let query = "";
    let limit = "";

    if (event.checkedAll === false) {
      let fileTypes = "";
      for (let key in event.checked) {
        if (event.checked[key]) {
          fileTypes += key + ",";
        }
      }

      if (fileTypes) {
        query = "&type=" + fileTypes.slice(0, -1);
      }
    }

    limit = event.limit ? event.limit : "50";
    setApiUrl(SecFilingsURL + "?limit=" + limit + query);
  };

  const SecContent = () => {
    if (hasError) {
      return <EmptyPlaceholder description="Uh oh! Something went wrong." />;
    } else {
      return (
        <SECTable
          columns={columns}
          data={filings.results}
          getHeaderProps={(column) => ({
            style: {
              fontWeight: "bolder",
              fontSize: "16px",
              minWidth: "150px",
            },
          })}
        />
      );
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Company",
        accessor: (item) => {
          return (
            <React.Fragment>
              <Link
                to={{
                  pathname: `/profile/${item.company.common_ticker_symbol}`,
                }}
              >
                <Label size="mini" color="blue">
                  {item.company.common_ticker_symbol}
                </Label>
                <span style={{ margin: 5, color: "black" }}>
                  {item.company.name}
                </span>
              </Link>
            </React.Fragment>
          );
        },
      },

      {
        Header: "Form",
        accessor: (form) => {
          return (
            <a href={form.link} target="_blank" rel="noreferrer">
              {form.title}{" "}
              <LaunchIcon
                fontSize="small"
                style={{ verticalAlign: "bottom" }}
              />
            </a>
          );
        },
      },

      {
        Header: "Date Filed",
        accessor: "updated",
      },
    ],
    []
  );

  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  return (
    <React.Fragment>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <SECToolbar onSubmit={handleSubmit} />
          {!loading ? (
            <SecContent />
          ) : (
            <Table basic="very">
              <Table.Body>
                {[...range(1, 10)].map((index) => (
                  <Table.Row key={index}>
                    <td>
                      <PlaceholderTemplate />
                    </td>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </CardContent>
      </Card>
      <div style={{ padding: "1em" }}></div>
    </React.Fragment>
  );
};

export default Screener;
