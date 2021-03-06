export default {
  recipe_gear: {
    title: "Gear",
    time: 0.5,
    consumes: {
      iron_plate: 2,
    },
    produces: {
      iron_gear: 1,
    },
  },
  recipe_pipe: {
    title: "Pipe",
    time: 0.5,
    consumes: {
      iron_plate: 1,
    },
    produces: {
      pipe: 1,
    },
  },
  recipe_cables: {
    title: "Copper Cable (2x)",
    time: 0.5,
    consumes: {
      copper_plate: 1,
    },
    produces: {
      copper_cable: 2,
    },
  },
  recipe_steel: {
    title: "Steel Plate",
    time: 16.0,
    consumes: {
      iron_plate: 5,
    },
    produces: {
      steel_plate: 1,
    },
  },
  recipe_circuit: {
    title: "Electric Circuit",
    time: 1.5,
    consumes: {
      iron_plate: 1,
      copper_cable: 3,
    },
    produces: {
      electric_circuit: 1,
    },
  },
  recipe_engine_block: {
    title: "Engine Block",
    time: 10.0,
    consumes: {
      steel_plate: 1,
      iron_gear: 1,
      pipe: 2,
    },
    produces: {
      engine_block: 1,
    },
  },
  recipe_elec_engine: {
    title: "Electric Engine",
    time: 10.0,
    consumes: {
      electric_circuit: 2,
      engine_block: 1,
      lubricant: 15,
    },
    produces: {
      electric_engine: 1,
    },
  },
};
