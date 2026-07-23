'use client';
import { useToast } from '@/components/ui/Toast';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Upload } from 'lucide-react';

interface Category {
  id: string;
  category_name: string;
}

interface ExpenseFormProps {
  budgetId: string;
  categories: Category[];
  onSubmit: (expense: any) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ 
  budgetId, 
  categories, 
  onSubmit, 
  onCancel 
}: ExpenseFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: '',
    amount: '',
    category_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'paid'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/budget/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget_id: budgetId,
          amount: parseFloat(formData.amount)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.details || errorData.error || 'Failed to add expense';
        throw new Error(errorMsg);
      }

      const data = await response.json();
      onSubmit(data.expense);

      // Reset form
      setFormData({
        expense_name: '',
        amount: '',
        category_id: '',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
        status: 'paid'
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast(`Failed to add expense: ${error instanceof Error ? error.message : 'Please try again.'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Expense Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Name *
            </label>
            <input
              type="text"
              name="expense_name"
              value={formData.expense_name}
              onChange={handleChange}
              required
              placeholder="e.g., Venue Deposit, Catering Payment"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date *
              </label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partially_paid">Partially Paid</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Additional details about this expense..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Receipt Upload (Future Feature) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt (Coming Soon)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Receipt upload with OCR coming soon</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
