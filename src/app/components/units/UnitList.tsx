import { Unit } from "@/lib/units";

interface UnitListProps {
    title: string;
    units: Unit[];
    color: string;
}

export function UnitList({ title, units, color }: UnitListProps) {
    return (
        <div className="mx-12 text-white">
            <h2 className={`text-${color}-400 text-xl`}>{title}</h2>
            <ul
                className={`grid gap-y-2 ${
                    units.length > 4 ? "grid-cols-2 gap-x-8" : "grid-cols-1"
                }`}
            >
                {units.map((unit, index) => (
                    <li key={index}>{`${unit.name} x${unit.count}`}</li>
                ))}
            </ul>
        </div>
    );
}
