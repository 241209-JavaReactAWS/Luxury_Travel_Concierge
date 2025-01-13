
import "./BookingDataChart.css"
import Supplementaries from '../../SupplementaryClass'
import { Bar } from "react-chartjs-2";
import BarChart from '../GlobalComponents/BarChart/BarChart'
import axios from "axios";
import { useEffect, useState } from "react";



const BookingDataChart = (props:any) => {
    let chartlabels = ["Empty Set"]
    let chartvalues = [0]
    let title = "Error Getting Data"

    const [option, setOption] = useState(
        {
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
                        text: title,
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
    })

    const [chartData, setChartData] = useState(
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
    )


    useEffect(() => {
       axios.get(Supplementaries.serverLink+`hotel/data/${props.hotelId}`,{withCredentials:true, headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }})
       .then((data)=>{
            let values = data.data;
            let y = Supplementaries.filterDateRangesBefore(values,364)
            y = Supplementaries.filterDateRangesAfterToday(y);
            Supplementaries.sortDates(y)
            let z = Supplementaries.CreateOccupencyCount(y)
            const chartdata:any[] = Supplementaries.ConvertOccupancyCountJsonToList(z)

            console.log(z)
            chartlabels = chartdata.map((row:any) => row.day)
            chartvalues = chartdata.map((row:any) => row.count)
            
            title = "Occupancy"
            setChartData({
                labels: chartlabels,
                datasets:
                    [{
                        label: 'Booking for the Year',
                        data: chartvalues,
                        backgroundColor: '#db9d17',
                        borderColor: '#db9d17',
                        borderWidth: 1,
                    }]
                })

            setOption( {
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
                            text: title,
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
        })
       })
    },[props.hotelId])


    return ( 
        <BarChart chartData={chartData} option={option}></BarChart>   
      );
    };

export default BookingDataChart