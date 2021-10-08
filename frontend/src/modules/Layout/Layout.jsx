import React from "react";
import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import { withRouter } from "react-router-dom";
import DesktopContainer from './DesktopContainer'
import MobileContainer from './MobileContainer'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    computer: 768,
  },
})

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <Media greaterThan="mobile">
      <DesktopContainer>{children}</DesktopContainer>
    </Media>
    <Media at="mobile">
      <MobileContainer>{children}</MobileContainer>
    </Media>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

class CustomLayout extends React.Component {
  render() {    
    return (
      <ResponsiveContainer>
        {this.props.children}
      </ResponsiveContainer>
    );
  }
}

export default withRouter(
  CustomLayout
);
