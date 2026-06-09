import type { LegalDocument } from '../../lib/legalContent';

type LegalPageProps = {
  doc: LegalDocument;
};

export function LegalPage({ doc }: LegalPageProps) {
  return (
    <section className="foundation-page narrow-page legal-page">
      <p className="eyebrow">{doc.eyebrow}</p>
      <h1>{doc.title}</h1>
      {doc.isDraft && (
        <p className="legal-draft-banner" role="note">
          Draft — pending legal review. This text is provisional and not yet legally binding.
        </p>
      )}
      <p className="legal-updated">Last updated: {doc.lastUpdated}</p>
      <p className="foundation-subtitle">{doc.intro}</p>
      <div className="legal-body">
        {doc.sections.map((section) => (
          <section key={section.heading} className="legal-section">
            <h2>{section.heading}</h2>
            {section.blocks.map((block, blockIndex) =>
              block.type === 'paragraph' ? (
                <p key={blockIndex}>{block.text}</p>
              ) : (
                <ul key={blockIndex}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
