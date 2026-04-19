import { useState, useEffect } from 'react'

const CATEGORIES = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other']

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Food',
  amount: '',
  date: new Date().toISOString().split('T')[0],
}

function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        description: editingExpense.description,
        category: editingExpense.category,
        amount: String(editingExpense.amount),
        date: editingExpense.date,
      })
      setErrors({})
    } else {
      setForm(EMPTY_FORM)
      setErrors({})
    }
  }, [editingExpense])

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.amount) {
      errs.amount = 'Amount is required.'
    } else if (!/^\d+$/.test(form.amount.trim())) {
      errs.amount = 'Amount must be a whole number (integer).'
    } else if (parseInt(form.amount, 10) <= 0) {
      errs.amount = 'Amount must be greater than zero.'
    }
    if (!form.date) errs.date = 'Date is required.'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      amount: parseInt(form.amount, 10),
      date: form.date,
    })
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setErrors({})
    onCancelEdit()
  }

  const isEditing = Boolean(editingExpense)

  return (
    <div className={`expense-form-card ${isEditing ? 'editing' : ''}`}>
      <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Grocery run"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($) <span className="required">*</span></label>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="numeric"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 50"
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date <span className="required">*</span></label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </div>

        <div className="form-actions">
          {isEditing && (
            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
export { CATEGORIES }
