import preview from "#.storybook/preview";
import { clubsById } from "@/data/clubs";
import { getPlayer, squad } from "@/data/players";
import { PlayerCard, playerCardProps } from "./PlayerCard";

const meta = preview.meta({
  title: "Components/PlayerCard",
  component: PlayerCard,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    club: { control: "select", options: Object.keys(clubsById), mapping: clubsById },
    position: { control: "select" },
    nationality: { control: "select", options: ["PT", "BR", "CV", "AO", "ES", "GH", "SN", "UY", "MA", "JP", "DK", "NL", "AR", "ML"] },
    status: { control: "inline-radio" },
    rating: { control: { type: "range", min: 0, max: 10, step: 0.1 } },
    photoUrl: {
      control: "select",
      options: ["/players/silhouette-1.svg", "/players/silhouette-2.svg", "/players/silhouette-3.svg", "/players/silhouette-4.svg", undefined],
    },
    onSelect: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: playerCardProps(getPlayer("farol-9")),
});

export const Default = meta.story({});

export const Captain = meta.story({
  args: playerCardProps(getPlayer("farol-5")),
});

export const Goalkeeper = meta.story({
  args: playerCardProps(getPlayer("farol-1")),
});

export const Injured = meta.story({
  args: playerCardProps(getPlayer("farol-17")),
});

export const Suspended = meta.story({
  args: playerCardProps(getPlayer("farol-15")),
});

export const VeryLongName = meta.story({
  args: playerCardProps(getPlayer("pinhal-23")),
});

export const MissingPhoto = meta.story({
  args: { ...playerCardProps(getPlayer("farol-10")), photoUrl: undefined },
});

export const SquadGrid = meta.story({
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,62rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-4">
      {[...squad("farol").slice(-4), getPlayer("pinhal-23"), getPlayer("lobos-1"), getPlayer("gaivotas-10"), getPlayer("cabo-10")].map(
        (player) => (
          <li key={player.id}>
            <PlayerCard {...playerCardProps(player)} />
          </li>
        ),
      )}
    </ul>
  ),
});
