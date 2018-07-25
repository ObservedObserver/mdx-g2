import React, { Component } from 'react';
import {parser} from './utils/parser.js'
import Chart from './components/mdxChart.js'
import './App.css';
import 'whatwg-fetch'
const HOST = 'http://localhost:2018';
const CubeList = [
  {
    name: 'HemaBI',
    api: '/api/data/hema'
  }
]

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mdx: '',
      mdxString: '',
      chartTypes: ['bar', 'line', 'stackBar', 'stackLine', 'area', 'stackArea'],
      choosenType: 'bar',
      choosenCube: CubeList[0],
      words: {},
      hint: '',
      config: {Dimensions: [], Measures: []},
      dataSource: []
    }
    this.currentLabel = ''
  }
  componentWillMount () {
    this.getData(CubeList[0])
  }
  getData = (choosenCube) => {
    let self = this
    fetch(HOST + choosenCube.api, {
      method: 'GET'
    }).then((res) => {
      return res.json()
    }).then((res) => {
      console.log(self.setState, this)
      self.setState({
        dataSource: res.dataSource,
        config: res.config
      }, () => {
        console.log('finish', self.state)
      })
      console.log(res.config)
    })
  }

  getMDX = (ev) => {
    let mdx = ev.target.value
    let words = parser(mdx)
    let {rows = [], columns = [], values = [], cube = ''} = words
    this.setState({
      mdx: mdx,
      mdxString: (<p>ROWS: [<span style={{color: '#f5222d'}}>{rows.toString()}</span>]<br/>
       COLUMNS: [<span style={{color: '#52c41a'}}>{columns.toString()}</span>]<br/>
       CUBE [<span style={{color: '#faad14'}}>{cube}</span>] <br/>
       MEASURES: [<span style={{color: '#1890ff'}}>{values.toString()}</span>]</p> ),
      words: words
    })

  }

  changeChart = (ev) => {
    let choosenType = ev.target.value
    this.setState({
      choosenType
    })
  }

  changeCube = (ev) => {
    let choosenCube = CubeList.find((cube) => {
      return cube === ev.target.value
    })
    this.setState({
      choosenCube,
      mdx: ''
    })
    this.getData(choosenCube)
  }

  dragStart = (ev) => {
    this.currentLabel = ev.target.textContent
  }
  allowDrag = (ev) => {
    ev.preventDefault()
  }
  dragDrop = (ev) => {
    ev.stopPropagation()
    let text = this.state.mdx
    let startPos = this.refs.textarea.selectionStart
    let endPos = this.refs.textarea.selectionEnd
    text = text.substring(0, startPos) + '[' +this.currentLabel + ']' + text.substring(endPos, text.length);
    this.setState({
      mdx: text
    })
    this.currentLabel = ''
    this.refs.textarea.focus()
  }
  render() {
    const {Dimensions, Measures} = this.state.config
    let dims = Dimensions.map((dim) => {
      return (<span key={dim} draggable="true" onDragStart={this.dragStart} className="dim-label">{dim}</span>)
    })
    let meas = Measures.map((mea) => {
      return (<span key={mea} draggable="true" onDragStart={this.dragStart} className="mea-label">{mea}</span>)
    })
    let cubes = CubeList.map((cube) => {
      return (<span key={cube.name} draggable="true" onDragStart={this.dragStart} className="cube-label">{cube.name}</span>)
    })
    // this.chart.render()

    return (
      <div className="App" >
        <header className="App-header">
          <h1 className="App-title">MDX to G2</h1>
        </header>
        <div className="App-container">
          <h5>Cube</h5>
          <div className="label-container">
          <select value={this.state.choosenCube} onChange={this.changeCube}>
          {CubeList.map((cube) => {
            return (<option key={cube.name} value={cube.name}>{cube.name}</option>)
          })}
          </select>: {cubes}</div>
          <h5>维度:</h5>
          <div className="label-container">{dims}</div>
          <h5>>度量:</h5>
          <div className="label-container">{meas}</div>
          <br/>
          <p>example: <i>{'select {[department]} on row, {[video]} on column from [dataSource] where {[profit], [count]}'}</i></p>
          <h3>Your Mdx:</h3>
          {this.state.mdxString}
          <h4>Debug: {this.state.hint}</h4>
          <div>
          <textarea ref="textarea" onDrop={this.dragDrop} onDragOver={this.allowDrag} onChange={this.getMDX} className="App-Input" value={this.state.mdx}></textarea>
          </div>
          <div>
            <select value={this.state.choosenType} onChange={this.changeChart}>
            {this.state.chartTypes.map((chart) => {
              return (<option key={chart} value={chart}>{chart}</option>)
            })}
            </select>
          </div>
          <h3>Your Chart:</h3>
          <Chart dataSource={this.state.dataSource} mdx={this.state.mdx} />
        </div>
      </div>
    );
  }
}
// select [department] on row, [video] on column from [dataSource] where [profit]

export default App;
