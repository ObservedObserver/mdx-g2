import React, { Component } from 'react'
import './hl-textarea.css'

class HighlightTextarea extends Component {
    constructor () {
        super ()
        this.state = {
            value: ''
        }
    }
    valueChange = (ev) => {
        let innerHTML = ev.target.innerHTML
        innerHTML = innerHTML.split(' ').join(';')
        this.setState({
            value: innerHTML
        })
        ev.target.innerHTML = innerHTML
        ev.target.focus()
        ev.target.setSelectionRange(innerHTML.length,innerHTML.length);
        console.log('valueChange', ev.target.innerHTML)
    }
    parseText = (text) => {
        let words = text.split(' ')
        return words.map((word) => {
            return (<div style={{marginTop: '10px', color: 'red'}}>{word}</div>)
        })
    }
    render () {
        return (
            <div>
                <div>{this.parseText(this.props.value)} </div>
            </div>
        )
    }
}

export default HighlightTextarea;