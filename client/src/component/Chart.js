import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import axios from 'axios';
import Cfhart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
import { useActionData } from 'react-router-dom';
Cfhart.register(CategoryScale);

const Chart = (props) => {
    const [barChartData,setBarChartData]=useState([]);
    const [dataSet,setDataSet]=useState([
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(194, 116, 161, 0.5)',
          borderColor: 'rgb(194, 116, 161)',
          data: barChartData
        },
      ],)
    const [data,setData]=useState({
        labels: ["0-100",
        "101-200",
        "201-300",
        "301-400",
        "401-500",
        "501-600",
        "601-700",
        "701-800",
        "801-900",
        "900Above"],
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(194, 116, 161, 0.5)',
            borderColor: 'rgb(194, 116, 161)',
            data: barChartData
          },
        ],
      })

  async function fetchBarChart(){
    await axios.post('/getBarChatData',{month:props.month}).then((res)=>{
        const barChartData=res.data;
        const price=Object.values(barChartData);
        setBarChartData(price)
        setData(prevData=>({
            ...prevData,datasets:[{
                ...prevData.datasets[0],
                data:barChartData,
            }
            ]
        }))

    }).catch((error)=>{
        console.log("Something went wrong")
        console.log(error)
    })
  }
  useEffect(()=>{
    fetchBarChart()
  },[props.month])

  return (
    // <div></div>

    <CDBContainer>
      <h1 className="mt-5 d-flex justify-content-center" style={{paddingTop:"5rem"}}>Bar Chart Stats - {props.month}</h1>
      {<Bar data={data} options={{ responsive: true }} />}
    </CDBContainer>
  );
};

export default Chart;