import { SCHEMA } from "@/lib/sql/seed";

/**
 * Static reference card listing the sample database tables and columns. Pure
 * presentational (trusted constant data), so a plain server component.
 */
export function SqlSchema() {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <div className="border-b border-border bg-bg-elevated-2 px-4 py-2 font-mono text-xs uppercase tracking-wide text-accent-warm">
        Sample database
      </div>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {SCHEMA.map((t) => (
            <tr key={t.name} className="align-top">
              <td className="border-b border-border px-4 py-2 font-mono text-accent">
                {t.name}
              </td>
              <td className="border-b border-border px-4 py-2 font-mono text-fg">
                {t.columns}
              </td>
              <td className="border-b border-border px-4 py-2 text-fg-muted">{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
