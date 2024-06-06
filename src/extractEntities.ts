import * as fs from 'fs';

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

function readJsonFile(filename: string): Entity[] {
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData.toString());
}

function loadEntitiesFromJson(): Entities {
    const entities = {
        cities: readJsonFile('./src/data/cities.json'),
        brands: readJsonFile('./src/data/brands.json'),
        dish_types: readJsonFile('./src/data/dish-types.json'),
        diets: readJsonFile('./src/data/diets.json'),
    };
    // console.log('Loaded Entities:', JSON.stringify(entities, null, 2));
    return entities;
}


async function extractEntities(searchTerm: string): Promise<object[]> {
    const matchedEntities = loadEntitiesFromJson();
    console.log('Matched Entities:', JSON.stringify(matchedEntities, null, 2));

    const results: object[] = [];

    // Parse search term to extract city name, brand name, diet, and dish type
    const searchTokens = searchTerm.split(' in ');
    const mainQuery = searchTokens[0];
    const cityName = searchTokens[1];

    // Filter cities based on the parsed city name
    const filteredCities = matchedEntities.cities.filter(city => city.name.toLowerCase() === cityName.toLowerCase());
    console.log('Filtered Cities:', JSON.stringify(filteredCities, null, 2));

    // Filter brands based on the main query
    const filteredBrands = matchedEntities.brands.filter(brand => brand.name.toLowerCase().includes(mainQuery.toLowerCase()));
    console.log('Filtered Brands:', JSON.stringify(filteredBrands, null, 2));

    // Filter diets based on the main query
    const filteredDiets = matchedEntities.diets.filter(diet => diet.name.toLowerCase().includes(mainQuery.toLowerCase()));
    console.log('Filtered Diets:', JSON.stringify(filteredDiets, null, 2));

    // Filter dish types based on the main query
    const filteredDishTypes = matchedEntities.dish_types.filter(dishType => dishType.name.toLowerCase().includes(mainQuery.toLowerCase()));
    console.log('Filtered Dish Types:', JSON.stringify(filteredDishTypes, null, 2));

    // Generate combinations for filtered cities and brands
    for (const city of filteredCities) {
        for (const brand of filteredBrands) {
            results.push({ city, brand });
        }
    }

    // Generate combinations for filtered cities and diets
    for (const city of filteredCities) {
        for (const diet of filteredDiets) {
            results.push({ city, diet });
        }
    }

    // Generate combinations for filtered cities and dish types
    for (const city of filteredCities) {
        for (const dishType of filteredDishTypes) {
            results.push({ city, dishType });
        }
    }

    return results;
}

// Example usage
(async () => {
    const searchTerm = "McDonald's in London";
    console.log('Search Term:', searchTerm);
    const entities = await extractEntities(searchTerm);
    console.log('entities:', JSON.stringify(entities, null, 2));
})().catch(error => console.error('Error:', error.stack));