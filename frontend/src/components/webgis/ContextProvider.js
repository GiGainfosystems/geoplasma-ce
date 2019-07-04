import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default function createContextProvider(context) {
  class ContextProvider extends PureComponent {
    static propTypes = {
      children: PropTypes.node,
    };
    static childContextTypes = {};

    getChildContext() {
      return context;
    }

    render() {
      return this.props.children;
    }
  }

  Object.keys(context).forEach((key) => {
    ContextProvider.childContextTypes[key] = PropTypes.any.isRequired;
  });

  return ContextProvider;
}
