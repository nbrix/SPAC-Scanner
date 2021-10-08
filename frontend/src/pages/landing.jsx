/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React from "react";
import {
  Container,
  Grid,
  Header,
  Segment,
  Card,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Losers from "../modules/Snapshots/TopLosers";
import Gainers from "../modules/Snapshots/TopGainers";
import MostActiveCard from "../modules/Snapshots/MostActive";
import News from "../modules/Snapshots/News";
import FilingSnapshot from "../modules/Snapshots/Filings";

const LandingPage = () => {
  return (
    <React.Fragment>
      <Segment style={{ padding: "4em 0em" }} vertical>
        <Grid stretched container stackable columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Gainers />
            </Grid.Column>
            <Grid.Column>
              <Losers />
            </Grid.Column>
            <Grid.Column>
              <MostActiveCard />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Header style={{ padding: "1em 0em 0em 1em" }}>
                  Latest News
                </Header>

                <Card.Content>
                  <News limit="5" pagination={false} label={false} />
                </Card.Content>
                <Container textAlign="center" style={{ paddingBottom: "1em" }}>
                  <Link to={{ pathname: `/news` }}>
                    <h4 style={{color: '#1890ff'}}>« View More News »</h4>
                  </Link>
                </Container>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card fluid>
                <Header style={{ padding: "1em 0em 0em 1em" }}>
                  Latest SEC Filings
                </Header>

                <Card.Content>
                  <FilingSnapshot limit="6" pagination={false} />
                </Card.Content>

                <Container textAlign="center" style={{ paddingBottom: "1em" }}>
                  <Link to={{ pathname: `/sec-filings` }}>
                    <h4 style={{color: '#1890ff'}}>« View More SEC Filings »</h4>
                  </Link>
                </Container>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default LandingPage;
