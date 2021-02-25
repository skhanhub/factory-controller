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
    return this.Inventory;
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
    return this.Recipes;
  }

  printInventory() {
    for (const item in this.Inventory) {
      console.log(`${item}: ${this.Inventory[item]}`);
    }
  }

  printRecipes() {
    console.log(this.Recipes);
  }

  build(item: string, level: number = 0) {
    const buildSequence: { sequence: string; time: number } = {
      sequence: "",
      time: 0,
    };
    let totalTime = 0;
    if (level === 0) {
      this.CurrentBuild = item;
      this.TempInventory = { ...this.Inventory };
    }

    if (!this.Recipes[item]) {
      if ((this.TempInventory[item] || 0) === 0) {
        throw new Error(
          `Insufficient resources to build: ${this.CurrentBuild}\n`
        );
      }
      return {
        sequence: "",
        time: 0,
      };
    }

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
          const tempItems = this.build(itemConsumed, level + 1);
          buildSequence.sequence = buildSequence.sequence + tempItems.sequence;
          totalTime += tempItems.time;
          for (const itemProduced in this.Recipes[itemConsumed]?.produces) {
            this.TempInventory[itemProduced] =
              (this.TempInventory[itemProduced] || 0) +
              (this.Recipes[itemConsumed]?.produces[itemProduced] || 0);
            if (itemProduced === itemConsumed) {
              this.TempInventory[itemProduced] =
                (this.TempInventory[itemProduced] || 0) - 1;
              totalTime += this.Recipes[itemProduced]?.time || 0;
              buildSequence.sequence = `${buildSequence.sequence}${" ".repeat(
                2 * (level + 1)
              )}> building recipe ${this.Recipes[itemProduced]?.name} in ${
                this.Recipes[itemProduced]?.time
              }s (${
                tempItems.time + (this.Recipes[itemProduced]?.time || 0)
              }s total)\n`;
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
          if (itemProduced === item)
            buildSequence.sequence = `${buildSequence.sequence}${" ".repeat(
              2 * level
            )}> building recipe ${this.Recipes[itemProduced]?.name} in ${
              this.Recipes[itemProduced]?.time || 0
            }s (${
              totalTime + (this.Recipes[itemProduced]?.time || 0)
            }s total)\n`;
        }
      }
      totalTime += this.Recipes[item]?.time || 0;
      this.Inventory = { ...this.TempInventory };
      console.log(buildSequence.sequence);
      console.log(`Built ${item} in ${totalTime} seconds\n`);
    }
    buildSequence.time += totalTime;
    return buildSequence;
  }

  buildMultiple(itemsToBuild: Array<{ name: string; quantity: number }>) {
    const builds = [];
    for (const item of itemsToBuild) {
      for (let i = 0; i < item.quantity; i++) {
        builds.push(this.build(item.name));
      }
    }
    this.printInventory();
    return builds;
  }
}
