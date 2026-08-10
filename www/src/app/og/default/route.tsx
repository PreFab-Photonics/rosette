import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { ImageResponse } from "takumi-js/response";

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
