interface IRecipes {
  [key: string]: {
    produces: number;
    consumes: {
      [key: string]: number;
    };
    time: number;
  };
}

export default class FactoryController {
  Inventory: { [key: string]: number };
  Recipes: IRecipes;
  constructor() {
    this.Inventory = {};
    this.Recipes = {};
  }
}
