"use client";

export function SortSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
        >
            <option value="recent">Newest</option>
            <option value="top">Most Voted</option>
            <option value="views">Most Viewed</option>
        </select>
    );
}
