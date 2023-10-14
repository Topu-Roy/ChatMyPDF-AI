import { type ClassValue, clsx } from "clsx";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteURL(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `http://${process.env.VERCEL_URL}${path}`;

  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

type MetadataProps = {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
};

export function generateMetadata({
  title,
  description,
  image,
  icons,
  noIndex,
}: MetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image! }],
    },
    twitter: {
      title,
      creator: "",
      description,
      images: [image!],
      card: "summary_large_image",
    },
    icons,
    metadataBase: new URL("http://chatmypdf.vercel.app"),
    themeColor: "#fff",
    ...(noIndex && {
      robots: {
        follow: false,
        index: false,
      },
    }),
  };
}
