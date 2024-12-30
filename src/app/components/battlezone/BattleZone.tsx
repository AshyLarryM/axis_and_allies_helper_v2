import { GroupedUnitsByRole } from "@/lib/units";
interface BattleZoneProps {
    offensiveUnits: GroupedUnitsByRole,
    defensiveUnits: GroupedUnitsByRole,
}

export function BattleZone({ offensiveUnits, defensiveUnits }: BattleZoneProps) {

    function renderUnitsByValue(unitsByValue: GroupedUnitsByRole, attribute: string) {
        return Object.entries(unitsByValue).map(([value, units]) => (
            <div key={value} className="mb-4">
                <h4 className="font-bold">{`${attribute} Value: ${value}`}</h4>
                <ul>
                    {units.map((unit, index) => (
                        <li key={index}>
                            {`${unit.name} x${unit.count}`}
                        </li>
                    ))}
                </ul>
            </div>
        ));
    }
    
    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold">Offensive Units</h3>
            {renderUnitsByValue(offensiveUnits, "Attack")}
            <h3 className="text-lg font-semibold">Defensive Units</h3>
            {renderUnitsByValue(defensiveUnits, "Defense")}
        </div>
    );
}
