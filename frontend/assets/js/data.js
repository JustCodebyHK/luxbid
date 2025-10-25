// Mock data for properties
window.mockProperties = [
  {
    _id: 'p1',
    title: 'Mediterranean Villa',
    description: 'Elegant cliffside villa with panoramic sea views and infinity pool.',
    type: 'villa',
    location: 'Amalfi Coast, IT',
    images: [
      'https://th.bing.com/th/id/OIP.iRB0cYXa7Vau4dxVTVpOVgHaLH?w=1200&h=1200&rs=1&pid=ImgDetMain',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 20000000,
    currentBid: 24500000,
    minIncrement: 100000,
    deadline: Date.now() + 3*24*3600*1000,
    amenities: { bedrooms: 4, bathrooms: 4, sqft: 4200 }
  },
  {
    _id: 'p2',
    title: 'Modern Hillside Mansion',
    description: 'Glass-walled mansion with home theater and rooftop helipad.',
    type: 'mansion',
    location: 'Los Angeles, US',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 52000000,
    currentBid: 59800000,
    minIncrement: 250000,
    deadline: Date.now() + 1*24*3600*1000 + 2*3600*1000,
    amenities: { bedrooms: 6, bathrooms: 7, sqft: 9800 }
  },
  {
    _id: 'p3',
    title: 'Lakeside Designer House',
    description: 'Minimalist house with private dock and floor-to-ceiling windows.',
    type: 'house',
    location: 'Zurich, CH',
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 11000000,
    currentBid: 13200000,
    minIncrement: 50000,
    deadline: Date.now() + 5*24*3600*1000 + 8*3600*1000,
    amenities: { bedrooms: 3, bathrooms: 3, sqft: 2700 }
  },
  {
    _id: 'p4',
    title: 'Skyline Penthouse',
    description: 'Luxury penthouse with 360° city views and private elevator.',
    type: 'villa',
    location: 'Dubai, AE',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 33000000,
    currentBid: 37500000,
    minIncrement: 125000,
    deadline: Date.now() + 2*24*3600*1000 + 6*3600*1000,
    amenities: { bedrooms: 3, bathrooms: 4, sqft: 3100 }
  },
  {
    _id: 'p5',
    title: 'Countryside Estate',
    description: 'Classic stone estate with expansive gardens and stables.',
    type: 'house',
    location: 'Cotswolds, UK',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 18000000,
    currentBid: 20800000,
    minIncrement: 80000,
    deadline: Date.now() + 4*24*3600*1000 + 3*3600*1000,
    amenities: { bedrooms: 5, bathrooms: 4, sqft: 5300 }
  },
  {
    _id: 'p6',
    title: 'Beachfront Villa',
    description: 'Private beachfront with infinity pool and open-air lounge.',
    type: 'villa',
    location: 'Phuket, TH',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 39000000,
    currentBid: 44200000,
    minIncrement: 200000,
    deadline: Date.now() + 2*24*3600*1000 + 22*3600*1000,
    amenities: { bedrooms: 5, bathrooms: 5, sqft: 6000 }
  },
  // Additional diverse options (land, commercial, farms, estates, etc.)
  {
    _id: 'p7',
    title: 'Prime Residential Plot',
    description: 'Corner plot in gated community with wide road access.',
    type: 'land',
    location: 'Bengaluru, IN',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 7500000,
    currentBid: 8200000,
    minIncrement: 25000,
    deadline: Date.now() + 2*24*3600*1000 + 5*3600*1000,
    amenities: { sqft: 2400 }
  },
  {
    _id: 'p8',
    title: 'Commercial Land Parcel',
    description: 'High-street frontage ideal for retail/office development.',
    type: 'commercial-land',
    location: 'Gurugram, IN',
    images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 26000000,
    currentBid: 27500000,
    minIncrement: 100000,
    deadline: Date.now() + 1*24*3600*1000 + 10*3600*1000,
    amenities: { sqft: 10000 }
  },
  {
    _id: 'p9',
    title: 'Riverfront Farm Land',
    description: 'Fertile acreage with irrigation access and farmhouse.',
    type: 'farm',
    location: 'Nashik, IN',
    images: ['https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 12000000,
    currentBid: 13900000,
    minIncrement: 50000,
    deadline: Date.now() + 6*24*3600*1000,
    amenities: { sqft: 130680 }
  },
  {
    _id: 'p10',
    title: 'Private Island Plot',
    description: 'Secluded island parcel with pristine shoreline.',
    type: 'island',
    location: 'Maldives',
    images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 95000000,
    currentBid: 102000000,
    minIncrement: 500000,
    deadline: Date.now() + 9*24*3600*1000,
    amenities: { sqft: 871200 }
  },
  {
    _id: 'p11',
    title: 'Hilltop Tea Estate',
    description: 'Operational estate with breathtaking valley views.',
    type: 'estate',
    location: 'Munnar, IN',
    images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 38000000,
    currentBid: 40200000,
    minIncrement: 150000,
    deadline: Date.now() + 7*24*3600*1000,
    amenities: { sqft: 2178000 }
  },
  {
    _id: 'p12',
    title: 'City Center Office Floor',
    description: 'Grade-A office floorplate with 40 parking bays.',
    type: 'commercial',
    location: 'Mumbai, IN',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1461715407244-5d063f53d92d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 67000000,
    currentBid: 71500000,
    minIncrement: 250000,
    deadline: Date.now() + 3*24*3600*1000 + 6*3600*1000,
    amenities: { sqft: 20000 }
  },
  {
    _id: 'p13',
    title: 'Countryside Ranch Land',
    description: 'Rolling meadows ideal for ranching or eco-resort.',
    type: 'ranch',
    location: 'Texas, US',
    images: ['https://images.unsplash.com/photo-1496483648148-47c686dc86a8?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 22000000,
    currentBid: 23800000,
    minIncrement: 75000,
    deadline: Date.now() + 8*24*3600*1000,
    amenities: { sqft: 4356000 }
  },
  {
    _id: 'p14',
    title: 'Seaside Residential Plot',
    description: 'Second-row plot with ocean glimpses and beach access.',
    type: 'land',
    location: 'Goa, IN',
    images: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534311513-4036d26fdfd2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 9800000,
    currentBid: 10400000,
    minIncrement: 30000,
    deadline: Date.now() + 2*24*3600*1000 + 20*3600*1000,
    amenities: { sqft: 3000 }
  },
  {
    _id: 'p15',
    title: 'Boutique Heritage Haveli',
    description: 'Restored haveli suitable for boutique hotel conversion.',
    type: 'mansion',
    location: 'Jaipur, IN',
    images: ['https://images.unsplash.com/photo-1470145318698-cb03732f5ddf?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 25000000,
    currentBid: 27100000,
    minIncrement: 90000,
    deadline: Date.now() + 6*24*3600*1000 + 4*3600*1000,
    amenities: { bedrooms: 10, bathrooms: 10, sqft: 12000 }
  },
  {
    _id: 'p16',
    title: 'Premium Golf Course Plot',
    description: 'Exclusive golf course plot with stunning fairway views and membership privileges. Perfect for luxury villa construction.',
    type: 'land',
    location: 'Gurgaon, IN',
    images: [
      'https://cdn.golflux.com/wp-content/uploads/2024/03/best-golf-courses-in-India.jpg',
      'https://images.unsplash.com/photo-1467951591042-f388365db261?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop'
    ],
    startingBid: 15000000,
    currentBid: 16800000,
    minIncrement: 50000,
    deadline: Date.now() + 4*24*3600*1000 + 8*3600*1000,
    amenities: { sqft: 6000 }
  },
  {
    _id: 'p17',
    title: 'Ski Chalet',
    description: 'Cozy chalet near ski lifts with cedar sauna.',
    type: 'house',
    location: 'Zermatt, CH',
    images: ['https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 21000000,
    currentBid: 22600000,
    minIncrement: 70000,
    deadline: Date.now() + 3*24*3600*1000 + 12*3600*1000,
    amenities: { bedrooms: 4, bathrooms: 3, sqft: 3200 }
  },
  {
    _id: 'p18',
    title: 'Lakeview Commercial Plot',
    description: 'Mixed-use plot with zoning for retail + residential.',
    type: 'commercial-land',
    location: 'Pune, IN',
    images: ['https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop'],
    startingBid: 19500000,
    currentBid: 20400000,
    minIncrement: 60000,
    deadline: Date.now() + 5*24*3600*1000 + 3*3600*1000,
    amenities: { sqft: 8000 }
  }
];
