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
    const url = `https://api.binance.com/api/v3/klines?symbol=${cryptoInput.toUpperCase()}&interval=1d&limit=1000`;

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
        onChange={(input) => setCryptoInput(input.target.value)}
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



// list of all coins from binance


// ['BTCUSDT', '1INCHUSDT', 'AAVEUSDT', 'ACMUSDT', 'ADAUSDT', 'ALGOUSDT', 'ALICEUSDT', 'ALPACAUSDT', 'ALPHAUSDT', 'ANKRUSDT', 'ARDRUSDT', 'ARPAUSDT', 'ARUSDT', 'ASRUSDT', 'ATAUSDT', 'ATMUSDT', 'ATOMUSDT', 'AUDIOUSDT', 'AVAUSDT', 'AVAXUSDT', 'AXSUSDT', 'BADGERUSDT', 'BAKEUSDT', 'BALUSDT', 'BANDUSDT', 'BATUSDT', 'BCHUSDT', 'BELUSDT', 'BNTUSDT', 'BURGERUSDT', 'C98USDT', 'CAKEUSDT', 'CELOUSDT', 'CELRUSDT', 'CFXUSDT', 'CHRUSDT', 'CHZUSDT', 'CKBUSDT', 'CLVUSDT', 'COMPUSDT', 'COSUSDT', 'COTIUSDT', 'CRVUSDT', 'CTKUSDT', 'CTSIUSDT', 'CTXCUSDT', 'CVCUSDT', 'DASHUSDT', 'DATAUSDT', 'DCRUSDT', 'DEGOUSDT', 'DENTUSDT', 'DEXEUSDT', 'DGBUSDT', 'DIAUSDT', 'DODOUSDT', 'DOGEUSDT', 'DOTUSDT', 'DUSKUSDT', 'EGLDUSDT', 'ENJUSDT', 'EOSUSDT', 'ERNUSDT', 'ETCUSDT', 'EURUSDT', 'FARMUSDT', 'FETUSDT', 'FILUSDT', 'FIOUSDT', 'FIROUSDT', 'FISUSDT', 'FLMUSDT', 'FLOWUSDT', 'FORTHUSDT', 'FTTUSDT', 'FUNUSDT', 'GRTUSDT', 'GTCUSDT', 'HARDUSDT', 'HBARUSDT', 'HIVEUSDT', 'HOTUSDT', 'ICPUSDT', 'ICXUSDT', 'INJUSDT', 'IOSTUSDT', 'IOTAUSDT', 'IOTXUSDT', 'JSTUSDT', 'JUVUSDT', 'KAVAUSDT', 'KMDUSDT', 'KNCUSDT', 'KSMUSDT', 'LINAUSDT', 'LINKUSDT', 'LITUSDT', 'LPTUSDT', 'LRCUSDT', 'LSKUSDT', 'LTCUSDT', 'LTOUSDT', 'LUNAUSDT', 'MANAUSDT', 'MASKUSDT', 'MBLUSDT', 'MDTUSDT', 'MINAUSDT', 'MKRUSDT', 'MLNUSDT', 'MTLUSDT', 'NEARUSDT', 'NEOUSDT', 'NMRUSDT', 'NULSUSDT', 'OGNUSDT', 'OGUSDT', 'OMUSDT', 'ONEUSDT', 'ONGUSDT', 'ONTUSDT', 'OXTUSDT', 'PAXGUSDT', 'PERPUSDT', 'PHAUSDT', 'PONDUSDT', 'PSGUSDT', 'PUNDIXUSDT', 'QNTUSDT', 'QTUMUSDT', 'QUICKUSDT', 'RAYUSDT', 'RIFUSDT', 'RLCUSDT', 'ROSEUSDT', 'RSRUSDT', 'RUNEUSDT', 'RVNUSDT', 'SANDUSDT', 'SCUSDT', 'SFPUSDT', 'SHIBUSDT', 'SKLUSDT', 'SLPUSDT', 'SNXUSDT', 'SOLUSDT', 'STMXUSDT', 'STORJUSDT', 'STPTUSDT', 'STRAXUSDT', 'STXUSDT', 'SUNUSDT', 'SUPERUSDT', 'SUSHIUSDT', 'SXPUSDT', 'TFUELUSDT', 'THETAUSDT', 'TKOUSDT', 'TLMUSDT', 'TRBUSDT', 'TROYUSDT', 'TRUUSDT', 'TRXUSDT', 'TUSDUSDT', 'TWTUSDT', 'UMAUSDT', 'UNIUSDT', 'USDCUSDT', 'UTKUSDT', 'VETUSDT', 'VITEUSDT', 'VTHOUSDT', 'WANUSDT', 'WINGUSDT', 'WINUSDT', 'XLMUSDT', 'XRPUSDT', 'XTZUSDT', 'XVGUSDT', 'XVSUSDT', 'YFIUSDT', 'ZECUSDT', 'ZENUSDT', 'ZILUSDT', 'ZRXUSDT', 'BNBUSDT', 'ETHUSDT', 'NKNUSDT', 'BARUSDT', 'MBOXUSDT', 'REQUSDT', 'GHSTUSDT', 'WAXPUSDT', 'GNOUSDT', 'XECUSDT', 'ELFUSDT', 'DYDXUSDT', 'IDEXUSDT', 'VIDTUSDT', 'USDPUSDT', 'GALAUSDT', 'ILVUSDT', 'YGGUSDT', 'SYSUSDT', 'DFUSDT', 'FIDAUSDT', 'AGLDUSDT', 'RADUSDT', 'BETAUSDT', 'RAREUSDT', 'LAZIOUSDT', 'CHESSUSDT', 'ADXUSDT', 'AUCTIONUSDT', 'BNXUSDT', 'MOVRUSDT', 'CITYUSDT', 'ENSUSDT', 'QIUSDT', 'PORTOUSDT', 'POWRUSDT', 'JASMYUSDT', 'AMPUSDT', 'PYRUSDT', 'ALCXUSDT', 'SANTOSUSDT', 'BICOUSDT', 'FLUXUSDT', 'FXSUSDT', 'VOXELUSDT', 'HIGHUSDT', 'CVXUSDT', 'PEOPLEUSDT', 'SPELLUSDT', 'JOEUSDT', 'ACHUSDT', 'IMXUSDT', 'GLMRUSDT', 'LOKAUSDT', 'SCRTUSDT', 'API3USDT', 'BTTCUSDT', 'ACAUSDT', 'XNOUSDT', 'WOOUSDT', 'ALPINEUSDT', 'TUSDT', 'ASTRUSDT', 'GMTUSDT', 'KDAUSDT', 'APEUSDT', 'BSWUSDT', 'BIFIUSDT', 'STEEMUSDT', 'NEXOUSDT', 'REIUSDT', 'LDOUSDT', 'OPUSDT', 'LEVERUSDT', 'STGUSDT', 'LUNCUSDT', 'GMXUSDT', 'POLYXUSDT', 'APTUSDT', 'OSMOUSDT', 'HFTUSDT', 'PHBUSDT', 'HOOKUSDT', 'MAGICUSDT', 'HIFIUSDT', 'RPLUSDT', 'PROSUSDT', 'GNSUSDT', 'SYNUSDT', 'VIBUSDT', 'SSVUSDT', 'LQTYUSDT', 'AMBUSDT', 'USTCUSDT', 'GASUSDT', 'GLMUSDT', 'PROMUSDT', 'QKCUSDT', 'UFTUSDT', 'IDUSDT', 'ARBUSDT', 'RDNTUSDT', 'WBTCUSDT', 'EDUUSDT', 'SUIUSDT', 'AERGOUSDT', 'PEPEUSDT', 'FLOKIUSDT', 'ASTUSDT', 'SNTUSDT', 'COMBOUSDT', 'MAVUSDT', 'PENDLEUSDT', 'ARKMUSDT', 'WBETHUSDT', 'WLDUSDT', 'FDUSDUSDT', 'SEIUSDT', 'CYBERUSDT', 'ARKUSDT', 'CREAMUSDT', 'IQUSDT', 'NTRNUSDT', 'TIAUSDT', 'MEMEUSDT', 'ORDIUSDT', 'BEAMXUSDT', 'PIVXUSDT', 'VICUSDT', 'BLURUSDT', 'VANRYUSDT', 'AEURUSDT', 'JTOUSDT', '1000SATSUSDT', 'BONKUSDT', 'ACEUSDT', 'NFPUSDT', 'AIUSDT', 'XAIUSDT', 'MANTAUSDT', 'ALTUSDT', 'JUPUSDT', 'PYTHUSDT', 'RONINUSDT', 'DYMUSDT', 'PIXELUSDT', 'STRKUSDT', 'PORTALUSDT', 'PDAUSDT', 'AXLUSDT', 'WIFUSDT', 'METISUSDT', 'AEVOUSDT', 'BOMEUSDT', 'ETHFIUSDT', 'ENAUSDT', 'WUSDT', 'TNSRUSDT', 'SAGAUSDT', 'TAOUSDT', 'OMNIUSDT', 'REZUSDT', 'BBUSDT', 'NOTUSDT', 'IOUSDT', 'ZKUSDT', 'LISTAUSDT', 'ZROUSDT', 'GUSDT', 'BANANAUSDT', 'RENDERUSDT', 'TONUSDT', 'DOGSUSDT', 'EURIUSDT', 'SLFUSDT', 'POLUSDT', 'NEIROUSDT', 'TURBOUSDT', '1MBABYDOGEUSDT', 'CATIUSDT', 'HMSTRUSDT', 'EIGENUSDT', 'SCRUSDT', 'BNSOLUSDT', 'LUMIAUSDT', 'KAIAUSDT', 'COWUSDT', 'CETUSUSDT', 'PNUTUSDT', 'ACTUSDT', 'USUALUSDT', 'THEUSDT', 'ACXUSDT', 'ORCAUSDT', 'MOVEUSDT', 'MEUSDT', 'VELODROMEUSDT', 'VANAUSDT', '1000CATUSDT', 'PENGUUSDT', 'BIOUSDT', 'DUSDT', 'AIXBTUSDT', 'CGPTUSDT', 'COOKIEUSDT', 'SUSDT', 'SOLVUSDT', 'TRUMPUSDT']










