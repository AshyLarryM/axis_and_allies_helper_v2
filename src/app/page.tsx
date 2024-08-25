'use client';
import { newUnit } from "@/lib/units";
import { useState } from "react";

type UnitName = "Infantry" | "Tank" | "Fighter" | "Bomber" | "Battleship" | "Submarine" | "Destroyer" | "Transport" | "Aircraft Carrier";
type UnitType = "land" | "air" | "sea";
type Role = "attacking" | "defensive";

interface Unit {
    name: UnitName,
    category: UnitType
    attack: number,
    defense: number,
    count: number,
    role: Role,
}


export default function Home() {

	const [selectedUnit, setSelectedUnit] = useState<UnitName>("Infantry");
	const [count, setCount] = useState<number>(1);
	const [role, setRole] = useState<Role>("attacking");

	function addUnit() {
		const unit = newUnit(selectedUnit, count, role);

		if (role === 'attacking') {

		}
	}



	return (
		<main className="">

		</main>
	);
}
