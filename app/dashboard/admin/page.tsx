import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-balance">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">1,254</div>
            <CardDescription>Active users</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">8,342</div>
            <CardDescription>This month</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">78%</div>
            <CardDescription>User retention</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">$12.5K</div>
            <CardDescription>This month</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>Latest user registrations and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4 last:border-b-0">
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">Joined today • 3 workouts completed</p>
            </div>
            <div className="border-b pb-4 last:border-b-0">
              <p className="font-medium">Mike Chen</p>
              <p className="text-sm text-muted-foreground">Joined 2 days ago • 12 workouts completed</p>
            </div>
            <div>
              <p className="font-medium">Emma Davis</p>
              <p className="text-sm text-muted-foreground">Joined 5 days ago • 25 workouts completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
