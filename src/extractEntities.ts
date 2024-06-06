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
    return entities;
}

async function extractEntities(searchTerm: string): Promise<object[]> {
    const matchedEntities = loadEntitiesFromJson();

    const results: object[] = [];
    const searchTokens = searchTerm.split(' in ');
    const mainQuery = searchTokens[0];
    const cityName = searchTokens.length > 1 ? searchTokens[1] : '';

    const filteredCities = cityName 
        ? matchedEntities.cities.filter(city => city.name.toLowerCase() === cityName.toLowerCase())
        : [];

    const filteredBrands = matchedEntities.brands.filter(brand => brand.name.toLowerCase().includes(mainQuery.toLowerCase()));
    const filteredDiets = matchedEntities.diets.filter(diet => diet.name.toLowerCase().includes(mainQuery.toLowerCase()));
    const filteredDishTypes = matchedEntities.dish_types.filter(dishType => dishType.name.toLowerCase().includes(mainQuery.toLowerCase()));

    const entitiesToCombine = [
        { key: 'brand', values: filteredBrands },
        { key: 'diet', values: filteredDiets },
        { key: 'dishType', values: filteredDishTypes }
    ];

    // Add combinations without city if city is not specified in the search term
    if (!cityName) {
        entitiesToCombine.forEach(entity => {
            entity.values.forEach(value => {
                results.push({ [entity.key]: value });
            });
        });
        return results;
    }

    // Add combinations with city
    entitiesToCombine.forEach(entity => {
        entity.values.forEach(value => {
            filteredCities.forEach(city => {
                results.push({ city, [entity.key]: value });
            });
        });
    });

    return results;
}

// Example usage
(async () => {
    const searchTerm = "vegan sushi in London";
    console.log('Search Term:', searchTerm);
    const entities = await extractEntities(searchTerm);
    console.log('entities:', JSON.stringify(entities, null, 2));
})().catch(error => console.error('Error:', error.stack));
