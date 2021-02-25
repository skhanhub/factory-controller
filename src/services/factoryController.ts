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
  TempInventory: IInventory;
  Recipes: IRecipes;
  CurrentBuild: string;

  constructor() {
    this.Inventory = {};
    this.TempInventory = {};
    this.Recipes = {};
    this.CurrentBuild = "";
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

  printInventory() {
    for (const item in this.Inventory) {
      console.log(`${item}: ${this.Inventory[item]}`);
    }
  }

  printRecipes() {
    console.log(this.Recipes);
  }

  plan(item: string, quantity: number, level: number = 0) {
    if (level === 0) {
      this.CurrentBuild = item;
      this.TempInventory = { ...this.Inventory };
    }
    if (quantity === 0) return [];
    else if (!this.Recipes[item]) {
      if (quantity > (this.TempInventory[item] || 0)) {
        throw new Error(
          `Insufficient resources to build: ${this.CurrentBuild}`
        );
      }
      return [];
    }
    let sequence: Array<string> = [];
    for (const itemConsumed in this.Recipes[item]?.consumes) {
      for (
        let j = 0;
        j < (this.Recipes[item]?.consumes[itemConsumed] || 0);
        j++
      ) {
        if ((this.TempInventory[itemConsumed] || 0) > 0) {
          this.TempInventory[itemConsumed] =
            (this.TempInventory[itemConsumed] || 0) - 1;
        } else {
          const tempItems = this.plan(itemConsumed, 1, level + 1);
          sequence = [...sequence, ...tempItems];

          for (const itemProduced in this.Recipes[itemConsumed]?.produces) {
            this.TempInventory[itemProduced] =
              (this.TempInventory[itemProduced] || 0) +
              (this.Recipes[itemConsumed]?.produces[itemProduced] || 0);
            if (itemProduced === itemConsumed) {
              this.TempInventory[itemProduced] =
                (this.TempInventory[itemProduced] || 0) - 1;
              sequence.push(itemProduced);
            }
          }
        }
      }
    }

    if (level === 0) {
      for (const itemProduced in this.Recipes[item]?.produces) {
        for (
          let j = 0;
          j < (this.Recipes[item]?.produces[itemProduced] || 0);
          j++
        ) {
          this.TempInventory[itemProduced] =
            (this.TempInventory[itemProduced] || 0) + 1;
          if (itemProduced === item) sequence.push(itemProduced);
        }
      }
      this.Inventory = { ...this.TempInventory };
    }
    return sequence;
  }

  build(item: string) {
    let totalTime = 0;
    const itemRequired = this.plan(item, 1);
    for (item of itemRequired) {
      console.log(
        `building recipe ${this.Recipes[item]?.name} in ${this.Recipes[item]?.time}s`
      );
      totalTime += this.Recipes[item]?.time || 0;
    }
    console.log(`Total time to build ${item} is ${totalTime}`);
  }

  buildMultiple(itemsToBuild: Array<{ name: string; quantity: number }>) {
    for (const item of itemsToBuild) {
      for (let i = 0; i < item.quantity; i++) {
        this.build(item.name);
      }
    }
    this.printInventory();
  }
}
