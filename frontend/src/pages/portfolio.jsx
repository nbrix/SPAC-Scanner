import React, { useState, useEffect } from "react";
import { Grid, Card, Segment, Header } from "semantic-ui-react";
import News from "../modules/Snapshots/News";
import FilingSnapshot from "../modules/Snapshots/Filings";
import { PortfolioURL } from "../services/Api/index";
import useAxios from "../services/Api/useAxios";
import authHeader from "../services/Api/authHeader";

import { columns } from "../modules/Portfolio/TableColumns";

import { Loader } from "semantic-ui-react";
import PortfolioTable from "../modules/Portfolio/PortfolioTable";
import EmptyPlaceholder from "../components/EmptyPlaceholder";

const Portfolio = () => {
  const [companies, loading, hasError] = useAxios({
    method: "get",
    url: PortfolioURL,
    headers: authHeader(),
  });
  const [tickers, setTickers] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      let t = companies.map((x) => {
        return x.common_ticker_symbol;
      });
      setTickers(t);
      setData(companies);
    }
  }, [companies]);

  const columnData = React.useMemo(() => columns, []);

  return (
    <Segment style={{ padding: "4em 0em" }} vertical>
      <Grid stretched container stackable columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Card fluid style={{ minHeight: 500 }}>
              <Card.Content>
                {!loading ? (
                  hasError ? (
                    <EmptyPlaceholder description="Uh oh! Something went wrong." />
                  ) : (
                    <PortfolioTable
                      columns={columnData}
                      data={data}
                      setData={setData}
                      getHeaderProps={(column) => ({
                        className: "screener-column",
                        style: {
                          fontWeight: "bolder",
                          fontSize: "14px",
                          verticalAlign: "bottom",
                        },
                      })}
                    />
                  )
                ) : (
                  <Loader active size="big" />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Header style={{ padding: "1em 0em 0em 1em" }}>
                Portfolio News
              </Header>
              <Card.Content>
                {!loading ? <News ticker={tickers} limit="5" label={false} /> : null}
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Header style={{ padding: "1em 0em 0em 1em" }}>
                Latest SEC Filings
              </Header>
              <Card.Content>
                {!loading ? <FilingSnapshot ticker={tickers} limit="6" /> : null}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default Portfolio;
