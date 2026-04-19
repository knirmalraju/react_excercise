import { CATEGORIES } from './ExpenseForm'

const CATEGORY_COLORS = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare: '#10b981',
  Shopping: '#f59e0b',
  Education: '#06b6d4',
  Other: '#6b7280',
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#6b7280'
  return (
    <span className="category-badge" style={{ '--badge-color': color }}>
      {category}
    </span>
  )
}

function ExpenseList({ expenses, onEdit, onDelete, filterCategory, onFilterChange, sortBy, onSortChange }) {
  if (expenses.length === 0 && filterCategory === 'All') {
    return (
      <div className="expense-list-card">
        <div className="list-header">
          <h2>Expenses</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <p>No expenses yet. Add one above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-list-card">
      <div className="list-header">
        <h2>Expenses <span className="count-badge">{expenses.length}</span></h2>
        <div className="list-controls">
          <select
            value={filterCategory}
            onChange={e => onFilterChange(e.target.value)}
            className="control-select"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="control-select"
            aria-label="Sort expenses"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No expenses in this category.</p>
        </div>
      ) : (
        <ul className="expense-items">
          {expenses.map(expense => (
            <li key={expense.id} className="expense-item">
              <div className="expense-left">
                <div className="expense-title-row">
                  <span className="expense-title">{expense.title}</span>
                  <CategoryBadge category={expense.category} />
                </div>
                {expense.description && (
                  <span className="expense-desc">{expense.description}</span>
                )}
                <span className="expense-date">
                  {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="expense-right">
                <span className="expense-amount">${expense.amount.toLocaleString()}</span>
                <div className="expense-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => onEdit(expense)}
                    aria-label={`Edit ${expense.title}`}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => onDelete(expense.id)}
                    aria-label={`Delete ${expense.title}`}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExpenseList
export { CATEGORY_COLORS }
