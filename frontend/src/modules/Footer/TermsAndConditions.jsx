import React from "react";
import {
  Button,
  Modal,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import "./Footer.css";

const TermsAndConditions = () => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
  
    const hideLoader = () => {
      setLoading(false);
    };
  
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => {
          setOpen(true);
          setLoading(true);
        }}
        open={open}
        trigger={<Button className="button-link">Terms and Conditions</Button>}
        size="large"
      >
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader inverted size="large" />
              </Dimmer>
            ) : null}
            <iframe
              title="Terms and Conditions"
              src={`https://app.termly.io/document/terms-of-use-for-saas/afcc259a-ab41-4924-a9c3-832e001d4b38`}
              onLoad={hideLoader}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content="OK" onClick={() => setOpen(false)} positive />
        </Modal.Actions>
      </Modal>
    );
};

export default TermsAndConditions;