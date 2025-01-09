
import "./BookingDataChart.css"
import Supplementaries from '../../SupplementaryClass'
import { Bar } from "react-chartjs-2";
import BarChart from '../GlobalComponents/BarChart/BarChart'
import axios from "axios";
import { useEffect } from "react";



const BookingDataChart = (props:any) => {
    let x = Supplementaries.generateDateRanges(1);
    let y = Supplementaries.filterDateRangesBefore(x,364)
    y = Supplementaries.filterDateRangesAfterToday(y);

    Supplementaries.sortDates(y)
    let z = Supplementaries.CreateOccupencyCount(y)
    const chartdata:any[] = Supplementaries.ConvertOccupancyCountJsonToList(z)
    let chartlabels = chartdata.map((row:any) => row.day)
    let chartvalues = chartdata.map((row:any) => row.count)
    

    const option = {
        responsive:true,
        plugins:
        {
            legend:
                {
                    display: false
                },
            title:
                {
                    display: true,
                    text: "Occupancy",
                    font:{
                        size: 32,
                        family: "Raleway"
                    }
                }
        },
        scales: {
            x: {
              categoryPercentage: 1,
              barPercentage: 1,      
              grid:{
                display: false
              }
            },
            y:{
                grid:{
                    display: false
                }
            }
        },
    }

    const chartData =
    {
       labels: chartlabels,
       datasets:
           [{
               label: 'Booking for the Year',
               data: chartvalues,
               backgroundColor: '#db9d17',
               borderColor: '#db9d17',
               borderWidth: 1,
           }]
       }

    useEffect(() => {
       axios.get(Supplementaries.serverLink+`hotel/data/${props.hotelId}`,{withCredentials:true})
       .then((data)=>{
            let values = data.data;
            let y = Supplementaries.filterDateRangesBefore(values,364)
            y = Supplementaries.filterDateRangesAfterToday(y);
            Supplementaries.sortDates(y)
            let z = Supplementaries.CreateOccupencyCount(y)
            const chartdata:any[] = Supplementaries.ConvertOccupancyCountJsonToList(z)
            chartlabels = chartdata.map((row:any) => row.day)
            chartvalues = chartdata.map((row:any) => row.count)

       })
       .catch((error)=>{
            option.plugins.title.text = "Error Getting Files"
       })
    })

    return (
        <div id="pain">
            <BarChart chartData={chartData} option={option}></BarChart>   
        </div>
      );
    };

export default BookingDataChart