"use client";

// Simple tabbed panel for MDX. Usage:
//
//   <Tabs>
//   <Tab label="🐧 Linux">
//   ...markdown (at column 0, blank lines around)...
//   </Tab>
//   <Tab label="🪟 Windows">
//   ...markdown...
//   </Tab>
//   </Tabs>
//
// Defaults to the first tab, but on mount picks the tab matching the visitor's OS
// (by matching "Windows"/"Linux"/"Mac" in the label against the user agent).

import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type TabProps = { label: string; children: ReactNode };

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ua = navigator.userAgent;
    const os = /Win/i.test(ua) ? "windows" : /Mac/i.test(ua) ? "mac" : /Linux|X11/i.test(ua) ? "linux" : "";
    if (!os) return;
    const i = tabs.findIndex((t) => t.props.label.toLowerCase().includes(os));
    if (i >= 0) setActive(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="os-tabs">
      <div className="os-tablist" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`os-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {t.props.label}
          </button>
        ))}
      </div>
      <div className="os-tabpanel" role="tabpanel">
        {tabs[active]}
      </div>
    </div>
  );
}
