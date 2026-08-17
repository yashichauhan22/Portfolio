import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Project } from '../types';

interface ProjectContributionsChartProps {
  projects: Project[];
  currentEditingTimeline?: string;
  onSelectYearFilter?: (year: string) => void;
}

interface TimelineDataPoint {
  period: string;
  count: number;
  projects: { id: string; title: string; role: string; tech: string[] }[];
  techCount: number;
  highlighted?: boolean;
}

export const ProjectContributionsChart: React.FC<ProjectContributionsChartProps> = ({
  projects,
  currentEditingTimeline,
  onSelectYearFilter,
}) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'frequency' | 'techContributions'>('frequency');

  // Parse timelines and aggregate data by Year/Period
  const chartData = useMemo(() => {
    // Map of period to project array
    const periodMap = new Map<string, { id: string; title: string; role: string; tech: string[] }[]>();

    // Seed default baseline timeline years if sparse
    const baselineYears = ['2023', '2024', '2025', '2026'];
    baselineYears.forEach((yr) => periodMap.set(yr, []));

    projects.forEach((proj) => {
      // Extract 4-digit years from timeline string, e.g. "2024 — 2025" or "2025"
      const years = proj.timeline.match(/\b(20\d{2})\b/g);
      if (years && years.length > 0) {
        years.forEach((yr) => {
          if (!periodMap.has(yr)) {
            periodMap.set(yr, []);
          }
          const list = periodMap.get(yr)!;
          if (!list.some((p) => p.id === proj.id)) {
            list.push({
              id: proj.id,
              title: proj.title,
              role: proj.role,
              tech: proj.techStack || [],
            });
          }
        });
      } else {
        // Fallback to "2025" or raw string
        const key = proj.timeline.trim() || '2025';
        if (!periodMap.has(key)) periodMap.set(key, []);
        periodMap.get(key)!.push({
          id: proj.id,
          title: proj.title,
          role: proj.role,
          tech: proj.techStack || [],
        });
      }
    });

    // Sort periods chronologically
    const sortedKeys = Array.from(periodMap.keys()).sort((a, b) => a.localeCompare(b));

    const result: TimelineDataPoint[] = sortedKeys.map((period) => {
      const projs = periodMap.get(period) || [];
      const uniqueTech = new Set<string>();
      projs.forEach((p) => p.tech.forEach((t) => uniqueTech.add(t)));

      const isCurrentEditing = currentEditingTimeline && currentEditingTimeline.includes(period);

      return {
        period,
        count: projs.length,
        projects: projs,
        techCount: uniqueTech.size,
        highlighted: Boolean(isCurrentEditing),
      };
    });

    return result;
  }, [projects, currentEditingTimeline]);

  // Overall metrics
  const totalProjects = projects.length;
  const peakYear = useMemo(() => {
    if (chartData.length === 0) return 'N/A';
    const sorted = [...chartData].sort((a, b) => b.count - a.count);
    return sorted[0].count > 0 ? `${sorted[0].period} (${sorted[0].count} projects)` : '2025';
  }, [chartData]);

  const activeTechStackCount = useMemo(() => {
    const all = new Set<string>();
    projects.forEach((p) => p.techStack?.forEach((t) => all.add(t)));
    return all.size;
  }, [projects]);

  return (
    <div className="bg-[#eeeeec] border border-[#c4c5d9] p-4 sm:p-6 space-y-4 sm:space-y-5 font-['Inter']">
      {/* Header with Title & Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c4c5d9]/60 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#0040e0] text-base sm:text-lg">bar_chart</span>
            <h4 className="font-['Inter'] font-bold text-xs sm:text-sm text-[#1a1c1b] uppercase tracking-wider">
              Project Contribution & Timeline Frequency
            </h4>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-[#5e5e5e] mt-0.5">
            Tracking output cadence and case study velocity over time
          </p>
        </div>

        <div className="flex items-center self-start sm:self-auto space-x-1 bg-[#e2e2e0] p-1 border border-[#c4c5d9]">
          <button
            type="button"
            onClick={() => setViewMode('frequency')}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'frequency'
                ? 'bg-[#121212] text-white font-bold'
                : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            Project Count
          </button>
          <button
            type="button"
            onClick={() => setViewMode('techContributions')}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'techContributions'
                ? 'bg-[#121212] text-white font-bold'
                : 'text-[#5e5e5e] hover:text-black'
            }`}
          >
            Tech Breadth
          </button>
        </div>
      </div>

      {/* Metric Quick Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-[#f9f9f7] p-2.5 sm:p-3 border border-[#c4c5d9]/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
          <span className="font-mono text-[10px] uppercase text-[#747688] block">Total Case Studies</span>
          <span className="font-['Inter'] text-base sm:text-lg font-bold text-[#1a1c1b]">{totalProjects}</span>
        </div>
        <div className="bg-[#f9f9f7] p-2.5 sm:p-3 border border-[#c4c5d9]/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
          <span className="font-mono text-[10px] uppercase text-[#747688] block">Peak Velocity</span>
          <span className="font-['Inter'] text-xs sm:text-sm font-bold text-[#0040e0] truncate block">{peakYear}</span>
        </div>
        <div className="bg-[#f9f9f7] p-2.5 sm:p-3 border border-[#c4c5d9]/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
          <span className="font-mono text-[10px] uppercase text-[#747688] block">Stack Breadth</span>
          <span className="font-['Inter'] text-base sm:text-lg font-bold text-[#1a1c1b]">{activeTechStackCount} Techs</span>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-48 sm:h-56 md:h-60 bg-[#f9f9f7] border border-[#c4c5d9]/80 p-2 sm:p-3 pt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveBarIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0de" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: '#5e5e5e', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#c4c5d9' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#5e5e5e', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#c4c5d9' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TimelineDataPoint;
                  return (
                    <div className="bg-[#121212] text-white p-2.5 sm:p-3 border border-[#0040e0] shadow-xl text-xs font-['Inter'] max-w-[260px] sm:max-w-xs z-50">
                      <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1 mb-1.5">
                        <span className="font-mono text-[#b8c3ff] font-bold text-[10px] sm:text-[11px]">
                          TIMELINE: {data.period}
                        </span>
                        <span className="bg-[#0040e0] text-white px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono">
                          {data.count} {data.count === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>
                      {data.projects.length > 0 ? (
                        <div className="space-y-1">
                          <div className="font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase">
                            Delivered:
                          </div>
                          {data.projects.map((p, i) => (
                            <div key={i} className="text-[10px] sm:text-[11px] leading-tight">
                              <span className="text-[#84a9ff] font-medium">• {p.title}</span>
                              <div className="text-[8px] sm:text-[9px] text-neutral-400 pl-2 truncate">
                                {p.tech.slice(0, 3).join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-neutral-400 italic">No projects recorded.</div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={viewMode === 'frequency' ? 'count' : 'techCount'}
              name={viewMode === 'frequency' ? 'Projects' : 'Tech Stack Count'}
              radius={[2, 2, 0, 0]}
              maxBarSize={36}
            >
              {chartData.map((entry, index) => {
                let fill = '#0040e0';
                if (entry.highlighted) {
                  fill = '#00268a';
                } else if (activeBarIndex === index) {
                  fill = '#2962ff';
                } else if (entry.count === 0 && viewMode === 'frequency') {
                  fill = '#c4c5d9';
                }
                return <Cell key={`cell-${index}`} fill={fill} cursor="pointer" />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Legend & Filter Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 font-mono text-[10px] sm:text-[11px] text-[#5e5e5e]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#0040e0] inline-block"></span>
            <span>Recorded</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#00268a] inline-block"></span>
            <span>Active Form Target</span>
          </div>
        </div>

        {onSelectYearFilter && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[#747688]">Filter by:</span>
            {chartData.map((d) => (
              <button
                key={d.period}
                type="button"
                onClick={() => onSelectYearFilter(d.period)}
                className="px-1.5 py-0.5 bg-[#e2e2e0] hover:bg-[#c4c5d9] text-[#1a1c1b] transition-colors cursor-pointer border border-[#c4c5d9]/60 min-h-[24px]"
              >
                {d.period}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
