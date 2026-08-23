"use client";
import { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";

export interface SearchOption {
  value: string;
  label: string;
}

interface Props {
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * Type-to-filter select. Shows the full list on focus, narrows as you type,
 * and supports arrow-key + Enter selection.
 *
 * The dropdown is portalled to <body> and positioned fixed because the metal
 * items grid sits inside `overflow-x: auto`, which would otherwise clip it.
 */
export function SearchSelect({ options, value, onChange, placeholder = "Select…", ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  // Filtering can shrink the list below the stored index; without clamping,
  // filtered[highlight] is undefined and Enter silently does nothing.
  const cursor = Math.min(highlight, Math.max(0, filtered.length - 1));

  // Portal into .dash-shell, not <body> — the dashboard's design tokens are
  // scoped to that element, so a list mounted outside it renders unstyled.
  useEffect(() => {
    setPortalTarget(document.querySelector<HTMLElement>(".dash-shell") ?? document.body);
  }, []);

  const reposition = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  // Keep the portalled list glued to the input while scrolling/resizing.
  useEffect(() => {
    if (!open) return;
    reposition();
    const handler = () => reposition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
      setQuery("");
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view as you arrow through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) { setOpen(true); setHighlight(0); return; }
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      const pick = filtered[cursor];
      if (open && pick) {
        e.preventDefault();
        choose(pick.value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    } else if (e.key === "Tab") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div className="dash-combo" ref={wrapRef}>
      <input
        ref={inputRef}
        type="text"
        className="dash-input dash-combo-input"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        autoComplete="off"
        value={open ? query : selected?.label ?? ""}
        placeholder={open ? selected?.label ?? placeholder : placeholder}
        onChange={(e) => { setQuery(e.target.value); setHighlight(0); if (!open) setOpen(true); }}
        onFocus={() => { setOpen(true); setHighlight(0); }}
        onKeyDown={onKeyDown}
      />
      <span className="dash-combo-caret" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>

      {open && rect && portalTarget && createPortal(
        <ul
          id={listId}
          role="listbox"
          ref={listRef}
          className="dash-combo-list"
          style={{ top: rect.top, left: rect.left, width: rect.width }}
        >
          {filtered.length === 0 ? (
            <li className="dash-combo-empty">No match for “{query}”</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={o.value}
                data-idx={i}
                role="option"
                aria-selected={o.value === value}
                className={
                  "dash-combo-option" +
                  (i === cursor ? " dash-combo-option--active" : "") +
                  (o.value === value ? " dash-combo-option--selected" : "")
                }
                onMouseEnter={() => setHighlight(i)}
                onClick={() => choose(o.value)}
              >
                {o.label}
              </li>
            ))
          )}
        </ul>,
        portalTarget
      )}
    </div>
  );
}
