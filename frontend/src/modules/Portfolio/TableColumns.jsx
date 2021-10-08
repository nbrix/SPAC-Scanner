import React from "react";
import { Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import {
  numberWithCommas,
  addDollarSign,
  addPercentage,
} from "../../utils/format";

import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

import {
  commonQuoteFilterMethod,
  CommonNumberRangeColumnFilter,
  WarrantNumberRangeColumnFilter,
  warrantQuoteFilterMethod,
  IndustryColumnFilter,
  industryFilterMethod,
} from "../Table/FilterTypes";

export const columns = [
  {
    id: "symbol",
    Header: () => <div style={{ textAlign: "left" }}>Symbol</div>,
    accessor: (x) => x.common_ticker_symbol,
    category: "",
    title: "Symbol",
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
    id: "sparkline",
    Header: "",
    Cell: (props) => (
      <div
        style={{
          textAlign: "left",
        }}
      >
        {props.row.original.sparkline ? (
          <Sparklines data={props.row.original.sparkline}>
            <SparklinesLine
              color={
                props.row.original.common_quote
                  ? props.row.original.common_quote.change >= 0
                    ? "green"
                    : "red"
                  : "gray"
              }
            />
            <SparklinesSpots size={2} />
          </Sparklines>
        ) : null}
      </div>
    ),

    category: "Fundamental",
    title: "Sparkline",
    disableSortBy: true,
    width: "120",
  },

  {
    id: "name",
    Header: () => <div style={{ textAlign: "left" }}>Name</div>,
    accessor: "name",
    category: "Fundamental",
    title: "Name",
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
    width: "150",
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
    filter: commonQuoteFilterMethod,
    Filter: CommonNumberRangeColumnFilter,
    sortType: (a, b) => {
      a = a.original.price ? parseFloat(a.original.price) : -1;
      b = b.original.price ? parseFloat(b.original.price) : -1;

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
    filter: "includesValue",
    //filterMethod:  (filter, row) => customOptionsFilterMethod(filter, row),
    //Filter: NumberRangeColumnFilter,
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
      a = a.original.change ? parseFloat(a.original.change) : -1;
      b = b.original.change ? parseFloat(b.original.change) : -1;

      return a < b ? -1 : 1;
    },
    width: "120",
  },
  {
    id: "changesPercentage",
    Header: () => <div className="right-aligned">% Change</div>,
    accessor: (x) => {
      return (
        <React.Fragment>
          {x.common_quote
            ? x.common_quote.changesPercentage
              ? x.common_quote.changesPercentage.toFixed(2)
              : "N/A"
            : "N/A"}
        </React.Fragment>
      );
    },
    category: "Fundamental",
    title: "% Change",
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
      a = parseFloat(a.original.changesPercentage);
      b = parseFloat(b.original.changesPercentage);

      return a < b ? -1 : 1;
    },
    width: "120",
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
    width: "130",
  },
  {
    id: "ipo_date",
    Header: () => <div className="right-aligned">IPO Date</div>,
    accessor: (x) => {
      return (
        <div className="right-aligned">{x.ipo_date ? x.ipo_date : "N/A"}</div>
      );
    },
    sortType: (a, b) => {
      if (a.original.ipo_date && b.original.ipo_date) {
        return 0 < new Date(b.original.ipo_date) - new Date(a.original.ipo_date)
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
    width: "130",
  },

  /************************** WARRANTS ******************************** */

  {
    id: "warrantSymbol",
    Header: () => <div style={{ textAlign: "left" }}>Warrant Symbol</div>,
    accessor: (x) => x.warrant_ticker_symbol,
    category: "Warrants",
    title: "Symbol",
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
    filter: warrantQuoteFilterMethod,
    Filter: WarrantNumberRangeColumnFilter,
    sortType: (a, b) => {
      a = a.original.price ? parseFloat(a.original.price) : -1;
      b = b.original.price ? parseFloat(b.original.price) : -1;

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
      a = a.original.change ? parseFloat(a.original.change) : -1;
      b = b.original.change ? parseFloat(b.original.change) : -1;

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
      a = parseFloat(a.original.changesPercentage);
      b = parseFloat(b.original.changesPercentage);

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
    category: "Warrants",
    title: "Volume",
    width: "120",
  },
  {
    id: "avgVolumeWarrant",
    Header: () => <div className="right-aligned">Warrant Average Volume</div>,
    accessor: (x) => {
      return (
        <div className="right-aligned">
          {x.warrant_quote
            ? x.warrant_quote.avgVolume
              ? numberWithCommas(x.warrant_quote.avgVolume, false)
              : "N/A"
            : "N/A"}
        </div>
      );
    },
    category: "Warrants",
    title: "Average Volume",
    width: "130",
  },

  /************************** UNITS ******************************** */
  {
    id: "unitSymbol",
    Header: () => <div style={{ textAlign: "left" }}>Unit Symbol</div>,
    accessor: (x) => x.unit_ticker_symbol,
    category: "Units",
    title: "Symbol",
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
    sortType: (a, b) => {
      a = a.original.price ? parseFloat(a.original.price) : -1;
      b = b.original.price ? parseFloat(b.original.price) : -1;

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
      a = a.original.change ? parseFloat(a.original.change) : -1;
      b = b.original.change ? parseFloat(b.original.change) : -1;

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
      a = parseFloat(a.original.changesPercentage);
      b = parseFloat(b.original.changesPercentage);

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
    category: "Units",
    title: "Volume",
    width: "120",
  },
  {
    id: "avgVolumeUnit",
    Header: () => <div className="right-aligned">Unit Average Volume</div>,
    accessor: (x) => {
      return (
        <div className="right-aligned">
          {x.unit_quote
            ? x.unit_quote.avgVolume
              ? numberWithCommas(x.unit_quote.avgVolume, false)
              : "N/A"
            : "N/A"}
        </div>
      );
    },
    category: "Units",
    title: "Average Volume",
    width: "130",
  },
  /************************** RIGHTS ******************************** */
  {
    id: "rightsSymbol",
    Header: () => <div style={{ textAlign: "left" }}>Warrant Symbol</div>,
    accessor: (x) => x.rights_ticker_symbol,
    category: "Rights",
    title: "Symbol",
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
    sortType: (a, b) => {
      a = a.original.price ? parseFloat(a.original.price) : -1;
      b = b.original.price ? parseFloat(b.original.price) : -1;

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
      a = a.original.change ? parseFloat(a.original.change) : -1;
      b = b.original.change ? parseFloat(b.original.change) : -1;

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
      a = parseFloat(a.original.changesPercentage);
      b = parseFloat(b.original.changesPercentage);

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
    category: "Rights",
    title: "Volume",
    width: "120",
  },
  {
    id: "avgVolumeRights",
    Header: () => <div className="right-aligned">Rights Average Volume</div>,
    accessor: (x) => {
      return (
        <div className="right-aligned">
          {x.rights_quote
            ? x.rights_quote.avgVolume
              ? numberWithCommas(x.rights_quote.avgVolume, false)
              : "N/A"
            : "N/A"}
        </div>
      );
    },
    category: "Rights",
    title: "Average Volume",
    width: "130",
  },
];
