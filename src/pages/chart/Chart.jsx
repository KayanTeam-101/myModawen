import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { FiArrowUp, FiArrowDown, FiDollarSign } from 'react-icons/fi';
import { HiChartBar } from 'react-icons/hi';

// Cleaner, more maintainable ChartPage
// - smaller helper functions
// - avoid using window.* at module scope
// - use ResizeObserver for responsive SVG sizing
// - clearer separation of responsibilities

/* ---------- Utilities ---------- */
const safeParseJSON = (s) => {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const parseDateKey = (dateStr) => {
  const [d, m, y] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatArabicDate = (dateStr) =>
  parseDateKey(dateStr).toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const getStoredChartData = () => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('data');
  const parsed = safeParseJSON(raw);
  if (!parsed || typeof parsed !== 'object') return [];
  return Object.keys(parsed).map((dateKey) => ({
    date: dateKey,
    total: parsed[dateKey].reduce((s, it) => s + (parseFloat(it.price) || 0), 0),
    items: parsed[dateKey],
  }))
  .sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date));
};

/* ---------- Hooks ---------- */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });
  return isDark;
};

const useResizeWidth = (ref) => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      const w = ref.current?.clientWidth || width;
      setWidth(w);
    });
    ro.observe(ref.current);
    setWidth(ref.current.clientWidth || width);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};

/* ---------- Color Constants ---------- */
const COLORS = {
  primary: {
    light: '#4F46E5',
    dark: '#6366F1'
  },
  background: {
    light: 'bg-white',
    dark: 'bg-black'
  },
  card: {
    light: 'bg-white',
    dark: 'bg-gray-950'
  },
  text: {
    light: 'text-gray-900',
    dark: 'text-gray-100'
  },
  accent: {
    indigo: {
      light: 'from-indigo-600 to-indigo-500',
      dark: 'from-indigo-500 to-indigo-400'
    },
    red: {
      light: 'from-red-500 to-orange-400',
      dark: 'from-red-400 to-orange-300'
    },
    green: {
      light: 'from-emerald-500 to-teal-400',
      dark: 'from-emerald-400 to-teal-300'
    }
  },
  border: {
    light: 'border-indigo-100',
    dark: 'border-gray-700'
  }
};

