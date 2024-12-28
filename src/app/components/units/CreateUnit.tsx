import { Position, UnitName } from "@/lib/units";
import { Dispatch, SetStateAction } from "react";

interface CreateUnitProps {
    selectedUnit: UnitName,
    position: Position,
    setSelectedUnit: Dispatch<SetStateAction<UnitName>>,
    setPosition: Dispatch<SetStateAction<Position>>,
    unitCount: number,
    setUnitCount: Dispatch<SetStateAction<number>>,
    addUnit: () => void,
}


export function CreateUnit({ selectedUnit, position, setSelectedUnit, setPosition, unitCount, setUnitCount, addUnit }: CreateUnitProps) {
    function incrementCount() {
        setUnitCount(unitCount + 1);
    }

    function decrementCount() {
        if (unitCount > 1) {
            setUnitCount(unitCount - 1);
        }
    }


    return (
        <div className="flex flex-col items-center">
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

            <div className="flex flex-col items-center my-4">
                <label className="text-slate-200 mb-2">Unit Quantity</label>
                <div>
                    <button className="bg-gray-800 text-white text-center py-2 px-4 w-12 rounded-l-md"
                        onClick={decrementCount}
                    > -
                    </button>
                    <span className="bg-gray-800 text-white text-center py-2 px-4 w-12 ">
                        {unitCount}
                    </span>
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded-r-md"
                        onClick={incrementCount}
                    >
                        +
                    </button>
                </div>
            </div>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:opacity-80 mt-4"
                onClick={addUnit}
            >
                Add Unit
            </button>
        </div>
    )
}
