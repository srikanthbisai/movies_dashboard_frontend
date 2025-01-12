import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Movie } from '../types';

const MovieMetricsChart = ({ movies }: { movies: Movie[] }) => {
  // Transform movie data for visualization
  const chartData = movies.map(movie => ({
    name: movie.title,
    castCount: movie.cast.length,
  }));

  return (
    <div className="w-full bg-black text-white p-4 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Movies Cast Size Overview</h3>
      <div className="w-full overflow-x-auto">
        <LineChart width={800} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="castCount" stroke="#3B82F6" name="Cast Members" />
        </LineChart>
      </div>
    </div>
  );
};

export default MovieMetricsChart;