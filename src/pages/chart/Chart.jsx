import React, { useState, useEffect, useMemo } from 'react';
import { BsBarChart, BsCashCoin, BsChevronLeft, BsChevronRight, BsFilter } from 'react-icons/bs';
import { FiArrowUp, FiArrowDown, FiDollarSign } from 'react-icons/fi';

const ChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendDirection, setTrendDirection] = useState('up');
  const [maxSpendingDay, setMaxSpendingDay] = useState(null);
  const [minSpendingDay, setMinSpendingDay] = useState(null);
  
  // Process data into chart format
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data')) || {};
    
    if (Object.keys(storedData).length === 0) {
      setLoading(false);
      return;
    }

    const processData = () => {
      const dates = Object.keys(storedData);
      
      // Calculate daily totals
      const dailyTotals = dates.map(date => {
        const total = storedData[date].reduce((sum, item) => 
          sum + parseFloat(item.price), 0);
        return { date, total, items: storedData[date] };
      });
      
      // Sort by date
      dailyTotals.sort((a, b) => {
        const parseDate = dateStr => {
          const [day, month, year] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        };
        return parseDate(a.date) - parseDate(b.date);
      });
      
      // Combine state updates
      let newSelectedDate = null;
      let newMaxSpendingDay = null;
      let newMinSpendingDay = null;
      let newTrendDirection = 'up';
      
      if (dailyTotals.length > 0) {
        newSelectedDate = dailyTotals[dailyTotals.length - 1];
        
        // Find max and min spending days
        newMaxSpendingDay = dailyTotals.reduce((max, day) => 
          day.total > max.total ? day : max, dailyTotals[0]);
        newMinSpendingDay = dailyTotals.reduce((min, day) => 
          day.total < min.total ? day : min, dailyTotals[0]);
        
        // Determine spending trend
        if (dailyTotals.length > 1) {
          const lastTwo = dailyTotals.slice(-2);
          newTrendDirection = lastTwo[1].total > lastTwo[0].total ? 'up' : 'down';
        }
      }
      
      setChartData(dailyTotals);
      setSelectedDate(newSelectedDate);
      setMaxSpendingDay(newMaxSpendingDay);
      setMinSpendingDay(newMinSpendingDay);
      setTrendDirection(newTrendDirection);
      setLoading(false);
    };
    
    processData();
  }, []); // Empty dependency array ensures single run

  // Calculate statistics
  const totalSpent = useMemo(() => 
    chartData.reduce((sum, day) => sum + day.total, 0), [chartData]);
  
  const averageDaily = useMemo(() => 
    chartData.length > 0 ? (totalSpent / chartData.length).toFixed(0) : 0, 
    [chartData, totalSpent]
  );

  // Filter data based on time selection
  const filteredData = useMemo(() => {
    if (timeFilter === 'all' || chartData.length === 0) return chartData;
    
    const today = new Date();
    const days = timeFilter === 'week' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - days);
    
    return chartData.filter(day => {
      const [d, m, y] = day.date.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date >= cutoffDate;
    });
  }, [chartData, timeFilter]);

  // Navigation functions
  const navigateDate = (direction) => {
    if (!selectedDate || !chartData.length) return;
    
    const currentIndex = chartData.findIndex(d => d.date === selectedDate.date);
    
    if (direction === 'next' && currentIndex < chartData.length - 1) {
      setSelectedDate(chartData[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedDate(chartData[currentIndex - 1]);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const [d, m, y] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            تحليل المصروفات
          </h1>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            رصد وتحليل أنماط صرفك اليومية بسهولة ودقة
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SummaryCard 
            title="إجمالي المصروفات" 
            value={`${totalSpent.toFixed(0)} ج.م`} 
            icon={<FiDollarSign className="text-blue-600 text-xl" />}
            trend={null}
          />
          
          <SummaryCard 
            title="متوسط الصرف اليومي" 
            value={`${averageDaily} ج.م`} 
            icon={<FiDollarSign className="text-green-600 text-xl" />}
            trend={trendDirection}
          />
          
          <SummaryCard 
            title="أعلى يوم صرف" 
            value={maxSpendingDay ? `${maxSpendingDay.total.toFixed(0)} ج.م` : "0 ج.م"} 
            subValue={maxSpendingDay ? formatDate(maxSpendingDay.date) : ""}
            icon={<FiArrowUp className="text-red-400 text-xl" />}
            trend={null}
          />
          
          <SummaryCard 
            title="أقل يوم صرف" 
            value={minSpendingDay ? `${minSpendingDay.total.toFixed(0)} ج.م` : "0 ج.م"} 
            subValue={minSpendingDay ? formatDate(minSpendingDay.date) : ""}
            icon={<FiArrowDown className="text-purple-600 text-xl" />}
            trend={null}
          />
        </div>
        
        {/* Time Filters */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            <FilterButton 
              active={timeFilter === 'week'} 
              onClick={() => setTimeFilter('week')}
            >
              أسبوع
            </FilterButton>
            <FilterButton 
              active={timeFilter === 'month'} 
              onClick={() => setTimeFilter('month')}
            >
              شهر
            </FilterButton>
            <FilterButton 
              active={timeFilter === 'all'} 
              onClick={() => setTimeFilter('all')}
            >
              الكل
            </FilterButton>
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <BsBarChart className="mr-2 text-blue-500" />
                تطور المصروفات اليومية
              </h2>
              <p className="text-gray-500 mt-1">استعرض أنماط صرفك على مدار الوقت</p>
            </div>
            
            <div className="mt-3 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">المصروفات اليومية</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm text-gray-600">المتوسط ({averageDaily} ج.م)</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500">جاري تحليل البيانات...</p>
              </div>
            ) : (
              <LineChart 
                data={filteredData} 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                average={parseInt(averageDaily)}
              />
            )}
          </div>
        </div>
        
        {/* Details Panel */}
        {selectedDate && selectedDate.items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  تفاصيل المصروفات - {formatDate(selectedDate.date)}
                </h2>
                <p className="text-gray-500 mt-1">
                  {selectedDate.items.length} عناصر • {selectedDate.total.toFixed(2)} ج.م
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button 
                  onClick={() => navigateDate('prev')}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
                >
                  <BsChevronLeft className="text-gray-600" />
                  <span className="text-sm text-gray-600 mr-2">السابق</span>
                </button>
                
                <div className="text-xl font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  -{selectedDate.total.toFixed(2)} ج.م
                </div>
                
                <button 
                  onClick={() => navigateDate('next')}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
                >
                  <span className="text-sm text-gray-600 ml-2">التالي</span>
                  <BsChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDate.items.map((item, index) => (
                <ExpenseItem 
                  key={index} 
                  name={item.name}
                  price={item.price}
                  time={item.time}
                  timestamp={item.timestamp}
                />
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && selectedDate.items.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-300 mb-4">
              <BsCashCoin className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">لا توجد مصروفات مسجلة</h3>
            <p className="text-gray-500 mt-2">
              لم يتم تسجيل أي مشتريات في تاريخ {formatDate(selectedDate.date)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Responsive Line Chart Component
const LineChart = ({ data, selectedDate, onSelectDate, average }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
        <p className="text-lg font-medium">لا توجد بيانات متاحة</p>
        <p className="text-sm mt-2 max-w-md text-center">
          أضف مصروفات جديدة لرؤية التحليل البياني
        </p>
      </div>
    );
  }
  
  // Responsive chart dimensions
  const minPointSpacing = 20; // Minimum space between data points
  const chartHeight = 300;
  const margin = { top: 30, right: 40, bottom: 50, left: 60 };
  
  // Calculate required width based on data points
  const requiredWidth = Math.max(
    700, // Minimum width
    data.length * minPointSpacing + margin.left + margin.right
  );
  
  const innerWidth = requiredWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  // Data points
  const maxSpending = Math.max(...data.map(d => d.total), 10);
  const minSpending = Math.min(...data.map(d => d.total), 0);
  
  // Scale values to fit chart
  const scaleX = (index) => 
    margin.left + (index / (data.length - 1)) * innerWidth;
  
  const scaleY = (value) => 
    margin.top + innerHeight - ((value - minSpending) / (maxSpending - minSpending || 1)) * innerHeight;
  
  // Generate path for line
  let pathData = "";
  data.forEach((day, i) => {
    const x = scaleX(i);
    const y = scaleY(day.total);
    if (i === 0) {
      pathData += `M ${x} ${y} `;
    } else {
      pathData += `L ${x} ${y} `;
    }
  });
  
  // Average line position
  const averageY = scaleY(average);
  
  // Only show every nth label to prevent overlap
  const labelInterval = Math.ceil(data.length / 15);
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg 
        width={requiredWidth} 
        height={chartHeight} 
        viewBox={`0 0 ${requiredWidth} ${chartHeight}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = margin.top + t * innerHeight;
          const value = maxSpending - t * (maxSpending - minSpending);
          return (
            <g key={i}>
              <line 
                x1={margin.left} 
                y1={y} 
                x2={requiredWidth - margin.right} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeDasharray="4 4" 
              />
              <text 
                x={margin.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fill="#6b7280" 
                fontSize="12"
              >
                {Math.round(value)} ج.م
              </text>
            </g>
          );
        })}
        
        {/* Average line */}
        <line 
          x1={margin.left} 
          y1={averageY} 
          x2={requiredWidth - margin.right} 
          y2={averageY} 
          stroke="#9ca3af" 
          strokeDasharray="6 4" 
        />
        <text 
          x={requiredWidth - margin.right + 5} 
          y={averageY + 4} 
          fill="#6b7280" 
          fontSize="12"
        >
          المتوسط
        </text>
        
        {/* Vertical grid lines - only show every nth */}
        {data.map((day, i) => {
          if (i % labelInterval !== 0 && i !== data.length - 1) return null;
          
          const x = scaleX(i);
          return (
            <g key={i}>
              <line 
                x1={x} 
                y1={margin.top} 
                x2={x} 
                y2={chartHeight - margin.bottom} 
                stroke="#e5e7eb" 
                strokeDasharray="4 4" 
              />
              <text 
                x={x} 
                y={chartHeight - 15} 
                textAnchor="middle" 
                fill="#6b7280" 
                fontSize="10"
              >
                {day.date}
              </text>
            </g>
          );
        })}
        
        {/* Line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        
        {/* Dots - only show value labels for selected points */}
        {data.map((day, i) => {
          const x = scaleX(i);
          const y = scaleY(day.total);
          const isSelected = selectedDate && selectedDate.date === day.date;
          const isAboveAverage = day.total > average;
          
          return (
            <g key={i}>
              {/* Selection line */}
              {isSelected && (
                <line 
                  x1={x} 
                  y1={margin.top} 
                  x2={x} 
                  y2={chartHeight - margin.bottom} 
                  stroke="#93c5fd" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                />
              )}
              
              {/* Dot */}
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 6 : 4} 
                fill={isAboveAverage ? "#ef4444" : "#3b82f6"} 
                stroke="white" 
                strokeWidth="2"
                onClick={() => onSelectDate(day)}
                className="cursor-pointer transition-all duration-200"
              />
              
              {/* Value label - only show for selected point */}
              {isSelected && (
                <text 
                  x={x} 
                  y={y - 12} 
                  textAnchor="middle" 
                  fill="#2563eb" 
                  fontSize="11"
                  fontWeight="bold"
                  className="drop-shadow-sm"
                >
                  {day.total.toFixed(0)} ج.م
                </text>
              )}
            </g>
          );
        })}
        
        {/* Axes */}
        <line 
          x1={margin.left} 
          y1={chartHeight - margin.bottom} 
          x2={requiredWidth - margin.right} 
          y2={chartHeight - margin.bottom} 
          stroke="#9ca3af" 
          strokeWidth="1" 
        />
        <line 
          x1={margin.left} 
          y1={margin.top} 
          x2={margin.left} 
          y2={chartHeight - margin.bottom} 
          stroke="#9ca3af" 
          strokeWidth="1" 
        />
      </svg>
    </div>
  );
};

// Sub-components
const SummaryCard = ({ title, value, subValue, color, icon, trend }) => (
  <div className={`border-b border-gray-200 p-2 gap-3.5 flex items-start transition-all h-full`}>
    <div className="bg-white p-3 rounded-xl mr-4 mt-1">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-sm text-gray-700">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subValue && <p className="text-gray-600 text-sm mt-1">{subValue}</p>}
      
      {trend && (
        <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm ${
          trend === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {trend === 'up' ? 
            <><FiArrowUp className="mr-1" /> ارتفاع</> : 
            <><FiArrowDown className="mr-1" /> انخفاض</>
          }
        </div>
      )}
    </div>
  </div>
);

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl transition-all ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const ExpenseItem = ({ name, price, time, timestamp }) => (
  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white group">
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-lg truncate">{name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-gray-500 text-sm">{time}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500 text-sm">
            {new Date(parseInt(timestamp)).toLocaleDateString('ar-EG')}
          </span>
        </div>
      </div>
      <div className="text-red-600 font-bold text-xl flex-shrink-0">-{price} ج.م</div>
    </div>
    
    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
      <div className="text-sm text-gray-500 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {new Date(parseInt(timestamp)).toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  </div>
);

export default ChartPage;