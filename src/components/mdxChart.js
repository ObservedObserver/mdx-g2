import React, { Component } from 'react';
import {parser} from '../utils/parser.js'


import {dataset} from '../utils/dataset'

import G2 from '@antv/g2'
let chartId = 0;
function getChartId () {
    return 'mdx-chart-' + chartId++;
}
class mdxChart extends Component {
  constructor (props) {
    super(props)
    const { dataSource = [], mdx = '', chartType = 'bar' } = props
    // this.state = {
    //   chartTypes: ['bar', 'line', 'stackBar', 'stackLine', 'area', 'stackArea'],
    //   choosenType: 'bar',
    //   words: {},
    //   hint: ''
    // }
    this.chartId = getChartId()
    this.chartType = chartType
    this.dataSource = dataSource
    this.words = parser(mdx)
    this.dataset = new dataset({dataSource: dataSource})
  }
  
  componentDidMount () {
    const { height = 400 } = this.props
    this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        height,
        padding: [40, 40, 60, 40]
    });
    this.renderChart()
  }

  componentWillReceiveProps (nextProps) {
      console.log(nextProps)
    const { dataSource = [], mdx = '' } = nextProps
    this.words = parser(mdx)
    this.dataSource = dataSource
    this.dataset = new dataset({dataSource})
    this.renderChart()
  }

  renderChart () {
    const { rows = [], columns = [], values = [], cube = 'default' } = this.words
    const sampleData = this.dataSource[0]
    console.log('render', this.words)
    let self = this
    let data
    if (rows.length > 0 && columns.length > 0 && values.length > 0) {
        console.log(rows, columns, values)
        // 完整的mdx，包含row，column，value
        // data = this.dataset.getVisData(rows.concat(columns), values)

        if (typeof sampleData[rows[0]] === 'number' && typeof sampleData[columns[0]] === 'number') {

            // this.chartType = 'point'
            // select {[lastweek_avg_sale_amount_1d]} on row, {[avg_sale_amount_1d]} on column from [HemaBI] where {[area]}

            data = this.dataSource
            console.log(data)
            console.log('scatter', sampleData, rows, columns)
            this.chart.source(data)
            this.renderViews({
                facetFields: [...values.slice(1)],
                dimensions: rows,
                measures: columns,
                colors: values,
                chartType: 'point'
            })
        } else {
            data = this.dataset.getVisData(rows.concat(columns), values)
            this.chart.source(data)
            this.renderViews({
                facetFields: [self.dataset.MeasureType, ...rows.slice(1).concat(columns.slice(1))],
                dimensions: rows,
                measures: [self.dataset.MeasureValue],
                colors: columns,
                chartType: self.chartType
            })
        }

        this.chart.render()

    } else if (rows.length > 0 && columns.length > 0 && values.length === 0) {
        // 不含value，将 value置于row或column
        let dimRow, meaColumn;

        if (typeof sampleData[columns[0]] === 'number') {
            [dimRow, meaColumn] = [rows, columns]
        } else {
            [dimRow, meaColumn] = [columns, rows]
            this.chart.coord().transpose().scale(1, -1);
        }

        data = this.dataset.getVisData(dimRow, meaColumn)
        this.chart.source(data)
        this.renderViews({
            facetFields: [self.dataset.MeasureType, ...dimRow.slice(1)],
            dimensions: dimRow,
            measures: [self.dataset.MeasureValue],
            colors: dimRow,
            chartType: self.chartType
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
          case 'point':
            geom = view.point()
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

  render() {
      
    return (
      <div>
          <div id={this.chartId}></div>
      </div>
    );
  }
}
export default mdxChart;
