// src/pages/DietSuggestions.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./DietSuggestions.css";

/** ---------- config ---------- */
const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const TIMES = ["breakfast", "lunch", "dinner"];

/** ---------- helpers ---------- */
// keep this helper near the top
const fmtDate = (d) =>
  typeof d === "string"
    ? d
    : new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

const addDays = (value, delta) => {
  // value can be ISO string or Date
  const base = typeof value === "string" ? new Date(value) : new Date(value);
  base.setDate(base.getDate() + delta);
  // return normalized ISO yyyy-mm-dd
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

export default function DietSuggestions({ user }) {
  const isAuthed = !!user?.email;

  // UI state (declare ALL hooks before any conditional return)
  const [tab, setTab] = useState("breakfast");
  const [day, setDay] = useState(fmtDate(new Date()));

  // user items
  const [userItems, setUserItems] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  // suggestions
  const [sugs, setSugs] = useState([]);
  const [sugVisible, setSugVisible] = useState(4);
  const [sugLoading, setSugLoading] = useState(false);

  // add modal
  const [openAdd, setOpenAdd] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addResults, setAddResults] = useState([]);
  const [addLoading, setAddLoading] = useState(false);

  const canLoadMore = sugs.length > sugVisible;

  // Load user items for the selected day + tab
  useEffect(() => {
    if (!isAuthed) return; // guard inside effect

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
        if (!alive) return;
        setUserItems(items || []);
      } catch (err) {
        if (!alive) return;
        console.error(err);
        setUserError("Failed to load your items.");
      } finally {
        if (alive) setUserLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAuthed, user?.email, day, tab]);

  // Load suggestions (vary by day + tab for freshness)
  useEffect(() => {
    let alive = true;
    (async () => {
      setSugLoading(true);
      try {
        const list = await tmdbRandom(6);
        if (!alive) return;
        setSugs(list);
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
    const items = await apiGetUserItems({
      email: user.email,
      date: day,
      meal: tab,
    });
    setUserItems(items || []);
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
      setAddResults(hits || []);
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
    setUserItems(items || []);
    setOpenAdd(false);
    setAddQuery("");
    setAddResults([]);
  }

  // Now it’s safe to conditionally return after hooks are declared
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
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
          <button className="diet-more__btn" onClick={() => setOpenAdd(true)}>
            + Add food
          </button>
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

                {/* Placeholder macro bars */}
                <div className="diet-macros">
                  {[
                    { key: "Protein", className: "macro__fill--protein" },
                    { key: "Fats", className: "macro__fill--fat" },
                    { key: "Carbs", className: "macro__fill--carb" },
                  ].map((m) => (
                    <div key={m.key}>
                      <div className="macro__bar">
                        <div
                          className={`macro__fill ${m.className}`}
                          style={{ width: "20%" }}
                        />
                      </div>
                      <div className="macro__label">
                        <span className="dot">•</span>
                        <span>{m.key}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                  {[
                    { key: "Protein", className: "macro__fill--protein" },
                    { key: "Fats", className: "macro__fill--fat" },
                    { key: "Carbs", className: "macro__fill--carb" },
                  ].map((x) => (
                    <div key={x.key}>
                      <div className="macro__bar">
                        <div
                          className={`macro__fill ${x.className}`}
                          style={{ width: "10%" }}
                        />
                      </div>
                      <div className="macro__label">
                        <span className="dot">•</span>
                        <span>{x.key}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
              <button className="diet-more__btn" onClick={searchAdd} disabled={!addQuery.trim()}>
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
