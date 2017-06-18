import React, { PropTypes } from 'react'
import Branding from '../Branding'
import MainMenu from '../../containers/MainMenu'
import SSNLink from '../../components/SSNLink'
import classes from './Navbar.scss'


const Navbar = () => (
  <header className={classes.container}>
    <Branding title='Chen' />
    <SSNLink />
    <MainMenu />
  </header>
)

export default Navbar
