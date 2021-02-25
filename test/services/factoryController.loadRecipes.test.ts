import FactoryController from "../../src/services/factoryController";
import recipes from "../data/recipes";

describe("Tests for the loadRecipes method of factoryController class", () => {
  test("Should output and log the modified recipes", () => {
    //Arrange
    const expectedResult = {
      title: "Electric Engine",
      time: 10,
      consumes: { electric_circuit: 2, engine_block: 1, lubricant: 15 },
      produces: { electric_engine: 1 },
      name: "recipe_elec_engine",
    };
    const factoryController = new FactoryController();
    console.log = jest.fn();

    //Act
    const result = factoryController.loadRecipes(recipes);

    //Assert
    expect(console.log).toHaveBeenCalled();
    expect(result).toHaveProperty("electric_engine");
    expect(result.electric_engine).toMatchObject(expectedResult);
  });
});
