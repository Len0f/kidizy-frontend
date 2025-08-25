// TDD Caroline

// Mock des modules React Native pour éviter les erreurs d'import
jest.mock("react-native", () => ({
  StyleSheet: {
    create: jest.fn(() => ({})),
  },
}));

// Fonction simple pour filtrer par âge
function filterByAge(babysitters, ageRange) {
  if (!ageRange) {
    return babysitters;
  }

  const [min, max] = ageRange.split("-").map(Number);

  return babysitters.filter((babysitter) => {
    const age = parseInt(babysitter.age);
    return age >= min && age <= max;
  });
}

// Tests
describe("Age Filter", () => {
  // TEST 1 : Vérifier qu'on récupère bien les babysitters de 18-25 ans
  test("Filter babysitters aged 18-25", () => {
    const babysitters = [
      { name: "Alice", age: "22" },
      { name: "Bob", age: "30" },
      { name: "Claire", age: "19" },
    ];

    const result = filterByAge(babysitters, "18-25");

    expect(result).toHaveLength(2); // Alice et Claire
    expect(result[0].name).toBe("Alice");
    expect(result[1].name).toBe("Claire");
  });

  // TEST 2 : Vérifier qu'on récupère tous les babysitters sans filtre
  test("Return all babysitters when no filter", () => {
    const babysitters = [
      { name: "Alice", age: "22" },
      { name: "Bob", age: "30" },
    ];

    const result = filterByAge(babysitters, "");

    expect(result).toHaveLength(2);
  });

  // TEST 3 : Vérifier qu'on ne récupère personne si pas dans la tranche d'âge
  test("Return empty array when no match", () => {
    const babysitters = [
      { name: "Alice", age: "22" },
      { name: "Bob", age: "30" },
    ];

    const result = filterByAge(babysitters, "40-50");

    expect(result).toHaveLength(0);
  });
});
