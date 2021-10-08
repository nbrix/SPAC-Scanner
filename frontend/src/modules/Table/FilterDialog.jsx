import React, { useState, useEffect } from "react";
import { groupBy } from "../../utils/TableUtils";
import {
  Icon,
  Button,
  Modal,
  Grid,
  Checkbox,
  Message,
  Accordion,
  Menu,
} from "semantic-ui-react";
import "./FilterDialog.css";
import Hidden from "@material-ui/core/Hidden";

const defaultPropGetter = () => ({});

const CheckboxWarning = () => {
  return (
    <Message warning size="mini">
      <p>You must have at least one checked.</p>
    </Message>
  );
};

const columnsForm = (columns, category) => {
  const newObj = groupBy(columns, "category");
  let currentRow = [];
  let checkboxes = [];

  let i = 0;
  for (const obj of Object.values(newObj[category])) {
    if (i % 2 === 0) {
      currentRow.push(
        <Grid.Column key={category + obj.title}>
          <input type="checkbox" {...obj.getToggleHiddenProps()} />
          <label className="checkbox-label">{obj.title}</label>
        </Grid.Column>
      );
    } else {
      currentRow.push(
        <Grid.Column key={category + obj.title}>
          <input type="checkbox" {...obj.getToggleHiddenProps()} />
          <label className="checkbox-label">{obj.title}</label>
        </Grid.Column>
      );
      checkboxes.push(<Grid.Row key={category + i}>{currentRow}</Grid.Row>);
      currentRow = [];
    }
    i += 1;
  }
  return <Grid columns="equal">{checkboxes}</Grid>;
};

const FilterDialog = ({
  columns,
  getToggleHideAllColumnsProps = defaultPropGetter,
  allColumns,
  setFilter,
  setAllFilters,
  hiddenColumns,
  setHiddenColumns,
}) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [filterInput, setFilterInput] = useState(false);
  const [filterStatusInput, setFilterStatusInput] = useState([
    "Searching for target",
    "Found target",
  ]);

  const priceObj = allColumns.find((obj) => {
    return obj.id === "price";
  });
  const warrantObj = allColumns.find((obj) => {
    return obj.id === "priceWarrant";
  });
  const industryObj = allColumns.find((obj) => {
    return obj.id === "industry";
  });

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    setFilter("status", filterStatusInput);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const handleCheckbox = (e) => {
    const id = e.target.id || undefined;

    if (filterStatusInput && filterStatusInput.includes(id)) {
      if (filterStatusInput.length > 1) {
        setFilter(
          "status",
          filterStatusInput.filter((v) => v !== id)
        );

        setFilterStatusInput((prevChecked) => {
          return prevChecked.filter((v) => v !== id);
        });
      } else {
        setFilterInput(true);
      }
    } else {
      setFilter("status", [...filterStatusInput, id]);
      setFilterStatusInput((prevChecked) => [...prevChecked, id]);
      setFilterInput(false);
    }
  };

  const handleResetFilters = () => {
    setAllFilters([]);
    setFilterStatusInput(["Searching for target", "Found target"]);
    setHiddenColumns(hiddenColumns);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Modal
        centered={true}
        open={open}
        size="tiny"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        trigger={
          <Button primary size="small">
            <Icon name="options" style={{paddingLeft: 5}}/>
            <Hidden smDown>{' '}Filter</Hidden>
          </Button>
        }
      >
        <Modal.Content>
          <Button onClick={handleResetFilters} className="reset-button">
            Reset All Filters
          </Button>
          <h4>
            <strong>Status</strong>
          </h4>
          {filterInput ? <CheckboxWarning /> : null}
          <Grid columns="equal">
            <Grid.Column>
              <Checkbox
                id="PreIPO"
                onChange={handleCheckbox}
                checked={filterStatusInput.includes("PreIPO")}
                label="PreIPO"
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                id="Searching for target"
                onChange={handleCheckbox}
                checked={filterStatusInput.includes("Searching for target")}
                label="Searching for target"
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                id="Found target"
                onChange={handleCheckbox}
                checked={filterStatusInput.includes("Found target")}
                label="Found target"
              />
            </Grid.Column>
          </Grid>
          <div>
            <br />
            <h4>
              <strong>Industry</strong>
            </h4>
            {industryObj.Filter ? industryObj.render("Filter") : null}

            <br />
            <h4>
              <strong>Price</strong>
            </h4>

            {priceObj.Filter ? priceObj.render("Filter") : null}

            <br />
            <h4>
              <strong>Warrant Price</strong>
            </h4>
            {warrantObj.Filter ? warrantObj.render("Filter") : null}

            <br />
            <h4>
              <strong>Show/Hide - Columns</strong>
            </h4>
          </div>
          <Accordion as={Menu} vertical fluid>
            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 0}
                content="Fundamentals"
                index={0}
                onClick={handleClick}
              />
              <Accordion.Content
                active={activeIndex === 0}
                content={columnsForm(allColumns, "Fundamental")}
              />
            </Menu.Item>

            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 1}
                content="Warrants"
                index={1}
                onClick={handleClick}
              />
              <Accordion.Content
                active={activeIndex === 1}
                content={columnsForm(allColumns, "Warrants")}
              />
            </Menu.Item>

            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 2}
                content="Units"
                index={2}
                onClick={handleClick}
              />
              <Accordion.Content
                active={activeIndex === 2}
                content={columnsForm(allColumns, "Units")}
              />
            </Menu.Item>

            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 3}
                content="Rights"
                index={3}
                onClick={handleClick}
              />
              <Accordion.Content
                active={activeIndex === 3}
                content={columnsForm(allColumns, "Rights")}
              />
            </Menu.Item>
          </Accordion>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button primary onClick={() => setOpen(false)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default FilterDialog;
