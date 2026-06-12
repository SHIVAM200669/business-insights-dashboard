import React, { useEffect, useState, useCallback } from 'react';
import { 
  getPaginatedRecords, 
  createAnalyticsRecord, 
  updateAnalyticsRecord, 
  deleteAnalyticsRecord 
} from '../services/db';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  FileSpreadsheet,
  XCircle,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DataManagement = () => {
  const { showToast } = useToast();
  
  // Data list & loading state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Query, filter, sorting, pagination state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Form states for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('New Record');
  const [editingId, setEditingId] = useState(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    value: '',
    sales: '',
    revenue: '',
    date: ''
  });

  const [availableCategories, setAvailableCategories] = useState([
    'Electronics', 'SaaS Subscriptions', 'Consulting', 'Office Supplies'
  ]);

  const fetchRecords = useCallback(() => {
    setLoading(true);
    try {
      const response = getPaginatedRecords({
        search,
        category,
        sortBy,
        sortOrder,
        page,
        limit
      });
      setRecords(response.data);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalRecords(response.pagination.total || 0);

      // Collect categories dynamically
      if (response.data.length > 0) {
        const uniqueCats = [...new Set(response.data.map(r => r.category))];
        setAvailableCategories(prev => [...new Set([...prev, ...uniqueCats])]);
      }
    } catch (error) {
      showToast('Failed to fetch analytics records.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, sortOrder, page, limit, showToast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Reset pagination on filter change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryFilter = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
    setPage(1);
  };

  // Open Modal helpers
  const openCreateModal = () => {
    setEditingId(null);
    setModalTitle('Create Analytics Record');
    setFormData({
      category: 'Electronics',
      value: '',
      sales: '',
      revenue: '',
      date: new Date().toISOString().substring(0, 10)
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    setModalTitle(`Edit Record #${record.id}`);
    setFormData({
      category: record.category,
      value: record.value,
      sales: record.sales,
      revenue: record.revenue,
      date: record.date
    });
    setIsModalOpen(true);
  };

  // Create or Update Form Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.value || !formData.sales || !formData.revenue || !formData.date) {
      showToast('Please fill out all record values.', 'error');
      return;
    }

    try {
      if (editingId) {
        updateAnalyticsRecord(editingId, formData);
        showToast('Analytics record updated successfully.', 'success');
      } else {
        createAnalyticsRecord(formData);
        showToast('Analytics record created successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      showToast(error.message || 'Failed to save analytics record.', 'error');
    }
  };

  // Delete Record Handler
  const handleDelete = (id) => {
    if (!window.confirm(`Are you sure you want to delete analytics record #${id}?`)) {
      return;
    }
    try {
      deleteAnalyticsRecord(id);
      showToast('Record deleted successfully.', 'success');
      fetchRecords();
    } catch (error) {
      showToast(error.message || 'Failed to delete record.', 'error');
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    try {
      const response = getPaginatedRecords({ limit: 1000 });
      const allData = response.data;
      
      const headers = ['ID', 'Category', 'Value', 'Sales Units', 'Revenue ($)', 'Date Created', 'Last Updated By'];
      const csvRows = [headers.join(',')];

      for (const row of allData) {
        const values = [
          row.id,
          `"${String(row.category || '').replace(/"/g, '""')}"`,
          row.value,
          row.sales,
          row.revenue,
          row.date,
          `"${String(row.user_name || 'System').replace(/"/g, '""')}"`
        ];
        csvRows.push(values.join(','));
      }

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_export_${new Date().toISOString().substring(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV compilation downloaded successfully.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to compile CSV file.', 'error');
    }
  };

  // PDF Export utility
  const exportToPDF = () => {
    try {
      const response = getPaginatedRecords({ limit: 1000 });
      const allData = response.data;

      const doc = new jsPDF();
      doc.setFont('helvetica');
      
      // Title Banner
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate 900
      doc.text("Enterprise Analytics Data compilation", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate 500
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
      doc.text(`Total Records Extracted: ${allData.length}`, 14, 31);

      // Data table structure
      const tableColumn = ["ID", "Category", "Metric Value", "Units Sold", "Revenue", "Recorded Date", "Modified By"];
      const tableRows = allData.map(r => [
        r.id,
        r.category,
        r.value,
        r.sales,
        `$${parseFloat(r.revenue).toFixed(2)}`,
        r.date,
        r.user_name || 'System'
      ]);

      autoTable(doc, {
        startY: 37,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233] }, // primary 500
        styles: { fontSize: 8.5 }
      });

      doc.save(`analytics_report_${new Date().toISOString().substring(0,10)}.pdf`);
      showToast('PDF compilation downloaded successfully.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to compile PDF file.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-darkbg-800 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-darkbg-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search category/editor..."
              value={search}
              onChange={handleSearchChange}
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
            />
          </div>

          <div className="relative flex items-center bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl px-2">
            <span className="text-gray-400 pl-1"><Filter className="h-4 w-4" /></span>
            <select
              value={category}
              onChange={handleCategoryFilter}
              className="bg-transparent border-transparent py-2 pl-2 pr-6 text-sm text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-0 focus:border-transparent cursor-pointer"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-800 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkbg-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            {exportDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setExportDropdownOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-40 z-30 rounded-xl bg-white dark:bg-darkbg-800 p-1.5 shadow-xl border border-gray-100 dark:border-darkbg-700 flex flex-col gap-0.5">
                  <button 
                    onClick={() => {
                      exportToCSV();
                      setExportDropdownOpen(false);
                    }} 
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-darkbg-900 rounded-lg text-left"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    <span>Export CSV</span>
                  </button>
                  <button 
                    onClick={() => {
                      exportToPDF();
                      setExportDropdownOpen(false);
                    }} 
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-darkbg-900 rounded-lg text-left"
                  >
                    <FileDown className="h-4 w-4 text-rose-500" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-sm font-bold text-white shadow-md shadow-primary-500/10 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
        </div>

      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-darkbg-800 rounded-2xl shadow-sm border border-gray-150 dark:border-darkbg-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 dark:border-darkbg-700 bg-gray-50/50 dark:bg-darkbg-900/40 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1.5">
                    <span>Category</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('value')}>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span>Metric Value</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('sales')}>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span>Units Sold</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span>Revenue</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5 select-none cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-5">Modified By</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-darkbg-700 text-sm">
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-5"><div className="h-4 w-6 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-12 bg-gray-200 dark:bg-darkbg-700 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-12 bg-gray-200 dark:bg-darkbg-700 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-200 dark:bg-darkbg-700 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                    <td className="py-4 px-5"><div className="h-4 w-14 bg-gray-200 dark:bg-darkbg-700 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <XCircle className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="font-semibold text-gray-600 dark:text-gray-350">No data records found</p>
                      <p className="text-xs text-gray-400 mt-1">Try clearing filters or adding records</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-darkbg-900/20 text-gray-800 dark:text-gray-200 transition-colors">
                    <td className="py-3 px-5 font-mono text-xs">{record.id}</td>
                    <td className="py-3 px-5 font-semibold">{record.category}</td>
                    <td className="py-3 px-5 text-right font-medium">{record.value}</td>
                    <td className="py-3 px-5 text-right font-medium">{record.sales}</td>
                    <td className="py-3 px-5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      ${parseFloat(record.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-5 text-gray-550 dark:text-gray-400">{record.date}</td>
                    <td className="py-3 px-5">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-darkbg-700 rounded-lg text-gray-600 dark:text-gray-300 font-medium">
                        {record.user_name || 'System'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-darkbg-700 dark:hover:text-primary-400 rounded-lg transition"
                          title="Edit Row"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500 dark:hover:bg-darkbg-700 dark:hover:text-rose-450 rounded-lg transition"
                          title="Delete Row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-150 dark:border-darkbg-700 px-5 py-3.5 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing <span className="font-bold text-gray-700 dark:text-gray-200">{records.length}</span> of <span className="font-bold text-gray-700 dark:text-gray-200">{totalRecords}</span> items
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-800 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-gray-700 dark:text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-800 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              list="categories-datalist"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="E.g. Electronics, consulting..."
              className="block w-full px-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
            />
            <datalist id="categories-datalist">
              {availableCategories.map((c, i) => <option key={i} value={c} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Metric Value
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="450"
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Units Sold
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.sales}
                onChange={(e) => setFormData(prev => ({ ...prev, sales: e.target.value }))}
                placeholder="120"
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Revenue ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                placeholder="4500.00"
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Recorded Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-darkbg-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-850 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-sm font-bold text-white transition shadow-md shadow-primary-500/10"
            >
              Save Record
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default DataManagement;
