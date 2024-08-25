type UnitName = "Infantry" | "Tank" | "Fighter" | "Bomber" | "Battleship" | "Submarine" | "Destroyer" | "Transport" | "Aircraft Carrier";
type UnitType = "land" | "air" | "sea";
type Role = "attacking" | "defensive";

export function newUnit(name: string, count: number, role: Role) {
    switch (name) {
        case "Infantry":
            return { name, attack: 1, defense: 2, count, category: "land", role };
        case "Tank":
            return { name, attack: 3, defense: 3, count, category: "land", role };
        case "Fighter":
            return { name, attack: 3, defense: 4, count, category: "air", role };
        case "Bomber":
            return { name, attack: 4, defense: 1, count, category: "air", role };
        case "Submarine":
            return { name, attack: 2, defense: 1, count, category: "sea", role };
        case "Transport":
            return { name, attack: 0, defense: 0, count, category: "sea", role };
        case "Destroyer":
            return { name, attack: 2, defense: 2, count, category: "sea", role };
        case "Aircraft Carrier":
            return { name, attack: 2, defense: 2, count, category: "sea", role };
        case "Battleship":
            return { name, attack: 4, defense: 4, count, category: "sea", role };
        default:
            return { name: "Infantry", attack: 1, defense: 2, count, category: "land", role }; // default to Infantry
    }
}
