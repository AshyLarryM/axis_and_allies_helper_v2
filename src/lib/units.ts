type UnitName = "Infantry" | "Tank" | "Fighter" | "Bomber" | "Battleship" | "Submarine" | "Destroyer" | "Transport" | "Aircraft Carrier";
type UnitType = "land" | "air" | "sea";
type Position = "offensive" | "defensive";

interface Unit {
	name: UnitName,
	category: UnitType
	attack: number,
	defense: number,
	count: number,
	position: Position,
}

export function newUnit(name: UnitName, count: number, position: Position): Unit {
    switch (name) {
        case "Infantry":
            return { name, attack: 1, defense: 2, count, category: "land", position };
        case "Tank":
            return { name, attack: 3, defense: 3, count, category: "land", position };
        case "Fighter":
            return { name, attack: 3, defense: 4, count, category: "air", position };
        case "Bomber":
            return { name, attack: 4, defense: 1, count, category: "air", position };
        case "Submarine":
            return { name, attack: 2, defense: 1, count, category: "sea", position };
        case "Transport":
            return { name, attack: 0, defense: 0, count, category: "sea", position };
        case "Destroyer":
            return { name, attack: 2, defense: 2, count, category: "sea", position };
        case "Aircraft Carrier":
            return { name, attack: 2, defense: 2, count, category: "sea", position };
        case "Battleship":
            return { name, attack: 4, defense: 4, count, category: "sea", position };
        default:
            return { name: "Infantry", attack: 1, defense: 2, count, category: "land", position }; // default to Infantry
    }
}
