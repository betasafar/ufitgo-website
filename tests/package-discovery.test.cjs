const assert = require("node:assert/strict")
const test = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

// Run the installed TypeScript sources without generating build files or adding a test dependency.
function loadSource(filename) {
  const source = fs.readFileSync(filename, "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  const localRequire = (id) => id.startsWith("@/") || id.startsWith(".")
    ? loadSource(path.resolve(id.startsWith("@/") ? path.join(__dirname, "..") : path.dirname(filename), id.replace(/^@\//, "")) + ".ts")
    : require(id)
  new Function("require", "module", "exports", "process", compiled)(localRequire, module, module.exports, process)
  return module.exports
}

const discovery = loadSource(path.join(__dirname, "../lib/package-discovery.ts"))
const packages = loadSource(path.join(__dirname, "../lib/packages.ts"))
const api = loadSource(path.join(__dirname, "../lib/api.ts"))

test("server default requests never manufacture a calendar year", () => {
  assert.deepEqual(discovery.parseDiscoveryFilters({ type: "hajj" }), {
    type: "hajj", season: undefined, yearMode: "default",
  })
  assert.equal(discovery.parseDiscoveryFilters({ type: "umrah" }).year, undefined)
})

test("specific seasonal years and general departure years use different fields", () => {
  const hajj = discovery.parseDiscoveryFilters({ type: "hajj", yearMode: "specific", seasonYear: "2027", year: "2026" })
  assert.equal(hajj.seasonYear, 2027)
  assert.equal(hajj.year, undefined)
  const ramadan = discovery.parseDiscoveryFilters({ type: "umrah", season: "ramadan", yearMode: "specific", seasonYear: "2028" })
  assert.equal(ramadan.seasonYear, 2028)
  const umrah = discovery.parseDiscoveryFilters({ type: "umrah", yearMode: "specific", year: "2029", seasonYear: "2027" })
  assert.equal(umrah.year, 2029)
  assert.equal(umrah.seasonYear, undefined)
})

test("all years, invalid years and category changes cannot leak hidden restrictions", () => {
  const filters = discovery.parseDiscoveryFilters({ type: "hajj", season: "ramadan", yearMode: "all", seasonYear: "2027", year: "2026" })
  assert.equal(filters.season, undefined)
  assert.equal(filters.year, undefined)
  assert.equal(filters.seasonYear, undefined)
  for (const year of ["", "1999", "2201", "2027.5"]) {
    assert.equal(discovery.parseDiscoveryFilters({ type: "hajj", yearMode: "specific", seasonYear: year }).yearMode, "default")
  }
})

test("collection navigation preserves exact server filters", () => {
  assert.equal(discovery.packageCollectionHref({ type: "umrah", season: "ramadan", seasonYear: 2028, yearMode: "specific" }),
    "/packages?type=umrah&season=ramadan&seasonYear=2028&yearMode=specific")
})

test("canonical package mapping never mistakes service level or title for pilgrimage type", () => {
  const pkg = packages.mapPublicPackage({ id: 7, type: "hajj", title: "Umrah luxury", serviceLevel: "family", seasonYear: 2027 })
  assert.equal(pkg.type, "hajj")
  assert.equal(pkg.category, "family")
  assert.equal(pkg.serviceLevel, "family")
  assert.equal(pkg.seasonYear, 2027)
  assert.equal(pkg.departureDate, "")
  assert.equal(packages.mapPublicPackage({ id: 8, title: "Ramadan 2029", serviceLevel: "premium" }).type, "")
  assert.equal(packages.mapPublicPackage({ id: 9, type: "umrah", title: "Ramadan 2029" }).season, null)
})

test("API requests use accepted filters and uncached server metadata/feed, preserving empty sections", async () => {
  const originalFetch = global.fetch
  const calls = []
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options })
    return { ok: true, json: async () => ({ success: true, data: { sections: [], configVersion: 4, generatedAt: "2026-10-20" } }) }
  }
  try {
    await api.fetchPublicPackages(2, 12, undefined, { type: "hajj", yearMode: "specific", seasonYear: 2027, title: "Sacred & serene", budget: "5000000", month: "march" })
    const query = new URL(calls[0].url).searchParams
    assert.equal(query.get("title"), "Sacred & serene")
    assert.equal(query.get("budget"), "5000000")
    assert.equal(query.get("maxPrice"), null)
    assert.equal(query.get("seasonYear"), "2027")
    assert.equal(query.get("year"), null)
    assert.equal(query.get("month"), "march")
    await api.fetchPackageDiscovery({ type: "umrah", season: "ramadan", seasonYear: 2027, yearMode: "specific" })
    assert.equal(new URL(calls[1].url).searchParams.has("seasonYear"), false)
    assert.deepEqual((await api.fetchPublicHomeFeed()).sections, [])
    for (const call of calls) assert.equal(call.options.cache, "no-store")
  } finally {
    global.fetch = originalFetch
  }
})
