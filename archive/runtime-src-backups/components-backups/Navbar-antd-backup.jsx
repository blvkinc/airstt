import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Input, Button, Avatar, Dropdown, Badge, Drawer } from 'antd'
import { 
  SearchOutlined, 
  UserOutlined, 
  HeartOutlined, 
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  CrownOutlined
} from '@ant-design/icons'
import { useAuth } from '../../shared/context/AuthContext'

const { Header } = Layout

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">My Profile</Link>,
    },
    {
      key: 'premium',
      icon: <CrownOutlined />,
      label: <Link to="/premium">Upgrade to Premium</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout,
      danger: true,
    },
  ]

  const navigationItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/explore', label: <Link to="/explore">Explore</Link> },
    { key: '/events', label: <Link to="/events">Events</Link> },
    { key: '/venues', label: <Link to="/venues">Venues</Link> },
  ]

  const mobileMenuItems = [
    ...navigationItems,
    { key: '/merchant/auth', label: <Link to="/merchant/auth">For Businesses</Link> },
    { key: '/admin/dashboard', label: <Link to="/admin/dashboard" style={{ color: '#ff4d4f' }}>Super Admin</Link> },
  ]

  return (
    <>
      <Header 
        style={{ 
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #1890ff, #096dd9)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>S</span>
          </div>
          <span style={{ fontWeight: 'bold', fontSize: 24, color: '#262626' }}>Set The Table</span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, justifyContent: 'center' }}>
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={navigationItems}
              style={{ 
                border: 'none', 
                background: 'transparent',
                fontSize: 16,
                fontWeight: 500
              }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block" style={{ margin: '0 32px', maxWidth: 400, flex: 1 }}>
          <Input
            placeholder="Search events, venues..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ borderRadius: 12 }}
          />
        </div>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
            <Link to="/merchant/auth">
              <Button type="text" style={{ fontWeight: 500 }}>
                For Businesses
              </Button>
            </Link>
            
            <Link to="/admin/dashboard">
              <Button 
                type="primary" 
                danger 
                size="small"
                style={{ borderRadius: 8 }}
              >
                Super Admin
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button 
                    type="text" 
                    icon={<HeartOutlined />} 
                    shape="circle"
                    size="large"
                  />
                </Link>
                
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button 
                    type="text" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      fontWeight: 500
                    }}
                  >
                    <Avatar size="small" icon={<UserOutlined />} />
                    {user?.name?.split(' ')[0]}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Link to="/auth">
                <Button type="default" style={{ borderRadius: 8 }}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            className="md:hidden"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            size="large"
          />
        </div>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        size="default"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            placeholder="Search events, venues..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ borderRadius: 8, marginBottom: 16 }}
          />
          
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={mobileMenuItems}
            style={{ border: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {isAuthenticated ? (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Menu
                mode="vertical"
                items={[
                  { key: 'favorites', icon: <HeartOutlined />, label: <Link to="/profile">Favorites</Link> },
                  { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
                  { key: 'premium', icon: <CrownOutlined />, label: <Link to="/premium">Upgrade to Premium</Link> },
                  { type: 'divider' },
                  { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', onClick: handleLogout, danger: true },
                ]}
                style={{ border: 'none' }}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button type="primary" block size="large" style={{ marginTop: 16, borderRadius: 8 }}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default Navbar

