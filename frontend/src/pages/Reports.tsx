import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchReports } from '../features/reports/reportsSlice';
import { Category, ReportType } from '../types';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ReportCard from '../components/ReportCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function Reports() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.reports);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const activeType = (searchParams.get('type') as ReportType | null) ?? null;
  const activeCategory = (searchParams.get('category') as Category | null) ?? null;
  const search = searchParams.get('search') ?? '';
  const location = searchParams.get('location') ?? '';

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    return items
      .filter((r) => (activeType ? r.type === activeType : true))
      .filter((r) => (activeCategory ? r.category === activeCategory : true))
      .filter((r) => (location ? r.location.toLowerCase().includes(location.toLowerCase()) : true))
      .filter((r) =>
        search
          ? r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, activeType, activeCategory, search, location]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Browse Reports</h1>

      <div className="space-y-3 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={(v) => updateParam('search', v || null)} />
          </div>
          <input
            value={location}
            onChange={(e) => updateParam('location', e.target.value || null)}
            placeholder="Location"
            className="md:w-48 border border-gray-300 rounded-md px-4 py-2 text-sm"
          />
        </div>

        <FilterBar
          activeType={activeType}
          activeCategory={activeCategory}
          onTypeChange={(t) => updateParam('type', t)}
          onCategoryChange={(c) => updateParam('category', c)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}