/* ---------- Main Page ---------- */
const ChartPage = () => {
  const isDark = useTheme();
  const [chartData, setChartData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendDirection, setTrendDirection] = useState('up');
  const [maxSpendingDay, setMaxSpendingDay] = useState(null);
  const [minSpendingDay, setMinSpendingDay] = useState(null);

  useEffect(() => {
    const data = getStoredChartData();
    if (!data.length) {
      // no data -> show empty state (avoid forcing a redirect)
      setChartData([]);
      setLoading(false);
      return;
    }

    // compute auxiliaries
    const selected = data[data.length - 1] || null;
    const maxDay = data.reduce((m, d) => (d.total > m.total ? d : m), data[0]);
    const minDay = data.reduce((m, d) => (d.total < m.total ? d : m), data[0]);
    const lastTwo = data.slice(-2);
    const trend = lastTwo.length > 1 && lastTwo[1].total > lastTwo[0].total ? 'up' : 'down';

    setChartData(data);
    setSelectedDate(selected);
    setMaxSpendingDay(maxDay);
    setMinSpendingDay(minDay);
    setTrendDirection(trend);

    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const totalSpent = useMemo(() => chartData.reduce((s, d) => s + d.total, 0), [chartData]);
  const averageDaily = useMemo(() => (chartData.length ? Math.round(totalSpent / chartData.length) : 0), [chartData, totalSpent]);

  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    if (timeFilter === 'all') return chartData;
    const days = timeFilter === 'week' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return chartData.filter(d => parseDateKey(d.date) >= cutoff);
  }, [chartData, timeFilter]);

  const navigateDate = useCallback((direction) => {
    if (!selectedDate || !chartData.length) return;
    const idx = chartData.findIndex(d => d.date === selectedDate.date);
    if (direction === 'next' && idx < chartData.length - 1) setSelectedDate(chartData[idx + 1]);
    if (direction === 'prev' && idx > 0) setSelectedDate(chartData[idx - 1]);
  }, [selectedDate, chartData]);

  return (
    <div className={`min-h-screen p-4 md:p-6 showSmoothy ${isDark ? COLORS.background.dark : COLORS.background.light} ${isDark ? COLORS.text.dark : COLORS.text.light}`}>
      <div className="max-w-6xl mx-auto">
     
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="إجمالي المصروفات" value={`${totalSpent.toFixed(0)} ج.م`} icon={<FiDollarSign />} color="indigo" isDark={isDark} />
          <StatCard title="متوسط يومي" value={`${averageDaily} ج.م`} icon={<FiDollarSign />} color="indigo" chip={trendDirection} isDark={isDark} />
          <StatCard title="أعلى يوم" value={`${maxSpendingDay ? maxSpendingDay.total.toFixed(0) : 0} ج.م`} sub={maxSpendingDay ? formatArabicDate(maxSpendingDay.date) : ''} icon={<FiArrowUp />} color="red" isDark={isDark} />
          <StatCard title="أدنى يوم" value={`${minSpendingDay ? minSpendingDay.total.toFixed(0) : 0} ج.م`} sub={minSpendingDay ? formatArabicDate(minSpendingDay.date) : ''} icon={<FiArrowDown />} color="green" isDark={isDark} />
        </section>

        <div className="flex items-center justify-center mb-4 m-auto">
          <div className={`p-1 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-indigo-100'}`}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
              <FilterButton active={timeFilter === 'week'} onClick={() => setTimeFilter('week')} isDark={isDark}>أسبوع</FilterButton>
              <FilterButton active={timeFilter === 'month'} onClick={() => setTimeFilter('month')} isDark={isDark}>شهر</FilterButton>
              <FilterButton active={timeFilter === 'all'} onClick={() => setTimeFilter('all')} isDark={isDark}>الكل</FilterButton>
            </div>
          </div>
        </div>

        <div className={`${isDark ? COLORS.card.dark : COLORS.card.light} rounded-2xl shadow-lg border ${isDark ? COLORS.border.dark : COLORS.border.light} overflow-hidden`}>
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-indigo-50'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <HiChartBar className={`text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>مخطط المصروفات</div>
                <div className={`text-lg font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>آخر {filteredData.length} يوم</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigateDate('prev')} className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-50 hover:bg-indigo-100'}`}>
                <BsChevronLeft className={isDark ? 'text-indigo-300' : 'text-indigo-700'} />
              </button>
              <button onClick={() => navigateDate('next')} className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-50 hover:bg-indigo-100'}`}>
                <BsChevronRight className={isDark ? 'text-indigo-300' : 'text-indigo-700'} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div style={{ height: 300 }} className="w-full">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-indigo-400' : 'border-indigo-500'}`} />
                  <p className={`mt-4 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>جاري تحليل البيانات...</p>
                </div>
              ) : (
                <ResponsiveLineChart data={filteredData} selectedDate={selectedDate} onSelectDate={setSelectedDate} isDark={isDark} />
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        {selectedDate && selectedDate.items && selectedDate.items.length > 0 ? (
      <>
        <div className={`${isDark ? COLORS.card.dark : COLORS.card.light} rounded-2xl shadow-lg p-6 mt-6 border ${isDark ? COLORS.border.dark : COLORS.border.light}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>تفاصيل - {formatArabicDate(selectedDate.date)}</h2>
                <p className={`${isDark ? 'text-indigo-200' : 'text-indigo-700'} mt-1`}>{selectedDate.items.length} عناصر • {selectedDate.total.toFixed(2)} ج.م</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className={`text-xl font-bold ${isDark ? 'text-red-400 bg-gray-800' : 'text-black bg-red-50'} px-4 py-2 rounded-lg`}>-{selectedDate.total.toFixed(2)} ج.م</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDate.items.map((it, idx) => (
                <div key={idx} className={`border ${isDark ? 'border-gray-700/50' : 'border-indigo-100'} rounded-xl p-4 ${isDark ? 'bg-gray-900' : 'bg-white'} hover:shadow-md transition`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-900'} truncate`}>{it.name}</h3>
                      <div className={`flex items-center mt-1 ${isDark ? 'text-indigo-100' : 'text-indigo-600'} text-sm`}>{it.time}</div>
                    </div>
                    <div className={`font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>-{it.price} ج.م</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-16"></div>
      </>
        ) : (
          <div className={`${isDark ? COLORS.card.dark : COLORS.card.light} rounded-2xl shadow-lg p-6 mt-6 border ${isDark ? COLORS.border.dark : COLORS.border.light} text-center`}>
            <div className={`mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-300'}`}><FiDollarSign className="text-4xl mx-auto" /></div>
            <h3 className={`text-lg font-medium ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>لا توجد مصروفات مسجلة</h3>
            <p className={`${isDark ? 'text-indigo-100' : 'text-indigo-600'} mt-2`}>لم نعثر على أي مصروفات للتاريخ المحدد</p>
          </div>
        )}

      </div>
    </div>
  );
};

/* ---------- Responsive Line Chart (cleaner) ---------- */
const ResponsiveLineChart = ({ data, selectedDate, onSelectDate, isDark }) => {
  const ref = useRef(null);
  const width = useResizeWidth(ref);
  if (!data || data.length === 0) return (
    <div className={`h-full flex flex-col items-center justify-center p-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <div className={`border-2 border-dashed rounded-xl w-16 h-16 mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} />
      <p className="text-lg font-medium">لا توجد بيانات</p>
      <p className="text-sm mt-2 max-w-md text-center">أضف مصروفات جديدة لرؤية التحليل البياني</p>
    </div>
  );

  const height = 260;
  const margin = { top: 22, right: 18, bottom: 36, left: 30 };
  const innerH = height - margin.top - margin.bottom;
  const maxValue = Math.max(...data.map(d => d.total), 10);
  const minValue = Math.min(...data.map(d => d.total), 0);

  const scaleX = (i) => margin.left + (i / (data.length - 1 || 1)) * (width - margin.left - margin.right);
  const scaleY = (v) => margin.top + innerH - ((v - minValue) / (maxValue - minValue || 1)) * innerH;

  const makePath = () => {
    if (data.length === 1) return `M ${scaleX(0)} ${scaleY(data[0].total)}`;
    let d = `M ${scaleX(0)} ${scaleY(data[0].total)}`;
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = scaleX(i); const y1 = scaleY(data[i].total);
      const x2 = scaleX(i + 1); const y2 = scaleY(data[i + 1].total);
      const cx = (x1 + x2) / 2; const cy = (y1 + y2) / 2;
      d += ` Q ${x1} ${y1} ${cx} ${cy}`;
    }
    d += ` T ${scaleX(data.length - 1)} ${scaleY(data[data.length - 1].total)}`;
    return d;
  };

  const path = makePath();

  const [hoverIdx, setHoverIdx] = useState(null);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let best = 0; let bestDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dx = Math.abs(scaleX(i) - x);
      if (dx < bestDist) { best = i; bestDist = dx; }
    }
    setHoverIdx(best);
  };

  const hoverPoint = hoverIdx != null ? data[hoverIdx] : null;

  return (
    <div ref={ref} className="relative w-full" onMouseMove={handleMove} onMouseLeave={() => setHoverIdx(null)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradLine" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={isDark ? "#6366F1" : "#6366F1"} stopOpacity={isDark ? "0.28" : "0.28"} />
            <stop offset="100%" stopColor={isDark ? "#6366F1" : "#6366F1"} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[0,1,2,3].map(i => {
          const y = margin.top + (i/3)*innerH;
          return <line key={i} x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke={isDark ? '#374151' : '#eef2ff'} strokeWidth={1} />
        })}

        {/* area */}
        <path d={`${path} L ${scaleX(data.length-1)} ${height - margin.bottom} L ${margin.left} ${height - margin.bottom} Z`} fill="url(#gradLine)" />

        {/* line */}
        <path d={path} fill="none" stroke={isDark ? "#818cf8" : "#4F46E5"} strokeWidth={2.5} strokeLinecap="round" />

        {/* points */}
        {data.map((d, i) => {
          const x = scaleX(i); const y = scaleY(d.total);
          const isSelected = selectedDate && selectedDate.date === d.date;
          const isHovered = hoverIdx === i;
          return (
            <g key={i} className="cursor-pointer" onClick={() => onSelectDate(d)}>
              <circle cx={x} cy={y} r={i == data.length -1 ? 2 : 0} fill='#818cf8'  stroke={isDark ? '#818cf8' : '#4F46E5'} strokeWidth={isHovered || isSelected ? 2 : 1} />
            </g>
          );
        })}

        {/* x labels */}
        {data.map((d, i) => {
          if (data.length > 10 && i % Math.ceil(data.length/8) !== 0) return null;
          const x = scaleX(i);
          const [day, month] = d.date.split('-');
          return <text key={i} x={x} y={height - 6} textAnchor="middle" fontSize="10" fill={isDark ? '#9CA3AF' : '#6366F1'}>{day}/{month}</text>;
        })}
      </svg>

      {/* tooltip */}
      {hoverPoint && (
        <div className={`absolute -translate-x-1/2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100'} border px-3 py-2 rounded-xl shadow-lg top-6`} style={{ left: scaleX(hoverIdx) }}>
          <div className={`text-sm font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>{hoverPoint.total.toFixed(0)} ج.م</div>
          <div className="text-xs text-gray-500 mt-1">{hoverPoint.date}</div>
        </div>
      )}
    </div>
  );
};

/* ---------- Small UI components ---------- */
const StatCard = ({ title, value, sub, icon, color='indigo', chip, isDark }) => {
  const colors = {
    indigo: {
      bg: isDark ? 'bg-gradient-to-r from-sky-500 to-pink-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-500',
      chip: isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'
    },
    red: {
      bg: isDark ? 'bg-gradient-to-r from-red-400 to-orange-300' : 'bg-gradient-to-r from-red-500 to-orange-400',
      chip: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
    },
    green: {
      bg: isDark ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : 'bg-gradient-to-r from-emerald-500 to-teal-400',
      chip: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
    }
  };
  
  return (
    <div className={`${colors[color].bg} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm opacity-90">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {sub && <div className="text-indigo-100 text-sm mt-1">{sub}</div>}
        </div>
        <div className="bg-white/20 p-3 rounded-full">{icon}</div>
      </div>
      {chip && <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm ${colors[color].chip}`}>
        {chip === 'up' ? <FiArrowUp className="mr-1"/> : <FiArrowDown className="mr-1"/>}
        {chip === 'up' ? 'ارتفاع' : 'انخفاض'}
      </div>}
    </div>
  );
};

const FilterButton = ({ children, active, onClick, isDark }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl transition font-medium ${active 
    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md' 
    : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-indigo-800 hover:bg-indigo-200'}`}`}>
    {children}
  </button>
);

export default ChartPage;