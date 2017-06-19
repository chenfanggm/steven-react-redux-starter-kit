import React, { PropTypes } from 'react'
import BreadCrumb from '../BreadCrumb'
import classes from './Toolbar.scss'


const Navbar = ({ location, routes, params }) => (
  <div className={classes.container}>
    <div className={classes.leftWrapper}>
      <BreadCrumb location={location} routes={routes} params={params} />
    </div>
    <div className={classes.rightWrapper}>
    </div>
  </div>
)

export default Navbar
