import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import useToast from './hooks/useToast'
import './App.css'

const STORAGE_KEY = 'expense_tracker_data'

function loadExpenses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function sortExpenses(expenses, sortBy) {
  return [...expenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':  return a.date.localeCompare(b.date)
      case 'date-desc': return b.date.localeCompare(a.date)
      case 'amount-asc':  return a.amount - b.amount
      case 'amount-desc': return b.amount - a.amount
      default: return 0
    }
  })
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const { toast, showToast } = useToast()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  function handleAddExpense(data) {
    const newExpense = { ...data, id: crypto.randomUUID() }
    setExpenses(prev => [newExpense, ...prev])
    showToast('Expense added!')
  }

  function handleUpdateExpense(data) {
    setExpenses(prev =>
      prev.map(e => (e.id === editingExpense.id ? { ...data, id: e.id } : e))
    )
    setEditingExpense(null)
    showToast('Expense updated!')
  }

  function handleDelete(id) {
    setExpenses(prev => prev.filter(e => e.id !== id))
    showToast('Expense deleted.', 'info')
  }

  function handleSubmit(data) {
    if (editingExpense) {
      handleUpdateExpense(data)
    } else {
      handleAddExpense(data)
    }
  }

  const filtered = sortExpenses(
    filterCategory === 'All' ? expenses : expenses.filter(e => e.category === filterCategory),
    sortBy
  )

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-mark">💰</div>
          <div>
            <h1>Expense Tracker</h1>
            <p className="header-sub">Track, manage, and understand your spending</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="left-col">
          <ExpenseForm
            onSubmit={handleSubmit}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
          <ExpenseSummary expenses={expenses} />
        </div>

        <div className="right-col">
          <ExpenseList
            expenses={filtered}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert">
          {toast.msg}
        </div>
      )}
    </div>
  )
}

export default App
