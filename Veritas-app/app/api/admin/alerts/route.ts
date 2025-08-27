import { NextRequest, NextResponse } from "next/server";

interface SystemAlert {
  id: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: string;
  adminId: string;
  status: "active" | "dismissed";
  recipients: "all" | "admins" | "moderators";
  priority: "low" | "medium" | "high";
}

// In-memory storage for demo purposes
// In a real app, this would be a database
let alerts: SystemAlert[] = [
  {
    id: "1",
    message: "System maintenance scheduled for tonight at 2 AM UTC",
    type: "info",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    adminId: "admin-1",
    status: "active",
    recipients: "all",
    priority: "medium",
  },
  {
    id: "2",
    message: "High volume of verification requests detected",
    type: "warning",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    adminId: "admin-1",
    status: "active",
    recipients: "admins",
    priority: "high",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");

    let filteredAlerts = [...alerts];

    // Filter by status
    if (status && status !== "all") {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    // Filter by type
    if (type && type !== "all") {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
    }

    // Limit results
    if (limit) {
      filteredAlerts = filteredAlerts.slice(0, parseInt(limit));
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch alerts",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, type, recipients = "all", priority = "medium", adminId } = body;

    // Validate required fields
    if (!message || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Message and type are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!["info", "warning", "error"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid alert type. Must be info, warning, or error",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Create new alert
    const newAlert: SystemAlert = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
      adminId: adminId || "unknown",
      status: "active",
      recipients,
      priority,
    };

    // Add to alerts array
    alerts.unshift(newAlert);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send real-time notifications via WebSocket/SSE
    // 3. Send email/SMS notifications based on priority
    // 4. Log the action for audit purposes

    // Simulate notification dispatch
    console.log(`Alert published: ${message} (Type: ${type}, Priority: ${priority})`);

    // Mock notification dispatch based on recipients and priority
    if (priority === "high") {
      console.log("Sending immediate notifications for high priority alert");
    }

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: "Alert published successfully",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create alert",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminId } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert ID is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find and update alert
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Update alert status
    if (status) {
      alerts[alertIndex].status = status;
    }

    console.log(`Alert ${id} updated by admin ${adminId || "unknown"}`);

    return NextResponse.json({
      success: true,
      data: alerts[alertIndex],
      message: "Alert updated successfully",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update alert",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert ID is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find and remove alert
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const deletedAlert = alerts.splice(alertIndex, 1)[0];

    console.log(`Alert ${id} deleted`);

    return NextResponse.json({
      success: true,
      data: deletedAlert,
      message: "Alert deleted successfully",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error deleting alert:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete alert",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
