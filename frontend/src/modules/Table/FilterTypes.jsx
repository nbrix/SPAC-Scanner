import React, { useState, useEffect } from "react";
import { Grid, Checkbox, Dropdown } from "semantic-ui-react";
import Slider from "@material-ui/core/Slider";
import useDebounce from "../../hooks/useDebounce";

export const commonQuoteFilterMethod = (rows, ids, filterValue) => {
  let [min, max] = filterValue || [];

  min = typeof min === "number" ? min : -Infinity;
  max = typeof max === "number" ? max : Infinity;

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return rows.filter((row) => {
    return ids.some((id) => {
      const rowValue = row.original.common_quote
        ? row.original.common_quote.price
        : null;
      return rowValue >= min && rowValue <= max;
    });
  });
};

export function CommonNumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = 0;
    let max = 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(
        row.original.common_quote ? row.original.common_quote.price : 0,
        min
      );
      max = Math.max(
        row.original.common_quote ? row.original.common_quote.price : 0,
        max
      );
    });
    return [min, Math.ceil(max)];
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [id, preFilteredRows]);

  const initialMin = min;
  const initialMax = max;
  const [filterState, setFilterState] = useState(false);
  const [previousFilterValue, setPreviousFilterValue] = useState(filterValue);
  const [slideValue, setSlideValue] = useState(
    filterValue.length < 1 ? [initialMin, initialMax] : filterValue
  );
  const debouncedInput = useDebounce(slideValue, 500);

  useEffect(() => {
    if (debouncedInput) {
      setFilter(debouncedInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const handleCheckbox = (event) => {
    if (!filterState) {
      setPreviousFilterValue(filterValue);
      setFilter([undefined, undefined]);
    } else {
      setFilter(previousFilterValue);
    }
    setFilterState(!filterState);
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          value={slideValue[0] || previousFilterValue[0] || 0}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              val ? parseFloat(val) : undefined,
              old[1],
            ]);
            setSlideValue([val ? parseFloat(val) : undefined, filterValue[1]]);
          }}
          placeholder={min}
          style={{
            width: "70px",
            marginRight: "0.5rem",
          }}
          disabled={filterState}
        />
        to
        <input
          value={slideValue[1] || previousFilterValue[1]}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? parseFloat(val) : undefined,
            ]);
            setSlideValue([filterValue[0], val ? parseFloat(val) : undefined]);
          }}
          placeholder={"Max"}
          style={{
            width: "70px",
            marginLeft: "0.5rem",
          }}
          disabled={filterState}
        />
        <Checkbox
          onChange={handleCheckbox}
          label="ON/OFF"
          style={{ marginLeft: "auto" }}
          defaultChecked
        />
      </div>
      <br />
      <Grid>
        <Grid.Row>
          <Grid.Column width={1}>{min}</Grid.Column>
          <Grid.Column width={12}>
            <Slider
              min={min}
              max={max}
              style={{ color: "#3880ff" }}
              onChange={(e, newValue) => setSlideValue(newValue)}
              value={slideValue}
              valueLabelDisplay="auto"
              disabled={filterState}
              aria-labelledby="range-slider"
            />
          </Grid.Column>
          <Grid.Column width={2}>{max}</Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
}

export const warrantQuoteFilterMethod = (rows, ids, filterValue) => {
  let [min, max] = filterValue || [];

  min = typeof min === "number" ? min : -Infinity;
  max = typeof max === "number" ? max : Infinity;

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return rows.filter((row) => {
    return ids.some((id) => {
      const rowValue = row.original.warrant_quote
        ? row.original.warrant_quote.price
        : null;
      return rowValue >= min && rowValue <= max;
    });
  });
};

export function WarrantNumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = 0;
    let max = 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(
        row.original.warrant_quote ? row.original.warrant_quote.price : 0,
        min
      );
      max = Math.max(
        row.original.warrant_quote ? row.original.warrant_quote.price : 0,
        max
      );
    });
    return [min, Math.ceil(max)];
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [id, preFilteredRows]);

  const initialMin = min;
  const initialMax = max;
  const [filterState, setFilterState] = useState(false);
  const [previousFilterValue, setPreviousFilterValue] = useState(filterValue);
  const [slideValue, setSlideValue] = useState(
    filterValue.length < 1 ? [initialMin, initialMax] : filterValue
  );
  const debouncedInput = useDebounce(slideValue, 500);

  useEffect(() => {
    if (debouncedInput) {
      setFilter(debouncedInput);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [debouncedInput]);

  const handleCheckbox = (event) => {
    if (!filterState) {
      setPreviousFilterValue(filterValue);
      setFilter([undefined, undefined]);
    } else {
      setFilter(previousFilterValue);
    }
    setFilterState(!filterState);
  };

  const convertToValid = (input) => {
    let result = input;
    if (!input) {
      return input;
    }
    if (input <= 0) {
      result = 0;
    } else if (input >= max) {
      result = max;
    }
    return result;
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          value={slideValue[0]}
          type="number"
          step={0.1}
          onChange={(e) => {
            const val = convertToValid(e.target.value);
            setFilter((old = []) => [
              val ? parseFloat(val) : undefined,
              old[1],
            ]);
            setSlideValue(
              [
                val || val === 0 ? parseFloat(val) : undefined,
                filterValue[1],
              ].sort()
            );
          }}
          placeholder={min || 0}
          style={{
            width: "70px",
            marginRight: "0.5rem",
          }}
          disabled={filterState}
        />
        to
        <input
          value={slideValue[1]}
          type="number"
          step={0.1}
          onChange={(e) => {
            const val = convertToValid(e.target.value);
            setFilter((old = []) => [
              old[0],
              val ? parseFloat(val) : undefined,
            ]);
            setSlideValue(
              [
                filterValue[0],
                val || val === 0 ? parseFloat(val) : undefined,
              ].sort()
            );
          }}
          placeholder={"Max"}
          style={{
            width: "70px",
            marginLeft: "0.5rem",
          }}
          disabled={filterState}
        />
        <Checkbox
          onChange={handleCheckbox}
          label="ON/OFF"
          style={{ marginLeft: "auto" }}
          defaultChecked
        />
      </div>
      <br />
      <Grid>
        <Grid.Row>
          <Grid.Column textAlign="right" width={1}>
            {min}
          </Grid.Column>
          <Grid.Column verticalAlign="top" width={12}>
            <Slider
              min={min}
              max={max}
              step={0.1}
              style={{ color: "#3880ff" }}
              onChange={(e, newValue) => setSlideValue(newValue)}
              value={slideValue}
              disabled={filterState}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
            />
          </Grid.Column>
          <Grid.Column textAlign="left" width={2}>
            {max}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
}

export const industryFilterMethod = (rows, ids, filterValue) => {
  if (filterValue === undefined || filterValue.length < 1) return rows;

  return rows.filter((row) => {
    return row.original.industry.some((x) => {
      const rowValue = x.name;
      return filterValue.includes(rowValue);
    });
  });
};

export function IndustryColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  let options = new Set();
  preFilteredRows.forEach((row) => {
    row.original.industry.forEach((x) => {
      options.add(x.name ? x.name : null);
    });
  });

  options = [...options].sort();
  options = options.map((x) => {
    return { text: x, value: x, key: x };
  });

  const onChange = (e, values) => {
    const { value } = values;
    setFilter(value);
  };

  return (
    <React.Fragment>
      <Dropdown
        placeholder="Select Industry"
        fluid
        multiple
        selection
        options={options}
        onChange={onChange}
        value={filterValue}
      />
    </React.Fragment>
  );
}
