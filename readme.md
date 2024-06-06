Initially I tried to develop it with Postgres but the Neon DB that I was using was not returning the data from the tables.

So I've used JSON files to store the information.

In order to run it, open a terminal, go to src folder and run `npx ts-node src/extractEntities.ts`

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

For other inputs we must update `const searchTerm = "McDonald's in London";` with the desired value