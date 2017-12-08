import React from 'react'
import './styles.css';

import { Grid, Cell } from "react-md/lib/Grids";
import { SelectField } from "react-md/lib/SelectFields";

const SEARCH_VALUE = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export default class SearchInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // const select = new MDCSelect(document.querySelector('.mdc-select'));
    // select.listen('MDCSelect:change', () => {
    //   alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
    //     `with value "${select.value}"`);
    // });
  }

  render() {
    return (
      <div>
        <SelectField
          id="select-field-1"
          placeholder="Search Value"
          className="md-cell"
          menuItems={SEARCH_VALUE}
          position={SelectField.Positions.BELOW}
        />

        {/*<Grid className="grid-example">*/}
        {/*<Cell key={0} size={1}>*/}
        {/**/}
        {/*</Cell>*/}
        {/*<Cell key={1} size={1}>4</Cell>*/}
        {/*<Cell key={2} size={1}>4</Cell>*/}
        {/*</Grid>*/}
      </div>
    )
  }
}
