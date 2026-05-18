import { useCallback, useEffect, useId, useRef, useState } from "react";
import { searchCompanyIndex, type CompanySearchItem } from "../api/companies";
import { normalizeQuery } from "../lib/companySearch";
import { searchResultHref } from "../lib/paths";

function highlightMatch(name: string, query: string) {
  if (!query) return name;
  const lower = name.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="nav-search-mark">{name.slice(idx, idx + query.length)}</mark>
      {name.slice(idx + query.length)}
    </>
  );
}

export function NavSearch() {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<CompanySearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      searchCompanyIndex(q, 10)
        .then((items) => setResults(items))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, results]);

  const goToResult = useCallback((item: CompanySearchItem) => {
    setOpen(false);
    setQuery("");
    window.location.href = searchResultHref(item);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const q = normalizeQuery(query);
  const showDropdown = open && query.trim();

  return (
    <div ref={wrapRef} className="nav-search">
      <form
        className="nav-search-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results.length) goToResult(results[activeIndex] ?? results[0]);
        }}
      >
        <label className="sr-only" htmlFor="nav-company-search">
          Search companies and commodities
        </label>
        <div className="nav-search-box">
          <svg className="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            id="nav-company-search"
            type="search"
            className="nav-search-input"
            placeholder="Search companies, commodities & waterways…"
            autoComplete="off"
            value={query}
            role="combobox"
            aria-expanded={Boolean(showDropdown && results.length > 0)}
            aria-controls={listId}
            aria-autocomplete="list"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.trim() && setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && results.length) {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp" && results.length) {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
              }
            }}
          />
        </div>
      </form>

      {showDropdown && (
        <div id={listId} className="nav-search-results" role="listbox" aria-label="Search results">
          {loading && results.length === 0 ? (
            <p className="nav-search-empty">Searching…</p>
          ) : results.length === 0 ? (
            <p className="nav-search-empty">No matches</p>
          ) : (
            results.map((company, i) => (
              <button
                key={company.id}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                className={`nav-search-result${i === activeIndex ? " is-active" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToResult(company)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="nav-search-result-mark">{company.initials}</span>
                {company.kind === "waterway" && (
                  <span className="nav-search-kind nav-search-kind-waterway">Waterway</span>
                )}
                {company.kind === "commodity" && (
                  <span className="nav-search-kind nav-search-kind-commodity">Commodity</span>
                )}
                <span className="nav-search-result-text">
                  <span className="nav-search-result-name">{highlightMatch(company.name, q)}</span>
                  <span className="nav-search-result-sub">
                    {" "}
                    ·{" "}
                    {company.kind === "commodity"
                      ? company.subtitle || company.meta || "Commodity"
                      : company.kind === "waterway"
                        ? company.subtitle || company.meta || "Maritime waterway"
                        : company.subtitle || company.ticker || company.meta || company.legalName}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
