import { Card, CardContent } from "@/components/ui/card";
import { Users, Send, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function StatsBar() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => api.getStats(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="ml-4">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const responseRate = stats?.messagesSent > 0 
    ? ((stats.responses / stats.messagesSent) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Leads Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.leadsGenerated || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.messagesSent || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
