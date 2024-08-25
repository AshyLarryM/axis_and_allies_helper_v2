'use client';
import { newUnit } from "@/lib/units";
import { useState } from "react";

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

export default function Home() {

	const [offensiveUnits, setOffensiveUnits] = useState<Unit[]>([]);
	const [defensiveUnits, setDefensiveUnits] = useState<Unit[]>([]);

	const [selectedUnit, setSelectedUnit] = useState<UnitName>("Infantry");
	const [position, setPosition] = useState<Position>("offensive");

	const [count, setCount] = useState<number>(1);

	const [offensiveAttackGroups, setOffensiveAttackGroups] = useState<Record<number, Unit[]>>({});


	function addUnit() {
		const unit = newUnit(selectedUnit, count, position);

		if (position === 'offensive') {
			const existingUnitIndex = offensiveUnits.findIndex(u => u.name === unit.name);

			if (existingUnitIndex !== -1) {
				const updatedOffensiveUnits = offensiveUnits.map((unit, index) =>
					index === existingUnitIndex ? { ...unit, count: unit.count + count } : unit
				);
				setOffensiveUnits(updatedOffensiveUnits);
			} else {
				setOffensiveUnits([...offensiveUnits, unit]);
			}
		} else {
			const existingUnitIndex = defensiveUnits.findIndex(u => u.name === unit.name);

			if (existingUnitIndex !== - 1) {
				const updatedDefensiveUnits = defensiveUnits.map((unit, index) =>
					index === existingUnitIndex ? { ...unit, count: unit.count + count } : unit
				);
				setDefensiveUnits(updatedDefensiveUnits);
			} else {
				setDefensiveUnits([...defensiveUnits, unit]);
			}
		}
	}

	function sendToBattleStrip() {
		if (!offensiveUnits.length || !defensiveUnits.length) {
			console.log('need to add units for offense and defense!');
			return;
		}

		const offensiveAttackGroups: Record<number, Unit[]> = {};

		offensiveUnits.forEach(unit => {
			if (!offensiveAttackGroups[unit.attack]) {
				offensiveAttackGroups[unit.attack] = [];
			}
			offensiveAttackGroups[unit.attack].push(unit);
		})

		console.log("Offensive AttackGroups: ", offensiveAttackGroups);

		const defensiveDefenseGroups: Record<number, Unit[]> = {};

		defensiveUnits.forEach(unit => {
			if (!defensiveDefenseGroups[unit.defense]) {
				defensiveDefenseGroups[unit.defense] = [];
			}
			defensiveDefenseGroups[unit.defense].push(unit);
		});

		console.log("Offensive Attack Groups: ", offensiveAttackGroups);
		console.log("Defensive Group", defensiveDefenseGroups);

		setOffensiveAttackGroups(offensiveAttackGroups);
	}

	function takeCasualtyHits() {

	}

	function clearUnits() {
		setDefensiveUnits([]);
		setOffensiveUnits([]);
	}

	function incrementCount() {
		setCount(count + 1);
	}

	function decrementCount() {
		if (count > 1) {
			setCount(count - 1);
		}
	}


	return (
		<main className="">
			<div className="mt-16">
				<h1 className="text-2xl text-center text-slate-200">Choose Units for Battle</h1>

				<div className="flex justify-center my-4">
					<select
						className="bg-gray-800 rounded-md px-4 py-2 text-white"
						value={selectedUnit}
						onChange={(e) => setSelectedUnit(e.target.value as UnitName)}
					>
						<option value="Infantry">Infantry</option>
						<option value="Tank">Tank</option>
						<option value="Fighter">Fighter</option>
						<option value="Bomber">Bomber</option>
						<option value="Battleship">Battleship</option>
						<option value="Destroyer">Destroyer</option>
						<option value="Submarine">Submarine</option>
						<option value="Transport">Transport</option>
						<option value="Aircraft Carrier">Aircraft Carrier</option>

					</select>
					<select
						className="bg-gray-800 rounded-md px-4 py-2 text-white ml-4"
						value={position}
						onChange={(e) => setPosition(e.target.value as Position)}
					>
						<option value="offensive">Offensive</option>
						<option value="defensive">Defensive</option>
					</select>
				</div>

				<div className="flex flex-col items-center">
					<label className="text-white text-lg my-2">Quantity?</label>
					<div className="flex items-center">
						<button
							className="bg-gray-600 text-white px-8 py-2 rounded-l-md"
							onClick={decrementCount}
						>
							-
						</button>
						<span className="bg-gray-800 text-white text-center py-2 px-4 w-12">{count}</span>
						<button
							className="bg-gray-600 text-white px-8 py-2 rounded-r-md"
							onClick={incrementCount}
						>
							+
						</button>
					</div>
				</div>
				<div className="flex justify-center my-4">
					<button className="bg-green-600 text-white px-4 py-2 rounded-md hover:opacity-80"
						onClick={addUnit}>
						Add Unit
					</button>
					<button className="bg-red-600 px-4 py-2 rounded-md text-white ml-4"
						onClick={clearUnits}>
						Clear
					</button>
					<button className="bg-purple-600 text-white rounded-md px-4 py-2 ml-4 "
						onClick={sendToBattleStrip}>
						Send to Battle Strip
					</button>
				</div>

				<div className="mx-8 text-xl my-2 text-white">
					<h2 className="text-red-400">Offensive Units:</h2>
					<ul>
						{offensiveUnits.map((unit, index) => (
							<li key={index}>{`${unit.name} x ${unit.count}`}</li>
						))}
					</ul>
				</div>

				<div className="mx-8 text-xl mt-8 text-white">
					<h2 className="text-green-400">Defensive Units:</h2>
					<ul>
						{defensiveUnits.map((unit, index) => (
							<li key={index}>{`${unit.name} x ${unit.count}`}</li>
						))}
					</ul>
				</div>

				<div className="grid grid-cols-4 gap-4 mx-8 my-24">
					{[1, 2, 3, 4].map(attackValue => (
						<div
							key={attackValue}
							className="bg-gray-900 p-4 rounded-md text-white text-center"
						>
							<h3 className="text-lg font-bold">{attackValue}</h3>
						</div>
					))}
				</div>

				<div className="mx-8 mt-8 text-white">
					<h2 className="text-red-400 text-xl">Offensive Units by Attack Groups:</h2>
					<div>
						{Object.entries(offensiveAttackGroups).map(([attackValue, units]) => (
							<div key={attackValue} className="my-4">
								<h3 className="text-lg font-bold text-slate-300">Attack Power: {attackValue}</h3>
								<ul className="ml-4">
									{units.map((unit, index) => (
										<li key={index}>{`${unit.name} x ${unit.count}`}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

			</div>
		</main>
	);
}
