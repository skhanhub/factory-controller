interface IRecipes {
  [key: string]: {
    produces: number;
    consumes: {
      [key: string]: number;
    };
    time: number;
  };
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
    for (const item in newInventory) {
      this.Inventory[item] =
        this.Inventory[item] + newInventory[item] || newInventory[item];
    }
  }
}
