import preview from "#.storybook/preview";
import { Crest } from "@/components/Crest";
import { KitPreview } from "@/components/KitPreview";
import { clubs } from "@/data/clubs";

/**
 * Galleries of the whole league. Tagged `!manifest` so agents using the Storybook MCP
 * see focused usage examples per component rather than this composite showcase.
 */
const meta = preview.meta({
  title: "Showcase/Clubs",
  tags: ["!manifest", "!autodocs"],
});

export const AllClubKits = meta.story({
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {clubs.map((club) => (
        <li key={club.id} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <KitPreview {...club.kit} size={128} label={`${club.name} home kit`} />
          <div className="flex w-full items-center gap-2.5 border-t border-line pt-4">
            <Crest club={club} size={24} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{club.shortName}</p>
              <p className="text-xs capitalize text-muted">{club.kit.pattern}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
});
