// scripts/migrate-translations.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Hero = require('../models/Hero.model');
const Translation = require('../models/Translation.model');

const migrateTranslations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get current hero data
    const hero = await Hero.findOne({ isActive: true });
    
    if (!hero) {
      console.log('No active hero found');
      return;
    }

    // Create translation entries for hero content
    const heroTranslations = [
      {
        key: 'hero.badge',
        translations: {
          en: hero.badge || 'Industrial Excellence',
          fr: hero.badge || 'Excellence Industrielle'
        },
        category: 'hero',
        isEditable: true
      },
      {
        key: 'hero.heading',
        translations: {
          en: hero.heading,
          fr: hero.heading // Will need manual translation
        },
        category: 'hero',
        isEditable: true
      },
      {
        key: 'hero.description',
        translations: {
          en: hero.description,
          fr: hero.description // Will need manual translation
        },
        category: 'hero',
        isEditable: true
      },
      {
        key: 'hero.primary_button',
        translations: {
          en: hero.buttons?.primary?.text || 'Our Services',
          fr: hero.buttons?.primary?.text || 'Nos Services'
        },
        category: 'hero',
        isEditable: true
      },
      {
        key: 'hero.secondary_button',
        translations: {
          en: hero.buttons?.secondary?.text || 'Download Portfolio',
          fr: hero.buttons?.secondary?.text || 'Télécharger Portfolio'
        },
        category: 'hero',
        isEditable: true
      }
    ];

    // Insert or update translations
    for (const trans of heroTranslations) {
      await Translation.findOneAndUpdate(
        { key: trans.key },
        trans,
        { upsert: true, new: true }
      );
      console.log(`✓ Migrated: ${trans.key}`);
    }

    console.log('\nMigration completed successfully!');
    console.log('Note: Please review and manually translate the content in the database.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

migrateTranslations();