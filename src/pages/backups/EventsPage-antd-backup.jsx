import { Link } from 'react-router-dom'
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Tag, 
  Rate,
  Badge,
  Statistic
} from 'antd'
import { 
  SearchOutlined, 
  StarFilled, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  ArrowRightOutlined, 
  ArrowUpOutlined, 
  UserOutlined, 
  GiftOutlined 
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const EventsPage = () => {
  const featuredCategories = [
    { name: "Luxury Brunch", icon: "🥂", count: 45, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
    { name: "Rooftop Parties", icon: "🌃", count: 32, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop" },
    { name: "Beach Clubs", icon: "🏖️", count: 28, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop" },
    { name: "Corporate Events", icon: "💼", count: 38, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
    { name: "Weddings", icon: "💒", count: 25, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop" },
    { name: "Live Music", icon: "🎵", count: 42, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop" }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      date: "Feb 20, 2024",
      time: "11:00 AM - 3:00 PM",
      price: 299,
      rating: 4.8,
      reviews: 124,
      location: "Burj Al Arab",
      category: "Luxury Brunch",
      attendees: 45
    },
    {
      id: 2,
      title: "Rooftop Party Experience",
      venue: "Sky Lounge Dubai",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
      date: "Feb 22, 2024",
      time: "7:00 PM - 12:00 AM",
      price: 199,
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai",
      category: "Party",
      attendees: 120
    },
    {
      id: 3,
      title: "Beach Club Brunch",
      venue: "Azure Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      date: "Feb 25, 2024",
      time: "12:00 PM - 4:00 PM",
      price: 249,
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah",
      category: "Beach Brunch",
      attendees: 80
    }
  ]

  const trendingEvents = [
    { name: "Valentine's Day Special", growth: "+45%", bookings: 234 },
    { name: "Weekend Brunch Series", growth: "+32%", bookings: 189 },
    { name: "Ladies Night Events", growth: "+28%", bookings: 156 }
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '120px 24px',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
        
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: 50,
            padding: '12px 24px',
            marginBottom: 32,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Text style={{ color: 'white', fontWeight: 500 }}>
              🎉 Discover Amazing Events in Dubai
            </Text>
          </div>
          
          <Title level={1} style={{ 
            fontSize: 'clamp(3rem, 6vw, 5rem)', 
            marginBottom: 24,
            color: 'white',
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            Find Your Perfect<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Event Experience
            </span>
          </Title>
          
          <Paragraph style={{ 
            fontSize: 22, 
            marginBottom: 48, 
            maxWidth: 700, 
            margin: '0 auto 48px auto',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6
          }}>
            From luxury brunches to rooftop parties, discover curated events that match your style
          </Paragraph>
          
          {/* Enhanced Search Bar */}
          <Card style={{ 
            maxWidth: 700, 
            margin: '0 auto 48px auto',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Input
                  size="large"
                  placeholder="Search events by name, category, or venue..."
                  prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                  style={{ 
                    borderRadius: 12,
                    border: '2px solid #f0f0f0',
                    fontSize: 16,
                    height: 50
                  }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Link to="/explore?tab=events">
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    style={{ 
                      borderRadius: 12,
                      height: 50,
                      fontSize: 16,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    Explore Events
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>

          {/* Enhanced Stats */}
          <Row gutter={[24, 24]} style={{ maxWidth: 900, margin: '0 auto' }}>
            <Col xs={12} md={6}>
              <Card style={{ 
                borderRadius: 20, 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Active Events</span>}
                  value="200+" 
                  valueStyle={{ color: '#ffeaa7', fontSize: 28, fontWeight: 700 }} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card style={{ 
                borderRadius: 20, 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Happy Guests</span>}
                  value="50K+" 
                  valueStyle={{ color: '#ffeaa7', fontSize: 28, fontWeight: 700 }} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card style={{ 
                borderRadius: 20, 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Partner Venues</span>}
                  value="150+" 
                  valueStyle={{ color: '#ffeaa7', fontSize: 28, fontWeight: 700 }} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card style={{ 
                borderRadius: 20, 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Average Rating</span>}
                  value="4.8★" 
                  valueStyle={{ color: '#ffeaa7', fontSize: 28, fontWeight: 700 }} 
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Event Categories */}
      <div style={{ padding: '100px 24px', background: '#fafbfc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <Title level={2} style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              marginBottom: 24,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              Browse by Category
            </Title>
            <Paragraph style={{ 
              fontSize: 22, 
              color: '#6c757d', 
              maxWidth: 600, 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Explore events tailored to your interests and preferences
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {featuredCategories.map((category, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Link to={`/explore?tab=events&category=${encodeURIComponent(category.name)}`}>
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: 24, 
                      overflow: 'hidden', 
                      height: 320,
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    cover={
                      <div style={{ 
                        position: 'relative', 
                        height: 320,
                        background: `linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 32,
                        color: 'white',
                        overflow: 'hidden'
                      }}>
                        {/* Floating particles effect */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                          animation: 'float 6s ease-in-out infinite'
                        }} />
                        
                        <div style={{ 
                          fontSize: 56, 
                          marginBottom: 16,
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}>
                          {category.icon}
                        </div>
                        <Title level={3} style={{ 
                          color: 'white', 
                          marginBottom: 8,
                          fontWeight: 700,
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                          {category.name}
                        </Title>
                        <Text style={{ 
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: 16,
                          textShadow: '0 1px 5px rgba(0,0,0,0.3)'
                        }}>
                          {category.count} events available
                        </Text>
                      </div>
                    }
                  />
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Upcoming Events */}
      <div style={{ 
        padding: '100px 24px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '40%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
          borderRadius: '50%',
          transform: 'rotate(15deg)'
        }} />
        
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 80 }}>
            <Col xs={24} lg={16}>
              <Title level={2} style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                marginBottom: 16,
                color: 'white',
                fontWeight: 700,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                Upcoming Events
              </Title>
              <Paragraph style={{ 
                fontSize: 22, 
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                Don't miss out on these popular experiences
              </Paragraph>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
              <Link to="/explore?tab=events">
                <Button 
                  size="large" 
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: 12,
                    height: 48,
                    paddingLeft: 24,
                    paddingRight: 24,
                    fontWeight: 600
                  }}
                >
                  View All Events
                </Button>
              </Link>
            </Col>
          </Row>
          
          <Row gutter={[32, 32]}>
            {upcomingEvents.map((event) => (
              <Col xs={24} md={12} lg={8} key={event.id}>
                <Card
                  hoverable
                  style={{ 
                    borderRadius: 20, 
                    overflow: 'hidden',
                    border: 'none',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  cover={
                    <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
                      }} />
                      <Tag
                        style={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          borderRadius: 20,
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          padding: '6px 16px',
                          fontWeight: 600,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                      >
                        {event.category}
                      </Tag>
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 20,
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                      >
                        <StarFilled style={{ color: '#faad14', fontSize: 16 }} />
                        <Text style={{ fontSize: 14, fontWeight: 600 }}>{event.rating}</Text>
                      </div>
                    </div>
                  }
                  actions={[
                    <Link key="details" to={`/events/${event.id}`}>
                      <Button 
                        type="primary" 
                        block
                        style={{
                          borderRadius: 12,
                          height: 44,
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  ]}
                >
                  <div style={{ padding: '8px 0' }}>
                    <Title level={4} style={{ 
                      margin: '0 0 12px 0',
                      fontWeight: 700,
                      color: '#2c3e50'
                    }}>
                      {event.title}
                    </Title>
                    
                    <Text type="secondary" style={{ 
                      display: 'block', 
                      marginBottom: 20,
                      fontSize: 16,
                      fontWeight: 500
                    }}>
                      {event.venue}
                    </Text>
                    
                    <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 20 }}>
                      <Space size={10}>
                        <CalendarOutlined style={{ color: '#667eea', fontSize: 16 }} />
                        <Text style={{ fontWeight: 500 }}>{event.date}</Text>
                      </Space>
                      <Space size={10}>
                        <EnvironmentOutlined style={{ color: '#667eea', fontSize: 16 }} />
                        <Text style={{ fontWeight: 500 }}>{event.location}</Text>
                      </Space>
                      <Space size={10}>
                        <UserOutlined style={{ color: '#667eea', fontSize: 16 }} />
                        <Text style={{ fontWeight: 500 }}>{event.attendees} attending</Text>
                      </Space>
                    </Space>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '16px 0 0 0',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <Title level={3} style={{ 
                        color: '#667eea', 
                        margin: 0,
                        fontWeight: 700
                      }}>
                        AED {event.price}
                      </Title>
                      <Text type="secondary" style={{ fontWeight: 500 }}>per person</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Trending Events */}
      <div style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 24 }}>
              Trending Now
            </Title>
            <Paragraph style={{ fontSize: 20, color: '#666' }}>
              Most popular events this week
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {trendingEvents.map((trend, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  style={{ 
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #e6f7ff 0%, #fff2e6 100%)',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <ArrowUpOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                    <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                      {trend.growth}
                    </Title>
                  </div>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {trend.name}
                  </Title>
                  <Text type="secondary">
                    {trend.bookings} bookings this week
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Why Book With Us */}
      <div style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
        color: 'white'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              marginBottom: 24,
              color: 'white'
            }}>
              Why Book Events With Us?
            </Title>
            <Paragraph style={{ 
              fontSize: 20, 
              color: 'rgba(255,255,255,0.7)', 
              maxWidth: 500, 
              margin: '0 auto' 
            }}>
              Experience the best event booking platform in Dubai
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #40a9ff, #1890ff)',
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  transition: 'transform 0.3s ease'
                }}>
                  <GiftOutlined style={{ fontSize: 40, color: 'white' }} />
                </div>
                <Title level={3} style={{ color: 'white', marginBottom: 12 }}>
                  Best Prices
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
                  Exclusive deals and packages you won't find anywhere else
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #b37feb, #722ed1)',
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  transition: 'transform 0.3s ease'
                }}>
                  <StarFilled style={{ fontSize: 40, color: 'white' }} />
                </div>
                <Title level={3} style={{ color: 'white', marginBottom: 12 }}>
                  Verified Events
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
                  All events are verified and quality-checked by our team
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  transition: 'transform 0.3s ease'
                }}>
                  <UserOutlined style={{ fontSize: 40, color: 'white' }} />
                </div>
                <Title level={3} style={{ color: 'white', marginBottom: 12 }}>
                  Easy Booking
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
                  Simple, fast, and secure booking process in just a few clicks
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #e6f7ff 0%, #fff2e6 50%, #f5f5f5 100%)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Card style={{ 
            borderRadius: 24, 
            padding: 48,
            boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
            border: '1px solid #d9d9d9'
          }}>
            <Title level={2} style={{ marginBottom: 16 }}>
              Ready to Explore?
            </Title>
            <Paragraph style={{ 
              fontSize: 20, 
              color: '#666', 
              marginBottom: 32,
              maxWidth: 500,
              margin: '0 auto 32px auto'
            }}>
              Browse through hundreds of amazing events and find your perfect experience today
            </Paragraph>
            
            <Link to="/explore?tab=events">
              <Button 
                type="primary" 
                size="large" 
                icon={<ArrowRightOutlined />}
                style={{ 
                  fontSize: 18, 
                  height: 56, 
                  paddingLeft: 48, 
                  paddingRight: 48,
                  borderRadius: 28
                }}
              >
                Browse All Events
              </Button>
            </Link>
            
            <Paragraph style={{ color: '#999', fontSize: 14, marginTop: 24, marginBottom: 0 }}>
              Join 50,000+ happy customers who found their perfect event
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EventsPage