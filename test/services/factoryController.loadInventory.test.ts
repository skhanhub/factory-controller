import FactoryController from "../../src/services/factoryController";
import inventory from "../data/inventory";

describe("Tests for the loadInventory method of factoryController class", () => {
  test("Should output and log the inventory", () => {
    //Arrange
    const factoryController = new FactoryController();
    console.log = jest.fn();

    //Act
    const result = factoryController.loadInventory(inventory);

    //Assert
    expect(console.log).toHaveBeenCalled();
    expect(result).toHaveProperty("iron_plate");
    expect(result.copper_cable).toEqual(10);
  });
});
