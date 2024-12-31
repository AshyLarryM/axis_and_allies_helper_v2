export type UnitName = "Infantry" | "Tank" | "Fighter" | "Bomber" | "Battleship" | "Submarine" | "Destroyer" | "Transport" | "Aircraft Carrier";
export type UnitType = "land" | "air" | "sea";
export type Position = "offensive" | "defensive";

export interface Unit {
    name: UnitName,
    attack: number,
    defense: number,
    count: number,
    category: UnitType
    position: Position,
}

export type GroupedUnitsByRole = Record<number, Unit[]>;

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
            return { name: "Infantry", attack: 1, defense: 2, count, category: "land", position };
    }
}

export function updateUnits(units: Unit[], newUnit: Unit, setUnits: React.Dispatch<React.SetStateAction<Unit[]>>) {
    const existingUnitIndex = units.findIndex(u => u.name === newUnit.name);

    if (existingUnitIndex !== -1) {
        const updatedUnits = units.map((u, index) =>
            index === existingUnitIndex
                ? { ...u, count: u.count + newUnit.count }
                : u
        );
        setUnits(updatedUnits);
    } else {
        setUnits([...units, newUnit]);
    }
};

export function groupUnitsByAttribute(units: Unit[], attribute: "attack" | "defense"): Record<number, Unit[]> {
    return units.reduce((groups, unit) => {
        const key = unit[attribute];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(unit);
        console.log("Groups: ", groups, units);
        return groups;
    }, {} as Record<number, Unit[]>)
}

