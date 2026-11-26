import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  FileText,
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { StatCard } from '../../components/StatCard';
import { StatusPill } from '../../components/StatusPill';
import { adminApi, OverviewStats, RegistrationChartData, DonationChartItem } from '../../api/adminApi';

const ROLE_COLORS = ['#34d399', '#38bdf8', '#fbbf24', '#a78bfa'];

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [regData, setRegData] = useState<RegistrationChartData | null>(null);
  const [donationsData, setDonationsData] = useState<DonationChartItem[]>([]);
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [overviewRes, regRes, donRes] = await Promise.all([
          adminApi.getOverview(),
          adminApi.getRegistrationsChart(daysFilter),
          adminApi.getDonationsChart(),
        ]);
        setStats(overviewRes);
        setRegData(regRes);
        setDonationsData(donRes);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [daysFilter]);

  if (isLoading && !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Platform Metrics
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time analytics across foundation activities
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="inline-flex rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#071f14] p-1 text-xs">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDaysFilter(d)}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                daysFilter === d
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Registered foundation supporters"
          icon={Users}
        />
        <StatCard
          title="New Users (This Month)"
          value={stats?.newUsersThisMonth || 0}
          subtitle="Recent registrations"
          icon={UserPlus}
          trend={{ value: 'Active', isPositive: true }}
        />
        <StatCard
          title="Pending Applications"
          value={stats?.pendingApplications || 0}
          subtitle="Volunteer & internship reviews"
          icon={FileText}
        />
        <StatCard
          title="Donations This Month"
          value={`₹${(stats?.donationsThisMonthAmount || 0).toLocaleString('en-IN')}`}
          subtitle={`${stats?.donationsThisMonthCount || 0} contributions`}
          icon={IndianRupee}
          trend={{ value: 'Monthly Total', isPositive: true }}
        />
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registrations over time (Line chart) */}
        <div className="lg:col-span-2 rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white font-heading">
              User Registrations Trend ({daysFilter} Days)
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Daily Growth
            </span>
          </div>

          <div className="h-64 w-full">
            {regData?.timeline && regData.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regData.timeline}>
                  <XAxis
                    dataKey="date"
                    stroke="#52525b"
                    fontSize={11}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis stroke="#52525b" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071f14',
                      borderColor: 'rgba(110,231,183,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Registrations"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ fill: '#34d399', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                No registration records in this range
              </div>
            )}
          </div>
        </div>

        {/* Users by Role (Donut chart) */}
        <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white font-heading mb-4">
            User Composition
          </h3>

          <div className="h-48 w-full flex-1">
            {regData?.roles && regData.roles.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regData.roles}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {regData.roles.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071f14',
                      borderColor: 'rgba(110,231,183,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                No user role distribution data
              </div>
            )}
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[rgba(110,231,183,0.1)] text-[11px]">
            {regData?.roles.map((r, idx) => (
              <div key={r.name} className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-zinc-400">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: ROLE_COLORS[idx % ROLE_COLORS.length] }}
                  />
                  {r.name}
                </span>
                <span className="font-bold text-white mt-0.5">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donations per Month Bar Chart */}
      <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-5">
        <h3 className="text-sm font-semibold text-white font-heading mb-4">
          Monthly Donations Received (INR)
        </h3>

        <div className="h-56 w-full">
          {donationsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationsData}>
                <XAxis dataKey="month" stroke="#52525b" fontSize={11} />
                <YAxis
                  stroke="#52525b"
                  fontSize={11}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071f14',
                    borderColor: 'rgba(110,231,183,0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-500">
              No donation metrics available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: Pending Applications & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Newest Pending Applications */}
        <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white font-heading">
              New Pending Applications
            </h3>
            <Link
              to="/admin/applications"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-[rgba(110,231,183,0.08)]">
            {stats?.recentApplications && stats.recentApplications.length > 0 ? (
              stats.recentApplications.map((app: any) => (
                <div key={app.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {app.applicantName}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {app.email} • <span className="capitalize">{app.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={app.status} size="sm" />
                    <Link
                      to="/admin/applications"
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No pending applications to review
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Events */}
        <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white font-heading">
              Recent System Activity
            </h3>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Audit Log
            </span>
          </div>

          <div className="flex-1 divide-y divide-[rgba(110,231,183,0.08)]">
            {stats?.recentAudit && stats.recentAudit.length > 0 ? (
              stats.recentAudit.slice(0, 5).map((log: any) => (
                <div key={log.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-300">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    by {log.actor_email} • {log.entity_type} ({log.entity_id.slice(0, 8)}...)
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No audit entries recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
