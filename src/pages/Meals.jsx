import { useEffect, useMemo, useState } from "react";
import "./Meals.css";

/* ======================= TheMealDB helpers ======================= */
async function fetchRandomMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const json = await res.json();
  return json?.meals?.[0] || null;
}
async function fetchRandomMeals(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(await fetchRandomMeal());
  return out.filter(Boolean);
}
async function searchMeals(term) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
    term.trim()
  )}`;
  const res = await fetch(url);
  const json = await res.json();
  return json?.meals || null;
}
async function lookupMeal(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const json = await res.json();
  return json?.meals?.[0] || null;
}

/* =========================== utilities =========================== */
function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const meas = meal[`strMeasure${i}`]?.trim();
    if (ing) items.push((meas ? `${meas} ` : "") + ing);
  }
  return items;
}

/* === Backend base (for modal nutrition fetch) === */
const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* ============================== UI =============================== */
const TIMES = ["07:00", "10:00", "13:00", "18:00"];

export default function Meals() {
  const [loading, setLoading] = useState(true);
  const [hourMeals, setHourMeals] = useState([]);
  const [activeSlot, setActiveSlot] = useState(0);

  // search
  const [q, setQ] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  // details modal
  const [openMeal, setOpenMeal] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  // modal nutrition
  const [detailNutri, setDetailNutri] = useState({
    calories: null,
    carbs: null,
    protein: null,
  });
  const [detailNutriLoading, setDetailNutriLoading] = useState(false);
  const [detailNutriNote, setDetailNutriNote] = useState("");

  const activeMeal = useMemo(() => hourMeals[activeSlot], [hourMeals, activeSlot]);

  async function assignMeals(preferred = []) {
    let meals = [...preferred];
    if (meals.length < 4) {
      const pad = await fetchRandomMeals(4 - meals.length);
      meals = meals.concat(pad);
    }
    setHourMeals(meals.slice(0, 4));
    setActiveSlot(0);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await assignMeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSearch(e) {
  e.preventDefault();
  const term = q.trim();
  if (!term) return;

  setLoading(true);
  setResultsLoading(true);
  setNoResults(false);

  try {
    const hits = await searchMeals(term);

    if (!hits) {
      setNoResults(true);
      setResults([]); 
    } else {
      setResults(hits);
    }
  } finally {
    setLoading(false);
    setResultsLoading(false);
  }
}

  async function openDetails(id) {
    setOpenLoading(true);
    setDetailNutri({ calories: null, carbs: null, protein: null });
    setDetailNutriNote("");
    try {
      const meal = await lookupMeal(id);
      setOpenMeal(meal || null);

      if (meal) {
        setDetailNutriLoading(true);
        try {
          const res = await fetch(
            `${BACKEND}/api/recipes/search?query=${encodeURIComponent(meal.strMeal)}`
          );
          const data = await res.json();
          if (data?.quotaExceeded) {
            setDetailNutriNote("Daily nutrition limit reached. Try again later.");
          } else {
            const first = data?.recipes?.[0];
            if (first) {
              const round = (n) => (Number.isFinite(n) ? Math.round(n) : null);
              setDetailNutri({
                calories: round(first.calories),
                carbs: round(first.carbs),
                protein: round(first.protein),
              });
            }
          }
        } catch {
          setDetailNutriNote("Nutrition unavailable right now.");
        } finally {
          setDetailNutriLoading(false);
        }
      }
    } finally {
      setOpenLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="inner two-col">
        {/* LEFT COLUMN: title + search + results */}
        <div className="left">
          <header className="hero-copy">
            <h1>Recipe and Meal Plan</h1>
            <p className="sub">
              Search recipes and explore ingredients & instructions for the selected meal.
            </p>

            <form className="search" onSubmit={onSearch}>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search recipes (e.g., chicken, pasta, curry)"
                aria-label="Search recipes"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {noResults && (
              <div className="nores">
                No recipes found for “{q}”. Showing random ideas on the right.
              </div>
            )}
          </header>

          <section className="results">
            <div className="results-head">
              <h3>Search Results</h3>
              <span className="muted">
                {resultsLoading ? "Loading..." : `${results.length} item(s)`}
              </span>
            </div>

            {results.length === 0 && !resultsLoading ? (
              <div className="muted">Try searching for “chicken”, “beef”, “pasta”, “salad”…</div>
            ) : (
              <div className="cards-grid">
                {results.map((m) => (
                  <article key={m.idMeal} className="r-card">
                    <div className="r-img-wrap">
                      <img src={m.strMealThumb} alt={m.strMeal} />
                    </div>
                    <div className="r-body">
                      <h4 className="r-title" title={m.strMeal}>{m.strMeal}</h4>
                      <div className="r-meta">
                        <span>{m.strCategory || "—"}</span>
                        <span>•</span>
                        <span>{m.strArea || "—"}</span>
                      </div>
                      <div className="r-actions">
                        <button className="btn" onClick={() => openDetails(m.idMeal)}>View</button> 
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Required Recipe (sticky) */}
        <aside className="right">
          <div className="sticky">
            <div className="card">
              <div className="card-head">
                <span className="label">Required Recipe</span>
                <div className="chips">
                  {TIMES.map((t, i) => (
                    <button
                      key={t}
                      className={`chip ${i === activeSlot ? "chip-active" : ""}`}
                      onClick={() => setActiveSlot(i)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="muted">Recipe by the hour</div>
              </div>

              <div className="photo-wrap">
                {activeMeal ? (
                  <img src={activeMeal.strMealThumb} alt={activeMeal.strMeal} className="photo" />
                ) : (
                  <div className="img-skeleton" />
                )}
              </div>

              {activeMeal && (
                <div className="meal-meta">
                  <div className="meal-name">{activeMeal.strMeal}</div>
                  <div className="meal-area">{activeMeal.strArea}</div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* DETAILS MODAL */}
      {openMeal && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setOpenMeal(null)}>✕</button>
            {openLoading ? (
              <div style={{ padding: 24 }}>Loading…</div>
            ) : (
              <>
                <div className="modal-hero">
                  <img src={openMeal.strMealThumb} alt={openMeal.strMeal} />
                  <div className="modal-hero-info">
                    <h3>{openMeal.strMeal}</h3>
                    <div className="r-meta">
                      <span>{openMeal.strCategory || "—"}</span>
                      <span>•</span>
                      <span>{openMeal.strArea || "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-nutri">
                  <div className="modal-nutri-head">
                    <h4>Nutrients (this meal)</h4>
                    <span className="muted">
                      {detailNutriLoading
                        ? "Calculating…"
                        : detailNutriNote ||
                          ((detailNutri.calories != null ||
                            detailNutri.carbs != null ||
                            detailNutri.protein != null)
                            ? "Powered by Spoonacular"
                            : "—")}
                    </span>
                  </div>

                  <div className="modal-nutri-grid">
                    <div className="modal-nutri-item">
                      <div className="modal-nutri-key">Calories</div>
                      <div className="modal-nutri-val">
                        {detailNutri.calories == null ? "—" : `${detailNutri.calories} kcal`}
                      </div>
                    </div>
                    <div className="modal-nutri-item">
                      <div className="modal-nutri-key">Carbohydrates</div>
                      <div className="modal-nutri-val">
                        {detailNutri.carbs == null ? "—" : `${detailNutri.carbs} g`}
                      </div>
                    </div>
                    <div className="modal-nutri-item">
                      <div className="modal-nutri-key">Proteins</div>
                      <div className="modal-nutri-val">
                        {detailNutri.protein == null ? "—" : `${detailNutri.protein} g`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-cols">
                  <div>
                    <h4>Ingredients</h4>
                    <ul className="ing">
                      {extractIngredients(openMeal).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Instructions</h4>
                    <p className="inst">{openMeal.strInstructions}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-backdrop" onClick={() => setOpenMeal(null)} />
        </div>
      )}
    </div>
  );
}
