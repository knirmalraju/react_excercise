import { CATEGORY_COLORS } from './ExpenseList'

function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  const thisMonth = (() => {
    const now = new Date()
    return expenses
      .filter(e => {
        const d = new Date(e.date + 'T00:00:00')
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      })
      .reduce((sum, e) => sum + e.amount, 0)
  })()

  if (expenses.length === 0) return null

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      <div className="summary-stats">
        <div className="stat-box">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">${total.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">This Month</span>
          <span className="stat-value">${thisMonth.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Entries</span>
          <span className="stat-value">{expenses.length}</span>
        </div>
      </div>

      {categoryEntries.length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <ul className="breakdown-list">
            {categoryEntries.map(([cat, amt]) => {
              const pct = total > 0 ? Math.round((amt / total) * 100) : 0
              const color = CATEGORY_COLORS[cat] || '#6b7280'
              return (
                <li key={cat} className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="breakdown-dot" style={{ background: color }} />
                    <span>{cat}</span>
                  </div>
                  <div className="breakdown-bar-wrap">
                    <div
                      className="breakdown-bar"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="breakdown-amount">${amt.toLocaleString()} <small>({pct}%)</small></span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ExpenseSummary
