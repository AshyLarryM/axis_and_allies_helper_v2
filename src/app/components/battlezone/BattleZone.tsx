import { GroupedUnitsByRole, UnitName } from "@/lib/units";

interface BattleZoneProps {
    offensiveUnits: GroupedUnitsByRole;
    defensiveUnits: GroupedUnitsByRole;
}

const staticNumbers = [4, 3, 2, 1];

const attackUnitNames: Record<number, UnitName[]> = {
    4: ["Battleship", "Bomber"],
    3: ["Tank", "Fighter"],
    2: ["Submarine", "Destroyer", "Aircraft Carrier"],
    1: ["Infantry"],
};

const defenseUnitNames: Record<number, UnitName[]> = {
    4: ["Battleship", "Fighter"],
    3: ["Tank"],
    2: ["Infantry", "Destroyer", "Aircraft Carrier"],
    1: ["Bomber", "Submarine"],
};

export function BattleZone({ offensiveUnits, defensiveUnits }: BattleZoneProps) {
    function renderUnitsForNumber(unitsByValue: GroupedUnitsByRole, value: number) {
        const units = unitsByValue[value] || [];
        return (
            <ul>
                {units.map((unit, index) => (
                    <li key={index} className="text-sm">{`${unit.count}x ${unit.name} `}</li>
                ))}
            </ul>
        );
    }



    return (
        <div className="my-16">
            <div>
                <h3 className="text-center text-red-600 font-bold text-xl mb-4">Attackers</h3>
                <div className="grid grid-cols-4 justify-items-center">
                    {staticNumbers.map((value) => (
                        <div key={value} className="col-span-1 text-center text-gray-100">
                            {renderUnitsForNumber(offensiveUnits, value)}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="grid grid-cols-4 justify-items-center gap-x-8">
                    {staticNumbers.map((value) => (
                        <div key={value} className="text-center mt-4">
                            <p className="text-xs sm:text-sm md:text-md font-bold whitespace-nowrap text-red-400">
                                {attackUnitNames[value]?.join(" | ")}
                            </p>

                        </div>
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-4 justify-items-center items-center gap-x-8 text-gray-800 border-2 border-b-blue-500 border-t-red-500 border-l-yellow-500 border-r-yellow-500 py-8">
                {staticNumbers.map((value) => (
                    <div
                        key={value}
                        className="flex justify-center items-center bg-yellow-500 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-4xl sm:text-5xl md:text-6xl"
                    >
                        <h4>{value}</h4>
                    </div>
                ))}
            </div>
            <div>

                <div>
                    <div className="grid grid-cols-4 justify-items-center gap-x-8">
                        {staticNumbers.map((value) => (
                            <div key={value} className="text-center mb-4">
                                <p className="text-xs sm:text-sm md:text-md font-bold whitespace-nowrap text-blue-400">
                                    {defenseUnitNames[value]?.join(" | ")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="grid grid-cols-4 justify-items-center">
                    {staticNumbers.map((value) => (
                        <div key={value} className="col-span-1 text-center text-gray-100">
                            {renderUnitsForNumber(defensiveUnits, value)}
                        </div>
                    ))}
                </div>
                <h3 className="text-center text-blue-600 font-bold text-xl mt-4">Defenders</h3>
            </div>
        </div>
    );
}