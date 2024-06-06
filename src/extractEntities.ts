import { Pool } from 'pg';

// Set up the PostgreSQL connection pool
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:dB9cFnXCsH8Z@ep-wild-bonus-a5sl15bt.us-east-2.aws.neon.tech/neondb?sslmode=require',
});

interface Entity {
    id: number;
    name: string;
}

interface Entities {
    cities: Entity[];
    brands: Entity[];
    dish_types: Entity[];
    diets: Entity[];
}

// Function to query the database for entities
async function queryEntities(searchTerm: string): Promise<Entities> {
    console.log('1 searchTerm: ', searchTerm);
    const client = await pool.connect();

    const entities: Entities = {
        cities: [],
        brands: [],
        dish_types: [],
        diets: []
    };

    try {
        console.log(`Searching for entities matching: ${searchTerm}`);
        
        // Query cities, brands, dish_types and diets
        for (const entityType of Object.keys(entities)) {
            const query = `SELECT id, name FROM ${entityType} WHERE name ILIKE $1`;
            console.log('Executing query:', query); // Log the query being executed
            const res = await client.query(query, [`%${searchTerm}%`]);
            console.log(`Query result for ${entityType}:`, res.rows);
            entities[entityType as keyof Entities] = res.rows;
        }
    } catch (error) {
        console.error('Error querying entities:', error); // Log any errors that occur during the query
    } finally {
        client.release();
    }
    return entities;
}

// Function to extract entities from search term
async function extractEntities(searchTerm: string): Promise<object[]> {
    console.log('2 searchTerm: ', searchTerm);
    const matchedEntities = await queryEntities(searchTerm);
    console.log('Matched Entities:', matchedEntities); // Log matched entities
    const results: object[] = [];

    // Generate all possible combinations
    for (const city of matchedEntities.cities) {
        for (const brand of matchedEntities.brands) {
            results.push({ city, brand });
        }

        for (const dish_type of matchedEntities.dish_types) {
            results.push({ city, dishType: dish_type });
        }

        for (const diet of matchedEntities.diets) {
            for (const dish_type of matchedEntities.dish_types) {
                results.push({ city, diet, dishType: dish_type });
            }
        }
    }

    for (const brand of matchedEntities.brands) {
        for (const diet of matchedEntities.diets) {
            results.push({ brand, diet });
        }
    }

    return results;
}

// Example usage
(async () => {
    const searchTerm = "McDonald's in London";
    const entities = await extractEntities(searchTerm);
    console.log('entities: ', JSON.stringify(entities, null, 2));
})().catch(error => console.error(error.stack));
