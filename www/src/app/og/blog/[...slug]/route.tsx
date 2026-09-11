import { readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "takumi-js/response";
import { blog, getBlogPostImage } from "@/lib/source";

export const revalidate = false;

const rosetteLogo = `data:image/svg+xml;base64,${readFileSync(
  path.join(process.cwd(), "public/rosette-logo.svg"),
).toString("base64")}`;
const prefabLogo = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), "public/prefab-logo-notext.png"),
).toString("base64")}`;
const patternWidth = 820;
const patternHeight = 554;
const asciiPattern = generateAsciiPattern(7, 52, 28);

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/blog/[...slug]">,
) {
  const { slug } = await params;
  // slug is ["my-post", "image.webp"] — take everything except the last segment
  const postSlug = slug.slice(0, -1);
  const page = blog.getPage(postSlug);
  if (!page) notFound();

  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(page.data.date));

  return new ImageResponse(
    <BlogImage
      title={page.data.title}
      description={page.data.description}
      date={date}
    />,
    {
      width: 1200,
      height: 630,
      format: "png",
    },
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: getBlogPostImage(page).segments,
  }));
}

function BlogImage({
  title,
  description,
  date,
}: {
  title: string;
  description?: string;
  date: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "38px",
        color: "#171717",
        backgroundColor: "#f7f7f7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "48px 54px 42px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: `${patternWidth}px`,
            height: `${patternHeight}px`,
            display: "flex",
          }}
        >
          {asciiPattern.map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              style={{
                position: "absolute",
                top: `${cell.y - 18}px`,
                left: `${cell.x}px`,
                display: "flex",
                color: cell.color,
                fontFamily: "monospace",
                fontSize: "18px",
                lineHeight: 1,
                opacity: Math.max(0, cell.x / patternWidth - 0.12) * 0.72,
              }}
            >
              {cell.char}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: Takumi renders this image server-side. */}
          <img
            src={prefabLogo}
            alt=""
            width="56"
            height="56"
            style={{
              width: "56px",
              height: "56px",
            }}
          />
          {/* biome-ignore lint/performance/noImgElement: Takumi renders this image server-side. */}
          <img
            src={rosetteLogo}
            alt=""
            width="56"
            height="56"
            style={{
              width: "56px",
              height: "56px",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "980px",
            marginTop: "48px",
            fontSize: title.length > 48 ? "56px" : "66px",
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "920px",
              marginTop: "22px",
              color: "#525252",
              fontSize: "27px",
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        )}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "1px solid #e0e0e0",
            color: "#737373",
            fontSize: "18px",
          }}
        >
          <div style={{ display: "flex" }}>{date}</div>
          <div style={{ display: "flex" }}>rosette.dev</div>
        </div>
      </div>
    </div>
  );
}

function generateAsciiPattern(seed: number, columns: number, rows: number) {
  const random = makeRandom(seed);
  const modes = Array.from({ length: 22 }, () => {
    const fx = (random() - 0.5) * 11;
    const fy = (random() - 0.5) * 11;
    const frequency = Math.hypot(fx, fy);
    return {
      fx,
      fy,
      amplitude: (random() * 2 - 1) * Math.exp(-(frequency * frequency) / 72.6),
      phase: random() * Math.PI * 2,
    };
  });

  const values: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      values.push(
        modes.reduce(
          (sum, mode) =>
            sum +
            mode.amplitude *
              Math.cos(
                2 *
                  Math.PI *
                  ((mode.fx * column) / columns + (mode.fy * row) / rows) +
                  mode.phase,
              ),
          0,
        ),
      );
    }
  }

  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const characters = "@%#*+=-:  ";

  return values.flatMap((value, index) => {
    const normalized = (value - min) / range;
    const char = characters[Math.floor(normalized * (characters.length - 1))];
    if (char === " ") return [];

    return [
      {
        char,
        x: (index % columns) * (patternWidth / columns),
        y: (Math.floor(index / columns) + 1) * (patternHeight / rows),
        color:
          normalized < 0.25
            ? "#4037c1"
            : normalized < 0.5
              ? "#e6b01b"
              : "#c9c9c9",
      },
    ];
  });
}

function makeRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
