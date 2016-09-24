import React, { PropTypes } from 'react'
import BreadCrumb from '../BreadCrumb'
import MessageBadge from '../../containers/MessageBadge'
import classes from './Toolbar.scss'


const Navbar = ({ location, routes, params }) => (
  <div className={classes.container}>
    <div className={classes.leftWrapper}>
      <BreadCrumb location={location} routes={routes} params={params} />
    </div>
    <div className={classes.rightWrapper}>
      <MessageBadge />
    </div>
  </div>
)

export default Navbar
