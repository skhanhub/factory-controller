interface IRecipes {
  [key: string]: {
    produces: {
      [key: string]: number;
    };
    consumes: {
      [key: string]: number;
    };
    time: number;
    name: string;
  } | null;
}
interface IInventory {
  [key: string]: number;
}
export default class FactoryController {
  Inventory: IInventory;
  Recipes: IRecipes;
  constructor() {
    this.Inventory = {};
    this.Recipes = {};
  }

  loadInventory(newInventory: IInventory) {
    let count = 0;
    for (const item in newInventory) {
      this.Inventory[item] =
        this.Inventory[item] + newInventory[item] || newInventory[item];
      this.Recipes[item] = null;
      count++;
    }
    console.log(`Inventory loaded: ${count} unique components`);
  }

  loadRecipes(newRecipes: any) {
    let count = 0;
    for (const recipe in newRecipes) {
      for (const item in newRecipes[recipe].produces) {
        if (!this.Recipes[item]) {
          this.Recipes[item] = {
            ...newRecipes[recipe],
            name: recipe,
          };
          count++;
        }
      }
    }
    console.log(`Recipes loaded: ${count} total`);
  }
}
