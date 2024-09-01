'use client';
import { newUnit } from "@/lib/units";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

	const [groupsAttacked, setGroupsAttacked] = useState<Set<number>>(new Set());
	const [groupsDefended, setGroupsDefended] = useState<Set<number>>(new Set());
	const [currentAttackValue, setCurrentAttackValue] = useState<number | null>(null);
	const [currentDefendValue, setCurrentDefendValue] = useState<number | null>(null);

	const [selectedUnit, setSelectedUnit] = useState<UnitName>("Infantry");
	const [position, setPosition] = useState<Position>("offensive");

	const [count, setCount] = useState<number>(1);

	const [offensiveAttackGroups, setOffensiveAttackGroups] = useState<Record<number, Unit[]>>({});
	const [defensiveDefenseGroups, setDefensiveDefenseGroups] = useState<Record<number, Unit[]>>({});

	const [diceRolls, setDiceRolls] = useState<number[]>([]);
	const [hits, setHits] = useState<number>(0);
	const [casualtyZone, setCasualtyZone] = useState<Unit[]>([]);

	const [isOffensivePhase, setIsOffensivePhase] = useState<boolean>(true);

	useEffect(() => {
		const totalDefensiveUnits = calculateTotalUnits(defensiveDefenseGroups);
		if (hits > 0 && hits >= totalDefensiveUnits && isOffensivePhase) {
			checkAndAutoAssignHits();
			setIsOffensivePhase(false);  // Change the phase immediately
		}
	}, [hits, defensiveDefenseGroups, isOffensivePhase]);



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
		if (!offensiveUnits.length || !defensiveUnits.length) { // check if offensive and defensive units exist
			console.log('need to add units for offense and defense!');
			toast.error("Must add units for Offense and Defense first!")
			return;
		}

		const offensiveAttackGroups: Record<number, Unit[]> = {};

		offensiveUnits.forEach(unit => {
			if (!offensiveAttackGroups[unit.attack]) {
				offensiveAttackGroups[unit.attack] = [];
			}
			offensiveAttackGroups[unit.attack].push(unit);
		})

		const defensiveDefenseGroups: Record<number, Unit[]> = {};

		defensiveUnits.forEach(unit => {
			if (!defensiveDefenseGroups[unit.defense]) {
				defensiveDefenseGroups[unit.defense] = [];
			}
			defensiveDefenseGroups[unit.defense].push(unit);
		});

		setOffensiveAttackGroups(offensiveAttackGroups);
		setDefensiveDefenseGroups(defensiveDefenseGroups);
	}

	function rollDice(numberOfDice: number): number[] {
		const newDiceRolls = [];

		for (let i = 0; i < numberOfDice; i++) {
			const roll = Math.floor(Math.random() * 6) + 1;
			newDiceRolls.push(roll)
		}

		setDiceRolls(newDiceRolls);
		return newDiceRolls;
	}

	function calculateTotalUnits(units: Record<number, Unit[]>): number {
		return Object.values(units).reduce(
			(total, unitArray) => total + unitArray.reduce((sum, unit) => sum + unit.count, 0),
			0
		);
	}

	function checkAndAutoAssignHits() {
		const totalDefensiveUnits = calculateTotalUnits(defensiveDefenseGroups);

		if (hits >= totalDefensiveUnits) {
			console.log("Auto-assigning hits to defensive units since hits >= total defensive units");

			// Automatically assign hits to all defensive units
			const updatedDefenseGroups = { ...defensiveDefenseGroups };
			const newCasualties: Unit[] = [];

			Object.keys(updatedDefenseGroups).forEach((defenseValue) => {
				const units = updatedDefenseGroups[Number(defenseValue)];

				units.forEach((unit) => {
					newCasualties.push(unit); // Move entire unit to casualties
				});

				updatedDefenseGroups[Number(defenseValue)] = []; // Remove all units from defense group
			});

			const casualtySummary = newCasualties.map(unit => `${unit.name} x ${unit.count}`).join(', ');
			toast.success(`Units hit and auto-assigned to casualty zone: ${casualtySummary}`);

			setDefensiveDefenseGroups(updatedDefenseGroups);
			setCasualtyZone([...casualtyZone, ...newCasualties]);
			setHits(0); // Reset the hits after applying
			setIsOffensivePhase(false);

			console.log("casualties: ", newCasualties);
			toast.success(`Casualties:  ${newCasualties}`); // TODO: Not sure why not displaying.
		}
	}

	const attackedGroups: Set<number> = new Set();

	function attack() {
		if (!Object.keys(offensiveAttackGroups).length) {
			console.log("No Offensive Units available for attack");
			return;
		}

		if (currentAttackValue === null) { // check for first attack (currentAttackValue(null)) if not then start with highestAttackValue
			const highestAttackValue = Math.max(...Object.keys(offensiveAttackGroups).map(Number));
			setCurrentAttackValue(highestAttackValue);
			attackWithGroup(highestAttackValue);
		}
		else {
			const availableAttackValues = Object.keys(offensiveAttackGroups) // Find the next highest attack value group that hasn't attacked yet
				.map(Number)
				.filter(attackValue => !attackedGroups.has(attackValue) && attackValue < currentAttackValue);

			if (availableAttackValues.length) {
				const nextHighestAttackValue = Math.max(...availableAttackValues);

				if (availableAttackValues.length === 1) {
					attackWithGroup(nextHighestAttackValue);
					console.log("All attack groups have already attacked!");
					toast.success("All attack groups have already attacked!")

					checkAndAutoAssignHits();

					setIsOffensivePhase(false);
					setCurrentAttackValue(null);
				}
				else {
					setCurrentAttackValue(nextHighestAttackValue);
					attackWithGroup(nextHighestAttackValue);
				}
			}
		}
	}


	function attackWithGroup(attackValue: number) {
		const attackGroup = offensiveAttackGroups[attackValue];

		if (attackGroup) {
			const totalUnits = attackGroup.reduce((total, unit) => total + unit.count, 0);
			const diceRolls = rollDice(totalUnits);

			let newHits = 0;
			diceRolls.forEach(roll => {
				if (roll <= attackValue) {
					newHits++;
				}
			});

			setHits(prevHits => {
				const updatedHits = prevHits + newHits;
				console.log("Updated hits: ", updatedHits);
				return updatedHits;
			});

			setGroupsAttacked(prev => {
				const updatedSet = new Set(prev);
				updatedSet.add(attackValue);
				return updatedSet;
			});

			console.log(`Rolling ${totalUnits} dice for attack group with attack value of ${attackValue}:`);
			toast.success(`Rolling ${totalUnits} dice for attack group with attack value of ${attackValue}: `);
			console.log("Dice Rolls:", diceRolls);
		} else {
			console.log(`No units available for attack value: ${attackValue}`);
		}
	}

	function assignHitToUnit(attackValue: number, unitIndex: number) {
		if (hits > 0) {
			const updatedDefensiveGroups = { ...defensiveDefenseGroups };
			const updatedCasualtyZone = [...casualtyZone];

			// Get the specific unit
			const unitToHit = updatedDefensiveGroups[attackValue][unitIndex];

			if (unitToHit) {
				unitToHit.count -= 1;

				const casualtyIndex = updatedCasualtyZone.findIndex(unit => unit.name === unitToHit.name);
				if (casualtyIndex !== -1) {
					updatedCasualtyZone[casualtyIndex].count += 1;
				} else {
					updatedCasualtyZone.push({ ...unitToHit, count: 1 });
				}

				// Remove the unit from the defensive group if its count is zero
				if (unitToHit.count === 0) {
					updatedDefensiveGroups[attackValue].splice(unitIndex, 1);
					// Remove the key from the object if no units left for that attack value
					if (updatedDefensiveGroups[attackValue].length === 0) {
						delete updatedDefensiveGroups[attackValue];
					}
				}

				setDefensiveDefenseGroups(updatedDefensiveGroups);
				setCasualtyZone(updatedCasualtyZone);
				setHits(prevHits => prevHits - 1);

				toast.success(`${unitToHit.name} hit!`);
			} else {
				console.log("No unit to hit at this index and attack value");
			}
		}
	}

	const defendedGroups: Set<number> = new Set();

	function defend() {
		console.log("defensive units", defensiveUnits);
		if (hits !== 0) {
			toast.error("Assign hits before defending!")
		}

		if (!Object.keys(defensiveDefenseGroups).length) {
			console.log("No Defensive Units available for attack");
			return;
		}
	}

	function clearUnits() {
		setDefensiveUnits([]);
		setOffensiveUnits([]);
		setOffensiveAttackGroups({});
		setDefensiveDefenseGroups({});
		setGroupsAttacked(new Set());
		setHits(0);
		setIsOffensivePhase(true);
		setCasualtyZone([]);

		console.log("cleared state")
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

				<div className="flex justify-center">
					<div className="mx-12 text-lg text-white">
						<h2 className="text-red-400 text-2xl">Offensive Units:</h2>
						<ul>
							{offensiveUnits.map((unit, index) => (
								<li key={index}>{`${unit.name} x ${unit.count}`}</li>
							))}
						</ul>
					</div>

					<div className="mx-12 text-lg text-white">
						<h2 className="text-green-400 text-2xl">Defensive Units:</h2>
						<ul>
							{defensiveUnits.map((unit, index) => (
								<li key={index}>{`${unit.name} x ${unit.count}`}</li>
							))}
						</ul>
					</div>
					<div className="text-white text-xl">
						<h2>Total Hits: {hits}</h2>
					</div>
				</div>

				{/* BattleZone */}
				<div className="grid grid-cols-4 gap-4 mx-8 mt-24">
					{[1, 2, 3, 4].map(attackValue => (
						<div key={attackValue} className="bg-gray-900 p-4 rounded-md text-white text-center">
							<div className="flex justify-center mb-2 pb-2 border-b border-yellow-500">
								{offensiveAttackGroups[attackValue] ? (
									offensiveAttackGroups[attackValue].map((unit, index) => (
										<div key={index} className="mx-2 text-red-300 text-lg">
											{`${unit.name} x ${unit.count}`}
										</div>
									))
								) : (
									<div className="text-gray-500">No units</div>
								)}
							</div>
							<h3 className="text-2xl font-bold mt-2">{attackValue}</h3>
							<div className="flex justify-center mt-2 border-t pt-2 border-yellow-500">
								{defensiveDefenseGroups[attackValue] ? (
									defensiveDefenseGroups[attackValue].map((unit, index) => (
										<div
											key={index}
											className={`mx-2 text-green-300 text-lg ${hits > 0 ? 'cursor-pointer' : ''}`}
											onClick={() => assignHitToUnit(attackValue, index)}
										>
											{`${unit.name} x ${unit.count}`}
										</div>
									))
								) : (
									<div className="text-gray-500">No units</div>
								)}

							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center mt-8">
					<div className="flex space-x-4">
						{diceRolls.map((roll, index) => (
							<Image
								key={index}
								src={`/diceImages/dice-${roll}.svg`}
								alt={`Dice ${roll}`}
								height={72}
								width={72}
								className="bg-white rounded-sm"
							/>
						))}

					</div>
				</div>

				<div className="flex justify-center mt-12">
					<div>
						{isOffensivePhase ? (
							<button onClick={attack} className="text-white text-xl bg-orange-700 px-4 py-2 rounded-md">Roll Dice and Attack</button>
						) : (
							<button onClick={defend} className="text-white text-xl bg-red-700 px-4 py-2 rounded-md">
								Roll Dice To Defend
							</button>
						)}
					</div>
				</div>

				<div className="flex justify-center mt-16">
					<div>
						<h3 className="text-3xl text-white font-semibold">Casualty Zone</h3>
						<ul>
							{casualtyZone.map((unit, index) => (
								<li key={index} className="text-xl text-red-500">{`${unit.name} x ${unit.count}`}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
