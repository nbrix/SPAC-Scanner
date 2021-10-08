import React from "react";
import {
  Button,
  Modal,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import "./Footer.css";

const PrivacyPolicy = () => {
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
        trigger={<Button className="button-link">Privacy Policy</Button>}
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
              title="Privacy Policy"
              src={`https://app.termly.io/document/privacy-policy/bda661c5-b8c9-455c-b529-597de3242582`}
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

export default PrivacyPolicy;