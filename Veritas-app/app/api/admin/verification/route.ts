import { NextRequest, NextResponse } from "next/server";

interface VerificationAction {
  id: string;
  claimId: number;
  action: "approve" | "reject" | "flag" | "pending";
  notes: string;
  timestamp: string;
  adminId: string;
  status: "completed" | "pending" | "failed";
}

interface PendingClaim {
  id: number;
  text: string;
  source: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  flagged: boolean;
  status: "pending" | "approved" | "rejected" | "flagged";
  category: string;
  aiConfidence?: number;
  metadata: {
    url?: string;
    platform?: string;
    shares?: number;
    likes?: number;
  };
}

// In-memory storage for demo purposes
let verificationActions: VerificationAction[] = [];

let pendingClaims: PendingClaim[] = [
  {
    id: 1,
    text: "Breaking: Major earthquake hits California, magnitude 8.2",
    source: "Twitter User @NewsAlert2024",
    timestamp: "2024-01-15T10:30:00Z",
    priority: "high",
    flagged: false,
    status: "pending",
    category: "Natural Disaster",
    aiConfidence: 0.23,
    metadata: {
      url: "https://twitter.com/NewsAlert2024/status/123456",
      platform: "Twitter",
      shares: 15420,
      likes: 8934,
    },
  },
  {
    id: 2,
    text: "New study shows coffee consumption reduces cancer risk by 40%",
    source: "Facebook Post - Health News Today",
    timestamp: "2024-01-15T09:15:00Z",
    priority: "medium",
    flagged: true,
    status: "pending",
    category: "Health",
    aiConfidence: 0.67,
    metadata: {
      url: "https://facebook.com/healthnews/posts/789012",
      platform: "Facebook",
      shares: 2341,
      likes: 5672,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const limit = searchParams.get("limit");
    const type = searchParams.get("type");

    if (type === "pending") {
      let filteredClaims = [...pendingClaims];

      // Filter by status
      if (status && status !== "all") {
        filteredClaims = filteredClaims.filter(claim => claim.status === status);
      }

      // Filter by priority
      if (priority && priority !== "all") {
        filteredClaims = filteredClaims.filter(claim => claim.priority === priority);
      }

      // Limit results
      if (limit) {
        filteredClaims = filteredClaims.slice(0, parseInt(limit));
      }

      // Sort by priority and timestamp
      filteredClaims.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      return NextResponse.json({
        success: true,
        data: filteredClaims,
        total: filteredClaims.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Return verification actions
    let actions = [...verificationActions];

    // Sort by timestamp (newest first)
    actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit results
    if (limit) {
      actions = actions.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: actions,
      total: actions.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error fetching verification data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verification data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, action, notes = "", adminId = "unknown" } = body;

    if (!claimId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim ID and action are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate action
    if (!["approve", "reject", "flag", "pending"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Must be approve, reject, flag, or pending",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find the claim
    const claimIndex = pendingClaims.findIndex(claim => claim.id === claimId);
    if (claimIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const timestamp = new Date().toISOString();

    // Create verification action record
    const verificationAction: VerificationAction = {
      id: Date.now().toString(),
      claimId,
      action,
      notes,
      timestamp,
      adminId,
      status: "completed",
    };

    // Update claim status based on action
    let newStatus: "pending" | "approved" | "rejected" | "flagged";
    switch (action) {
      case "approve":
        newStatus = "approved";
        break;
      case "reject":
        newStatus = "rejected";
        break;
      case "flag":
        newStatus = "flagged";
        pendingClaims[claimIndex].flagged = true;
        break;
      default:
        newStatus = "pending";
    }

    pendingClaims[claimIndex].status = newStatus;

    // Add to verification actions log
    verificationActions.unshift(verificationAction);

    // In a real app, you would:
    // 1. Update database with claim status
    // 2. Send notifications to relevant parties
    // 3. Update analytics/metrics
    // 4. Log the action for audit purposes
    // 5. Trigger any downstream workflows

    // Simulate different actions
    switch (action) {
      case "approve":
        console.log(`Claim ${claimId} approved by ${adminId}. Updating public verification status.`);
        break;
      case "reject":
        console.log(`Claim ${claimId} rejected by ${adminId}. Reason: ${notes}`);
        break;
      case "flag":
        console.log(`Claim ${claimId} flagged by ${adminId} for further review. Notes: ${notes}`);
        break;
      default:
        console.log(`Claim ${claimId} action: ${action} by ${adminId}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        action: verificationAction,
        updatedClaim: pendingClaims[claimIndex],
      },
      message: `Verification action "${action}" completed successfully`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error processing verification action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process verification action",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, updates, adminId = "unknown" } = body;

    if (!claimId || !updates) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim ID and updates are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find the claim
    const claimIndex = pendingClaims.findIndex(claim => claim.id === claimId);
    if (claimIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Update claim with provided updates
    const updatedClaim = {
      ...pendingClaims[claimIndex],
      ...updates,
    };

    pendingClaims[claimIndex] = updatedClaim;

    // Log the update action
    const updateAction: VerificationAction = {
      id: Date.now().toString(),
      claimId,
      action: "pending", // Updates don't change verification status
      notes: `Claim updated: ${Object.keys(updates).join(", ")}`,
      timestamp: new Date().toISOString(),
      adminId,
      status: "completed",
    };

    verificationActions.unshift(updateAction);

    console.log(`Claim ${claimId} updated by ${adminId}:`, updates);

    return NextResponse.json({
      success: true,
      data: {
        action: updateAction,
        updatedClaim,
      },
      message: "Claim updated successfully",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error updating claim:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update claim",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get("claimId");
    const adminId = searchParams.get("adminId");

    if (!claimId) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim ID is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find and remove claim
    const claimIndex = pendingClaims.findIndex(claim => claim.id === parseInt(claimId));
    if (claimIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const deletedClaim = pendingClaims.splice(claimIndex, 1)[0];

    // Log the deletion action
    const deleteAction: VerificationAction = {
      id: Date.now().toString(),
      claimId: parseInt(claimId),
      action: "pending", // Special case for deletions
      notes: "Claim deleted permanently",
      timestamp: new Date().toISOString(),
      adminId: adminId || "unknown",
      status: "completed",
    };

    verificationActions.unshift(deleteAction);

    console.log(`Claim ${claimId} deleted by ${adminId || "unknown"}`);

    return NextResponse.json({
      success: true,
      data: {
        action: deleteAction,
        deletedClaim,
      },
      message: "Claim deleted successfully",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error deleting claim:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete claim",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
