import { portalClass } from "@/lib/portal/core/classes";
import { parseGlossaryAvoidVariants } from "@/lib/portal/glossary/letter";
import type { GlossaryTermRow } from "@/lib/portal/glossary/group-terms";

type Props = {
  terms: GlossaryTermRow[];
};

export function GlossaryTermsList({ terms }: Props) {
  if (!terms.length) {
    return (
      <p className={portalClass.glossaryEmpty}>
        Термины пока не добавлены. Заполните коллекцию «Глоссарий — термины» в Payload Admin.
      </p>
    );
  }

  return (
    <ul className={portalClass.glossaryList}>
      {terms.map((term) => {
        const variants = parseGlossaryAvoidVariants(term.avoid);
        return (
          <li key={term.id} className={portalClass.glossaryItem}>
            <div className={portalClass.glossaryPreferred}>{term.preferred}</div>
            {variants.length ? (
              <div className={portalClass.glossaryAvoid}>
                {variants.map((variant, index) => (
                  <span key={`${term.id}-${variant}`}>
                    {index > 0 ? <span className={portalClass.glossaryAvoidSep}>, </span> : null}
                    <span className={portalClass.glossaryAvoidStrike}>{variant}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
