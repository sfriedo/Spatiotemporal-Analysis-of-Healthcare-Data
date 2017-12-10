import React from 'react'
import './styles.css';

import { SelectField } from "react-md/lib/SelectFields";
import { Card, CardTitle } from 'react-md';
import './styles.scss';
import { connect } from "react-redux";
import { requestStateData } from '../actions/apiActions';

const SEARCH_VALUE = ['patients', 'bmi', 'visits', 'visitsrel', 'patientsrel', 'smoker'];
const YEARS = ['NO FILTER', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000'];
const GENDERS = ['NO FILTER', 'M', 'F'];

class SearchInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = { search: SEARCH_VALUE[0], year: YEARS[0], gender: GENDERS[0] };
  }

  handleChange = (key, value) => {
    const newState = this.state;
    newState[key] = value;
    this.setState(newState);

    this.props.requestStateData(newState.search, newState.year, newState.gender);
  };

  componentDidMount() {
    this.props.requestStateData(SEARCH_VALUE[0]);
  }

  render() {
    return (
      <div className="search">
        <Card className="md-block-centered">
          <CardTitle title='' subtitle="Enter search parameter"/>
          <SelectField
            id="select-field-1"
            placeholder="Search Value"
            className="md-cell"
            menuItems={SEARCH_VALUE}
            defaultValue={SEARCH_VALUE[0]}
            onChange={this.handleChange.bind(this, 'search')}
            position={SelectField.Positions.BELOW}
          />
          <SelectField
            id="select-field-2"
            placeholder="Year"
            className="md-cell"
            menuItems={YEARS}
            defaultValue={YEARS[0]}
            onChange={this.handleChange.bind(this, 'year')}
            position={SelectField.Positions.BELOW}
          />
          <SelectField
            id="select-field-2"
            placeholder="Gender"
            className="md-cell"
            menuItems={GENDERS}
            defaultValue={GENDERS[0]}
            onChange={this.handleChange.bind(this, 'gender')}
            position={SelectField.Positions.BELOW}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
};

export default connect(mapStateToProps, { requestStateData })(SearchInterface);
