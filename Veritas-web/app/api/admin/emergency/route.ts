import { NextRequest, NextResponse } from "next/server";

interface EmergencyAction {
  id: string;
  action: string;
  timestamp: string;
  adminId: string;
  status: "executed" | "pending" | "failed";
  description: string;
  affectedSystems: string[];
  rollbackAvailable: boolean;
}

interface SystemState {
  manualReviewMode: boolean;
  aiVerificationEnabled: boolean;
  crisisMode: boolean;
  lastUpdated: string;
  updatedBy: string;
}

// In-memory storage for demo purposes
let systemState: SystemState = {
  manualReviewMode: false,
  aiVerificationEnabled: true,
  crisisMode: false,
  lastUpdated: new Date().toISOString(),
  updatedBy: "system",
};

let emergencyActions: EmergencyAction[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    let actions = [...emergencyActions];

    // Sort by timestamp (newest first)
    actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit results
    if (limit) {
      actions = actions.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: {
        systemState,
        recentActions: actions,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error fetching emergency actions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency actions",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, adminId, reason = "" } = body;

    if (!action || !adminId) {
      return NextResponse.json(
        {
          success: false,
          error: "Action and admin ID are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    let actionResult: EmergencyAction;
    let systemUpdates: Partial<SystemState> = {};

    switch (action) {
      case "manual-review":
        actionResult = {
          id: Date.now().toString(),
          action: "manual-review",
          timestamp,
          adminId,
          status: "executed",
          description: "Enabled manual review mode - all new claims require human verification",
          affectedSystems: ["verification-engine", "ai-processor", "claim-pipeline"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          manualReviewMode: true,
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      case "disable-ai":
        actionResult = {
          id: Date.now().toString(),
          action: "disable-ai",
          timestamp,
          adminId,
          status: "executed",
          description: "Disabled AI verification system - switching to manual verification only",
          affectedSystems: ["ai-verification", "machine-learning-pipeline", "auto-verification"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          aiVerificationEnabled: false,
          manualReviewMode: true, // Auto-enable manual review when AI is disabled
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      case "crisis-mode":
        actionResult = {
          id: Date.now().toString(),
          action: "crisis-mode",
          timestamp,
          adminId,
          status: "executed",
          description: "Activated crisis mode - enhanced monitoring and restricted operations",
          affectedSystems: ["monitoring", "alerts", "verification-pipeline", "user-permissions"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          crisisMode: true,
          manualReviewMode: true, // Auto-enable manual review in crisis mode
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      case "disable-manual-review":
        actionResult = {
          id: Date.now().toString(),
          action: "disable-manual-review",
          timestamp,
          adminId,
          status: "executed",
          description: "Disabled manual review mode - returning to automatic verification",
          affectedSystems: ["verification-engine", "claim-pipeline"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          manualReviewMode: false,
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      case "enable-ai":
        actionResult = {
          id: Date.now().toString(),
          action: "enable-ai",
          timestamp,
          adminId,
          status: "executed",
          description: "Enabled AI verification system - resuming automatic verification",
          affectedSystems: ["ai-verification", "machine-learning-pipeline", "auto-verification"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          aiVerificationEnabled: true,
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      case "disable-crisis-mode":
        actionResult = {
          id: Date.now().toString(),
          action: "disable-crisis-mode",
          timestamp,
          adminId,
          status: "executed",
          description: "Deactivated crisis mode - returning to normal operations",
          affectedSystems: ["monitoring", "alerts", "verification-pipeline", "user-permissions"],
          rollbackAvailable: true,
        };
        systemUpdates = {
          crisisMode: false,
          lastUpdated: timestamp,
          updatedBy: adminId,
        };
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown emergency action: ${action}`,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }

    // Update system state
    systemState = { ...systemState, ...systemUpdates };

    // Add to emergency actions log
    emergencyActions.unshift(actionResult);

    // In a real app, you would:
    // 1. Update database with new system state
    // 2. Send notifications to all admins
    // 3. Log the action for compliance/audit
    // 4. Update monitoring systems
    // 5. Potentially restart affected services
    // 6. Create rollback procedures

    // Simulate system notifications
    console.log(`EMERGENCY ACTION EXECUTED: ${action} by ${adminId}`);
    console.log(`System state updated:`, systemUpdates);
    console.log(`Affected systems:`, actionResult.affectedSystems);

    // Send immediate alerts for critical actions
    if (["crisis-mode", "disable-ai"].includes(action)) {
      console.log("CRITICAL: Sending immediate notifications to all administrators");
    }

    return NextResponse.json({
      success: true,
      data: {
        action: actionResult,
        systemState,
        message: `Emergency action "${action}" executed successfully`,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error executing emergency action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute emergency action",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, operation, adminId } = body;

    if (!actionId || !operation || !adminId) {
      return NextResponse.json(
        {
          success: false,
          error: "Action ID, operation, and admin ID are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const action = emergencyActions.find(a => a.id === actionId);
    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Emergency action not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (operation === "rollback" && action.rollbackAvailable) {
      const timestamp = new Date().toISOString();

      // Create rollback action
      const rollbackAction: EmergencyAction = {
        id: Date.now().toString(),
        action: `rollback-${action.action}`,
        timestamp,
        adminId,
        status: "executed",
        description: `Rolled back "${action.action}" - restoring previous system state`,
        affectedSystems: action.affectedSystems,
        rollbackAvailable: false,
      };

      // Determine rollback system updates
      let rollbackUpdates: Partial<SystemState> = {};

      switch (action.action) {
        case "manual-review":
          rollbackUpdates = { manualReviewMode: false };
          break;
        case "disable-ai":
          rollbackUpdates = { aiVerificationEnabled: true, manualReviewMode: false };
          break;
        case "crisis-mode":
          rollbackUpdates = { crisisMode: false, manualReviewMode: false };
          break;
      }

      rollbackUpdates.lastUpdated = timestamp;
      rollbackUpdates.updatedBy = adminId;

      // Apply rollback
      systemState = { ...systemState, ...rollbackUpdates };
      emergencyActions.unshift(rollbackAction);

      console.log(`EMERGENCY ROLLBACK: ${action.action} rolled back by ${adminId}`);

      return NextResponse.json({
        success: true,
        data: {
          rollbackAction,
          systemState,
          message: `Emergency action "${action.action}" rolled back successfully`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid operation or rollback not available",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error processing emergency action operation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process emergency action operation",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
