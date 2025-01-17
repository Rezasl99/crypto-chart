import React, { useRef, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import './CandleStickChart.css';


const CandleStickChart = () => {
  const chartRef = useRef(); //Main chart
  const currentChartRef = useRef();  //currentChartRef made to stop creating multiple charts
  const candleChartRef = useRef(); //Candles


  const [cryptoInput, setCryptoInput] = useState('BTCUSDT');
  useEffect(() => {

    if (!currentChartRef.current) {
      const chart = createChart(chartRef.current, {
        // Chart customization
        width: 1200,
        height: 800,
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
        crosshair: {
          mode: 0, //0 free , 1 fixed  , 2 hidden
        },
      });


      currentChartRef.current = chart;
      candleChartRef.current = chart.addCandlestickSeries();
    }

    //Fetching the default value BTCUSDT after creating the chart
    fetchData();

  });

  //Making request to the API
  const fetchData = () => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${cryptoInput}&interval=1m&limit=1000`;

    axios.get(url)
      .then((response) => {
        const data = response.data;

        const parsedData = data.map((item) => ({
          time: item[0] / 1000,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
        }));

        candleChartRef.current.setData(parsedData); // adding the data to the Candleseries
      })
      .catch((error) => {
        console.error(error); //perventing the error from api to popup
      });
  };

  return (
    <div className='chart-container'>
      <h2>{cryptoInput} Candlestick Chart</h2>
      <input
        type="text"
        value={cryptoInput}
        onChange={(input) => setCryptoInput(input.target.value.toUpperCase())} //it won't get the link without uppercase
        placeholder="Enter Full Crypto.C Name"
        className='chart-input'
      />
      <button onClick={fetchData}>Refetch Data</button>
      <div
        ref={chartRef}
        className='chart'
      />
    </div>
  );
};

export default CandleStickChart;
