import React from 'react'
import Branding from '../Branding'
import MainMenu from '../../containers/MainMenu'
import classes from './Navbar.scss'


const Navbar = () => (
  <header className={classes.container}>
    <Branding title='Chen' />
    <MainMenu />
  </header>
)

export default Navbar
