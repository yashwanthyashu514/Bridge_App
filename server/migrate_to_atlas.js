const { MongoClient } = require('mongodb');
require('dotenv').config();

// CONFIGURATION
const LOCAL_URI = 'mongodb://localhost:27017';
const ATLAS_URI = process.env.ATLAS_URI || 'mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority';

// Databases to skip
const SKIP_DBS = ['admin', 'config', 'local'];

async function migrate() {
    const localClient = new MongoClient(LOCAL_URI);
    const atlasClient = new MongoClient(ATLAS_URI);

    try {
        console.log('🚀 Starting full migration...');
        await localClient.connect();
        await atlasClient.connect();
        console.log('✅ Connected to both local and Atlas.');

        const admin = localClient.db().admin();
        const { databases } = await admin.listDatabases();

        for (const dbInfo of databases) {
            const dbName = dbInfo.name;
            if (SKIP_DBS.includes(dbName)) continue;

            console.log(`\n📦 Migrating database: ${dbName}`);
            const localDb = localClient.db(dbName);
            const atlasDb = atlasClient.db(dbName);

            const collections = await localDb.listCollections().toArray();

            for (const colInfo of collections) {
                const colName = colInfo.name;
                console.log(`  📄 Copying collection: ${colName}...`);

                const data = await localDb.collection(colName).find({}).toArray();
                
                if (data.length > 0) {
                    // Clear existing data in Atlas for this collection (Optional)
                    // await atlasDb.collection(colName).deleteMany({}); 
                    
                    await atlasDb.collection(colName).insertMany(data);
                    console.log(`  ✅ Inserted ${data.length} documents.`);
                } else {
                    console.log(`  ℹ️ Collection is empty, skipping.`);
                }
            }
        }

        console.log('\n🎉 Migration completed successfully!');
    } catch (err) {
        console.error('\n❌ Migration failed:', err);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

if (ATLAS_URI.includes('<password>')) {
    console.error('❌ Error: Please update the ATLAS_URI in the script or .env file with your actual credentials.');
    process.exit(1);
}

migrate();
