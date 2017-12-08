import React from 'react'
import './styles.css';

import { Grid, Cell } from "react-md/lib/Grids";
import { SelectField } from "react-md/lib/SelectFields";
import { Card, CardTitle, CardText } from 'react-md';
import './styles.scss';

const SEARCH_VALUE = ['patients', 'bmi', 'visits', 'visitsrel', 'patientsrel', 'smoker'];
const YEARS = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000'];
const GENDERS = ['m', 'w'];

export default class SearchInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="search">
        <Card className="md-block-centered">
          <CardTitle subtitle="Enter search parameter"/>
            <SelectField
              id="select-field-1"
              placeholder="Search Value"
              className="md-cell"
              menuItems={SEARCH_VALUE}
              position={SelectField.Positions.BELOW}
            />
            <SelectField
              id="select-field-2"
              placeholder="Year"
              className="md-cell"
              menuItems={YEARS}
              position={SelectField.Positions.BELOW}
            />
            <SelectField
              id="select-field-2"
              placeholder="Gender"
              className="md-cell"
              menuItems={GENDERS}
              position={SelectField.Positions.BELOW}
            />
        </Card>


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
};
