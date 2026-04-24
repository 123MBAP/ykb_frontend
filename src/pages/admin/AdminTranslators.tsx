import { useEffect, useMemo, useState } from 'react';
import { getBackendAuthHeaders } from '../../utils/backendAuth';

type Language = {
	id: number;
	title: string;
	prices: Record<string, number>;
	createdAt?: string;
	updatedAt?: string;
};

type PriceRow = { unit: string; amount: string };

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api';

async function readApiErrorMessage(res: Response): Promise<string> {
	try {
		const data = (await res.json()) as any;
		const msg = data?.error?.message;
		if (typeof msg === 'string' && msg.trim().length > 0) return msg;
	} catch {
		// ignore
	}
	return `Request failed (${res.status})`;
}

function pricesToRows(prices: Record<string, number>): PriceRow[] {
	return Object.entries(prices)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([unit, amount]) => ({ unit, amount: String(amount) }));
}

function rowsToPrices(rows: PriceRow[]): Record<string, number> {
	const out: Record<string, number> = {};
	for (const row of rows) {
		const unit = row.unit.trim();
		if (!unit) continue;
		const num = Number(row.amount);
		if (!Number.isFinite(num) || num <= 0) continue;
		out[unit] = num;
	}
	return out;
}

export function AdminTranslators() {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const [createTitle, setCreateTitle] = useState('');
	const [createRows, setCreateRows] = useState<PriceRow[]>([{ unit: 'hour', amount: '' }]);
	const [createError, setCreateError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	const [editingId, setEditingId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const [editRows, setEditRows] = useState<PriceRow[]>([]);
	const [editError, setEditError] = useState<string | null>(null);
	const [savingId, setSavingId] = useState<number | null>(null);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const languageById = useMemo(() => {
		const map = new Map<number, Language>();
		languages.forEach((l) => map.set(l.id, l));
		return map;
	}, [languages]);

	const load = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/languages`, {
				headers: { ...getBackendAuthHeaders() },
			});
			if (!res.ok) throw new Error(await readApiErrorMessage(res));
			const json = (await res.json()) as { languages?: Language[] };
			const list = Array.isArray(json.languages) ? json.languages : [];
			setLanguages(list);
			setLoadError(null);
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Failed to load languages';
			setLanguages([]);
			setLoadError(msg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startEdit = (id: number) => {
		const l = languageById.get(id);
		if (!l) return;
		setEditingId(id);
		setEditTitle(l.title);
		setEditRows(pricesToRows(l.prices));
		setEditError(null);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditTitle('');
		setEditRows([]);
		setEditError(null);
	};

	const validate = (title: string, rows: PriceRow[]): string | null => {
		if (!title.trim()) return 'Language title is required.';
		const prices = rowsToPrices(rows);
		if (Object.keys(prices).length === 0) return 'Add at least one price (e.g., hour, week).';
		return null;
	};

	const createLanguage = async () => {
		const err = validate(createTitle, createRows);
		if (err) {
			setCreateError(err);
			return;
		}

		setCreating(true);
		setCreateError(null);
		try {
			const res = await fetch(`${API_BASE}/languages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', ...getBackendAuthHeaders() },
				body: JSON.stringify({ title: createTitle.trim(), prices: rowsToPrices(createRows) }),
			});
			if (!res.ok) throw new Error(await readApiErrorMessage(res));
			const json = (await res.json()) as { language?: Language };
			if (!json.language) throw new Error('Invalid response');
			setLanguages((prev) => [...prev, json.language!].sort((a, b) => a.id - b.id));
			setCreateTitle('');
			setCreateRows([{ unit: 'hour', amount: '' }]);
		} catch (e) {
			setCreateError(e instanceof Error ? e.message : 'Failed to create language');
		} finally {
			setCreating(false);
		}
	};

	const saveEdit = async () => {
		if (editingId == null) return;
		const err = validate(editTitle, editRows);
		if (err) {
			setEditError(err);
			return;
		}

		setSavingId(editingId);
		setEditError(null);
		try {
			const res = await fetch(`${API_BASE}/languages/${editingId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', ...getBackendAuthHeaders() },
				body: JSON.stringify({ title: editTitle.trim(), prices: rowsToPrices(editRows) }),
			});
			if (!res.ok) throw new Error(await readApiErrorMessage(res));
			const json = (await res.json()) as { language?: Language };
			if (!json.language) throw new Error('Invalid response');
			setLanguages((prev) => prev.map((l) => (l.id === editingId ? json.language! : l)));
			cancelEdit();
		} catch (e) {
			setEditError(e instanceof Error ? e.message : 'Failed to save');
		} finally {
			setSavingId(null);
		}
	};

	const deleteLanguage = async (id: number) => {
		setDeletingId(id);
		try {
			const res = await fetch(`${API_BASE}/languages/${id}`, {
				method: 'DELETE',
				headers: { ...getBackendAuthHeaders() },
			});
			if (!res.ok) throw new Error(await readApiErrorMessage(res));
			setLanguages((prev) => prev.filter((l) => l.id !== id));
			if (editingId === id) cancelEdit();
		} catch (e) {
			// Keep it simple: surface the error via loadError area.
			setLoadError(e instanceof Error ? e.message : 'Failed to delete language');
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<main className="pt-16">
			<section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
				<div className="ykb-container">
					<h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Translator Languages</h1>
					<p className="text-lg text-gray-400">
						Manage translation languages and dynamic pricing (hour/week/etc).
					</p>
				</div>
			</section>

			<section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
				<div className="ykb-container space-y-8">
					{loadError ? (
						<div className="ykb-card p-6 border border-red-500/30 bg-red-500/10">
							<p className="text-red-200">{loadError}</p>
						</div>
					) : null}

					<div className="ykb-card p-7">
						<h2 className="text-2xl font-bold text-white mb-4">Add language</h2>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							<div className="lg:col-span-1">
								<label className="block text-sm font-semibold text-gray-200 mb-2">Language title</label>
								<input
									className="ykb-field"
									placeholder="e.g., French"
									value={createTitle}
									onChange={(e) => {
										setCreateTitle(e.target.value);
										setCreateError(null);
									}}
								/>
							</div>

							<div className="lg:col-span-2">
								<label className="block text-sm font-semibold text-gray-200 mb-2">Prices</label>
								<div className="space-y-3">
									{createRows.map((row, idx) => (
										<div key={`create-${idx}`} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
											<input
												className="ykb-field"
												placeholder="unit (hour/week/day)"
												value={row.unit}
												onChange={(e) => {
													const next = [...createRows];
													next[idx] = { ...next[idx], unit: e.target.value };
													setCreateRows(next);
													setCreateError(null);
												}}
											/>
											<input
												className="ykb-field"
												placeholder="price"
												inputMode="numeric"
												value={row.amount}
												onChange={(e) => {
													const next = [...createRows];
													next[idx] = { ...next[idx], amount: e.target.value };
													setCreateRows(next);
													setCreateError(null);
												}}
											/>
											<button
												type="button"
												className="ykb-button-outline h-[46px]"
												onClick={() => setCreateRows((prev) => prev.filter((_, i) => i !== idx))}
												disabled={createRows.length <= 1}
											>
												Remove
											</button>
										</div>
									))}

									<button
										type="button"
										className="ykb-button-outline px-4 py-2"
										onClick={() => setCreateRows((prev) => [...prev, { unit: '', amount: '' }])}
									>
										Add price
									</button>
								</div>
							</div>
						</div>

						{createError ? (
							<div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
								{createError}
							</div>
						) : null}

						<div className="mt-5">
							<button
								type="button"
								onClick={createLanguage}
								disabled={creating}
								className="ykb-button-solid px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{creating ? 'Creating…' : 'Create'}
							</button>
						</div>
					</div>

					<div className="ykb-card p-7">
						<div className="flex items-start justify-between gap-4 mb-4">
							<div>
								<h2 className="text-2xl font-bold text-white">Languages</h2>
								<p className="text-gray-300/80 text-sm">These are used for translator pricing options.</p>
							</div>
							<button type="button" className="ykb-button-outline px-4 py-2" onClick={() => void load()} disabled={loading}>
								{loading ? 'Refreshing…' : 'Refresh'}
							</button>
						</div>

						{loading ? (
							<p className="text-gray-400">Loading…</p>
						) : languages.length === 0 ? (
							<p className="text-gray-400">No languages yet.</p>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{languages.map((l) => {
									const isEditing = editingId === l.id;
									const priceEntries = Object.entries(l.prices ?? {}).sort(([a], [b]) => a.localeCompare(b));
									return (
										<div key={l.id} className="ykb-card p-7">
											{!isEditing ? (
												<>
													<div className="flex items-start justify-between gap-4">
														<div>
															<h3 className="text-xl font-bold text-white">{l.title}</h3>
															<p className="text-gray-400 text-sm">ID: {l.id}</p>
														</div>
														<div className="flex items-center gap-2">
															<button type="button" className="ykb-button-outline px-4 py-2" onClick={() => startEdit(l.id)}>
																Edit
															</button>
															<button
																type="button"
																className="ykb-button-outline px-4 py-2"
																disabled={deletingId === l.id}
																onClick={() => void deleteLanguage(l.id)}
															>
																{deletingId === l.id ? 'Deleting…' : 'Delete'}
															</button>
														</div>
													</div>

													<div className="mt-4 flex flex-wrap gap-2">
														{priceEntries.length === 0 ? (
															<span className="text-sm text-gray-400">No prices</span>
														) : (
															priceEntries.map(([unit, amount]) => (
																<span
																	key={`${l.id}-${unit}`}
																	className="text-sm rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-200"
																>
																	<span className="text-gray-400">{unit}:</span> {amount}
																</span>
															))
														)}
													</div>
												</>
											) : (
												<>
													<div className="flex items-start justify-between gap-4">
														<h3 className="text-xl font-bold text-white">Edit language</h3>
														<button type="button" className="ykb-button-outline px-4 py-2" onClick={cancelEdit}>
															Close
														</button>
													</div>

													<div className="mt-4 space-y-4">
														<div>
															<label className="block text-sm font-semibold text-gray-200 mb-2">Language title</label>
															<input
																className="ykb-field"
																value={editTitle}
																onChange={(e) => {
																	setEditTitle(e.target.value);
																	setEditError(null);
																}}
															/>
														</div>

														<div>
															<label className="block text-sm font-semibold text-gray-200 mb-2">Prices</label>
															<div className="space-y-3">
																{editRows.map((row, idx) => (
																	<div key={`edit-${idx}`} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
																		<input
																			className="ykb-field"
																			placeholder="unit (hour/week/day)"
																			value={row.unit}
																			onChange={(e) => {
																				const next = [...editRows];
																				next[idx] = { ...next[idx], unit: e.target.value };
																				setEditRows(next);
																				setEditError(null);
																			}}
																		/>
																		<input
																			className="ykb-field"
																			placeholder="price"
																			inputMode="numeric"
																			value={row.amount}
																			onChange={(e) => {
																				const next = [...editRows];
																				next[idx] = { ...next[idx], amount: e.target.value };
																				setEditRows(next);
																				setEditError(null);
																			}}
																		/>
																		<button
																			type="button"
																			className="ykb-button-outline h-[46px]"
																			onClick={() => setEditRows((prev) => prev.filter((_, i) => i !== idx))}
																			disabled={editRows.length <= 1}
																		>
																			Remove
																		</button>
																	</div>
																))}
																<button
																	type="button"
																	className="ykb-button-outline px-4 py-2"
																	onClick={() => setEditRows((prev) => [...prev, { unit: '', amount: '' }])}
																>
																	Add price
																</button>
															</div>
														</div>

														{editError ? (
															<div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
																{editError}
															</div>
														) : null}

														<button
															type="button"
															className="ykb-button-solid px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
															onClick={() => void saveEdit()}
															disabled={savingId === l.id}
														>
															{savingId === l.id ? 'Saving…' : 'Save'}
														</button>
													</div>
												</>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
