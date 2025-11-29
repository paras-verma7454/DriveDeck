import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { DropdownMenuDemo } from "@/components/Menu"
import { Outlet } from "react-router-dom"




const Home = () => {
  if (!localStorage.getItem("Authorization")) {
    window.location.href = "/";
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar/>
        <main className='w-full m-2 '>
            <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4'>
                <SidebarTrigger  className="cursor-pointer"/>
                {/* <SearchBar/> */}
                <div className="ml-auto"></div>
                <ModeToggle />
                <DropdownMenuDemo/>
                {/* <UserButton appearance={userButtonAppearance}/> */}
            </div>
            <div className="h-3"></div>
            <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-auto h-[calc(100vh-82px)] p-4'>
                <Outlet/>
            </div>
          </main>
      </SidebarProvider>
    </>
  )
}

export default Home