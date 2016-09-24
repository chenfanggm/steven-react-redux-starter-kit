import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Showdown from 'showdown'
import classes from './Scrolls.scss'


const converter = new Showdown.Converter()

const todayThought =
  `
  Tell me what do you want to read now, my friend.
  `

class Scrolls extends React.Component {
  render() {
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <span
            dangerouslySetInnerHTML={{__html: converter.makeHtml(todayThought)}}
          >
          </span>
        </div>
      </div>
    )
  }
}

export default connect(null, null)(Scrolls)
