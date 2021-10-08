import React, { useState, useEffect } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import {Form } from "semantic-ui-react";
import "./Toolbar.css"

const SECToolbar = (props) => {
  const { onSubmit } = props;
  const [checked, setChecked] = useState({
    "S-1": true,
    "10-Q": true,
    "8-K": true,
    425: true,
  });
  const [checkedAll, setCheckedAll] = useState(true);

  const toggleCheck = (inputName) => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[inputName] = !prevState[inputName];
      return newState;
    });
  };

  const selectAll = (value) => {
    setCheckedAll(value);
    if (value) {
      setChecked((prevState) => {
        const newState = { ...prevState };
        for (const inputName in newState) {
          newState[inputName] = value;
        }
        return newState;
      });
    }
  };

  useEffect(() => {
    let allChecked = true;
    for (const inputName in checked) {
      if (checked[inputName] === false) {
        allChecked = false;
      }
    }
    if (!allChecked) {
      setCheckedAll(false);
    }
  }, [checked]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    onSubmit({ checked, checkedAll });
  };

  return (
    <Toolbar>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Form Type</label>
          <Form.Group >
            <Form.Checkbox
              name="All"
              label="All"
              control="input"
              type="checkbox"
              className='checkbox'
              onChange={(event) => selectAll(event.target.checked)}
              checked={checkedAll}
            />
            <Form.Checkbox
              name="S-1"
              label="S-1"
              control="input"
              type="checkbox"
              className='checkbox'
              onChange={() => toggleCheck("S-1")}
              checked={checked["S-1"]}
            />
            <Form.Checkbox
              name="8-K"
              label="8-K"
              control="input"
              type="checkbox"
              className='checkbox'
              onChange={() => toggleCheck("8-K")}
              checked={checked["8-K"]}
            />
            <Form.Checkbox
              name="10-Q"
              label="10-Q"
              control="input"
              type="checkbox"
              className='checkbox'
              onChange={() => toggleCheck("10-Q")}
              checked={checked["10-Q"]}
            />
            <Form.Checkbox
              name="425"
              label="425"
              control="input"
              type="checkbox"
              className='checkbox'
              onChange={() => toggleCheck("425")}
              checked={checked["425"]}
            />
            <Form.Button
              primary
              size="mini"
              content="Submit"
              className='submit-button'
            />
          </Form.Group>
          
        </Form.Field>
      </Form>
    </Toolbar>
  );
};

export default SECToolbar;
