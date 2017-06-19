import React from 'react'
import classes from './Footer.scss'

const Footer = () => (
  <footer className={classes.container}>
    <div className={classes.topLayer}>
      All Rights Reserved ©2016 Chen Fang
    </div>
    <div className={classes.bottomLayer}>
      <a href='/rss.xml' className={classes.link}>
        Follow Rss&nbsp;
        <i className='fa fa-rss' aria-hidden='true'></i>
      </a>
    </div>
  </footer>
)

export default Footer
