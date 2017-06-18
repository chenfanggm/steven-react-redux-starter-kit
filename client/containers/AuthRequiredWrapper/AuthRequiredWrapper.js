import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as userActions } from '../../redux/modules/UserReducer'

class AuthRequiredWrapper extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedIn: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.isLoggedIn({ showLogin: true })
  }

  render() {
    const { children } = this.props

    return (
      <div>
        {children}
      </div>
    )
  }
}

export default connect(null, userActions)(AuthRequiredWrapper)

