import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import { coinObject } from "../functions/convertObject";
import List from "../components/Common/Dashboard/List";
import CoinInfo from "../components/Coin/CoinInfo";
import { getCoinData } from "../functions/getCoinData";
import { getCoinPrices } from "../functions/getCoinPrices";
import LineChart from "../components/Coin/CoinChart";
import SelectDays from "../components/Coin/SelectDays";
import { settingChartData } from "../functions/settingChartData";
import TogglePriceType from "../components/Coin/PriceType";
import Footer from "../components/Common/Footer";
import { useTheme } from "../context/ThemeContext";

const CoinPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coinData, setCoinData] = useState();
  const [days, setDays] = useState(30);
  const [chartData, setChartData] = useState();
  const [priceType, setPriceType] = useState("prices");
  const {darkMode} = useTheme();
  const handlePriceTypeChange = async (event, newType) => {
    setIsLoading(true);
    setPriceType(newType);
    const prices = await getCoinPrices(id, days, newType);
    if(prices.length > 0){
      settingChartData(setChartData, prices);
      setIsLoading(false);
    }
    
  };

  const handleDaysChange = async (e)=>{
    setIsLoading(true);
    setDays(e.target.value);
    const prices = await getCoinPrices(id, e.target.value, priceType);
    if(prices.length > 0){
      settingChartData(setChartData, prices);
      setIsLoading(false);
    }
  }

  // Fetch on mount and whenever the coin in the route changes.
  //
  // The body lives inline rather than calling a getData() helper: the
  // exhaustive-deps rule flags a function declared in the component body and
  // omitted from the dep array, and hoisting it into useCallback would mean
  // either re-fetching on every `days`/`priceType` change (which the two
  // handlers above already handle) or lying about the deps.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const data = await getCoinData(id);

      if (!data || cancelled) return;

      coinObject(setCoinData, data);
      const prices = await getCoinPrices(id, days, priceType);

      // `cancelled` covers the async gap above: navigating to another coin
      // mid-flight would otherwise let the stale response win.
      if (cancelled) return;

      if (prices.length > 0) {
        settingChartData(setChartData, prices);
        setIsLoading(false);
      }
    };

    if (id) load();

    return () => {
      cancelled = true;
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div style={{"display": "flex", "justifyContent": "center"}}>
            <List coin={coinData} />
          </div>
          <div style={{ 
            margin: "1rem 3rem", 
            backgroundColor: darkMode ? "var(--darkgrey)" : "var(--lightgrey)", 
            borderRadius: "20px",
            padding: "1rem",
          }}>
            <SelectDays days={days} handleDaysChange={handleDaysChange} />
            <TogglePriceType priceType={priceType} handlePriceTypeChange={handlePriceTypeChange}/>
            <LineChart chartData={chartData} />
          </div>

          <div className="wrapper">
            <CoinInfo heading={coinData.name} desc={coinData.desc} />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default CoinPage;
