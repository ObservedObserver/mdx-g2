import React, { Component } from 'react';
import {spliter} from './utils/translator.js'
import {dataSource, Dimensions, Measures} from './data/test.js'
import './App.css';
import G2 from '@antv/g2'

class App extends Component {
  constructor () {
    super()
    this.state = {
      mdxString: ''
    }
  }
  componentDidMount () {
    this.chart = new G2.Chart({
      container: 'g2-chart',
      width: 600,
      height: 400,
      padding: [40, 80, 80, 80]
    });
  }
  getMDX = (ev) => {
    console.log(ev.target.value)
    let mdx = ev.target.value
    let words = spliter(mdx)
    this.setState({
      mdxString: (<p>SELECT [<span style={{color: 'red'}}>{words.row}</span>] ON ROW,<br/>
       [<span style={{color: 'green'}}>{words.column}</span>] ON COLUMN <br/>
       FROM [<span style={{color: 'orange'}}>{words.cube}</span>] <br/>
       WHERE [<span style={{color: 'blue'}}>{words.measure}</span>]</p> ),
       g2String: (<p>
        chart.source({words.cube})
        chart.interval().position('{words.row}*{words.measure}').color('{words.column}')
        </p>)
    })
    console.log(spliter(mdx))
    const {row, column, measure, cube} = words
    if (row && column && measure && cube) {
      console.log('render chart')
      
      this.chart.source(dataSource())
      this.chart.facet('rect', {
        fields: [column],
        eachView: function eachView(view) {
          view.interval().position(row + '*' + measure).color(row)
        }
      });
      this.chart.render()
    } else {
      this.chart.clear()
    }
  }
  render() {
    let dims = Object.keys(Dimensions).join(' ; ')
    let meas = Object.keys(Measures).join(' ; ')
    // this.chart.render()
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">MDX to G2</h1>
        </header>
        <p>Cube: dataSource</p>
        <p>维度: {dims}</p>
        <p>度量: {meas}</p>
        <p className="App-intro">
        : )
        </p>
        <h3>Your Mdx:</h3>
        {this.state.mdxString}
        <textarea onChange={this.getMDX} className="App-Input"></textarea>
        <h3>Your Chart:</h3>
        <div id="g2-chart"></div>
      </div>
    );
  }
}

export default App;
