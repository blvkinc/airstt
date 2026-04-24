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
  Statistic,
  Badge
} from 'antd'
import { 
  SearchOutlined, 
  StarFilled, 
  EnvironmentOutlined, 
  ArrowRightOutlined, 
  BankOutlined, 
  UserOutlined, 
  TrophyOutlined 
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const VenuesPage = () => {
  const venueCategories = [
    { name: "Beach Clubs", icon: "🏖️", count: 28, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop" },
    { name: "Rooftop Bars", icon: "🌃", count: 32, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop" },
    { name: "Fine Dining", icon: "🍽️", count: 45, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
    { name: "Conference Centers", icon: "💼", count: 22, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
    { name: "Banquet Halls", icon: "🎭", count: 35, image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=400&h=300&fit=crop" },
    { name: "Garden Venues", icon: "🌳", count: 18, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop" }
  ]

  const featuredVenues = [
    {
      id: 1,
      name: "Azure Beach Club",
      category: "Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah",
      capacity: 300,
      priceRange: "AED 200-400",
      amenities: ["Beach Access", "Pool", "Valet Parking", "WiFi"],
      upcomingEvents: 8
    },
    {
      id: 2,
      name: "Sky Lounge Dubai",
      category: "Rooftop Bar",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai",
      capacity: 200,
      priceRange: "AED 150-300",
      amenities: ["City Views", "Cocktail Bar", "Outdoor Seating", "DJ"],
      upcomingEvents: 12
    },
    {
      id: 3,
      name: "Grand Convention Center",
      category: "Conference Center",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 203,
      location: "DIFC",
      capacity: 500,
      priceRange: "AED 300-600",
      amenities: ["AV Equipment", "WiFi", "Catering", "Parking"],
      upcomingEvents: 15
    }
  ]

  const topLocations = [
    { name: "Downtown Dubai", venues: 45, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
    { name: "Palm Jumeirah", venues: 32, image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop" },
    { name: "Dubai Marina", venues: 38, image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop" },
    { name: "DIFC", venues: 28, image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=300&fit=crop" }
  ]

  const venueFeatures = [
    { icon: BankOutlined, title: "150+ Premium Venues", description: "Carefully curated selection of Dubai's finest venues" },
    { icon: TrophyOutlined, title: "Quality Verified", description: "All venues are inspected and quality-certified" },
    { icon: UserOutlined, title: "Expert Support", description: "Dedicated team to help you find the perfect venue" }
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
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
              🏢 Dubai's Premier Venue Directory
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
            Discover Perfect<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Event Venues
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
            From beachfront clubs to rooftop bars, find the ideal venue for your next event
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
                  placeholder="Search venues by name, location, or type..."
                  prefix={<SearchOutlined style={{ color: '#764ba2' }} />}
                  style={{ 
                    borderRadius: 12,
                    border: '2px solid #f0f0f0',
                    fontSize: 16,
                    height: 50
                  }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Link to="/explore?tab=venues">
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    style={{ 
                      borderRadius: 12,
                      height: 50,
                      fontSize: 16,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #764ba2, #667eea)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)'
                    }}
                  >
                    Explore Venues
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
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Premium Venues</span>}
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
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Events Hosted</span>}
                  value="25K+" 
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
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Dubai Locations</span>}
                  value="12" 
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
                  value="4.7★" 
                  valueStyle={{ color: '#ffeaa7', fontSize: 28, fontWeight: 700 }} 
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Venue Categories */}
      <div style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 24 }}>
              Browse by Type
            </Title>
            <Paragraph style={{ fontSize: 20, color: '#666', maxWidth: 500, margin: '0 auto' }}>
              Find the perfect venue type for your event
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {venueCategories.map((category, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Link to={`/explore?tab=venues&category=${encodeURIComponent(category.name)}`}>
                  <Card
                    hoverable
                    style={{ borderRadius: 24, overflow: 'hidden', height: 280 }}
                    cover={
                      <div style={{ 
                        position: 'relative', 
                        height: 280,
                        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 24,
                        color: 'white'
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>{category.icon}</div>
                        <Title level={3} style={{ color: 'white', marginBottom: 8 }}>
                          {category.name}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                          {category.count} venues available
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

      {/* Featured Venues */}
      <div style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e6f7ff 100%)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 64 }}>
            <Col>
              <Title level={2} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>
                Featured Venues
              </Title>
              <Paragraph style={{ fontSize: 20, color: '#666' }}>
                Most popular venues this month
              </Paragraph>
            </Col>
            <Col>
              <Link to="/explore?tab=venues">
                <Button type="default" icon={<ArrowRightOutlined />} size="large">
                  View All Venues
                </Button>
              </Link>
            </Col>
          </Row>
          
          <Row gutter={[32, 32]}>
            {featuredVenues.map((venue) => (
              <Col xs={24} md={12} lg={8} key={venue.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                  cover={
                    <div style={{ position: 'relative', height: 224, overflow: 'hidden' }}>
                      <img 
                        src={venue.image} 
                        alt={venue.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <Tag
                        style={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          border: 'none'
                        }}
                      >
                        {venue.category}
                      </Tag>
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 12,
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <StarFilled style={{ color: '#faad14', fontSize: 14 }} />
                        <Text style={{ fontSize: 14, fontWeight: 500 }}>{venue.rating}</Text>
                      </div>
                    </div>
                  }
                  actions={[
                    <Link key="view" to={`/venues/${venue.id}`}>
                      <Button type="primary" block>View Venue</Button>
                    </Link>
                  ]}
                >
                  <Card.Meta
                    title={
                      <Title level={4} style={{ margin: 0 }}>{venue.name}</Title>
                    }
                    description={
                      <div>
                        <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: 16 }}>
                          <Space size={8}>
                            <EnvironmentOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary">{venue.location}</Text>
                          </Space>
                          <Space size={8}>
                            <UserOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary">Capacity: {venue.capacity} guests</Text>
                          </Space>
                        </Space>
                        
                        <Space wrap style={{ marginBottom: 16 }}>
                          {venue.amenities.slice(0, 3).map((amenity, index) => (
                            <Tag key={index} style={{ borderRadius: 8, fontSize: 12 }}>
                              {amenity}
                            </Tag>
                          ))}
                        </Space>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Title level={5} style={{ color: '#1890ff', margin: 0 }}>
                            {venue.priceRange}
                          </Title>
                          <Text type="secondary">{venue.upcomingEvents} events</Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Top Locations */}
      <div style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 24 }}>
              Explore by Location
            </Title>
            <Paragraph style={{ fontSize: 20, color: '#666' }}>
              Discover venues in Dubai's most popular areas
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {topLocations.map((location, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Link to={`/explore?tab=venues&location=${encodeURIComponent(location.name)}`}>
                  <Card
                    hoverable
                    style={{ borderRadius: 16, overflow: 'hidden', height: 200 }}
                    cover={
                      <div style={{ 
                        position: 'relative', 
                        height: 200,
                        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${location.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 16,
                        color: 'white'
                      }}>
                        <Title level={4} style={{ color: 'white', marginBottom: 4 }}>
                          {location.name}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                          {location.venues} venues
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

      {/* Why Choose Our Venues */}
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
              Why Choose Our Venues?
            </Title>
            <Paragraph style={{ 
              fontSize: 20, 
              color: 'rgba(255,255,255,0.7)', 
              maxWidth: 500, 
              margin: '0 auto' 
            }}>
              Premium venues with exceptional service and amenities
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {venueFeatures.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
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
                    <feature.icon style={{ fontSize: 40, color: 'white' }} />
                  </div>
                  <Title level={3} style={{ color: 'white', marginBottom: 12 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
                    {feature.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
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
              Find Your Perfect Venue
            </Title>
            <Paragraph style={{ 
              fontSize: 20, 
              color: '#666', 
              marginBottom: 32,
              maxWidth: 500,
              margin: '0 auto 32px auto'
            }}>
              Browse through our curated selection of premium venues and book your ideal space today
            </Paragraph>
            
            <Link to="/explore?tab=venues">
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
                Browse All Venues
              </Button>
            </Link>
            
            <Paragraph style={{ color: '#999', fontSize: 14, marginTop: 24, marginBottom: 0 }}>
              Trusted by 150+ venues and 25,000+ successful events
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VenuesPage