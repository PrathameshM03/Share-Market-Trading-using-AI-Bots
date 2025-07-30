
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PriceData, ChartColors } from '../types';

interface PriceChartProps {
    data: PriceData[];
    colors: ChartColors;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                <p className="label text-gray-700 dark:text-gray-200">{`${label}`}</p>
                <p className="intro text-primary font-bold">{`Price : $${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, colors }) => {
    const lastPrice = data.length > 0 ? data[data.length-1].price : 0;
    const firstPrice = data.length > 0 ? data[0].price : 0;
    const isUp = lastPrice >= firstPrice;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isUp ? "#10B981" : "#EF4444"} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={isUp ? "#10B981" : "#EF4444"} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                    <XAxis dataKey="name" stroke={colors.text} tick={{ fontSize: 12 }} />
                    <YAxis stroke={colors.text} tick={{ fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke={isUp ? "#10B981" : "#EF4444"} fillOpacity={1} fill="url(#colorUv)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;