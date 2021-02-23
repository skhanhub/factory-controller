import inventory from "../data/inventory";

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

  printInventory() {
    for (const item in this.Inventory) {
      console.log(`${item}: ${this.Inventory[item]}`);
    }
  }

  printRecipes() {
    console.log(this.Recipes);
  }

  plan(item: string, quantity: number, level: number = 0) {
    if (quantity === 0) return { sequence: [], required: {} };
    else if (!this.Recipes[item]) {
      return { sequence: [], required: { [item]: quantity } };
    }
    const itemRequired: any = { sequence: [], required: {} };
    for (const itemConsumed in this.Recipes[item]?.consumes) {
      if (this.Inventory[itemConsumed]) {
        itemRequired.required[itemConsumed] =
          this.Inventory[itemConsumed] >=
          (this.Recipes[item]?.consumes[itemConsumed] || 0)
            ? this.Recipes[item]?.consumes[itemConsumed] || 0
            : this.Recipes[item]?.consumes[itemConsumed] ||
              0 - this.Inventory[itemConsumed];
      }

      const tempItems: any = this.plan(
        itemConsumed,
        this.Recipes[item]?.consumes[itemConsumed] ||
          0 - this.Inventory[itemConsumed] ||
          0,
        level + 1
      );
      if (
        (this.Recipes[item]?.consumes[itemConsumed] || 0) >
        (this.Inventory[itemConsumed] || 0)
      ) {
        itemRequired.sequence = [
          ...itemRequired.sequence,
          ...tempItems.sequence,
        ];
        for (
          let i = 0;
          i <
          (this.Recipes[item]?.consumes[itemConsumed] || 0) -
            (this.Inventory[itemConsumed] || 0);
          i++
        ) {
          itemRequired.sequence.push(itemConsumed);
        }
      }

      for (const newItem in tempItems.required) {
        itemRequired.required[newItem] = itemRequired.required[newItem]
          ? itemRequired.required[newItem] + tempItems.required[newItem]
          : tempItems.required[newItem];
      }
    }
    if (level === 0) itemRequired.sequence.push(item);
    return itemRequired;
  }

  build(item: string) {
    let totalTime = 0;
    const itemRequired = this.plan(item, 1);
    for (item in itemRequired.required) {
      if (itemRequired.required[item] > this.Inventory[item])
        throw new Error(`Insufficient resources to build: ${item}`);
    }
    for (item of itemRequired.sequence) {
      console.log(
        `building recipe ${this.Recipes[item]?.name} in ${this.Recipes[item]?.time}s`
      );
      totalTime += this.Recipes[item]?.time || 0;
      for (const consumedItem in this.Recipes[item]?.consumes) {
        this.Inventory[consumedItem] -=
          this.Recipes[item]?.consumes[consumedItem] || 0;
      }
      for (const producedItem in this.Recipes[item]?.produces) {
        this.Inventory[producedItem] =
          this.Inventory[producedItem] +
            (this.Recipes[item]?.produces[producedItem] || 0) ||
          this.Recipes[item]?.produces[producedItem] ||
          0;
      }
      this.printInventory();
    }
    console.log(itemRequired);
    console.log(`Total time ${totalTime}`);
  }
}
