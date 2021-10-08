import React from "react";
import { Grid, Segment, Card } from "semantic-ui-react";
import NewsTable from "../modules/Snapshots/News";

const News = () => {
  return (
    <Segment style={{ padding: "4em 0em" }} vertical>
      <Grid stretched container stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <Card.Content>
                <Card.Header>Latest News</Card.Header>
              </Card.Content>
              <Card.Content>
                <NewsTable limit="25" overflow={false} label={false} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default News;
