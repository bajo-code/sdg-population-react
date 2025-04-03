import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { ApiCountry } from '../types';
import { useTheme } from '../../../context/ThemeContext';
import gsap from 'gsap';
import { useAnimationTiming } from '../../../context/AnimationTimingContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartColors = {
  light: {
    barBackground: 'rgba(75, 192, 192, 0.6)',
    barBorder: 'rgba(75, 192, 192, 1)',
    grid: 'rgba(0, 0, 0, 0.1)',
    ticks: '#666',
    text: '#333',
    tooltipBg: '#ffffff',
    tooltipText: '#333333',
    tooltipBorder: '#dddddd',
  },
  dark: {
    barBackground: 'rgba(153, 102, 255, 0.6)',
    barBorder: 'rgba(153, 102, 255, 1)',
    grid: 'rgba(255, 255, 255, 0.15)',
    ticks: '#ccc',
    text: '#f0f0f0',
    tooltipBg: '#2a2a2a',
    tooltipText: '#f0f0f0',
    tooltipBorder: '#555555',
  }
};


interface CountryChartProps {
  data: ApiCountry[];
  continentName?: string;
}

export const CountryChart: React.FC<CountryChartProps> = ({ data, continentName }) => {
  const { theme } = useTheme();

  const { textAnimationsComplete } = useAnimationTiming();
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const chartTitleRef = useRef<HTMLHeadingElement>(null);

  const currentColors = chartColors[theme];
  const chartTitleString = `Country Population in ${continentName || 'Selected Region'}`;
  const chartData: ChartData<'bar', number[], string> = {
    labels: data.map(c => c.name.common),
    datasets: [
      {
        label: `Population`,
        data: data.map(c => c.population),
        backgroundColor: currentColors.barBackground,
        borderColor: currentColors.barBorder,
        borderWidth: 1,
      },
    ],
  };


  const options: ChartOptions<'bar'> = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Population',
          color: currentColors.text,
          font: { size: 14, weight: 700 },
        },
        ticks: {
          color: currentColors.ticks,
          callback: function(value) {
              if (typeof value !== 'number') return value;
              if (value === 0) return '0';
               if (Math.abs(value) >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
              if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
              if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
              return value;
          }
        },
        grid: {
          color: currentColors.grid,
        }
      },
      x: {
        title: {
          display: true,
          text: 'Countries',
          color: currentColors.text,
          font: { size: 14, weight: 700 },
        },
        ticks: {
          color: currentColors.ticks,
          autoSkip: false,
          maxRotation: 90,
          minRotation: 70,
          font: { size: 10 }
        },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: currentColors.text,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: currentColors.tooltipBg,
        titleColor: currentColors.tooltipText,
        bodyColor: currentColors.tooltipText,
        borderColor: currentColors.tooltipBorder,
        borderWidth: 1,
        padding: 10,
        callbacks: {
            label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('es-ES').format(context.parsed.y);
                }
                return label;
            }
        }
     }
    },
  };

  // *** useEffect para la animación del GRÁFICO ***
 useEffect(() => {
  
  const refsToResetExist = chartWrapperRef.current && chartTitleRef.current;

  if (textAnimationsComplete && chartWrapperRef.current) {
    console.log("Text animations complete");

    // Animar AMBOS elementos (wrapper y título H3)
    const tl = gsap.timeline();

    tl.fromTo([chartWrapperRef.current, chartTitleRef.current],
      { opacity: 0, y: 50 },
      {
        duration: 1.0,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.1
      }
    );

    return () => {
      console.log("CountryChart: Cleaning up chart/title animation.");
      tl.kill();
    };

  }  else if (refsToResetExist) {

      gsap.set([chartWrapperRef.current, chartTitleRef.current], { opacity: 0, y: 50 });
      console.log("CountryChart: Text NOT complete or refs not ready, ensuring chart/title hidden.");
    }
  }, [textAnimationsComplete]);

  return (
   
    <div className="chart-module-container">
      <h3 ref={chartTitleRef} className="chart-title-header" style={{ opacity: 0, textAlign: 'center', marginBottom: '1rem' }}>
        {chartTitleString}
      </h3>
      <div ref={chartWrapperRef} className="chart-wrapper" style={{ opacity: 0, minHeight: '450px' }}>
        <Bar key={theme} options={options} data={chartData} />
      </div>

    </div>
  );
};