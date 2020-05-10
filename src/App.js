import React, { useState, useEffect } from "react";
import MediaQuery from 'react-responsive'
import { Card, Button, CardImg, CardTitle, CardText, CardDeck, CardSubtitle, CardBody } from 'reactstrap';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import LinearGradient from './LinearGradient.js';
import './App.css';
import './index.css'

/**
* Courtesy: https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json
* Looking topojson for other countries/world?
* Visit: https://github.com/markmarkoh/datamaps
*/

const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 600,
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

const geographyStyle = {
  default: {
    outline: 'none',
    border: '5px'
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

function App() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState([]);
    const [Confirmed, setConfirmed] = useState();
      const [deaths, setdeaths] = useState();
      const [recovered, setrecovered] = useState();
      const [active, setactive] = useState();
      const [name, setname] = useState();
      const [Ts, setTs] = useState();
      const [ConfirmedI, setConfirmedI] = useState();
        const [deathsI, setdeathsI] = useState();
        const [recoveredI, setrecoveredI] = useState();
        const [activeI, setactiveI] = useState();
        const [nameI, setnameI] = useState();





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
      setTooltipContent(`${geo.properties.st_nm}: ${current.value}`);
setConfirmed(`${current.value}`)
setdeaths(`${current.deaths}`)
setrecovered(`${current.recovered}`)
setactive(`${current.active}`)
setname(`${current.state}`==='Jammu and Kashmir'?'J&K':`${current.state}`==='Dadra and Nagar Haveli'?'Dadra':`${current.state}`)
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
    setConfirmed(ConfirmedI)
    setdeaths(deathsI)
    setrecovered(recoveredI)
    setactive(activeI)

    setname('India')

  };

  const onChangeButtonClick = () => {
    setData([
      { id: 'AP', state: 'Andhra Pradesh', value: 2}]);
  };



  React.useEffect(() => {
   fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise')
     .then(res => res.json())
     .then(d => {
       console.log(d.data.total);
       setConfirmed(d.data.total.confirmed)
       setdeaths(d.data.total.deaths)
       setrecovered(d.data.total.recovered)
       setactive(d.data.total.active)
       setname('India')
       setTs(d.data.lastRefreshed)
       setConfirmedI(d.data.total.confirmed)
       setdeathsI(d.data.total.deaths)
       setrecoveredI(d.data.total.recovered)
       setactiveI(d.data.total.active)
       setname('India')
setData(List(d));

     });
 }, []);



  return (
    <div className="container" style={{ backgroundColor: "#ffffff"}}>
    <div className="full-width-height container" >
      <div className="card-body">
      <h5 className="card-title"  style={{fontFamily:"Bree Serif" ,color:'#333333'}}><center><b>COVID-19 INDIA STATUS</b></center></h5>


      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <div className="container">

      <div className="row justify-content-center" >

      <Card onClick={onChangeButtonClick} style={{ width: '18%',backgroundColor: "#e6e6ff",overflow:'hidden',fontsize:'10px',whiteSpace: 'pre-wrap', display: 'block', padding: "20px", border: 'none',color: "#6666ff",fontFamily: "Bree Serif", fontWeight: 'bold'}}  >
<center maxLine='1' >{name}</center>
</Card>

      <Card style={{ width: '10%',backgroundColor: "#ffe0b3",padding: "10px", border: 'none',color: "#cc7a00",fontFamily: "Bree Serif", fontWeight: 'bold'}}>
<center><div >Confirmed</div><div>{Confirmed}</div></center>
</Card>
<Card style={{ width: '10%',backgroundColor: "#ccf2ff",padding: "10px" ,border: 'none',color: "#00ace6",fontFamily: "Bree Serif", fontWeight: 'bold'}}>
<center><div>Active</div><div>{active}</div></center>
</Card>

<Card style={{ width: '10%',backgroundColor: "#ddffcc",padding: "10px",border: 'none',color: "#408000",fontFamily: "Bree Serif", fontWeight: 'bold' }}>
<center><div>Recovered</div><div>{recovered}</div></center>
</Card>
<Card style={{ width: '10%',backgroundColor: "#ffd4cc",padding: "10px",border: 'none',color: "red",fontFamily: "Bree Serif", fontWeight: 'bold' }}>
<center><div>Death</div><div> {deaths}</div></center>
</Card>
<Card style={{ width: '18%',backgroundColor: "#ebebe0",padding: "10px",border: 'none',color: "#7a7a52",fontFamily: "Bree Serif", fontWeight: 'bold' }}>
<center><div>Last Updated</div>21 minutes ago<div> </div></center>
</Card>
</div>
</div>


        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={690}
          height={400}
          data-tip=""
        >

          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                console.log(data.state +" ,"+ geo.properties.name);
                const current = data.find(s => s.state === geo.properties.st_nm);
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
</div>


  {    /*  <div className="center">
          <button className="mt16" onClick={onChangeButtonClick}>Change</button>
        </div> */}
    </div>
    </div>

  );
}
function List(d) {
var arr = [];
var ress=[];
d.data.statewise.map(ds => (


      arr.push([ds.state,ds.confirmed,ds.deaths,ds.recovered,ds.active])


  ))

  for (var i = 0; i < arr.length; i++) {

    if(arr[i][0]==='Maharashtra')
    {
      ress.push({ id: 'MH', state: 'Maharashtra', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Tamil Nadu')
    {
      ress.push({ id: 'TN', state: 'Tamil Nadu', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Kerala')
    {
      ress.push({ id: 'KL', state: 'Kerala', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Madhya Pradesh')
    {
      ress.push({ id: 'MP', state: 'Madhya Pradesh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Delhi')
    {
      ress.push({ id: 'DL', state: 'Delhi', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Karnataka')
    {
      ress.push({ id: 'KA', state: 'Karnataka', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Rajasthan')
    {
      ress.push({ id: 'RJ', state: 'Rajasthan', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Chhattisgarh')
    {
      ress.push({ id: 'CT', state: 'Chhattisgarh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Telangana')
    {
      ress.push({ id: 'TS', state: 'Telangana', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Uttar Pradesh')
    {
      ress.push({ id: 'UP', state: 'Uttar Pradesh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Odisha')
    {
      ress.push({ id: 'OD', state: 'Odisha', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Jharkhand')
    {
      ress.push({ id: 'JH', state: 'Jharkhand', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Punjab')
    {
      ress.push({ id: 'PB', state: 'Punjab', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Gujarat')
    {
      ress.push({ id: 'GJ', state: 'Gujarat', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

    }
    else if(arr[i][0]==='Manipur')
   {
     ress.push({ id: 'MN', state: 'Manipur', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Meghalaya')
   {
     ress.push({ id: 'ML', state: 'Meghalaya', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Mizoram')
   {
     ress.push({ id: 'MZ', state: 'Mizoram', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   } else if(arr[i][0]==='Nagaland')
   {
     ress.push({ id: 'NL', state: 'Nagaland', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }

   else if(arr[i][0]==='Andhra Pradesh')
   {
     ress.push({ id: 'AP', state: 'Andhra Pradesh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='West Bengal')
   {
     ress.push({ id: 'WB', state: 'West Bengal', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Jammu and Kashmir')
   {
     ress.push({ id: 'JK', state: 'Jammu and Kashmir', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Himachal Pradesh')
   {
     ress.push({ id: 'HP', state: 'Himachal Pradesh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Haryana')
   {
     ress.push({ id: 'HR', state: 'Haryana', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Uttarakhand')
   {
     ress.push({ id: 'UK', state: 'Uttarakhand', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Bihar')
   {
     ress.push({ id: 'BR', state: 'Bihar', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Tripura')
   {
     ress.push({ id: 'TR', state: 'Tripura', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Assam')
   {
     ress.push({ id: 'AS', state: 'Assam', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Goa')
   {
     ress.push({ id: 'GA', state: 'Goa', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Sikkim')
   {
     ress.push({ id: 'SK', state: 'Sikkim', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Arunachal Pradesh')
   {
     ress.push({ id: 'AR', state: 'Arunachal Pradesh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Ladakh')
   {
     ress.push({ id: 'LD', state: 'Ladakh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }


   else if(arr[i][0]==='Dadra and Nagar Haveli')
   {

     ress.push({ id: 'DDd', state: 'Dadra and Nagar Haveli', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }
   else if(arr[i][0]==='Chandigarh')
   {

     ress.push({ id: 'DDd', state: 'Chandigarh', value: arr[i][1],deaths :arr[i][2],recovered:arr[i][3],active:arr[i][4]})

   }

}

  if (true) {

/*console.log(ress)*/
      return ress;
  }


}


export default App;
