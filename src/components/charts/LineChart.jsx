import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChart = ({ 
  data, 
  title, 
  xAxisLabel = '', 
  yAxisLabel = '',
  height = 300
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel
        }
      }
    }
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart
