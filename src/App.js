import React, { Component } from 'react';
import {parser} from './utils/parser.js'
import {Dimensions, Measures, generateData} from './data/test.js'
import {dataset} from './utils/dataset'
// import HighlightTextarea from './components/hl-textarea'
import './App.css';
import G2 from '@antv/g2'
const dataSource = generateData()
class App extends Component {
  constructor () {
    super()
    this.state = {
      mdxString: '',
      chartTypes: ['bar', 'line', 'stackBar', 'stackLine'],
      choosenType: 'bar',
      words: {},
      hint: ''
    }
    this.dataset = new dataset({dataSource})
  }
  componentDidMount () {
    this.chart = new G2.Chart({
      container: 'g2-chart',
      width: 600,
      height: 400,
      padding: [40, 80, 80, 80]
    });
  }
  renderChart (chartType) {
    const {row = [], column = [], measure = [], cube} = this.state.words
    
    if (row && column && measure && cube) {
      console.log('render chart')
      // let data = dataSource
      console.log(row.concat(column), measure)
      let data = this.dataset.getVisData(row.concat(column), measure)
      console.log(data)
      this.chart.source(data)
      let self = this
      this.chart.facet('rect', {
        fields: [self.dataset.MeasureType, ...row.slice(1).concat(column.slice(1))],
        eachView (view) {
          let geom;
          switch (chartType) {
            case 'bar':
              geom = view.interval().adjust([{
                type: 'dodge',
                marginRatio: 1 / 32
              }]);
              break
            case 'line':
              geom = view.line()
              break
            case 'stackBar':
              geom = view.intervalStack()
              break
            case 'stackLine':
              geom = view.lineStack()
              break
            default: 
              geom = view.interval().adjust([{
                type: 'dodge',
                marginRatio: 1 / 32
              }]);
          }
          geom.position(row[0] + '*' + self.dataset.MeasureValue).color(column[0])
        }
      });
      this.chart.render()
    } else {
      this.chart.clear()
    }
  }
  getMDX = (ev) => {
    // console.log(ev.target.value)
    let mdx = ev.target.value
    let words = parser(mdx)
    console.log('words', words)
    this.setState({
      mdxString: (<p>SELECT [<span style={{color: 'red'}}>{words.row.toString()}</span>] ON ROW,<br/>
       [<span style={{color: 'green'}}>{words.column.toString()}</span>] ON COLUMN <br/>
       FROM [<span style={{color: 'orange'}}>{words.cube}</span>] <br/>
       WHERE [<span style={{color: 'blue'}}>{words.measure.toString()}</span>]</p> ),
      words: words
    })
    
  }

  changeChart = (ev) => {
    let choosenType = ev.target.value
    this.setState({
      choosenType
    })

    this.generateChart(choosenType)
  }

  generateChart = (choosenType) => {
    try {
      this.renderChart(choosenType)
      this.setState({
        hint: 'running'
      })
    } catch (err) {
      console.log(err)
      this.setState({
        hint: 'this is a grammer error on your mdx'
      })
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
        <p>example: select (department) on row, (video) on column from (dataSource) where (profit)</p>
        <h3>Your Mdx:</h3>
        {this.state.mdxString}
        <h3>Debug</h3>
        {this.state.hint}
        <br/>
        <textarea onChange={this.getMDX} className="App-Input"></textarea>
        <div>
          <select value={this.state.choosenType} onChange={this.changeChart}>
          {this.state.chartTypes.map((chart) => {
            return (<option value={chart}>{chart}</option>)
          })}
          </select>
        </div>
       <button onClick={this.generateChart}>Generate Chart</button>
        <h3>Your Chart:</h3>
        <div id="g2-chart"></div>
      </div>
    );
  }
}
// select (department) on row, (video) on column from (dataSource) where (profit)

export default App;
