import React from "react";
import {
  Button,
  Modal,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import "./Footer.css";

const Disclaimer = () => {
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
        trigger={<Button className="button-link">Disclaimer</Button>}
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
              title="Disclaimer"
              src={`https://app.termly.io/document/disclaimer/eabea39d-6400-4166-a339-03efe3786803`}
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

export default Disclaimer;