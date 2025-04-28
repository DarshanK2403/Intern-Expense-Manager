import axios from "axios";
import { format } from "date-fns";
import { Clock, Activity, User, DollarSign, Filter } from "lucide-react";
import { useEffect, useState } from "react";

const History = () => {
  const token = localStorage.getItem("Token");
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const ActivityLog = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/activity-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivityLogs(res.data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    ActivityLog();
  }, [token]);

  // Get icon and color based on activity type
  const getActivityIconAndColor = (actionType) => {
    // Default styling
    let icon = <Activity className="w-5 h-5 text-purple-500" />;
    let bgColor = "bg-purple-100";
    let borderColor = "border-purple-200";
    let hoverBorderColor = "group-hover:border-purple-400";

    // Color scheme based on action categories
    if (!actionType) return { icon, bgColor, borderColor, hoverBorderColor };

    // Expense activities
    if (actionType.includes("EXPENSE")) {
      icon = <DollarSign className="w-5 h-5 text-red-500" />;
      bgColor = "bg-red-50";
      borderColor = "border-red-200";
      hoverBorderColor = "group-hover:border-red-400";
    }
    // Income activities
    else if (actionType.includes("INCOME")) {
      icon = <DollarSign className="w-5 h-5 text-green-500" />;
      bgColor = "bg-green-50";
      borderColor = "border-green-200";
      hoverBorderColor = "group-hover:border-green-400";
    }
    // Vendor activities
    else if (actionType.includes("VENDOR")) {
      icon = <User className="w-5 h-5 text-blue-500" />;
      bgColor = "bg-blue-50";
      borderColor = "border-blue-200";
      hoverBorderColor = "group-hover:border-blue-400";
    }
    // Report activities
    else if (actionType.includes("REPORT")) {
      icon = <Activity className="w-5 h-5 text-amber-500" />;
      bgColor = "bg-amber-50";
      borderColor = "border-amber-200";
      hoverBorderColor = "group-hover:border-amber-400";  
    }
    // Profile activities
    else if (actionType.includes("PROFILE")) {
      icon = <User className="w-5 h-5 text-indigo-500" />;
      bgColor = "bg-indigo-50";
      borderColor = "border-indigo-200";
      hoverBorderColor = "group-hover:border-indigo-400";
    }

    return { icon, bgColor, borderColor, hoverBorderColor };
  };

  // Action-specific styling for card
  const getActionTypeStyles = (actionType) => {
    // Create operations
    if (actionType?.includes("CREATE")) {
      return "border-l-4 border-l-green-500";
    }
    // Update operations
    else if (actionType?.includes("UPDATE")) {
      return "border-l-4 border-l-blue-500";
    }
    // Delete operations
    else if (actionType?.includes("DELETE")) {
      return "border-l-4 border-l-red-500";
    }
    // Generate operations
    else if (actionType?.includes("GENERATE")) {
      return "border-l-4 border-l-purple-500";
    }

    return "";
  };

  // Group logs by date for better organization
  const groupedLogs = activityLogs.reduce((groups, log) => {
    const date = format(new Date(log.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {});

  // Filter logs based on selected filter
  const filteredLogs = (logs) => {
    if (filter === "all") return logs;

    return logs.filter((log) => {
      if (filter === "expense" && log.actionType?.includes("EXPENSE"))
        return true;
      if (filter === "income" && log.actionType?.includes("INCOME"))
        return true;
      if (filter === "vendor" && log.actionType?.includes("VENDOR"))
        return true;
      if (filter === "report" && log.actionType?.includes("REPORT"))
        return true;
      if (filter === "profile" && log.actionType?.includes("PROFILE"))
        return true;
      return false;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header section with title and filters */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Activity History
            </h1>
            <p className="text-gray-500 mt-1">
              Track all changes and activities in your account
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <select
              className="bg-transparent text-sm focus:outline-none py-1 pr-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
              <option value="vendor">Vendors</option>
              <option value="report">Reports</option>
              <option value="profile">Profile</option>
            </select>
          </div>
        </div>

        {/* Legend for color coding */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="text-gray-500 font-medium">Action Types:</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Create</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Update</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Delete</span>
            </div>
          </div>
        </div>

        {/* Timeline content */}
        <div className="relative p-6">
          {/* Timeline line */}
          <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-gray-200"></div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 font-medium">
                No activities recorded yet
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Activity logs will appear here as you use the application
              </p>
            </div>
          ) : (
            Object.keys(groupedLogs)
              .sort((a, b) => new Date(b) - new Date(a))
              .map((date) => {
                const logsForDate = filteredLogs(groupedLogs[date]);

                if (logsForDate.length === 0) return null;

                return (
                  <div key={date} className="mb-8">
                    {/* Date header */}
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm">
                        {format(new Date(date), "EEEE, MMMM d, yyyy")}
                      </div>
                      <div className="ml-4 h-0.5 flex-grow bg-gray-100"></div>
                    </div>

                    {/* Logs for this date */}
                    {logsForDate.map((log) => {
                      const { icon, bgColor, borderColor, hoverBorderColor } =
                        getActivityIconAndColor(log.actionType);
                      const actionTypeStyle = getActionTypeStyles(
                        log.actionType
                      );

                      return (
                        <div key={log._id} className="flex mb-6 group">
                          {/* Icon circle */}
                          <div className="relative z-10 flex items-center justify-center w-16">
                            <div
                              className={`w-10 h-10 rounded-full bg-white border-2 ${borderColor} ${hoverBorderColor} flex items-center justify-center transition-colors duration-200`}
                            >
                              {icon}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-grow">
                            <div
                              className={`${bgColor} rounded-lg border border-gray-200 ${actionTypeStyle} p-4 shadow-sm hover:shadow-md transition-all duration-200`}
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-gray-800 font-medium">
                                  {log.description}
                                </p>

                                {log.actionType && (
                                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    {log.actionType.replace(/_/g, " ")}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center text-sm text-gray-500 mt-3">
                                <Clock className="w-4 h-4 mr-1" />
                                {format(new Date(log.createdAt), "h:mm a")}

                                {log.user && (
                                  <span className="ml-4 flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {log.user.name || "User"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
