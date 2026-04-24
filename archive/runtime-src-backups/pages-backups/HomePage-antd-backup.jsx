import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  DatePicker, 
  Typography, 
  Rate, 
  Badge, 
  Space,
  Statistic,
  Avatar,
  Tag
} from 'antd'
import { 
  SearchOutlined, 
  StarFilled, 
  UserOutlined, 
  ArrowRightOutlined, 
  CalendarOutlined, 
  GiftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import EventCard from '../../components/EventCard'

const { Title, Paragraph, Text: AntText } = Typography
const { Meta } = Card

const HomePage = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 124,
      price: 299,
      location: "Burj Al Arab",
      time: "11:00 AM - 3:00 PM",
      category: "Luxury Brunch"
    },
    {
      id: 2,
      title: "Rooftop Party Experience",
      venue: "Sky Lounge Dubai",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
      price: 199,
      location: "Downtown Dubai",
      time: "7:00 PM - 12:00 AM",
      category: "Party"
    },
    {
      id: 3,
      title: "Beach Club Brunch",
      venue: "Azure Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      price: 249,
      location: "Palm Jumeirah",
      time: "12:00 PM - 4:00 PM",
      category: "Beach Brunch"
    }
  ]

  const categories = [
    { name: "Luxury Brunch", icon: "🥂", count: 45 },
    { name: "Rooftop Parties", icon: "🌃", count: 32 },
    { name: "Beach Clubs", icon: "🏖️", count: 28 },
    { name: "Sports Bars", icon: "⚽", count: 22 },
    { name: "Ladies Night", icon: "💃", count: 18 },
    { name: "Ocean View", icon: "🌊", count: 35 }
  ]

  const topVenues = [
    {
      id: 1,
      name: "Azure Beach Club",
      category: "Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah",
      upcomingEvents: 3
    },
    {
      id: 2,
      name: "Sky Lounge Dubai",
      category: "Rooftop Bar",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai",
      upcomingEvents: 5
    },
    {
      id: 3,
      name: "Marina Sports Grill",
      category: "Sports Bar",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 67,
      location: "Dubai Marina",
      upcomingEvents: 8
    }
  ]

  const bucketListExperiences = [
    {
      id: 1,
      title: "Burj Al Arab Gold Brunch",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      price: 899,
      category: "Ultra Luxury",
      exclusive: true
    },
    {
      id: 2,
      title: "Private Yacht Brunch",
      venue: "Dubai Marina Yacht Club",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      price: 1299,
      category: "Exclusive Experience",
      exclusive: true
    }
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #e6f7ff 0%, #f6ffed 50%, #fff7e6 100%)',
          padding: '80px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Badge.Ribbon text="✨ Dubai's Premier Dining Experience Platform" color="blue">
            <div style={{ marginBottom: 32 }}>
              <Title level={1} style={{ fontSize: '4rem', marginBottom: 24, lineHeight: 1.2 }}>
                Discover Dubai's Best
                <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Brunch & Party Experiences
                </span>
              </Title>
              
              <Paragraph style={{ fontSize: '1.5rem', marginBottom: 48, maxWidth: 800, margin: '0 auto 48px' }}>
                Curated venues, exclusive packages, and unforgettable moments await you in the heart of Dubai
              </Paragraph>
              
              {/* Search Bar */}
              <Card 
                style={{ 
                  maxWidth: 800, 
                  margin: '0 auto',
                  borderRadius: 24,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
                styles={{ body: { padding: 12 } }}
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} md={12}>
                    <Input
                      size="large"
                      placeholder="Search events, venues, or cuisine..."
                      prefix={<SearchOutlined />}
                      style={{ borderRadius: 12 }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <DatePicker
                      size="large"
                      placeholder="Select date"
                      style={{ width: '100%', borderRadius: 12 }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Link to="/explore">
                      <Button 
                        type="primary" 
                        size="large" 
                        block
                        style={{ borderRadius: 12, height: 48 }}
                      >
                        Find Events
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card>
            </div>
          </Badge.Ribbon>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: '3rem', marginBottom: 24 }}>Browse by Category</Title>
            <Paragraph style={{ fontSize: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
              Find the perfect experience for any occasion in Dubai's finest venues
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {categories.map((category, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Link to={`/events?category=${encodeURIComponent(category.name)}`}>
                  <Card
                    hoverable
                    style={{ 
                      textAlign: 'center',
                      borderRadius: 24,
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease'
                    }}
                    styles={{ body: { padding: 32 } }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>{category.icon}</div>
                    <Title level={4} style={{ marginBottom: 8, color: '#262626' }}>
                      {category.name}
                    </Title>
                    <Paragraph type="secondary" style={{ margin: 0, fontSize: '0.875rem' }}>
                      {category.count} venues
                    </Paragraph>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Events */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #fafafa 0%, #e6f7ff 100%)' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 64 }}>
            <Col xs={24} md={16}>
              <Title level={2} style={{ fontSize: '3rem', marginBottom: 16 }}>Featured Events</Title>
              <Paragraph style={{ fontSize: '1.25rem', margin: 0 }}>
                Handpicked experiences you'll love, curated by our experts
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Link to="/events">
                <Button 
                  size="large" 
                  icon={<ArrowRightOutlined />}
                  style={{ borderRadius: 8 }}
                >
                  View All Events
                </Button>
              </Link>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]}>
            {featuredEvents.map((event) => (
              <Col xs={24} md={12} lg={8} key={event.id}>
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Top Venues */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 64 }}>
            <Col xs={24} md={16}>
              <Title level={2} style={{ fontSize: '3rem', marginBottom: 16 }}>Top Venues</Title>
              <Paragraph style={{ fontSize: '1.25rem', margin: 0 }}>
                Dubai's most popular dining destinations
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Link to="/venues">
                <Button 
                  size="large" 
                  icon={<ArrowRightOutlined />}
                  style={{ borderRadius: 8 }}
                >
                  View All Venues
                </Button>
              </Link>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]}>
            {topVenues.map((venue) => (
              <Col xs={24} md={12} lg={8} key={venue.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                  cover={
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        alt={venue.name}
                        src={venue.image}
                        style={{ width: '100%', height: 256, objectFit: 'cover' }}
                      />
                      <Tag
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          border: 'none'
                        }}
                      >
                        {venue.category}
                      </Tag>
                      <div style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 12,
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <StarFilled style={{ color: '#faad14', fontSize: 14 }} />
                        <AntText style={{ fontSize: 14, fontWeight: 500 }}>{venue.rating}</AntText>
                      </div>
                    </div>
                  }
                  actions={[
                    <Link to={`/venues/${venue.id}`} key="view">
                      <Button type="primary" style={{ borderRadius: 8 }}>
                        View Venue
                      </Button>
                    </Link>,
                    <Link to={`/venues/${venue.id}#events`} key="events">
                      <Button style={{ borderRadius: 8 }}>
                        Events
                      </Button>
                    </Link>
                  ]}
                >
                  <Meta
                    title={
                      <Link to={`/venues/${venue.id}`} style={{ color: 'inherit' }}>
                        {venue.name}
                      </Link>
                    }
                    description={
                      <Space separator="•" size={4}>
                        <AntText type="secondary">{venue.location}</AntText>
                        <AntText type="secondary">{venue.upcomingEvents} events</AntText>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Bucket List Experiences */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #fff7e6 0%, #e6f7ff 100%)' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: '3rem', marginBottom: 24 }}>Bucket List Experiences</Title>
            <Paragraph style={{ fontSize: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
              Once-in-a-lifetime dining experiences that define luxury in Dubai
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]} justify="center">
            {bucketListExperiences.map((experience) => (
              <Col xs={24} md={12} key={experience.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={experience.title}
                        src={experience.image}
                        style={{ width: '100%', height: 320, objectFit: 'cover' }}
                      />
                      <Tag
                        color="gold"
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          borderRadius: 12,
                          padding: '4px 12px',
                          fontWeight: 600
                        }}
                      >
                        Exclusive
                      </Tag>
                    </div>
                  }
                  actions={[
                    <Link to={`/events/${experience.id}`} key="reserve">
                      <Button type="primary" size="large" style={{ borderRadius: 8 }}>
                        Reserve Experience
                      </Button>
                    </Link>
                  ]}
                >
                  <div style={{ padding: '16px 0' }}>
                    <Title level={4} style={{ marginBottom: 8 }}>{experience.title}</Title>
                    <AntText type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                      {experience.venue}
                    </AntText>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tag color="purple">{experience.category}</Tag>
                      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                        AED {experience.price}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>


    </div>
  )
}

export default HomePage

