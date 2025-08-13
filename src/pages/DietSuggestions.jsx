// src/pages/DietSuggestions.jsx
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import "./DietSuggestions.css";

/** ---------- config ---------- */
const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const TIMES = ["breakfast", "lunch", "dinner"];

/** ---------- helpers ---------- */
const fmtDate = (d) =>
  typeof d === "string"
    ? d
    : new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

const addDays = (value, delta) => {
  const base = typeof value === "string" ? new Date(value) : new Date(value);
  base.setDate(base.getDate() + delta);
  return fmtDate(base);
};

// TheMealDB helpers
async function tmdbSearch(q) {
  if (!q.trim()) return [];
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
    q
  )}`;
  const res = await fetch(url);
  const json = await res.json();
  return json?.meals || [];
}
async function tmdbRandom(n = 6) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const j = await r.json();
    if (j?.meals?.[0]) out.push(j.meals[0]);
  }
  return out;
}

// Backend CRUD
async function apiGetUserItems({ email, date, meal }) {
  const u = new URL(`${BACKEND}/api/diet-items`);
  u.searchParams.set("email", email);
  u.searchParams.set("date", date);
  u.searchParams.set("meal", meal);
  const res = await fetch(u);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}
async function apiAddItem(payload) {
  const res = await fetch(`${BACKEND}/api/diet-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}
