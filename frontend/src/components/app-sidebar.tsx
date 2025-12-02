import { Car, Home, Settings, User, UserPlus2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: UserPlus2,
  },
  {
    title: "Cars",
    url: "/dashboard/cars",
    icon: Car,
  },
  {
    title: "Account",
    url: "/dashboard/account",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const {open}= useSidebar();
  const isActive = useLocation()
  // console.log("loc", isActive.pathname)
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="text-blue-400 text-xl text-center font-bold">
        {open ? "DriveDeck" : (
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-1 rounded-lg">
            <Car className="text-white" size={24} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive.pathname === item.url}>
                      <Link to={item.url} >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}