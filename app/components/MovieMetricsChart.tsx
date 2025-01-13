import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Movie } from '../types';

const MovieMetricsChart = ({ movies }: { movies: Movie[] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = movies.map(movie => ({
    name: isMobile ? movie.title.slice(0, 15) + '...' : movie.title,
    castCount: movie.cast.length,
  }));

  return (
    <div className="w-full bg-black text-white p-4 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Movies Cast Size Overview</h3>
      <div className="w-full h-[400px] overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }}
              itemStyle={{ color: '#F3F4F6' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend wrapperStyle={{ color: '#F3F4F6' }} />
            <Line 
              type="monotone" 
              dataKey="castCount" 
              stroke="#3B82F6" 
              name="Cast Members"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6, fill: '#60A5FA' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MovieMetricsChart;