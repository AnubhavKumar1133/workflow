"use client"

type TaskStatsProps = {
  taskStats: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
  priorityStats: {
    high: number
    medium: number
    low: number
  }
}

export function TaskStats({ taskStats, priorityStats }: TaskStatsProps) {
  // Calculate percentages
  const getPercentage = (count: number) => {
    return taskStats.total > 0 ? Math.round((count / taskStats.total) * 100) : 0
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-sm font-medium">Tasks by Status</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
                <span>Pending</span>
              </div>
              <span>
                {taskStats.pending} ({getPercentage(taskStats.pending)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-400"
                style={{ width: `${getPercentage(taskStats.pending)}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
                <span>In Progress</span>
              </div>
              <span>
                {taskStats.inProgress} ({getPercentage(taskStats.inProgress)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-400"
                style={{ width: `${getPercentage(taskStats.inProgress)}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                <span>Completed</span>
              </div>
              <span>
                {taskStats.completed} ({getPercentage(taskStats.completed)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-400"
                style={{ width: `${getPercentage(taskStats.completed)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium">Tasks by Priority</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
                <span>High</span>
              </div>
              <span>
                {priorityStats.high} ({getPercentage(priorityStats.high)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-red-400"
                style={{ width: `${getPercentage(priorityStats.high)}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                <span>Medium</span>
              </div>
              <span>
                {priorityStats.medium} ({getPercentage(priorityStats.medium)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${getPercentage(priorityStats.medium)}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                <span>Low</span>
              </div>
              <span>
                {priorityStats.low} ({getPercentage(priorityStats.low)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-400"
                style={{ width: `${getPercentage(priorityStats.low)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
