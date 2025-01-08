import { BarElement, CategoryScale, Chart, Legend, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";


Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
  
)
export const BarChart = (props:any) => {

  const chartData = props.chartData
                
  const option = props.option

  return (
      <Bar
        data={chartData}
        options={option}
      />
  );
};

export default BarChart