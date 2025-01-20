import React, { useRef, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import './CandleStickChart.css';


const CandleStickChart = () => {
  const chartRef = useRef(); //Main chart
  const currentChartRef = useRef();  //currentChartRef made to stop creating multiple charts
  const candleChartRef = useRef(); //Candles
  const volumeChartRef = useRef(); // Volume


  const [cryptoInput, setCryptoInput] = useState('BTCUSDT');
  useEffect(() => {
    if (!currentChartRef.current) {
      const chart = createChart(chartRef.current, {
        // Chart customization
        width: 1200,
        height: 800,
        rightPriceScale: {
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
        crosshair: {
          mode: 0, // 0 free , 1 fixed  , 2 hidden
        },
        layout : {
          background: {
            type: 'solid',
            color: '#131722'
          },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0.6)',
          },
        },
      });

      currentChartRef.current = chart;
      candleChartRef.current = chart.addCandlestickSeries();
      volumeChartRef.current = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      chart.priceScale('').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
    }

    // Fetch the default value 'BTCUSDT' after creating the chart
    fetchData();
  });

  // Call fetchData() every 1 second
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(intervalId);
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

        const volumeData = data.map((item) => {
          const open = parseFloat(item[1]);
          const close = parseFloat(item[4]);
          const volume = parseFloat(item[5]);

          return {
            time: item[0] / 1000,
            value: volume,
            color: close < open
              ? 'rgba(255, 82, 82, 0.8)'      // red if close < open
              : 'rgba(23, 145, 132, 0.8)',     // green if close >= open
          };
        });

        candleChartRef.current.setData(parsedData); // adding the data to the Candleseries
        volumeChartRef.current.setData(volumeData); // adding volueme data to the chart
      })
      .catch((error) => {
        console.error(error); //perventing the error from api to popup,it doesn't fix it
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
