Initially I tried to develop it with Postgres but the Neon DB that I was using was not returning the data from the tables.
Here is the implementation for Postgres [link](https://github.com/raresmigea/food-styles/commit/2ab59d8a18fefd6d62a7a829b57f2286578994ae#diff-117b15355f721d250aea88628b9ebdafd88a4c2669932e640857229149e93515)

So I've used JSON files to store the information, the files are in `data` folder.

In order to run it, open a terminal, go to `src` folder then run `npx ts-node src/extractEntities.ts`

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
