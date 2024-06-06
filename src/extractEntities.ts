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
    return {
        cities: readJsonFile('./src/data/cities.json'),
        brands: readJsonFile('./src/data/brands.json'),
        dish_types: readJsonFile('./src/data/dish-types.json'),
        diets: readJsonFile('./src/data/diets.json'),
    };
}

async function extractEntities(searchTerm: string): Promise<object[]> {
    const matchedEntities = loadEntitiesFromJson();
    const results: object[] = [];
    const searchTokens = searchTerm.toLowerCase().split(' in ');

    const mainQuery = searchTokens[0];
    const cityName = searchTokens[1];

    const filteredCities = cityName ? matchedEntities.cities.filter(city => city.name.toLowerCase() === cityName) : [];
    const filteredBrands = matchedEntities.brands.filter(brand => mainQuery.includes(brand.name.toLowerCase()));
    const filteredDiets = matchedEntities.diets.filter(diet => mainQuery.includes(diet.name.toLowerCase()));
    const filteredDishTypes = matchedEntities.dish_types.filter(dishType => mainQuery.includes(dishType.name.toLowerCase()));

    const uniqueResults = new Set<object>();

    if (filteredCities.length === 0) {
        for (const brand of filteredBrands) {
            uniqueResults.add({ brand });
        }
        for (const diet of filteredDiets) {
            for (const dishType of filteredDishTypes) {
                uniqueResults.add({ diet, dishType });
            }
        }
    } else {
        for (const city of filteredCities) {
            if (filteredDiets.length > 0 && filteredDishTypes.length > 0) {
                for (const diet of filteredDiets) {
                    for (const dishType of filteredDishTypes) {
                        uniqueResults.add({ city, diet, dishType });
                    }
                }
            }
            if (filteredDiets.length > 0 && filteredBrands.length > 0) {
                for (const diet of filteredDiets) {
                    for (const brand of filteredBrands) {
                        uniqueResults.add({ city, diet, brand });
                    }
                }
            }
            if (filteredDiets.length === 0 && filteredDishTypes.length > 0) {
                for (const dishType of filteredDishTypes) {
                    uniqueResults.add({ city, dishType });
                }
            }
            if (filteredDiets.length === 0 && filteredBrands.length > 0) {
                for (const brand of filteredBrands) {
                    uniqueResults.add({ city, brand });
                }
            }
        }
    }

    results.push(...uniqueResults);

    return results;
}

// Example usage
(async () => {
    const searchTerm = "vegan sushi in London";
    const entities = await extractEntities(searchTerm);
    console.log('entities:', JSON.stringify(entities, null, 2));
})().catch(error => console.error('Error:', error.stack));