async function apiDeleteItem(id) {
  const res = await fetch(`${BACKEND}/api/diet-items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}

/** ---------- nutrition fetch against your backend ---------- */
// cache to avoid repeat requests during a session
const nutriCache = new Map();

async function fetchNutritionByTitle(title) {
  const key = title.toLowerCase().trim();
  if (nutriCache.has(key)) return nutriCache.get(key);

  try {
    const res = await fetch(
      `${BACKEND}/api/recipes/search?query=${encodeURIComponent(title)}`
    );
    const data = await res.json();

    if (data?.quotaExceeded) {
      const out = { note: "Daily nutrition limit reached.", values: null };
      nutriCache.set(key, out);
      return out;
    }

    const first =
      data?.recipes?.[0] ?? data?.results?.[0] ?? data?.recipe ?? null;

    const round = (n) => (Number.isFinite(n) ? Math.round(n) : null);
    const values = first
      ? {
          calories: round(first.calories),
          carbs: round(first.carbs),
          protein: round(first.protein),
        }
      : null;

    const out = { note: values ? "Powered by Spoonacular" : "Nutrition unavailable", values };
    nutriCache.set(key, out);
    return out;
  } catch {
    const out = { note: "Nutrition unavailable", values: null };
    nutriCache.set(key, out);
    return out;
  }
}

/** ---------- macro bar UI helpers ---------- */
function MacroBar({ label, value, unit, max = 100 }) {
  // clamp width; if null, show 0 width and '—'
  const pct = value == null ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="macro__bar">
        <div
          className={`macro__fill ${
            label === "Protein"
              ? "macro__fill--protein"
              : label === "Carbs"
              ? "macro__fill--carb"
              : "macro__fill--cal"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="macro__label">
        <span className="dot">•</span>
        <span>
          {label}: {value == null ? "—" : `${value} ${unit}`}
        </span>
      </div>
    </div>
  );
}

export default function DietSuggestions({ user }) {
  const isAuthed = !!user?.email;

  // UI state
  const [tab, setTab] = useState("breakfast");
  const [day, setDay] = useState(fmtDate(new Date()));

  // user items
  const [userItems, setUserItems] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  // suggestions
  const [sugs, setSugs] = useState([]); // meal objects from TMDB + nutrition attached
  const [sugVisible, setSugVisible] = useState(4);
  const [sugLoading, setSugLoading] = useState(false);

  // add modal
  const [openAdd, setOpenAdd] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addResults, setAddResults] = useState([]);
  const [addLoading, setAddLoading] = useState(false);

  const canLoadMore = sugs.length > sugVisible;

  // Load user items for the selected day + tab and attach nutrition
  useEffect(() => {
    if (!isAuthed) return;

    let alive = true;
    (async () => {
      setUserLoading(true);
      setUserError("");
      try {
        const items = await apiGetUserItems({
          email: user.email,
          date: day,
          meal: tab,
        });

        // attach nutrition per item.name
        const withNutri = await Promise.all(
          (items || []).map(async (it) => {
            const { values, note } = await fetchNutritionByTitle(it.name);
            return { ...it, nutrition: values, nutriNote: note };
          })
        );

        if (alive) setUserItems(withNutri);
      } catch (err) {
        if (alive) {
          console.error(err);
          setUserError("Failed to load your items.");
        }
      } finally {
        if (alive) setUserLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAuthed, user?.email, day, tab]);

  // Load suggestions (vary by day + tab), then attach nutrition to each suggestion
  useEffect(() => {
    let alive = true;
    (async () => {
      setSugLoading(true);
      try {
        const list = await tmdbRandom(6);
        // attach nutrition in parallel by meal title
        const withNutri = await Promise.all(
          list.map(async (m) => {
            const { values, note } = await fetchNutritionByTitle(m.strMeal);
            return { ...m, nutrition: values, nutriNote: note };
          })
        );
        if (!alive) return;
        setSugs(withNutri);
        setSugVisible(4);
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setSugLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [day, tab]);

  async function handleAddFromSuggestion(m) {
    if (!isAuthed) return;
    const payload = {
      email: user.email,
      date: day,
      mealType: tab,
      mealId: m.idMeal,
      name: m.strMeal,
      thumb: m.strMealThumb,
    };
    await apiAddItem(payload);
    // reload items (nutrition will be reattached by the effect)
    const items = await apiGetUserItems({
      email: user.email,
      date: day,
      meal: tab,
    });
    const withNutri = await Promise.all(
      (items || []).map(async (it) => {
        const { values, note } = await fetchNutritionByTitle(it.name);
        return { ...it, nutrition: values, nutriNote: note };
      })
    );
    setUserItems(withNutri || []);
  }

  async function removeItem(id) {
    if (!isAuthed) return;
    await apiDeleteItem(id);
    setUserItems((prev) => prev.filter((x) => x._id !== id));
  }

  async function searchAdd() {
    setAddLoading(true);
    try {
      const hits = await tmdbSearch(addQuery);
      // attach nutrition to search results as well (nice UX while choosing)
      const withNutri = await Promise.all(
        (hits || []).map(async (m) => {
          const { values } = await fetchNutritionByTitle(m.strMeal);
          return { ...m, nutrition: values };
        })
      );
      setAddResults(withNutri || []);
    } finally {
      setAddLoading(false);
    }
  }

  async function addFromSearch(m) {
    if (!isAuthed) return;
    const payload = {
      email: user.email,
      date: day,
      mealType: tab,
      mealId: m.idMeal,
      name: m.strMeal,
      thumb: m.strMealThumb,
    };
    await apiAddItem(payload);
    const items = await apiGetUserItems({
      email: user.email,
      date: day,
      meal: tab,
    });
    const withNutri = await Promise.all(
      (items || []).map(async (it) => {
        const { values, note } = await fetchNutritionByTitle(it.name);
        return { ...it, nutrition: values, nutriNote: note };
      })
    );
    setUserItems(withNutri || []);
    setOpenAdd(false);
    setAddQuery("");
    setAddResults([]);
  }

  // totals (optional)
  const totals = useMemo(() => {
    const sum = (sel) =>
      userItems.reduce((acc, it) => acc + (it.nutrition?.[sel] ?? 0), 0);
    return {
      calories: Math.round(sum("calories")),
      carbs: Math.round(sum("carbs")),
      protein: Math.round(sum("protein")),
    };
  }, [userItems]);

  if (!isAuthed) return <Navigate to="/login" replace />;

  return (
    <div className="diet-page">
      <div className="diet-inner">
        <h1 className="diet-title">Diet improvement suggestions</h1>

        {/* Tabs + date + add button */}
        <div className="diet-header-row">
          <div className="diet-tabs">
            {TIMES.map((t) => (
              <button
                key={t}
                className={`diet-tab ${t === tab ? "diet-tab--active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="diet-day">
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
          </div>
          <button className="diet-more__btn" onClick={() => setOpenAdd(true)}>
            + Add food
          </button>
        </div>

        {/* Totals row (optional) */}
        <div style={{ margin: "8px 0 16px", fontSize: 14 }} className="muted">
          Day totals for {tab}: {totals.calories} kcal • {totals.protein} g protein •{" "}
          {totals.carbs} g carbs
        </div>

        {/* Your items */}
        <h3>Your {tab}</h3>
        {userLoading ? (
          <div className="diet-loading">Loading…</div>
        ) : userError ? (
          <div className="diet-loading" style={{ color: "#b91c1c" }}>
            {userError}
          </div>
        ) : userItems.length === 0 ? (
          <div className="diet-loading">No items yet. Add your first one!</div>
        ) : (
          <div className="diet-grid">
            {userItems.map((it) => (
              <article key={it._id} className="diet-card">
                <div className="diet-card__head">
                  <div className="diet-thumb">
                    <img src={it.thumb} alt={it.name} />
                  </div>
                  <h4 className="diet-card__title" title={it.name}>
                    {it.name}
                  </h4>
                  <div className="diet-card__actions">
                    <button
                      className="diet-card__more"
                      onClick={() => removeItem(it._id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Actual macro bars from backend nutrition */}
                <div className="diet-macros">
                  <MacroBar label="Protein" value={it.nutrition?.protein ?? null} unit="g" />
                  <MacroBar label="Carbs" value={it.nutrition?.carbs ?? null} unit="g" />
                  <MacroBar label="Calories" value={it.nutrition?.calories ?? null} unit="kcal" max={800} />
                </div>

                {it.nutriNote && (
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {it.nutriNote}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Suggestions */}
        <h3 style={{ marginTop: 20 }}>Suggestions</h3>
        <div className="diet-grid">
          {sugLoading && <div className="diet-loading">Loading…</div>}
          {!sugLoading &&
            sugs.slice(0, sugVisible).map((m) => (
              <article key={m.idMeal} className="diet-card">
                <div className="diet-card__head">
                  <div className="diet-thumb">
                    <img src={m.strMealThumb} alt={m.strMeal} />
                  </div>
                  <h4 className="diet-card__title" title={m.strMeal}>
                    {m.strMeal}
                  </h4>
                  <button
                    className="diet-more__btn"
                    onClick={() => handleAddFromSuggestion(m)}
                    aria-label="Add"
                  >
                    Add
                  </button>
                </div>

                <div className="diet-macros">
                  <MacroBar label="Protein" value={m.nutrition?.protein ?? null} unit="g" />
                  <MacroBar label="Carbs" value={m.nutrition?.carbs ?? null} unit="g" />
                  <MacroBar label="Calories" value={m.nutrition?.calories ?? null} unit="kcal" max={800} />
                </div>

                {m.nutriNote && (
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {m.nutriNote}
                  </div>
                )}
              </article>
            ))}
        </div>

        <div className="diet-more">
          <button
            disabled={!canLoadMore}
            className="diet-more__btn"
            onClick={() => setSugVisible((v) => v + 2)}
          >
            See more
          </button>
        </div>
      </div>

      {/* Add Food Modal */}
      {openAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
          onClick={() => setOpenAdd(false)}
        >
          <div
            className="diet-card add-form"
            style={{ width: "min(760px,92vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <h3 style={{ margin: 0 }}>Add food</h3>
              <button className="diet-more__btn" onClick={() => setOpenAdd(false)}>
                Close
              </button>
            </div>

            <div className="add-search">
              <input
                value={addQuery}
                onChange={(e) => setAddQuery(e.target.value)}
                placeholder="Search foods (e.g., omelet, salad, rice)…"
              />
              <button
                className="diet-more__btn"
                onClick={searchAdd}
                disabled={!addQuery.trim()}
              >
                Search
              </button>
            </div>

            {addLoading ? (
              <div className="diet-loading">Searching…</div>
            ) : (
              <div className="add-results">
                {addResults.map((r) => (
                  <div key={r.idMeal} className="add-result-card">
                    <img src={r.strMealThumb} alt={r.strMeal} />
                    <div>
                      <div className="add-result-title">{r.strMeal}</div>
                      <div className="add-result-meta">
                        <span>{r.strCategory || "—"}</span>
                        <span>•</span>
                        <span>{r.strArea || "—"}</span>
                      </div>
                      {r.nutrition && (
                        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                          {r.nutrition.calories ?? "—"} kcal •{" "}
                          {r.nutrition.protein ?? "—"} g protein •{" "}
                          {r.nutrition.carbs ?? "—"} g carbs
                        </div>
                      )}
                    </div>
                    <button className="diet-more__btn" onClick={() => addFromSearch(r)}>
                      Add
                    </button>
                  </div>
                ))}

                {addResults.length === 0 && !addLoading && (
                  <div className="diet-loading">No results. Try another term.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
