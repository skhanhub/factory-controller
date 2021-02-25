import FactoryController from "../../src/services/factoryController";
import recipes from "../data/recipes";
import inventory from "../data/inventory";

describe("Tests for the build method of factoryController class", () => {
  test("Should return an object with sequence and time property", () => {
    //Arrange
    const factoryController = new FactoryController();
    factoryController.loadInventory(inventory);
    factoryController.loadRecipes(recipes);
    console.log = jest.fn();

    //Act
    const result = factoryController.build("electric_engine");

    //Assert
    expect(console.log).toHaveBeenCalled();
    expect(result).toHaveProperty("sequence");
    expect(result).toHaveProperty("time");
  });

  test("Should set time to 40", () => {
    //Arrange
    const factoryController = new FactoryController();
    factoryController.loadInventory(inventory);
    factoryController.loadRecipes(recipes);
    console.log = jest.fn();

    //Act
    const result = factoryController.build("electric_engine");

    //Assert
    expect(result.time).toEqual(40);
  });
});
