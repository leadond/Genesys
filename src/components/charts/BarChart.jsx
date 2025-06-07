import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const BarChart = ({ 
  data, 
  title, 
  xAxisLabel = '', 
  yAxisLabel = '', 
  stacked = false,
  horizontal = false,
  height = 300
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        stacked,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel
        }
      },
      y: {
        stacked,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel
        }
      }
    }
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
