import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Image, Upload, Users, Activity } from "lucide-react";

const data = [
  { name: "Jan", uploads: 40 },
  { name: "Feb", uploads: 55 },
  { name: "Mar", uploads: 70 },
  { name: "Apr", uploads: 90 },
  { name: "May", uploads: 60 },
];

// Simple Card Components (Tailwind only)
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-md border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, className = "" }) => (
  <button className={`px-4 py-2 rounded-xl font-medium ${className}`}>
    {children}
  </button>
);

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Upload size={16} /> Upload Image
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Images"
          value="1,240"
          icon={<Image />}
          color="bg-blue-500"
        />
        <StatCard
          title="Uploads Today"
          value="85"
          icon={<Upload />}
          color="bg-green-500"
        />
        <StatCard
          title="Users"
          value="320"
          icon={<Users />}
          color="bg-purple-500"
        />
        <StatCard
          title="Activity"
          value="1,890"
          icon={<Activity />}
          color="bg-orange-500"
        />
      </div>

      {/* Chart Section */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Uploads Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="uploads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Uploads
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 font-medium shadow-sm hover:shadow-md transition"
              >
                Image {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-xl font-bold text-gray-800">{value}</h2>
        </div>
        <div className={`p-3 rounded-xl text-white ${color}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
