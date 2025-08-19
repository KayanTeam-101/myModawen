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
    // Sample data structure
    const storedData = JSON.parse(localStorage.getItem('data'));
    const data =localStorage.getItem('data');
    if (!data) {
      window.location.href='/'
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
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6 showSmoothy">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">
            تحليل المصروفات
          </h1>
          <p className="text-indigo-700 mt-2 max-w-lg mx-auto">
            رصد وتحليل أنماط صرفك اليومية بسهولة ودقة
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SummaryCard 
            title="إجمالي المصروفات" 
            value={`${totalSpent.toFixed(0)} ج.م`} 
            icon={<FiDollarSign className="text-white text-xl" />}
            trend={null}
            color="bg-indigo-600"
          />
          
          <SummaryCard 
            title="متوسط الصرف اليومي" 
            value={`${averageDaily} ج.م`} 
            icon={<FiDollarSign className="text-white text-xl" />}
            trend={trendDirection}
            color="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          
          <SummaryCard 
            title="أعلى يوم صرف" 
            value={maxSpendingDay ? `${maxSpendingDay.total.toFixed(0)} ج.م` : "0 ج.م"} 
            subValue={maxSpendingDay ? formatDate(maxSpendingDay.date) : ""}
            icon={<FiArrowUp className="text-white text-xl" />}
            trend={null}
            color="bg-gradient-to-r from-red-500 to-orange-500"
          />
          
          <SummaryCard 
            title="أقل يوم صرف" 
            value={minSpendingDay ? `${minSpendingDay.total.toFixed(0)} ج.م` : "0 ج.م"} 
            subValue={minSpendingDay ? formatDate(minSpendingDay.date) : ""}
            icon={<FiArrowDown className="text-white text-xl" />}
            trend={null}
            color="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
        
        {/* Time Filters */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-indigo-100 p-1 rounded-xl">
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
           
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-indigo-900 flex items-center">
                <BsBarChart className="mr-2 text-indigo-600" />
                تطور المصروفات اليومية
              </h2>
              <p className="text-indigo-700 mt-1">استعرض أنماط صرفك على مدار الوقت</p>
            </div>
            
            <div className="mt-3 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                <span className="text-sm text-indigo-800">المصروفات اليومية</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 mr-2"></div>
                <span className="text-sm text-indigo-800">المتوسط ({averageDaily} ج.م)</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-indigo-700">جاري تحليل البيانات...</p>
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
          <>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  تفاصيل المصروفات - {formatDate(selectedDate.date)}
                </h2>
                <p className="text-indigo-700 mt-1">
                  {selectedDate.items.length} عناصر • {selectedDate.total.toFixed(2)} ج.م
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button 
                  onClick={() => navigateDate('prev')}
                  className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center"
                >
                  <BsChevronLeft className="text-indigo-700" />
                  <span className="text-sm text-indigo-700 mr-2">السابق</span>
                </button>
                
                <div className="text-xl font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  -{selectedDate.total.toFixed(2)} ج.م
                </div>
                
                <button 
                  onClick={() => navigateDate('next')}
                  className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center"
                >
                  <span className="text-sm text-indigo-700 ml-2">التالي</span>
                  <BsChevronRight className="text-indigo-700" />
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
            <div className='h-14'></div>

          </>
        )}
        
        {selectedDate && selectedDate.items.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
            <div className="text-indigo-300 mb-4">
              <BsCashCoin className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-indigo-800">لا توجد مصروفات مسجلة</h3>
            <p className="text-indigo-600 mt-2">
              لم يتم تسجيل أي مشتريات في تاريخ {formatDate(selectedDate.date)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Line Chart Component
const LineChart = ({ data, selectedDate, onSelectDate, average }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-indigo-700 p-4">
        <div className="bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-xl w-16 h-16 mb-4" />
        <p className="text-lg font-medium text-indigo-900">لا توجد بيانات متاحة</p>
        <p className="text-sm mt-2 max-w-md text-center">
          أضف مصروفات جديدة لرؤية التحليل البياني
        </p>
      </div>
    );
  }
  
  // Enhanced dimensions and spacing
  const minPointSpacing = 40;
  const chartHeight = 350;
  const margin = { top: 30, right: 50, bottom: 80, left: 70 };
  
  // Calculate required width
  const requiredWidth = Math.max(
    1200,
    data.length * minPointSpacing + margin.left + margin.right
  );
  
  const innerWidth = requiredWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  // Data points
  const maxSpending = Math.max(...data.map(d => d.total), 10);
  const minSpending = Math.min(...data.map(d => d.total), 0);
  
  // Scale functions
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
  
  // Label interval calculation
  const labelInterval = Math.max(1, Math.floor(data.length / 8));
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg 
        width={requiredWidth} 
        height={chartHeight} 
        viewBox={`0 0 ${requiredWidth} ${chartHeight}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {/* Gradient background */}
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="aqua" stopOpacity=".4" />
            <stop offset="100%" stopColor="#5047e011" stopOpacity=".1" />
          </linearGradient>
        </defs>
        
        {/* Background area */}
        <path 
          d={`${pathData} L ${scaleX(data.length-1)} ${chartHeight - margin.bottom} L ${margin.left} ${chartHeight - margin.bottom} Z`} 
          fill="url(#areaGradient)" 
          stroke="none" 
        />
        
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
                stroke="#e0e7ff" 
                strokeDasharray="4 4" 
              />
              <text 
                x={margin.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fill="#4f46e5" 
                fontSize="12"
                fontWeight="500"
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
          stroke="#a5b4fc" 
          strokeDasharray="6 4" 
          strokeWidth="2"
        />
        <text 
          x={requiredWidth - margin.right + 5} 
          y={averageY + 4} 
          fill="#6366f1" 
          fontSize="12"
          fontWeight="500"
        >
          المتوسط
        </text>
        
        {/* Vertical grid lines */}
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
                stroke="#e0e7ff" 
                strokeDasharray="4 4" 
              />
              <text 
                x={x} 
                y={chartHeight - 20} 
                textAnchor="middle" 
                fill="#4f46e5" 
                fontSize="10"
                fontWeight="500"
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
          stroke="#4f46e5" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        
        {/* Dots */}
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
                r={isSelected ? 8 : 6} 
                fill={isAboveAverage ? "#ef4444" : "#4f46e5"} 
                stroke="white" 
                strokeWidth="2"
                onClick={() => onSelectDate(day)}
                className="cursor-pointer transition-all duration-200 hover:r-8"
              />
              
              {/* Value label */}
              {isSelected && (
                <g>
                  <rect 
                    x={x - 30} 
                    y={y - 40} 
                    width={60} 
                    height={25} 
                    rx="4" 
                    fill="#4f46e5" 
                    className="drop-shadow-sm"
                  />
                  <text 
                    x={x} 
                    y={y - 25} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {day.total.toFixed(0)} ج.م
                  </text>
                </g>
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
          stroke="#a5b4fc" 
          strokeWidth="1" 
        />
        <line 
          x1={margin.left} 
          y1={margin.top} 
          x2={margin.left} 
          y2={chartHeight - margin.bottom} 
          stroke="#a5b4fc" 
          strokeWidth="1" 
        />
      </svg>
    </div>
  );
};

// Sub-components
const SummaryCard = ({ title, value, subValue, color, icon, trend }) => (
  <div className={`${color} rounded-2xl p-5 transition-all h-full text-white shadow-lg`}>
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subValue && <p className="text-indigo-100 text-sm mt-1">{subValue}</p>}
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        {icon}
      </div>
    </div>
    
    {trend && (
      <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm ${
        trend === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {trend === 'up' ? 
          <><FiArrowUp className="mr-1" /> ارتفاع</> : 
          <><FiArrowDown className="mr-1" /> انخفاض</>
        }
      </div>
    )}
  </div>
);

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl transition-all font-medium ${
      active 
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md' 
        : 'text-indigo-800 hover:bg-indigo-200'
    }`}
  >
    {children}
  </button>
);

const ExpenseItem = ({ name, price, time, timestamp }) => (
  <div className="border border-indigo-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white group">
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-indigo-900 text-lg truncate">{name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-indigo-600 text-sm">{time}</span>
          <span className="mx-2 text-indigo-300">•</span>
          <span className="text-indigo-600 text-sm">
            {new Date(parseInt(timestamp)).toLocaleDateString('ar-EG')}
          </span>
        </div>
      </div>
      <div className="text-red-600 font-bold text-xl flex-shrink-0">-{price} ج.م</div>
    </div>
    
    <div className="mt-4 pt-3 border-t border-indigo-100 flex justify-between">
      <div className="text-sm text-indigo-600 flex items-center">
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