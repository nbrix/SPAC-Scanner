import React, { useState } from "react";
import { Label, Table, Image, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AllNewsURL, DetailNewsURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import { Pagination } from "semantic-ui-react";
import PlaceholderTemplate from "../../components/PlaceholderTemplate";
import EmptyPlaceholder from "../../components/EmptyPlaceholder";
import "./News.css";

const NewsTable = (props) => {
  const {
    ticker = "",
    limit,
    overflow = true,
    pagination = true,
    label = true,
  } = props;

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
    isTicker ? DetailNewsURL + ticker : AllNewsURL + query
  );
  const [news, loading, hasError] = useAxios({
    method: "get",
    url: apiUrl,
  });

  const NewsContent = () => {
    if (hasError) {
      return <EmptyPlaceholder description="Uh oh! Something went wrong." />;
    } else if (!Array.isArray(news.results) || !news.results.length) {
      return <EmptyPlaceholder description="No news found" />;
    } else {
      return news.results.map((item, index) => (
        <>
          <Table.Row key={index}>
            {!label ? (
              <Table.Cell key={item.image} verticalAlign="middle" width={3}>
                <a href={item.url}>
                  <Image
                    src={item.image}
                    fluid
                    centered
                    verticalAlign="middle"
                  />
                </a>
              </Table.Cell>
            ) : (
              <Table.Cell key={item.symbol} width={1}>
                <Link to={{ pathname: `/profile/${item.symbol}` }}>
                  <Label color="blue">{item.symbol}</Label>
                </Link>
              </Table.Cell>
            )}

            <Table.Cell key={item.title}>
              <a href={item.url} style={{ color: "black" }}>
                <h4>{item.title}</h4>
              </a>

              <span style={{ fontSize: ".9em", color: "gray" }}>
                <Label size="mini" horizontal>
                  {item.site}
                </Label>

                {dateTimeFormat(item.publishedDate)}
                <Link
                  to={{ pathname: `/profile/${item.symbol}` }}
                  style={{ paddingLeft: ".9em" }}
                >
                  {item.symbol}
                </Link>
              </span>
              <p className="description-text">
                {cleanText(item.text, item.site)}
              </p>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="description-row">
            <Table.Cell colSpan="2">
              <p>{cleanText(item.text, item.site)}</p>
              <Divider />
            </Table.Cell>
          </Table.Row>
        </>
      ));
    }
  };

  const onChange = (e, pageInfo) => {
    setActivePage(pageInfo.activePage);
    setApiUrl(
      isTicker
        ? DetailNewsURL + ticker + offset + limitParam
        : AllNewsURL + offset + limitParam
    );

    if (true) {
      return <EmptyPlaceholder />;
    }
  };

  const offset = (pageInfo) => {
    return "?offset=" + pageInfo.activePage.toString();
  };

  const dateTimeFormat = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date.replace(/-/g, "/")));
  };

  const cleanText = (text, outlet) => {
    let cleanedText = text;
    let pattern;
    let n;
    if (outlet === "Business Wire") {
      pattern = "\\)--";
      n = text.search(pattern);
      cleanedText = text.substring(n + 3);
    } else if (outlet === "Bloomberg Technology" || outlet === "PRNewsWire") {
      pattern = "--";
      n = text.search(pattern);
      cleanedText = text.substring(n + 2);
    }

    if (overflow && cleanedText.length > 150) {
      cleanedText = cleanedText.slice(0, 147) + "...";
    }
    return cleanedText;
  };

  let tableFooter;

  if (!loading) {
    if (pagination && (news.next || news.previous)) {
      tableFooter = (
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
                totalPages={Math.ceil(news.count / (limit ? limit : 5))}
                ellipsisItem={null}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      );
    } else if (pagination) {
      tableFooter = null;
    }
  }

  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  return (
    <React.Fragment>
      <Table unstackable basic="very" compact style={{ fontSize: ".75em" }}>
        <Table.Body key="news-table">
          {loading ? (
            [...range(1, limit ? limit : 5)].map((item, index) => (
              <Table.Row key={"placeholder" + String(index)}>
                <td>
                  <PlaceholderTemplate />
                </td>
              </Table.Row>
            ))
          ) : (
            <NewsContent />
          )}
        </Table.Body>

        {!loading && !hasError ? tableFooter : null}
      </Table>
    </React.Fragment>
  );
};

export default NewsTable;
