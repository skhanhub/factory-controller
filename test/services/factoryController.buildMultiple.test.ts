import FactoryController from "../../src/services/factoryController";
import recipes from "../data/recipes";
import inventory from "../data/inventory";

describe("Tests for the buildMultiple method of factoryController class", () => {
  test("Should return 5 builds", () => {
    //Arrange
    const factoryController = new FactoryController();
    factoryController.loadInventory(inventory);
    factoryController.loadRecipes(recipes);
    console.log = jest.fn();

    //Act
    const result = factoryController.buildMultiple([
      {
        name: "electric_engine",
        quantity: 3,
      },
      {
        name: "electric_circuit",
        quantity: 2,
      },
    ]);

    //Assert
    expect(result.length).toEqual(5);
  });
});
