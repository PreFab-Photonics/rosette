import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";

export const revalidate = false;

export async function GET() {
  return new ImageResponse(
    <DefaultImage
      title="Rosette"
      description="The modern GDSII layout editor"
      site="Rosette"
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}
