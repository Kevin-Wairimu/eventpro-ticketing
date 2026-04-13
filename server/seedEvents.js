import sequelize from './config/database.js';
import Event from './models/Event.js';

const initialEvents = [
  {
    name: 'Carnivore Fest 2026',
    date: new Date('2026-06-15'),
    status: 'Published',
    capacity: 500,
    price: 1500.00,
    location: 'Carnivore Grounds, Nairobi',
    category: 'Food & Drink',
    imageUrl: '/assets/carnivore-fest.jpg'
  },
  {
    name: 'Tech Hackathon 2026',
    date: new Date('2026-07-20'),
    status: 'Published',
    capacity: 200,
    price: 0.00,
    location: 'iHub, Nairobi',
    category: 'Technology',
    imageUrl: '/assets/tech-hackathon.jpg'
  },
  {
    name: 'Luxury Car Auction',
    date: new Date('2026-08-05'),
    status: 'Published',
    capacity: 100,
    price: 5000.00,
    location: 'KICC, Nairobi',
    category: 'Lifestyle',
    imageUrl: '/assets/car auction.jpg'
  },
  {
    name: 'Wines & Expo',
    date: new Date('2026-09-12'),
    status: 'Published',
    capacity: 300,
    price: 2500.00,
    location: 'Sarit Centre, Nairobi',
    category: 'Business',
    imageUrl: '/assets/wines&expo.jpg'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase for seeding.');

    // Sync models
    await sequelize.sync();

    // Clear existing events if needed (optional)
    // await Event.destroy({ where: {} });

    console.log('⏳ Seeding events...');
    for (const eventData of initialEvents) {
      const [event, created] = await Event.findOrCreate({
        where: { name: eventData.name },
        defaults: eventData
      });
      if (created) {
        console.log(`✅ Created event: ${event.name}`);
      } else {
        console.log(`ℹ️ Event already exists: ${event.name}`);
      }
    }

    console.log('✅ Seeding completed successfully!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
