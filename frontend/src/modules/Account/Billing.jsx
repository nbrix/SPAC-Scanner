import React, { useState, useEffect } from "react";
import {
  Segment,
  Header,
  Icon,
  Dimmer,
  Loader,
  Button,
  Modal,
  Divider,
} from "semantic-ui-react";
import Shell from "./Shell";
import { authAxios } from "../../services/Api/authAxios";
import { BillingURL, CancelSubscriptionURL } from "../../constants";
import SubscribeForm from "./SubscribeForm";

const CancelSubscriptionModal = (props) => {
  const [open, setOpen] = useState(false);
  const { handleUnsubscribe } = props;

  const cancelSubscription = () => {
    if (handleUnsubscribe) {
      handleUnsubscribe();
    }

    setOpen(false);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Cancel Subscription</Button>}
      size="mini"
    >
      <Modal.Header>Cancel Your Subscription</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Are you sure you want to cancel your subscription?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setOpen(false)}>
          No
        </Button>
        <Button
          content="Yes"
          labelPosition="right"
          icon="checkmark"
          onClick={cancelSubscription}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

const Billing = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({});

  useEffect(() => {
    handleUserDetails();
  }, []);

  const handleUnsubscribe = () => {
    setError(null);
    setLoading(true);

    authAxios
      .post(CancelSubscriptionURL)
      .then((res) => {
        setLoading(false);
        handleUserDetails();
      })
      .catch((err) => {
        setError(err.response.data.message);
        setLoading(false);
      });
  };

  const handleUserDetails = () => {
    setLoading(true);
    authAxios
      .get(BillingURL)
      .then((res) => {
        setLoading(false);
        setBillingDetails(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.message);
      });
  };

  function renderBillingDetails(details) {
    const free_trial = "free_trial";
    const member = "member";
    const not_member = "not_member";

    return (
      <Segment>
        <Header as="h3">Monthly Summary</Header>
        {details.membershipType === free_trial ? (
          <React.Fragment>
            <p>
              Your free trial ends on{" "}
              {new Date(details.free_trial_end_date).toDateString()}
            </p>
            <SubscribeForm handleUserDetails={handleUserDetails} />
          </React.Fragment>
        ) : details.membershipType === member ? (
          <React.Fragment>
            <p>
              Next billing date is{" "}
              {new Date(details.next_billing_date).toDateString()}
            </p>
            <p>Amount due: ${details.amount_due}</p>
            <Divider />
            <CancelSubscriptionModal handleUnsubscribe={handleUnsubscribe} />
          </React.Fragment>
        ) : details.membershipType === not_member ? (
          <React.Fragment>
            <p>Sign up to download screener data.</p>
            <SubscribeForm handleUserDetails={handleUserDetails} />
          </React.Fragment>
        ) : null}
      </Segment>
    );
  }

  return (
    <React.Fragment>
      <Shell>
        {error && (
          <Segment placeholder>
            <Header icon>
              <Icon name="rocket" />
              Could not fetch your account details. Please try reloading the
              page.
            </Header>
            <a href="/account/billing">
              <Button primary>Reload</Button>
            </a>
          </Segment>
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted></Loader>
            </Dimmer>
          </Segment>
        )}
        {billingDetails && renderBillingDetails(billingDetails)}
      </Shell>
    </React.Fragment>
  );
};

export default Billing;
