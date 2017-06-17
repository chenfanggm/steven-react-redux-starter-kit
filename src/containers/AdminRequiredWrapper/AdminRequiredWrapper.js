import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as userActions, USER_ENUM } from '../../redux/modules/UserReducer'


class AuthRequiredWrapper extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    unauthorizedRoute: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { isAuthenticated, user } = this.props
    if (!(isAuthenticated && user.user &&
      ([USER_ENUM.ROLE_ADMIN, USER_ENUM.ROLE_OWNER].includes(user.user.role)))) {
      this.props.unauthorizedRoute()
    }
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

const mapStateToProps = (state) => ({
  isAuthenticated : state.user.isAuthenticated,
  user : state.user
})

export default connect(mapStateToProps, userActions)(AuthRequiredWrapper)

