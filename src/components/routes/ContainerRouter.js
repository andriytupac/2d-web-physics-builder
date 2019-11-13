import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';

const componentProps = [
  PropTypes.string,
  PropTypes.bool,
  PropTypes.element,
  PropTypes.array,
  PropTypes.func,
  PropTypes.node,
  PropTypes.object,
];

const Component = props => (
  <props.component {...props}>{props.children}</props.component>
);

Component.propTypes = {
  children: PropTypes.oneOfType(componentProps).isRequired,
};

const RouteComponent = withRouter(Component);

class ContainerRouter extends React.PureComponent {
  static propTypes = {
    private: PropTypes.bool,
    exact: PropTypes.bool,
    path: PropTypes.string,
    history: PropTypes.object.isRequired,
    component: PropTypes.oneOfType(componentProps),
    children: PropTypes.oneOfType(componentProps),
  };

  render() {
    /*const isPrivate = this.props.private;
    const isAuth = this.context.auth.isAuthenticated();
    if (isPrivate && !isAuth) {
      return <Redirect to="/" />;
    }*/

    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={props => (
          <RouteComponent {...props} component={this.props.component}>
            {this.props.children}
          </RouteComponent>
        )}
      />
    );
  }
}

export default withRouter(ContainerRouter);
