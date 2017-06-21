import React from 'react'
import { Link } from 'react-router'
import headshotImg from '../../static/img/me/cartoon_headshot.png'
import classes from './Branding.scss'


const Branding = ({ title, subtitle }) => {
  return (
    <Link to='/about' className={classes.container}>
      <div className={classes.text}>
        <span className={classes.title}>{title}</span>&nbsp;
        <span className={classes.subtitle}>{subtitle}</span>
      </div>
      <img className={classes.logo} src={headshotImg} />
    </Link>
  )
}

export default Branding
