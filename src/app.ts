import FactoryController from "./services/factoryController";
import inventory from "./data/inventory";
import recipes from "./data/recipes";

const factoryController = new FactoryController();
factoryController.loadInventory(inventory);
factoryController.loadRecipes(recipes);

factoryController.printInventory();

try {
  factoryController.buildMultiple([
    {
      name: "electric_engine",
      quantity: 3,
    },
    {
      name: "electric_circuit",
      quantity: 5,
    },
    {
      name: "electric_engine",
      quantity: 3,
    },
  ]);
} catch (err) {
  console.log(err.message);
  factoryController.printInventory();
}
