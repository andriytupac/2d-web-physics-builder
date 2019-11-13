import React from 'react';
import PropTypes from 'prop-types';

class Layout extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array,
    ]).isRequired,
  };

  render() {
    return <div className="Main">{this.props.children}</div>;
  }
}

export default Layout;
