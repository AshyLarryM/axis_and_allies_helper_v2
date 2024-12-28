'use client';
import { newUnit, Position, Unit, UnitName, updateUnits } from "@/lib/units";
import { useState } from "react";
import { CreateUnit } from "./components/units/CreateUnit";
import { UnitList } from "./components/units/UnitList";

export default function Home() {

	const [offensiveUnits, setOffensiveUnits] = useState<Unit[]>([]);
	const [defensiveUnits, setDefensiveUnits] = useState<Unit[]>([]);

	const [selectedUnit, setSelectedUnit] = useState<UnitName>("Infantry");
	const [position, setPosition] = useState<Position>("offensive");
	const [unitCount, setUnitCount] = useState<number>(1);

	function addUnit() {
		const newUnitInstance = newUnit(selectedUnit, unitCount, position);
		if (position === "offensive") {
			updateUnits(offensiveUnits, newUnitInstance, setOffensiveUnits);
		} else {
			updateUnits(defensiveUnits, newUnitInstance, setDefensiveUnits);
		}
	}


	return (
		<main className="">
			<div className="mt-16">
				<h1 className="text-2xl text-center text-slate-200">Choose Units for Battle</h1>
				<CreateUnit
					position={position}
					selectedUnit={selectedUnit}
					setSelectedUnit={setSelectedUnit}
					setPosition={setPosition}
					unitCount={unitCount}
					setUnitCount={setUnitCount}
					addUnit={addUnit}
				/>
				<div className="flex justify-center mt-6">
					<div className="flex justify-center mt-6">
						<UnitList title="Offensive Units" units={offensiveUnits} color="red" />
						<UnitList title="Defensive Units" units={defensiveUnits} color="blue" />
					</div>
				</div>
			</div>
		</main>
	);
}
