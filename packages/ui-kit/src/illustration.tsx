import { Box } from "@radix-ui/themes";
import type { CSSProperties } from "react";

export interface IllustrationProps {
  /** URL или путь к изображению. */
  src: string;
  /** Альтернативный текст для a11y. */
  alt: string;
  /** Ширина в px (по умолчанию 140 — как pass.x80 в макете). */
  width?: number;
  /** Высота в px (по умолчанию 140). */
  height?: number;
  /** Дополнительные CSS-классы контейнера. */
  className?: string;
}

export function Illustration({
  src,
  alt,
  width = 140,
  height = 140,
  className,
}: IllustrationProps) {
  const imgStyle: CSSProperties = {
    display: "block",
    width,
    height,
    objectFit: "contain",
  };

  return (
    <Box
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width,
        height,
      }}
    >
      <img src={src} alt={alt} width={width} height={height} style={imgStyle} />
    </Box>
  );
}
