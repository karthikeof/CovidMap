import React, { useState, useEffect } from "react";

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';

import LinearGradient from './LinearGradient.js';
import './App.css';


/**
* Courtesy: https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json
* Looking topojson for other countries/world?
* Visit: https://github.com/markmarkoh/datamaps
*/
const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffd4cc',
  '#ffbeb3',
  '#ffa899',
  '#ff9380',
  '#ff7d66',
  '#ff7d66',
  '#ff5233',
  '#ff3c1a',
  '#b31b00',
  '#660f00'
];

const DEFAULT_COLOR = '#EEE';

const getRandomInt = () => {
  return parseInt(Math.random() * 100);
};

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

// will generate random heatmap data on every call
const getHeatMapData = (d) => {

  return [
    { id: 'AP', state: 'Andhra Pradesh', value: 1 },
    { id: 'AR', state: 'Arunachal Pradesh', value: getRandomInt() },
    { id: 'AS', state: 'Assam', value: getRandomInt() },
    { id: 'BR', state: 'Bihar', value: getRandomInt() },
    { id: 'CT', state: 'Chhattisgarh', value: getRandomInt() },
    { id: 'GA', state: 'Goa', value: 21 },
    { id: 'GJ', state: 'Gujarat', value: 22 },
    { id: 'HR', state: 'Haryana', value: getRandomInt() },
    { id: 'HP', state: 'Himachal Pradesh', value: 24 },
    { id: 'JH', state: 'Jharkhand', value: 26 },
    { id: 'KA', state: 'Karnataka', value: 27 },
    { id: 'KL', state: 'Kerala', value: getRandomInt() },
    { id: 'MP', state: 'Madhya Pradesh', value: getRandomInt() },
    { id: 'MH', state: 'Maharashtra', value: getRandomInt() },
    { id: 'MN', state: 'Manipur', value: getRandomInt() },
    { id: 'ML', state: 'Meghalaya', value: 59 },
    { id: 'MZ', state: 'Mizoram', value: getRandomInt() },
    { id: 'NL', state: 'Nagaland', value: 59 },
    { id: 'OR', state: 'Odisha', value: 59 },
    { id: 'PB', state: 'Punjab', value: getRandomInt() },
    { id: 'RJ', state: 'Rajasthan', value: getRandomInt() },
    { id: 'SK', state: 'Sikkim', value: getRandomInt() },
    { id: 'TN', state: 'Tamil Nadu', value: getRandomInt() },
    { id: 'TG', state: 'Telangana', value: getRandomInt() },
    { id: 'TR', state: 'Tripura', value: 14 },
    { id: 'UT', state: 'Uttarakhand', value: getRandomInt() },
    { id: 'UP', state: 'Uttar Pradesh', value: 15 },
    { id: 'WB', state: 'West Bengal', value: 17 },
    { id: 'WB', state: 'West Bengal', value: 17 },
    { id: 'AN', state: 'Andaman and Nicobar Islands', value: getRandomInt() },
    { id: 'CH', state: 'Chandigarh', value: getRandomInt() },
    { id: 'DN', state: 'Dadra and Nagar Haveli', value: 19 },
    { id: 'DD', state: 'Daman and Diu', value: 20 },
    { id: 'DL', state: 'Delhi', value: 59 },
    { id: 'JK', state: 'Jammu and Kashmir', value: 25 },
    { id: 'LA', state: 'Ladakh', value: getRandomInt() },
    { id: 'LD', state: 'Lakshadweep', value: getRandomInt() },
    { id: 'AP', state: 'Puducherry', value: 1 }
  ];
};

