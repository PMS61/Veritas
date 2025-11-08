import { 
  Home, 
  Shield, 
  Eye, 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Mail, 
  Info, 
  User, 
  Settings,
  LogOut,
  Monitor,
  Search,
  Globe,
  Calendar,
  Bell,
  HelpCircle,
  BookOpen,
  FileCheck,
  Activity,
  Server
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  requiresAuth?: boolean;
  requiresNoAuth?: boolean;
}

// Public navigation items (simplified for landing page)
export const publicNavItems: NavItem[] = [
  {
    title: "Verify Information",
    href: "/verify",
    icon: Shield,
    description: "Verify claims and check facts"
  },
  {
    title: "Truth Updates",
    href: "/updates",
    icon: Eye,
    description: "Latest verified information"
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
    description: "Learn about Veritas"
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Get in touch with us"
  }
];

// Authenticated user navigation items
export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Activity,
    description: "Your verification dashboard"
  },
  {
    title: "Verify Information",
    href: "/dashboard/verify",
    icon: Shield,
    description: "Verify claims and check facts"
  },
  {
    title: "Truth Updates",
    href: "/dashboard/updates",
    icon: Eye,
    description: "Latest verified information"
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "View detailed analytics"
  },
  {
    title: "Trending Topics",
    href: "/dashboard/trends",
    icon: TrendingUp,
    description: "See trending verifications"
  },
  {
    title: "Reports",
    href: "/dashboard/report",
    icon: FileText,
    description: "Generate reports"
  }
];

// Authentication-related navigation items
export const authNavItems: NavItem[] = [
  {
    title: "Sign In",
    href: "/login",
    icon: User,
    requiresNoAuth: true,
    description: "Log into your account"
  },
  {
    title: "Sign Up",
    href: "/register",
    icon: Users,
    requiresNoAuth: true,
    description: "Create new account"
  },
  {
    title: "Logout",
    href: "#",
    icon: LogOut,
    requiresAuth: true,
    description: "Sign out of your account"
  }
];

// All navigation items combined
export const allNavItems: NavItem[] = [
  ...publicNavItems,
  ...dashboardNavItems,
  ...authNavItems
];

// Function to get navigation items based on user authentication status
export const getPublicNavItems = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    // Show dashboard nav items when logged in
    return [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Activity,
        description: "Your verification dashboard"
      },
      {
        title: "Verify Information",
        href: "/dashboard/verify",
        icon: Shield,
        description: "Verify claims and check facts"
      },
      {
        title: "Truth Updates",
        href: "/dashboard/updates",
        icon: Eye,
        description: "Latest verified information"
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        description: "View detailed analytics"
      },
      {
        title: "Trending Topics",
        href: "/dashboard/trends",
        icon: TrendingUp,
        description: "See trending verifications"
      },
      {
        title: "Reports",
        href: "/dashboard/report",
        icon: FileText,
        description: "Generate reports"
      }
    ];
  } else {
    // Show only basic public items when logged out (no auth buttons - they're in user actions)
    return [
      {
        title: "About",
        href: "/about",
        icon: Info,
        description: "Learn about Veritas"
      },
      {
        title: "Contact",
        href: "/contact",
        icon: Mail,
        description: "Get in touch with us"
      }
    ];
  }
};

export const getDashboardNavItems = (isLoggedIn: boolean) => {
  const baseItems = [...dashboardNavItems];
  
  if (isLoggedIn) {
    baseItems.push({
      title: "Public Portal",
      href: "/",
      icon: Globe,
      description: "Return to public portal"
    });
  }
  
  return baseItems;
};

// Function to get footer navigation items (public pages for easy access)
export const getFooterNavItems = () => {
  return [
    ...publicNavItems,
    {
      title: "Terms of Service",
      href: "/terms",
      icon: FileText,
      description: "Our terms and conditions"
    },
    {
      title: "Privacy Policy",
      href: "/privacy",
      icon: Shield,
      description: "Your privacy rights"
    },
    {
      title: "Documentation",
      href: "/help",
      icon: HelpCircle,
      description: "Learn how to use Veritas"
    }
  ];
};