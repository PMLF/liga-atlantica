import preview from "#.storybook/preview";
import { clubs, clubsById } from "@/data/clubs";
import { Crest } from "./Crest";

const meta = preview.meta({
  title: "Components/Crest",
  component: Crest,
  argTypes: {
    club: { control: "select", options: Object.keys(clubsById), mapping: clubsById },
    size: { control: { type: "range", min: 16, max: 200, step: 4 } },
    className: { table: { disable: true } },
  },
  args: { club: clubsById.farol, size: 96 },
});

export const Default = meta.story({});

export const AllCrests = meta.story({
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="grid grid-cols-4 gap-x-8 gap-y-6">
      {clubs.map((club) => (
        <li key={club.id} className="flex flex-col items-center gap-2">
          <Crest club={club} size={64} />
          <span className="text-xs font-medium text-muted">{club.shortName}</span>
        </li>
      ))}
    </ul>
  ),
});