function App() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [commitHistory, setCommitHistory] = useState([]);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);

  const [data, setData] = useState([]);


  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData([
      { id: 'AP', state: 'Andhra Pradesh', value: 2}]);
  };



  React.useEffect(() => {
   fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise')
     .then(res => res.json())
     .then(d => {
       const {name} = d;


setData(List(d));

     });
 }, []);



  return (
    <div className="full-width-height container">
      <h5 className="no-margin center">COVID-19 India</h5>

      <ReactTooltip>{tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={600}
          height={220}
          data-tip=""
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                //console.log(geo.id);
                const current = data.find(s => s.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={onMouseEnter(geo, current)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              })

            }
          </Geographies>
        </ComposableMap>
        <LinearGradient data={gradientData} />




        <div className="center">
          <button className="mt16" onClick={onChangeButtonClick}>Change</button>
        </div>
    </div>
  );
}
function List(d) {
var arr = [];
var ress=[];
d.data.statewise.map(ds => (


      arr.push([ds.state,ds.confirmed])


  ))

  for (var i = 0; i < arr.length; i++) {

    if(arr[i][0]==='Maharashtra')
    {
      ress.push({ id: 'MH', state: 'Maharashtra', value: arr[i][1]})

    }
    else if(arr[i][0]==='Tamil Nadu')
    {
      ress.push({ id: 'TN', state: 'Tamil Nadu', value: arr[i][1]})

    }
    else if(arr[i][0]==='Kerala')
    {
      ress.push({ id: 'KL', state: 'Kerala', value: arr[i][1]})

    }
    else if(arr[i][0]==='Madhya Pradesh')
    {
      ress.push({ id: 'MP', state: 'Madhya Pradesh', value: arr[i][1]})

    }
    else if(arr[i][0]==='Delhi')
    {
      ress.push({ id: 'DL', state: 'Delhi', value: arr[i][1]})

    }
    else if(arr[i][0]==='Karnataka')
    {
      ress.push({ id: 'KA', state: 'Karnataka', value: arr[i][1]})

    }
    else if(arr[i][0]==='Rajasthan')
    {
      ress.push({ id: 'RJ', state: 'Rajasthan', value: arr[i][1]})

    }
    else if(arr[i][0]==='Chhattisgarh')
    {
      ress.push({ id: 'CT', state: 'Chhattisgarh', value: arr[i][1]})

    }
    else if(arr[i][0]==='Telangana')
    {
      ress.push({ id: 'TS', state: 'Telangana', value: arr[i][1]})

    }
    else if(arr[i][0]==='Uttar Pradesh')
    {
      ress.push({ id: 'UP', state: 'Uttar Pradesh', value: arr[i][1]})

    }
    else if(arr[i][0]==='Odisha')
    {
      ress.push({ id: 'OD', state: 'Odisha', value: arr[i][1]})

    }
    else if(arr[i][0]==='Jharkhand')
    {
      ress.push({ id: 'JH', state: 'Jharkhand', value: arr[i][1]})

    }
    else if(arr[i][0]==='Punjab')
    {
      ress.push({ id: 'PB', state: 'Punjab', value: arr[i][1]})

    }
    else if(arr[i][0]==='Gujarat')
    {
      ress.push({ id: 'GJ', state: 'Gujarat', value: arr[i][1]})

    }
    else if(arr[i][0]==='Manipur')
   {
     ress.push({ id: 'MN', state: 'Manipur', value: arr[i][1]})

   }
   else if(arr[i][0]==='Meghalaya')
   {
     ress.push({ id: 'ML', state: 'Meghalaya', value: arr[i][1]})

   }
   else if(arr[i][0]==='Mizoram')
   {
     ress.push({ id: 'MZ', state: 'Mizoram', value: arr[i][1]})

   } else if(arr[i][0]==='Nagaland')
   {
     ress.push({ id: 'NL', state: 'Nagaland', value: arr[i][1]})

   }

   else if(arr[i][0]==='Andhra Pradesh')
   {
     ress.push({ id: 'AP', state: 'Andhra Pradesh', value: arr[i][1]})

   }
   else if(arr[i][0]==='West Bengal')
   {
     ress.push({ id: 'WB', state: 'West Bengal', value: arr[i][1]})

   }
   else if(arr[i][0]==='Jammu and Kashmir')
   {
     ress.push({ id: 'JK', state: 'Telangana', value: arr[i][1]})

   }
   else if(arr[i][0]==='Himachal Pradesh')
   {
     ress.push({ id: 'HP', state: 'Himachal Pradesh', value: arr[i][1]})

   }
   else if(arr[i][0]==='Haryana')
   {
     ress.push({ id: 'HR', state: 'Haryana', value: arr[i][1]})

   }
   else if(arr[i][0]==='Uttarakhand')
   {
     ress.push({ id: 'UK', state: 'Uttarakhand', value: arr[i][1]})

   }
   else if(arr[i][0]==='Bihar')
   {
     ress.push({ id: 'BR', state: 'Bihar', value: arr[i][1]})

   }
   else if(arr[i][0]==='Tripura')
   {
     ress.push({ id: 'TR', state: 'Tripura', value: arr[i][1]})

   }
   else if(arr[i][0]==='Assam')
   {
     ress.push({ id: 'AS', state: 'Assam', value: arr[i][1]})

   }
   else if(arr[i][0]==='Goa')
   {
     ress.push({ id: 'GA', state: 'Goa', value: arr[i][1]})

   }
   else if(arr[i][0]==='Sikkim')
   {
     ress.push({ id: 'SK', state: 'Sikkim', value: arr[i][1]})

   }
   else if(arr[i][0]==='Arunachal Pradesh')
   {
     ress.push({ id: 'AR', state: 'Arunachal Pradesh', value: arr[i][1]})

   }

}

  if (true) {

console.log(ress)
      return ress;
  }





}


export default App;
