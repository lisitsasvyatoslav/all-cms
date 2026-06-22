import NextLink from "next/link";

import { componentWebPagePath } from "@/lib/portal/components/routes";
import { portalClass } from "@/lib/portal/core/classes";
import {
  RELATED_PREVIEW_HEIGHT,
  RELATED_PREVIEW_WIDTH,
} from "@/lib/portal/documentation/related-preview-layout";
import { storybookRelatedPreviewIframeSrc } from "@/lib/storybook/storybook-related-preview-url";

type Props = {
  slug: string;
  name: string;
  storybookUrl: string | null;
  previewLightUrl: string | null;
  previewDarkUrl: string | null;
  previewAlt: string;
};

export function RelatedComponentCard({
  slug,
  name,
  storybookUrl,
  previewLightUrl,
  previewDarkUrl,
  previewAlt,
}: Props) {
  const href = componentWebPagePath(slug);
  const iframeSrc = storybookUrl ? storybookRelatedPreviewIframeSrc(storybookUrl) : null;
  const hasStaticPreview = Boolean(previewLightUrl || previewDarkUrl);

  const renderPreviewImage = (src: string, themeClass: string) => (
    // eslint-disable-next-line @next/next/no-img-element -- как Hero UI: нативный img + object-cover
    <img
      src={src}
      alt={previewAlt}
      width={RELATED_PREVIEW_WIDTH}
      height={RELATED_PREVIEW_HEIGHT}
      loading="lazy"
      decoding="async"
      className={`${portalClass.relatedPreviewImg} ${themeClass}`}
    />
  );

  return (
    <div className={portalClass.relatedCard}>
      <div className={portalClass.relatedTitleRow}>
        <NextLink href={href} className={`${portalClass.linkPlain} ${portalClass.relatedTitle}`}>
          <span className={portalClass.relatedTitleInner}>{name}</span>
        </NextLink>
      </div>

      <div className={portalClass.relatedPreview}>
        {hasStaticPreview ? (
          <NextLink href={href} className={portalClass.relatedPreviewLink}>
            {previewLightUrl ? renderPreviewImage(previewLightUrl, portalClass.relatedPreviewImgLight) : null}
            {previewDarkUrl ? renderPreviewImage(previewDarkUrl, portalClass.relatedPreviewImgDark) : null}
          </NextLink>
        ) : iframeSrc ? (
          <NextLink href={href} className={portalClass.relatedPreviewLink}>
            <span className={portalClass.relatedPreviewFrame}>
              <iframe
                title={`${name} preview`}
                src={iframeSrc}
                className={portalClass.relatedPreviewIframe}
                loading="lazy"
                tabIndex={-1}
              />
            </span>
          </NextLink>
        ) : (
          <NextLink href={href} className={portalClass.relatedPreviewLink}>
            <span className={portalClass.relatedPreviewPlaceholder} aria-hidden>
              {name}
            </span>
          </NextLink>
        )}
      </div>
    </div>
  );
}
