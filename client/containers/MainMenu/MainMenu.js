import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classes from './MainMenu.scss'
import { Menu, Dropdown, Icon } from 'antd'
import { actions as authActions } from '../../redux/modules/UserReducer'


class MainMenu extends React.Component {

  constructor(props) {
    super(props)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  getDropdownContainer() {
    return $('#dropdownContainer')[0]
  }

  logoutHandler() {
    this.props.logoutUser()
  }

  render() {
    const { isAuthenticated } = this.props
    const { showLoginModal, showMessageModal } = this.props

    const authItem = isAuthenticated ? (
      <Menu.Item key='navbarAuth'>
        <a onClick={this.logoutHandler}>
          <i className='fa fa-pencil-square-o' aria-hidden='true'></i>&nbsp;
          LOG OUT
        </a>
      </Menu.Item>
    ) : (
      <Menu.Item key='navbarAuth'>
        <a onClick={showLoginModal}>
          <i className='fa fa-pencil-square-o' aria-hidden='true'></i>&nbsp;
          LOGIN / REGISTER
        </a>
      </Menu.Item>
    )

    const menu = (
      <Menu className={classes.dropdownMenu}>
        {authItem}
        <Menu.Divider />
        <Menu.Item key='navbarHome'>
          <Link to='/'>
            <i className='fa fa-home' aria-hidden='true'></i>&nbsp;
            home
          </Link>
        </Menu.Item>
        <Menu.Item key='navbarAbout'>
          <Link to='/about'>
            <i className='fa fa-at' aria-hidden='true'></i>&nbsp;
            about.
          </Link>
        </Menu.Item>
        <Menu.Item key='navbarMessage'>
          <a onClick={showMessageModal}>
            <i className='fa fa-commenting-o' aria-hidden='true'></i>&nbsp;
            message
          </a>
        </Menu.Item>
      </Menu>
    )

    return (
      <nav className={classes.container}>
        <Dropdown overlay={menu}
                  trigger={['click']}
                  getPopupContainer={this.getDropdownContainer}>
          <a href=''>
            <Icon type='down' /> MENU
          </a>
        </Dropdown>
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
