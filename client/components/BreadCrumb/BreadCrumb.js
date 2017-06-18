import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Breadcrumb from 'react-breadcrumbs'
import classes from './BreadCrumb.scss'


const separatorRender = (
  <i
    className={`fa fa-angle-right ${classes.separator}`}
    aria-hidden='true'
  />
)

const BreadCrumb = ({ location, routes, params }) => {
  if (location.pathname != '/') {
    return (
      <Breadcrumb
        routes={routes}
        params={params}
        displayMissing={false}
        wrapperElement='div'
        itemElement='span'
        wrapperClass={classes.breadcrumb}
        itemClass={classes.item}
        activeItemClass={classes.active}
        separator={separatorRender}
      />
    )
  }

  return (
    <div className={classes.breadcrumb}></div>
  )
}

Breadcrumb.PropTypes = {
  location: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
}

export default BreadCrumb
