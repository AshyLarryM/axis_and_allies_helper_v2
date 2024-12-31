'use client';
import { groupUnitsByAttribute, newUnit, Position, Unit, UnitName, updateUnits } from "@/lib/units";
import { useState } from "react";
import { CreateUnit } from "./components/units/CreateUnit";
import { UnitList } from "./components/units/UnitList";
import { BattleZone } from "./components/battlezone/BattleZone";

export default function Home() {
	const [offensiveUnits, setOffensiveUnits] = useState<Unit[]>([]);
	const [defensiveUnits, setDefensiveUnits] = useState<Unit[]>([]);

	const [selectedUnit, setSelectedUnit] = useState<UnitName>("Infantry");
	const [position, setPosition] = useState<Position>("offensive");
	const [unitCount, setUnitCount] = useState<number>(1);

	const [groupedOffensiveUnits, setGroupedOffensiveUnits] = useState<Record<number, Unit[]>>({});
	const [groupedDefensiveUnits, setGroupedDefensiveUnits] = useState<Record<number, Unit[]>>({});

	const [battleZoneVisible, setBattleZoneVisible] = useState<boolean>(false);

	function addUnit() {
		const newUnitInstance = newUnit(selectedUnit, unitCount, position);
		if (position === "offensive") {
			updateUnits(offensiveUnits, newUnitInstance, setOffensiveUnits);
		} else {
			updateUnits(defensiveUnits, newUnitInstance, setDefensiveUnits);
		}
	}

	function sendToBattleZone() {
		if (offensiveUnits.length === 0 || defensiveUnits.length === 0) {
			console.log("add units for battle.")
			return;
		}

		const groupedByAttack = groupUnitsByAttribute(offensiveUnits, "attack");
		const groupedByDefense = groupUnitsByAttribute(defensiveUnits, "defense");

		setGroupedOffensiveUnits(groupedByAttack);
		setGroupedDefensiveUnits(groupedByDefense);

		setBattleZoneVisible(true);
	}

	return (
		<main className="p-4">
			<div className="mt-8">
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
				{(defensiveUnits.length > 0 || offensiveUnits.length > 0) && (
					<>
						<div className="flex justify-center mt-6">
							<div className="flex justify-center mt-6">
								<UnitList title="Offensive Units" units={offensiveUnits} color="red" />
								<UnitList title="Defensive Units" units={defensiveUnits} color="blue" />
							</div>
						</div>

						{offensiveUnits.length > 0 && defensiveUnits.length > 0 && (
							<div className="flex justify-center my-6">
								<button onClick={sendToBattleZone} className="py-3 px-3 bg-green-500 rounded-full font-semibold">Send To BattleZone</button>
							</div>
						)}
					</>
				)}

				{battleZoneVisible && (
					<div className="flex justify-center mt-6">
						<BattleZone
							offensiveUnits={groupedOffensiveUnits}
							defensiveUnits={groupedDefensiveUnits} />
					</div>
				)}
			</div>
		</main>
	);
}
