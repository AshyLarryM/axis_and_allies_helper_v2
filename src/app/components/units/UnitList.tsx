import { Unit } from "@/lib/units";

interface UnitListProps {
    title: string;
    units: Unit[];
    color: string;
}

export function UnitList({ title, units, color }: UnitListProps) {
    return (
        <div className="mx-12 text-lg text-white">
            <h2 className={`text-${color}-400 text-2xl`}>{title}</h2>
            <ul>
                {units.map((unit, index) => (
                    <li key={index}>{`${unit.name} x${unit.count}`}</li>
                ))}
            </ul>
        </div>
    );
}
