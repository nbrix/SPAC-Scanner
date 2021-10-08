import React, { useState } from "react";
import { Label, Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { SecFilingsURL, SecFilingsTickerURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import { Pagination } from "semantic-ui-react";
import PlaceholderTemplate from "../../components/PlaceholderTemplate";
import EmptyPlaceholder from "../../components/EmptyPlaceholder";
import LaunchIcon from "@material-ui/icons/Launch";

const FilingSnapshot = (props) => {
  const { ticker = "", limit, pagination = true } = props;
  const isTicker = !(
    (Object.keys(ticker).length === 0 && ticker.constructor === Object) ||
    ticker === ""
  );

  const [activePage, setActivePage] = useState(1);

  let query = "";
  let limitParam = "";
  if (limit) {
    query = "?limit=" + limit;
    limitParam = "&limit=" + limit;
  }
  const [apiUrl, setApiUrl] = useState(
    isTicker ? SecFilingsTickerURL + ticker + limitParam : SecFilingsURL + query
  );

  const [filings, loading, hasError] = useAxios({
    method: "get",
    url: apiUrl,
  });

  const onChange = (e, pageInfo) => {
    setActivePage(pageInfo.activePage);
    setApiUrl(
      ticker
        ? SecFilingsTickerURL + ticker + "&" + offset(pageInfo) + limitParam
        : SecFilingsURL + "?" + offset(pageInfo) + limitParam
    );
  };

  const offset = (pageInfo) => {
    return "offset=" + pageInfo.activePage.toString();
  };

  const dateTimeFormat = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  };

  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  const SecContent = () => {
    if (hasError) {
      return <EmptyPlaceholder description="Uh oh! Something went wrong." />;
    } else {
      return filings.results.map((item, index) => (
        <Table.Row key={index}>
          <Table.Cell>
            <Link
              to={{
                pathname: `/profile/${item.company.common_ticker_symbol}`,
              }}
              style={{ fontSize: "1.5em" }}
            >
              {item.company.name}
              {" (" + item.company.common_ticker_symbol + ")"}
            </Link>

            <div style={{ fontSize: ".9em", color: "gray" }}>
              <Label size="mini" horizontal>
                {item.filing_type}
              </Label>
              {dateTimeFormat(item.updated) + " EST"}
            </div>
          </Table.Cell>

          <Table.Cell style={{ float: "right" }}>
            <a href={item.link} style={{ color: "black" }}>
              <Button size="mini" color="blue">
                <span style={{ verticalAlign: "middle" }}>SEC Filing </span>
                <LaunchIcon
                  fontSize="inherit"
                  style={{ verticalAlign: "bottom" }}
                />
              </Button>
            </a>
          </Table.Cell>
        </Table.Row>
      ));
    }
  };

  return (
    <React.Fragment>
      <Table
        unstackable
        basic="very"
        padded
        fixed
        style={{ fontSize: ".75em" }}
      >
        <Table.Body>
          {loading ? (
            [...range(1, limit)].map((item, index) => (
              <Table.Row key={"placeholder" + String(index)}>
                <td>
                  <PlaceholderTemplate />
                </td>
              </Table.Row>
            ))
          ) : (
            <SecContent />
          )}
        </Table.Body>

        {!loading && pagination && filings.next ? (
          <Table.Footer>
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={2}>
                <Pagination
                  boundaryRange={0}
                  siblingRange={2}
                  activePage={activePage}
                  onPageChange={onChange}
                  firstItem={null}
                  lastItem={null}
                  size="mini"
                  totalPages={Math.ceil(filings.count / (limit ? limit : 10))}
                  ellipsisItem={null}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    </React.Fragment>
  );
};

export default FilingSnapshot;
