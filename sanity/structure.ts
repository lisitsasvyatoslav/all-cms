import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Design System')
    .items([
      S.documentTypeListItem('portalSource').title('Portal Sources'),
      S.divider(),
      S.documentTypeListItem('component').title('Components'),
      S.documentTypeListItem('color').title('Colors'),
      S.documentTypeListItem('icon').title('Icons'),
      S.documentTypeListItem('note').title('Notes'),
    ])
