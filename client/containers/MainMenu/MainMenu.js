import React from 'react'
import { connect } from 'react-redux'
import classes from './MainMenu.scss'
import { actions as authActions } from '../../redux/modules/userReducer'


class MainMenu extends React.Component {

  constructor(props) {
    super(props)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  logoutHandler() {
    this.props.logoutUser()
  }

  render() {
    return (
      <nav className={classes.container}>
        <div id='dropdownContainer'
             className={classes.dropdownContainer}>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated
})

export default connect(mapStateToProps,
  Object.assign({}, authActions))(MainMenu)
