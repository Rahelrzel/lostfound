import { useState, FormEvent, ChangeEvent } from 'react';

export interface ReportFormData {
  type: 'LOST' | 'FOUND';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image: File | null;
}

interface Props {
  initialValues?: Partial<ReportFormData> & { imageUrl?: string };
  onSubmit: (data: ReportFormData) => void;
  loading: boolean;
  submitLabel: string;
}

const CATEGORIES = [
  { value: 'Phone', label: '📱 Phone' },
  { value: 'Cars', label: '🚗 Cars' },
  { value: 'Pets', label: '🐾 Pets' },
  { value: 'People', label: '👤 People' },
];

type Errors = Partial<Record<keyof ReportFormData, string>>;

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

export default function ReportForm({ initialValues, onSubmit, loading, submitLabel }: Props) {
  const [values, setValues] = useState<ReportFormData>({
    type: initialValues?.type ?? 'LOST',
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    category: initialValues?.category ?? '',
    location: initialValues?.location ?? '',
    date: initialValues?.date ? initialValues.date.slice(0, 10) : '',
    image: null,
  });
  const [errors, setErrors] = useState<Errors>({});

  function setField<K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.title.trim()) next.title = 'Add a short title.';
    if (!values.description.trim()) next.description = 'Describe what was lost or found.';
    if (!values.category) next.category = 'Pick a category.';
    if (!values.location.trim()) next.location = 'Add where it happened.';
    if (!values.date) next.date = 'Pick a date.';
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    onSubmit(values);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setField('image', e.target.files?.[0] ?? null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <span className={labelClass}>Report type</span>
        <div className="flex gap-2">
          {(['LOST', 'FOUND'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setField('type', type)}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium ${
                values.type === type
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {type === 'LOST' ? 'I lost something' : 'I found something'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className={inputClass}
          value={values.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Black iPhone 13 with a cracked screen"
        />
        {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={inputClass}
          value={values.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Any detail that helps someone recognise it."
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <span className={labelClass}>Category</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setField('category', cat.value)}
              className={`rounded-md border px-3 py-2 text-sm ${
                values.category === cat.value
                  ? 'border-slate-900 bg-slate-50 font-medium text-slate-900'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {errors.category && <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            className={inputClass}
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Bole, near Edna Mall"
          />
          {errors.location && <p className="mt-1.5 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
          />
          {errors.date && <p className="mt-1.5 text-sm text-red-600">{errors.date}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="image">
          Photo
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:border-slate-400"
        />
        {!values.image && initialValues?.imageUrl && (
          <img
            src={initialValues.imageUrl}
            alt="Current photo"
            className="mt-3 h-32 w-32 rounded-md border border-slate-200 object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}