Initially I tried to develop it with an online Postgres service, Neon, but the [database](https://console.neon.tech/) that I was using was not returning the data from the tables, just empty arrays (`[]`) even when performing a basic query like:

`SELECT * FROM cities WHERE name ILIKE '%London%';`

<img width="1499" alt="Screenshot 2024-06-07 at 01 44 35" src="https://github.com/raresmigea/food-styles/assets/57077559/f8a39d49-13fc-4e0c-8da0-b10c255f9289">



Here is the implementation for Postgres:

```
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:***********@ep-wild-bonus-a5sl15bt.us-east-2.aws.neon.tech/neondb?sslmode=require',
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
    const client = await pool.connect();

    const entities: Entities = {
        cities: [],
        brands: [],
        dish_types: [],
        diets: []
    };
```

So I've used JSON files to store the information, the files are in `data` folder.

## How to run the code: ##

- clone the repo
- run `npm install`
- go to `src` folder
- run `npx ts-node src/extractEntities.ts`


For the initial input it should return:

```
Search Term: McDonald's in London
Filtered Brands: [
  {
    "id": 4,
    "name": "McDonald's"
  }
]
entities: [
  {
    "city": {
      "id": 1,
      "name": "London"
    },
    "brand": {
      "id": 4,
      "name": "McDonald's"
    }
  }
]
```

<img width="1188" alt="Screenshot 2024-06-07 at 01 45 46" src="https://github.com/raresmigea/food-styles/assets/57077559/3b013fdf-ed58-4097-a0b5-3422f13acb55">



For other inputs we must update `const searchTerm = "McDonald's in London";` with the desired value

<img width="1175" alt="Screenshot 2024-06-07 at 01 46 33" src="https://github.com/raresmigea/food-styles/assets/57077559/7e34c5cf-1e63-4a12-bbad-643d56f83edf">


