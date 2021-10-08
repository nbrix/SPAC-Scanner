/* eslint-disable react/style-prop-object */
import React from "react";
import TradingViewWidget from "react-tradingview-widget";
import News from "../modules/Snapshots/News";
import SECTable from "../modules/Profile/SECTable";
import {
  CompanyDetailsURL,
  ManagementURL,
  SecFilingsTickerURL,
  TargetURL,
  QuoteURL
} from "../services/Api/index";
import useAxios from "../services/Api/useAxios";
import { numberWithCommas, formatDate } from "../utils/format";
import ErrorPlaceholder from "../components/EmptyPlaceholder";
import LaunchIcon from "@material-ui/icons/Launch";

import ManagementTable from "../modules/Profile/ManagementTable";
import EmptyPlaceholder from "../components/EmptyPlaceholder";

import {
  Divider,
  Grid,
  Segment,
  Card,
  Table,
  Tab,
  Dimmer,
  Loader,
  Icon,
} from "semantic-ui-react";
import "./profile.css";

const Profile = (props) => {
  const ticker = props.match.params.symbol;

  const [details, detailsLoading, detailsHasError] = useAxios({
    method: "get",
    url: CompanyDetailsURL + ticker,
  });
  const [profile, loading, profileHasError] = useAxios({
    method: "get",
    url: QuoteURL + ticker,
  });
  const [filings, filingLoading, filingHasError] = useAxios({
    method: "get",
    url: SecFilingsTickerURL + ticker,
  });
  const [target, targetLoading, targetHasError] = useAxios({
    method: "get",
    url: TargetURL + ticker,
  });
  const [management, managementLoading, managementHasError] = useAxios({
    method: "get",
    url: ManagementURL + ticker,
  });

  const formatDollars = (number) => {
    number = number.toString();
    if (!number) {
      return "-";
    }
    if (!number.includes(",")) {
      number = numberWithCommas(number);
    }
    if (number[0] === "-") {
      number = number.replace("-", "($");
      number += ")";
    }
    if (!number.includes("$")) {
      number = "$" + number;
    }

    return number;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Form",
        id: "title",
        accessor: (filing) => (
          <a style={{ color: "black", fontWeight: "bold" }} href={filing.link}>
            <span>
              {filing.title}
              <LaunchIcon
                fontSize="small"
                style={{ verticalAlign: "bottom" }}
              />
            </span>
          </a>
        ),
      },
      {
        Header: "Type",
        accessor: "filing_type",
      },

      {
        Header: "Date Filed",
        accessor: "updated",
      },
    ],
    []
  );

  const panes = [
    {
      menuItem: "Info",
      render: () => (
        <Tab.Pane key="0">
          {!detailsLoading && !detailsHasError ? (
            <Grid stackable>
              <Grid.Column width={8}>
                <p>
                  <strong>Focus: </strong>
                  {details.focus}
                </p>
                <p>
                  <strong>Status: </strong>
                  {details.status}
                </p>
                <p>
                  <strong>Trust Size: </strong>
                  {formatDollars(details.trust_size)}
                </p>
                <p>
                  <strong>IPO Date: </strong>
                  {formatDate(details.ipo_date)}
                </p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Table compact basic="very" unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Symbol</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        Price
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        Change
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        Volume
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {details.warrant_ticker_symbol ? (
                      details.warrant_quote ? (
                        <Table.Row>
                          <Table.Cell>
                            {details.warrant_ticker_symbol}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            ${details.warrant_quote.price}
                          </Table.Cell>
                          <Table.Cell
                            className={
                              details.warrant_quote.change >= 0
                                ? "green"
                                : "red"
                            }
                            textAlign="right"
                          >
                            {details.warrant_quote.change}{" "}
                            <b>({details.warrant_quote.change_perc}%)</b>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            {details.warrant_quote.volume}
                          </Table.Cell>
                        </Table.Row>
                      ) : null
                    ) : null}
                    {details.unit_ticker_symbol ? (
                      details.unit_quote ? (
                        <Table.Row>
                          <Table.Cell>{details.unit_ticker_symbol}</Table.Cell>
                          <Table.Cell textAlign="right">
                            ${details.unit_quote.price}
                          </Table.Cell>
                          <Table.Cell
                            className={
                              details.unit_quote.change >= 0 ? "green" : "red"
                            }
                            textAlign="right"
                          >
                            {details.unit_quote.change}{" "}
                            <b>({details.unit_quote.change_perc}%)</b>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            {details.unit_quote.volume}
                          </Table.Cell>
                        </Table.Row>
                      ) : null
                    ) : null}
                    {details.rights_ticker_symbol ? (
                      details.rights_quote ? (
                        <Table.Row>
                          <Table.Cell>
                            {details.rights_ticker_symbol}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            ${details.rights_quote.price}
                          </Table.Cell>
                          <Table.Cell
                            className={
                              details.rights_quote.change >= 0 ? "green" : "red"
                            }
                            textAlign="right"
                          >
                            {details.rights_quote.change}{" "}
                            <b>({details.rights_quote.change_perc}%)</b>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            {details.rights_quote.volume}
                          </Table.Cell>
                        </Table.Row>
                      ) : null
                    ) : null}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid>
          ) : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "News",
      render: () => (
        <Tab.Pane key="1">
          {!loading ? <News ticker={ticker} label={false} /> : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "SEC Filings",
      render: () => (
        <Tab.Pane key="2">
          {!filingLoading ? (
            filingHasError ? (
              <EmptyPlaceholder description="Uh oh! Something went wrong." />
            ) : (
              <SECTable
                columns={columns}
                data={filings.results}
                getHeaderProps={(column) => ({
                  style: {
                    fontWeight: "bolder",
                  },
                })}
              />
            )
          ) : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Management",
      render: () => (
        <Tab.Pane key="3">
          {!managementLoading ? (
            !managementHasError ? (
              <ManagementTable data={management} />
            ) : (
              <EmptyPlaceholder description="Uh oh! Something went wrong." />
            )
          ) : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Target Company",
      render: () => (
        <Tab.Pane key="4">
          {!targetLoading ? (
            !targetHasError && target.length ? (
              target.map((t) => {
                return (
                  <>
                    {t.about ? (
                      <div>
                        {t.about}
                        <Divider />
                      </div>
                    ) : null}

                    <Grid>
                      <Grid.Column width={8}>
                        <Table basic="very" compact>
                          <Table.Row>
                            <Table.Cell>Target Company</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.name}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Enterprise Valuation</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.enterprise_valuation}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Equity Valuation</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.equity_valuation}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Pipe Size</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.pipe_size}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Investor Deck</Table.Cell>
                            <Table.Cell>
                              <a href={t.investor_presentation}>
                                <LaunchIcon />
                              </a>
                            </Table.Cell>
                          </Table.Row>
                        </Table>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Table basic="very" compact>
                          <Table.Row>
                            <Table.Cell>Industry</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.industry ? t.industry : "N/A"}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Headquarters</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.headquarters ? t.headquarters : "N/A"}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Founded</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.founded ? t.founded : "N/A"}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Number of Employees</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.employees ? t.employees : "N/A"}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Website</Table.Cell>
                            <Table.Cell className="target-profile-text">
                              {t.website ? (
                                <a href={t.website}>{t.website}</a>
                              ) : (
                                "N/A"
                              )}
                            </Table.Cell>
                          </Table.Row>
                        </Table>
                      </Grid.Column>
                    </Grid>
                  </>
                );
              })
            ) : (
              <ErrorPlaceholder description="Target Unavailable" />
            )
          ) : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Projected Earnings",
      render: () => (
        <Tab.Pane key="5">
          {!targetLoading ? (
            target.length ? (
              <div className="table-container">
                <Table unstackable>
                  <Table.Row>
                    <Table.HeaderCell />
                    {target[0].earnings.map((t) => {
                      return <Table.HeaderCell>{t.year}</Table.HeaderCell>;
                    })}
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Revenue (M)</Table.Cell>
                    {target[0].earnings.map((t) => {
                      return (
                        <Table.Cell>{formatDollars(t.revenue)}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      {target[0].earnings[0].earnings_indicator + " (M)"}
                    </Table.Cell>
                    {target[0].earnings.map((t) => {
                      return (
                        <Table.Cell>{formatDollars(t.earnings)}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                </Table>
              </div>
            ) : (
              <ErrorPlaceholder description="Earnings Unavailable" />
            )
          ) : null}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Segment style={{ padding: "4em 0em" }} vertical>
        <Grid stretched container stackable>
          <Grid.Row>
            <Grid.Column width={10}>
              <Card fluid style={{ height: 500 }}>
                {detailsLoading ? null : details.status === "PreIPO" ? (
                  <Icon
                    style={{ width: "50%", margin: "auto" }}
                    size="huge"
                    disabled
                    name="cancel"
                  >
                    <h1>No Chart Available</h1>
                  </Icon>
                ) : (
                  <TradingViewWidget
                    autosize
                    style="3"
                    range="1d"
                    interval="5"
                    symbol={ticker}
                  />
                )}
              </Card>
            </Grid.Column>

            <Grid.Column width={6}>
              <Card fluid>
                {loading ? (
                  <Dimmer active inverted>
                    <Loader inverted />
                  </Dimmer>
                ) : profileHasError ? (
                  <EmptyPlaceholder description="Uh oh! Something went wrong." />
                ) : (
                  <Card.Content>
                    <Card.Header>Company Info</Card.Header>
                    <Divider clearing />
                    <Table
                      basic="very"
                      fixed
                      singleLine
                      unstackable
                      style={{ fontSize: "1em" }}
                    >
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>Close</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            ${profile.price}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Change</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            className={
                              profile.change > 0
                                ? "green"
                                : profile.change < 0
                                ? "red"
                                : null
                            }
                            textAlign="right"
                          >
                            {profile.change}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Change %</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            className={
                              profile.change > 0
                                ? "green"
                                : profile.change < 0
                                ? "red"
                                : null
                            }
                            textAlign="right"
                          >
                            {profile.changesPercentage}%
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Day Range</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            ${profile.dayLow} - ${profile.dayHigh}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Year Range</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            ${profile.yearLow} - ${profile.yearHigh}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Market Cap</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            ${numberWithCommas(profile.marketCap)}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Outstanding Shares</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            {numberWithCommas(profile.sharesOutstanding)}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Volume</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            {numberWithCommas(profile.volume)}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Average Volume</Table.Cell>
                          <Table.Cell
                            style={{ fontWeight: "bold" }}
                            textAlign="right"
                          >
                            {numberWithCommas(profile.avgVolume)}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Card.Content>
                )}
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Tab
                menu={{ secondary: true, pointing: true, className: "wrapped" }}
                panes={panes}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default Profile;
