/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React from "react";
import {
  Container,
  Grid,
  Segment,
} from "semantic-ui-react";
import TermsAndConditions from "./TermsAndConditions";
import Disclaimer from "./Disclaimer";
import PrivacyPolicy from "./PrivacyPolicy";
import "./Footer.css";







const Footer = () => {
  return (
    <Segment inverted vertical style={{ padding: "3em 0em" }}>
      <Container style={{ width: "50%" }}>
        <Grid divided inverted stackable columns="equal">
          <Grid.Row>
            <Grid.Column textAlign="center">
              <a className='email' href="mailto: info@spacscanner.com">info@spacscanner.com</a>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <PrivacyPolicy />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <TermsAndConditions />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Disclaimer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div style={{ textAlign: "center", color: "gray" }}>
          © 2021 SPACscanner
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;
