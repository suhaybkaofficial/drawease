"use client"
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Pencil, Image, Settings, LogOut } from "lucide-react"
import Canvas from "@/components/Canvas"
import Auth from "@/components/Auth"
import MyDrawings from "@/components/MyDrawings"
import SettingsPage from "@/components/SettingsPage"
import { authStore, getFileUrl } from '@/lib/pocketbase';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('canvas');
  const pathname = usePathname()

  useEffect(() => {
    if (authStore.isValid) {
      setIsAuthenticated(true);
      setUser(authStore.model);
    }
  }, []);

  const handleAuthSuccess = (authData) => {
    setIsAuthenticated(true);
    setUser(authData.record);
  };

  const handleLogout = () => {
    authStore.clear();
    setIsAuthenticated(false);
    setUser(null);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full justify-center items-center ">
                  <SidebarContent activePage={activePage} setActivePage={setActivePage} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold text-[#265AFF]">DrawEase</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user?.avatar ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={getFileUrl(user, user.avatar)}
                            alt={user.username}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col items-center">
                    <Avatar className="mb-2">
                      <AvatarImage src={user?.avatar ? getFileUrl(user, user.avatar) : ''} alt={user?.username} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-xl mb-2 text-gray-500">@{user?.username}</div>
                    <div className="font-normal">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex justify-center items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r p-4">
          <SidebarContent activePage={activePage} setActivePage={setActivePage} isMobile={false} />
        </aside>

        {/* Main Area */}
        <main className="flex-grow p-4 overflow-auto">
          {isAuthenticated ? (
            <>
              {activePage === 'canvas' && <Canvas />}
              {activePage === 'myDrawings' && <MyDrawings setActivePage={setActivePage} />}
              {activePage === 'settings' && <SettingsPage />}
            </>
          ) : (
            <Auth onAuthSuccess={handleAuthSuccess} />
          )}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ activePage, setActivePage, isMobile }) {
  const menuItems = [
    { name: 'New Drawing', icon: Pencil, page: 'canvas' },
    { name: 'My Drawings', icon: Image, page: 'myDrawings' },
    { name: 'Settings', icon: Settings, page: 'settings' },
  ];

  return (
    <nav className={`space-y-8 ${isMobile ? 'w-full' : ''}`}>
      <ul className={`space-y-4 ${isMobile ? 'flex flex-col items-center' : ''}`}>
        {menuItems.map((item) => (
          <li key={item.page} className={isMobile ? 'w-full max-w-xs' : 'w-full'}>
            <Button
              variant={activePage === item.page ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activePage === item.page ? 'bg-[#265AFF] text-white' : 'text-gray-700 hover:text-[#265AFF]'
              } ${isMobile ? 'justify-center' : ''}`}
              onClick={() => setActivePage(item.page)}
            >
              <item.icon className={`h-4 w-4 ${isMobile ? 'mr-2' : 'mr-2'}`} />
              {item.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}