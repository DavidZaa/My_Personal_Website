import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";

export const alt = "David Zhang — CS & Math of Computation at UCLA";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        label="dz-01 · personal site"
        title="David Zhang"
        subtitle="CS & Math of Computation at UCLA — projects, research, and writing."
      />
    ),
    size,
  );
}
