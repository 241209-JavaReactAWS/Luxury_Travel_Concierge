
import "./BookingDataChart.css"
import Supplementaries from '../../SupplementaryClass'
import { Bar } from "react-chartjs-2";
import BarChart from '../GlobalComponents/BarChart/BarChart'



const BookingDataChart = () => {
    let x = Supplementaries.generateDateRanges(200);
    let y = Supplementaries.filterDateRangesBefore(x,364)
    y = Supplementaries.filterDateRangesAfterToday(y);
    Supplementaries.sortDates(y)
    let z = Supplementaries.CreateOccupencyCount(y)
    const chartdata:any[] = Supplementaries.ConvertOccupancyCountJsonToList(z)
    let chartlabels = chartdata.map((row:any) => row.day)
    let chartvalues = chartdata.map((row:any) => row.count)
    

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
        
    


    return (
        <div id="pain">
            <BarChart chartData={chartData} option={option}></BarChart>   
        </div>
      );
    };

export default BookingDataChart