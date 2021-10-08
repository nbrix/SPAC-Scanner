import React from "react";
import TableScreener from "../modules/Table/TableScreener";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import {
  numberWithCommas,
  addDollarSign,
  addPercentage,
} from "../utils/format";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import { Loader } from "semantic-ui-react";
import { AllSpacsURL } from "../services/Api/index";
import useAxios from "../services/Api/useAxios";

import {
  commonQuoteFilterMethod,
  CommonNumberRangeColumnFilter,
  WarrantNumberRangeColumnFilter,
  warrantQuoteFilterMethod,
  IndustryColumnFilter,
  industryFilterMethod,
} from "../modules/Table/FilterTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 250,
    minHeight: 500,
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
  const [companyData, loading, hasError] = useAxios({
    method: "get",
    url: AllSpacsURL + "?limit=1000",
  });

  const filterTypes = React.useMemo(
    () => ({
      multiSelect: (rows, id, filterValue) => {
        return filterValue.length === 0
          ? rows
          : rows.filter((row) =>
              filterValue.includes(String(row.original.status))
            );
      },
    }),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        id: "symbol",
        Header: () => <div style={{ textAlign: "left" }}>Symbol</div>,
        accessor: (x) => x.common_ticker_symbol,
        category: "",
        title: "Symbol",
        heading: "Symbol",
        sticky: "left",
        Cell: (props) => (
          <div
            style={{
              textAlign: "left",
            }}
          >
            <Link
              to={{
                pathname: `/profile/${props.value}`,
              }}
            >
              {props.value}
            </Link>
          </div>
        ),
        width: "80",
      },
      {
        id: "name",
        Header: () => <div style={{ textAlign: "left" }}>Name</div>,
        accessor: "name",
        category: "Fundamental",
        title: "Name",
        heading: "Name",
        Cell: (props) => (
          <div
            style={{
              textAlign: "left",
            }}
          >
            {props.value}
          </div>
        ),
        width: "150",
      },
      {
        id: "status",
        Header: () => <div style={{ textAlign: "left" }}>Status</div>,
        accessor: "status",
        category: "Fundamental",
        title: "Status",
        heading: "Status",
        Cell: (props) => (
          <div>
            {props.value === "PreIPO" ? (
              <span>
                <Icon name="clipboard outline" /> PreIPO
              </span>
            ) : props.value === "Searching for target" ? (
              <span>
                <Icon name="search" />
                Searching
              </span>
            ) : (
              <span>
                <Icon name="target" />
                Target Found
              </span>
            )}
          </div>
        ),
        width: "140",
        filter: "includesSome",
      },
      {
        id: "price",
        Header: () => <div className="right-aligned">Price</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.common_quote ? (
                <Label
                  size="tiny"
                  color={
                    x.common_quote.price
                      ? x.common_quote.change < 0
                        ? "red"
                        : "green"
                      : null
                  }
                >
                  {x.common_quote.price
                    ? addDollarSign(x.common_quote.price.toFixed(2))
                    : "N/A"}
                </Label>
              ) : (
                <Label size="tiny">N/A</Label>
              )}
            </div>
          );
        },
        category: "Fundamental",
        values: (x) => {
          return x.common_quote.price;
        },
        title: "Price",
        heading: "Price",
        filter: commonQuoteFilterMethod,
        Filter: CommonNumberRangeColumnFilter,
        sortType: (a, b) => {
          a = a.original.common_quote
            ? parseFloat(a.original.common_quote.price)
            : -1;
          b = b.original.common_quote
            ? parseFloat(b.original.common_quote.price)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "100",
      },
      {
        id: "change",
        Header: () => <div className="right-aligned">Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.common_quote
                ? x.common_quote.change
                  ? x.common_quote.change.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Fundamental",
        title: "Change",
        heading: "Change",
        filter: "includesValue",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : null
            }
          >
            <b>{props.value}</b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.common_quote
            ? parseFloat(a.original.common_quote.change)
            : -100;
          b = b.original.common_quote
            ? parseFloat(b.original.common_quote.change)
            : -100;

          return a < b ? -1 : 1;
        },
        width: "90",
      },
      {
        id: "change_perc",
        Header: () => <div className="right-aligned">% Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.common_quote
                ? x.common_quote.change_perc
                  ? x.common_quote.change_perc.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Fundamental",
        title: "% Change",
        heading: "% Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : "right-aligned"
            }
          >
            <b>
              {props.value.props.children === "N/A"
                ? props.value.props.children
                : addPercentage(props.value.props.children)}
            </b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.common_quote
            ? parseFloat(a.original.common_quote.changesPercentage)
            : -100;
          b = b.original.common_quote
            ? parseFloat(b.original.common_quote.changesPercentage)
            : -100;

          return a < b ? -1 : 1;
        },
        width: "110",
      },
      {
        id: "industry",
        Header: () => <div className="left-aligned">Industry</div>,
        accessor: (x) => {
          return (
            <div className="left-aligned">
              {x.industry
                ? x.industry.map((i, index) => {
                    return <div key={i.name + index}>{i.name}</div>;
                  })
                : "N/A"}
            </div>
          );
        },
        filter: industryFilterMethod,
        Filter: IndustryColumnFilter,
        disableSortBy: true,
        category: "Fundamental",
        title: "Industry",
        heading: "Industry",
        width: "130",
      },
      {
        id: "ipo_date",
        Header: () => <div className="right-aligned">IPO Date</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.ipo_date ? x.ipo_date : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          if (a.original.ipo_date && b.original.ipo_date) {
            return 0 <
              new Date(b.original.ipo_date) - new Date(a.original.ipo_date)
              ? 1
              : -1;
          } else if (a.original.ipo_date) {
            return -1;
          } else if (b.original.ipo_date) {
            return 1;
          }

          return -1;
        },
        category: "Fundamental",
        title: "IPO Date",
        heading: "IPO Date",
        width: "130",
      },
      {
        id: "trust_size",
        Header: () => <div className="right-aligned">Trust Size</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.trust_size ? numberWithCommas(x.trust_size, true) : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          a = parseFloat(a.original.trust_size);
          b = parseFloat(b.original.trust_size);

          return a < b ? -1 : 1;
        },
        category: "Fundamental",
        title: "Trust Size",
        heading: "Trust Size",
        width: "120",
      },
      {
        id: "volume",
        Header: () => <div className="right-aligned">Volume</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.common_quote
                ? x.common_quote.volume
                  ? numberWithCommas(x.common_quote.volume, false)
                  : "N/A"
                : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          a = a.original.common_quote
            ? parseFloat(a.original.common_quote.volume)
            : -1;
          b = b.original.common_quote
            ? parseFloat(b.original.common_quote.volume)
            : -1;

          return a < b ? -1 : 1;
        },
        category: "Fundamental",
        title: "Volume",
        heading: "Volume",
        width: "100",
      },

      /************************** WARRANTS ******************************** */

      {
        id: "warrantSymbol",
        Header: () => <div style={{ textAlign: "left" }}>Warrant Symbol</div>,
        accessor: (x) => x.warrant_ticker_symbol,
        category: "Warrants",
        title: "Symbol",
        heading: "Warrant Symbol",
        Cell: (props) => (
          <div
            style={{
              textAlign: "left",
            }}
          >
            {props.value}
          </div>
        ),
        width: "80",
      },
      {
        id: "priceWarrant",
        Header: () => <div className="right-aligned">Warrant Price</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.warrant_quote ? (
                <Label
                  size="tiny"
                  color={
                    x.warrant_quote.price
                      ? x.warrant_quote.change < 0
                        ? "red"
                        : "green"
                      : null
                  }
                >
                  {x.warrant_quote.price
                    ? addDollarSign(x.warrant_quote.price.toFixed(2))
                    : "N/A"}
                </Label>
              ) : (
                <Label size="tiny">N/A</Label>
              )}
            </div>
          );
        },
        category: "Warrants",
        title: "Price",
        heading: "Warrant Price",
        filter: warrantQuoteFilterMethod,
        Filter: WarrantNumberRangeColumnFilter,
        sortType: (a, b) => {
          a = a.original.warrant_quote
            ? parseFloat(a.original.warrant_quote.price)
            : -1;
          b = b.original.warrant_quote
            ? parseFloat(b.original.warrant_quote.price)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "100",
      },
      {
        id: "changeWarrant",
        Header: () => <div className="right-aligned">Warrant Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.warrant_quote
                ? x.warrant_quote.change
                  ? x.warrant_quote.change.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Warrants",
        title: "Change",
        heading: "Warrant Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : null
            }
          >
            <b>{props.value}</b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.warrant_quote
            ? parseFloat(a.original.warrant_quote.change)
            : -100;
          b = b.original.warrant_quote
            ? parseFloat(b.original.warrant_quote.change)
            : -100;

          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "changesPercentageWarrant",
        Header: () => <div className="right-aligned">Warrant % Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.warrant_quote
                ? x.warrant_quote.changesPercentage
                  ? x.warrant_quote.changesPercentage.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Warrants",
        title: "% Change",
        heading: "Warrant % Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : "right-aligned"
            }
          >
            <b>
              {props.value.props.children === "N/A"
                ? props.value.props.children
                : addPercentage(props.value.props.children)}
            </b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.warrant_quote
            ? parseFloat(a.original.warrant_quote.changesPercentage)
            : -100;
          b = b.original.warrant_quote
            ? parseFloat(b.original.warrant_quote.changesPercentage)
            : -100;

          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "volumeWarrant",
        Header: () => <div className="right-aligned">Warrant Volume</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.warrant_quote
                ? x.warrant_quote.volume
                  ? numberWithCommas(x.warrant_quote.volume, false)
                  : "N/A"
                : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          a = a.original.warrant_quote
            ? parseFloat(a.original.warrant_quote.volume)
            : -100;
          b = b.original.warrant_quote
            ? parseFloat(b.original.warrant_quote.volume)
            : -100;

          return a < b ? -1 : 1;
        },
        category: "Warrants",
        title: "Volume",
        heading: "Warrant Volume",
        width: "120",
      },

      /************************** UNITS ******************************** */
      {
        id: "unitSymbol",
        Header: () => <div style={{ textAlign: "left" }}>Unit Symbol</div>,
        accessor: (x) => x.unit_ticker_symbol,
        category: "Units",
        title: "Symbol",
        heading: "Unit Symbol",
        Cell: (props) => (
          <div
            style={{
              textAlign: "left",
            }}
          >
            {props.value}
          </div>
        ),
        width: "80",
      },
      {
        id: "priceUnit",
        Header: () => <div className="right-aligned">Unit Price</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.unit_quote ? (
                <Label
                  size="tiny"
                  color={
                    x.unit_quote.price
                      ? x.unit_quote.change < 0
                        ? "red"
                        : "green"
                      : null
                  }
                >
                  {x.unit_quote.price
                    ? addDollarSign(x.unit_quote.price.toFixed(2))
                    : "N/A"}
                </Label>
              ) : (
                <Label size="tiny">N/A</Label>
              )}
            </div>
          );
        },
        category: "Units",
        title: "Price",
        heading: "Unit Price",
        sortType: (a, b) => {
          a = a.original.unit_quote
            ? parseFloat(a.original.unit_quote.price)
            : -1;
          b = b.original.unit_quote
            ? parseFloat(b.original.unit_quote.price)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "100",
      },
      {
        id: "changeUnit",
        Header: () => <div className="right-aligned">Unit Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.unit_quote
                ? x.unit_quote.change
                  ? x.unit_quote.change.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Units",
        title: "Change",
        heading: "Unit Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : null
            }
          >
            <b>{props.value}</b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.unit_quote
            ? parseFloat(a.original.unit_quote.change)
            : -100;
          b = b.original.unit_quote
            ? parseFloat(b.original.unit_quote.change)
            : -100;

          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "changesPercentageUnit",
        Header: () => <div className="right-aligned">Unit % Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.unit_quote
                ? x.unit_quote.changesPercentage
                  ? x.unit_quote.changesPercentage.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Units",
        title: "% Change",
        heading: "Unit % Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : "right-aligned"
            }
          >
            <b>
              {props.value.props.children === "N/A"
                ? props.value.props.children
                : addPercentage(props.value.props.children)}
            </b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.unit_quote
            ? parseFloat(a.original.unit_quote.changesPercentage)
            : -100;
          b = b.original.unit_quote
            ? parseFloat(b.original.unit_quote.changesPercentage)
            : -100;
          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "volumeUnit",
        Header: () => <div className="right-aligned">Unit Volume</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.unit_quote
                ? x.unit_quote.volume
                  ? numberWithCommas(x.unit_quote.volume, false)
                  : "N/A"
                : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          a = a.original.unit_quote
            ? parseFloat(a.original.unit_quote.volume)
            : -100;
          b = b.original.unit_quote
            ? parseFloat(b.original.unit_quote.volume)
            : -100;
          return a < b ? -1 : 1;
        },
        category: "Units",
        title: "Volume",
        heading: "Unit Volume",
        width: "120",
      },

      /************************** RIGHTS ******************************** */
      {
        id: "rightsSymbol",
        Header: () => <div style={{ textAlign: "left" }}>Rights Symbol</div>,
        accessor: (x) => x.rights_ticker_symbol,
        category: "Rights",
        title: "Symbol",
        heading: "Rights Symbol",
        Cell: (props) => (
          <div
            style={{
              textAlign: "left",
            }}
          >
            {props.value}
          </div>
        ),
        width: "80",
      },
      {
        id: "priceRights",
        Header: () => <div className="right-aligned">Rights Price</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.rights_quote ? (
                <Label
                  size="tiny"
                  color={
                    x.rights_quote.price
                      ? x.rights_quote.change < 0
                        ? "red"
                        : "green"
                      : null
                  }
                >
                  {x.rights_quote.price
                    ? addDollarSign(x.rights_quote.price.toFixed(2))
                    : "N/A"}
                </Label>
              ) : (
                <Label size="tiny">N/A</Label>
              )}
            </div>
          );
        },
        category: "Rights",
        title: "Price",
        heading: "Rights Price",
        sortType: (a, b) => {
          a = a.original.rights_quote
            ? parseFloat(a.original.rights_quote.price)
            : -1;
          b = b.original.rights_quote
            ? parseFloat(b.original.rights_quote.price)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "100",
      },
      {
        id: "changeRights",
        Header: () => <div className="right-aligned">Rights Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.rights_quote
                ? x.rights_quote.change
                  ? x.rights_quote.change.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Rights",
        title: "Change",
        heading: "Rights Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : null
            }
          >
            <b>{props.value}</b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.rights_quote
            ? parseFloat(a.original.rights_quote.change)
            : -1;
          b = b.original.rights_quote
            ? parseFloat(b.original.rights_quote.change)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "changesPercentageRights",
        Header: () => <div className="right-aligned">Rights % Change</div>,
        accessor: (x) => {
          return (
            <React.Fragment>
              {x.rights_quote
                ? x.rights_quote.changesPercentage
                  ? x.rights_quote.changesPercentage.toFixed(2)
                  : "N/A"
                : "N/A"}
            </React.Fragment>
          );
        },
        category: "Rights",
        title: "% Change",
        heading: "Rights % Change",
        Cell: (props) => (
          <div
            className={
              props.value.props.children
                ? (props.value.props.children.includes("-")
                    ? "red"
                    : props.value.props.children === "N/A"
                    ? null
                    : "green") + " right-aligned"
                : "right-aligned"
            }
          >
            <b>
              {props.value.props.children === "N/A"
                ? props.value.props.children
                : addPercentage(props.value.props.children)}
            </b>
          </div>
        ),
        sortType: (a, b) => {
          a = a.original.rights_quote
            ? parseFloat(a.original.rights_quote.changesPercentage)
            : -1;
          b = b.original.rights_quote
            ? parseFloat(b.original.rights_quote.changesPercentage)
            : -1;

          return a < b ? -1 : 1;
        },
        width: "120",
      },
      {
        id: "volumeRights",
        Header: () => <div className="right-aligned">Rights Volume</div>,
        accessor: (x) => {
          return (
            <div className="right-aligned">
              {x.rights_quote
                ? x.rights_quote.volume
                  ? numberWithCommas(x.rights_quote.volume, false)
                  : "N/A"
                : "N/A"}
            </div>
          );
        },
        sortType: (a, b) => {
          a = a.original.rights_quote
            ? parseFloat(a.original.rights_quote.volume)
            : -1;
          b = b.original.rights_quote
            ? parseFloat(b.original.rights_quote.volume)
            : -1;

          return a < b ? -1 : 1;
        },
        category: "Rights",
        title: "Volume",
        heading: "Rights Volume",
        width: "120",
      },
    ],
    []
  );

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        {!loading ? (
          hasError ? (
            <EmptyPlaceholder description="Uh oh! Something went wrong." />
          ) : (
            <TableScreener
              columns={columns}
              data={companyData.results}
              filterTypes={filterTypes}
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
          <Loader active size="huge" />
        )}
      </CardContent>
    </Card>
  );
};

export default Screener;
