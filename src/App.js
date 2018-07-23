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
      mdxCode: '',
      mdxString: '',
      chartTypes: ['bar', 'line', 'stackBar', 'stackLine', 'area', 'stackArea'],
      choosenType: 'bar',
      words: {},
      hint: ''
    }
    this.currentLabel = ''
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
    
    if (row.length && column.length && cube && measure.length) {
      console.log('render chart')
      // let data = dataSource
      console.log(row.concat(column), measure)
      let data = this.dataset.getVisData(row.concat(column), measure)
      console.log(data)
      this.chart.source(data)
      let self = this
      this.renderViews({
        facetFields: [self.dataset.MeasureType, ...row.slice(1).concat(column.slice(1))],
        dimensions: row,
        measures: [self.dataset.MeasureValue],
        colors: column,
        chartType
      })
      this.chart.render()
    } else if (row.length && column.length && cube && !measure.length) {
      let dimRow, meaColumn;
      if (Object.keys(Dimensions).indexOf(row[0]) >= 0) {
        [dimRow, meaColumn] = [row, column]
      } else {
        [dimRow, meaColumn] = [column, row]
      }
      let data = this.dataset.getVisData(dimRow, meaColumn)
      this.chart.source(data)
      let self = this
      this.renderViews({
        facetFields: [self.dataset.MeasureType, ...dimRow.slice(1)], 
        dimensions: dimRow, 
        measures: [self.dataset.MeasureValue], 
        colors: dimRow,
        chartType
      })
      this.chart.render()
    } else {
      this.chart.clear()
    }
  }
  renderViews = ({facetFields, dimensions, measures, colors, chartType}) => {
    this.chart.facet('rect', {
      fields: facetFields,
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
          case 'area':
            geom = view.area()
            break
          case 'stackArea':
            geom = view.areaStack()
            break
          default: 
            geom = view.interval().adjust([{
              type: 'dodge',
              marginRatio: 1 / 32
            }]);
        }
        geom.position(dimensions[0] + '*' + measures[0]).color(colors[0])
      }
    });
  }
  getMDX = (ev) => {
    // console.log(ev.target.value)
    let mdx = ev.target.value
    let words = parser(mdx)
    let {row = [], column = [], cube = '', measure = []} = words
    console.log('words', words)
    this.setState({
      mdxCode: mdx,
      mdxString: (<p>ROWS: [<span style={{color: '#f5222d'}}>{row.toString()}</span>]<br/>
       COLUMNS: [<span style={{color: '#52c41a'}}>{column.toString()}</span>]<br/>
       CUBE [<span style={{color: '#faad14'}}>{cube}</span>] <br/>
       MEASURES: [<span style={{color: '#1890ff'}}>{measure.toString()}</span>]</p> ),
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
  dragStart = (ev) => {
    console.log(ev.target.textContent)
    this.currentLabel = ev.target.textContent
  }
  allowDrag = (ev) => {
    ev.preventDefault()
  }
  dragDrop = (ev) => {
    console.log('drop', ev)
    ev.stopPropagation()
    let text = this.state.mdxCode
    let startPos = this.refs.textarea.selectionStart
    let endPos = this.refs.textarea.selectionEnd
    text = text.substring(0, startPos) + '[' +this.currentLabel + ']' + text.substring(endPos, text.length);  
    this.setState({
      mdxCode: text
    })
    console.log(text)
    this.currentLabel = ''
    this.refs.textarea.focus()
  }
  render() {
    let dims = Object.keys(Dimensions).map((dim) => {
      return (<span key={dim} draggable="true" onDragStart={this.dragStart} className="dim-label">{dim}</span>)
    })
    let meas = Object.keys(Measures).map((mea) => {
      return (<span key={mea} draggable="true" onDragStart={this.dragStart} className="mea-label">{mea}</span>)
    })
    let cubes = ['dataSource'].map((cube) => {
      return (<span key={cube} draggable="true" onDragStart={this.dragStart} className="cube-label">{cube}</span>)
    })
    // this.chart.render()
    return (
      <div className="App" >
        <header className="App-header">
          <h1 className="App-title">MDX to G2</h1>
        </header>
        <div className="App-container">
          <p>Cube: {cubes}</p>
          <p>维度: {dims}</p>
          <p>度量: {meas}</p>
          <p>example: <i>{'select {[department]} on row, {[video]} on column from [dataSource] where {[profit], [count]}'}</i></p>
          <h3>Your Mdx:</h3>
          {this.state.mdxString}
          <h4>Debug: {this.state.hint}</h4>
          <div>
          <textarea ref="textarea" onDrop={this.dragDrop} onDragOver={this.allowDrag} onChange={this.getMDX} className="App-Input" value={this.state.mdxCode}></textarea>
          </div>
          <div>
            <select value={this.state.choosenType} onChange={this.changeChart}>
            {this.state.chartTypes.map((chart) => {
              return (<option key={chart} value={chart}>{chart}</option>)
            })}
            </select>
          </div>
          <div className="App-button" onClick={this.generateChart} >Generate Chart</div>
          <h3>Your Chart:</h3>
          <div id="g2-chart"></div>
        </div>
      </div>
    );
  }
}
// select [department] on row, [video] on column from [dataSource] where [profit]

export default App;
