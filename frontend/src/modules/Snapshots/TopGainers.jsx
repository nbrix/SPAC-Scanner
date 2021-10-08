import React from "react";
import { Card, Table, Loader, Dimmer, Header } from "semantic-ui-react";
import { GainersURL } from "../../services/Api/index";
import useAxios from "../../services/Api/useAxios";
import { Link } from "react-router-dom";
import EmptyPlaceholder from "../../components/EmptyPlaceholder";

const Gainers = () => {
  const [gainers, loading, hasError] = useAxios({
    method: "get",
    url: GainersURL,
  });

  const GainersContent = () => {
    if (hasError) {
      return <EmptyPlaceholder description="Uh oh! Something went wrong." />;
    } else {
      return gainers.map((item) => (
        <Table.Row key={item.symbol}>
          <Table.Cell style={{ fontWeight: "bold" }} width={2}>
            <Link to={{ pathname: `/profile/${item.symbol}` }}>
              {item.symbol}
            </Link>
          </Table.Cell>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell className="green" textAlign="right" width={4}>
            {item.changesPercentage.toFixed(2)}%
          </Table.Cell>
        </Table.Row>
      ));
    }
  };

  return (
    <Card fluid>
      <Header style={{ padding: "1em 0em 0em 1em" }}>Top Gainers</Header>

      <Card.Content>
        <Table basic="very" unstackable style={{ fontSize: ".75em" }}>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell>
                  <Dimmer active inverted>
                    <Loader inverted />
                  </Dimmer>
                </Table.Cell>
              </Table.Row>
            ) : (
              <GainersContent />
            )}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
};

export default Gainers;
