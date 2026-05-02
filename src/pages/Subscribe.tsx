import { useMemo, useState, type FormEvent } from 'react';
import { CreditCard, Smartphone, BadgeCheck } from 'lucide-react';

type PaymentMethod = 'card' | 'mobileMoney';

type CardBrand = 'Visa' | 'Mastercard' | 'Unknown';

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatCardNumber(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function detectCardBrand(raw: string): CardBrand {
  const digits = onlyDigits(raw);
  if (!digits) return 'Unknown';

  // Visa: starts with 4
  if (digits.startsWith('4')) return 'Visa';

  // Mastercard: 51-55 or 2221-2720
  const first2 = Number(digits.slice(0, 2));
  if (first2 >= 51 && first2 <= 55) return 'Mastercard';

  const first4 = Number(digits.slice(0, 4));
  if (first4 >= 2221 && first4 <= 2720) return 'Mastercard';

  return 'Unknown';
}

function brandBadgeClasses(brand: CardBrand): string {
  if (brand === 'Visa') return 'border-primary/30 bg-primary/10 text-primary';
  if (brand === 'Mastercard') return 'border-secondary/30 bg-secondary/10 text-secondary';
  return 'border-border bg-surface text-textSecondary';
}

export function Subscribe() {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [amountRwf, setAmountRwf] = useState('5000');

  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    email: '',
  });

  const [mobileMoney, setMobileMoney] = useState({
    network: 'MTN MoMo',
    phone: '',
    name: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const brand = useMemo(() => detectCardBrand(card.number), [card.number]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-16 bg-white text-gray-900">
      <section className="border-b border-border bg-white py-8">
        <div className="ykb-container">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">Choose the best payment method fit for you</p>
            <h1 className="text-3xl font-semibold text-primary md:text-4xl">Subscribe</h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-textSecondary">
              Make a subscription payment to access premium concierge services. 
            </p>
          </div>
        </div>
      </section>

      <section className="ykb-section bg-dark-light">
        <div className="ykb-container">
          <div className="max-w-3xl mx-auto">
            <div className="ykb-card">
              {!submitted ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Checkout</h2>
                      <p className="text-textSecondary">Complete subscription payment (mocked).</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-textSecondary">Amount (RWF)</span>
                      <input
                        value={amountRwf}
                        onChange={(e) => setAmountRwf(onlyDigits(e.target.value).slice(0, 8))}
                        className="ykb-field w-40"
                        inputMode="numeric"
                        aria-label="Subscription amount in RWF"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${
                        method === 'card'
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border bg-surface text-textSecondary hover:bg-surface/70 hover:border-secondary/30'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Card (Visa/Mastercard)
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('mobileMoney')}
                      className={`flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${
                        method === 'mobileMoney'
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border bg-surface text-textSecondary hover:bg-surface/70 hover:border-secondary/30'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Mobile Money
                    </button>
                  </div>

                  <form onSubmit={submit} className="mt-6 space-y-5">
                    {method === 'card' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-primary">Card payment</h3>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${brandBadgeClasses(
                              brand
                            )}`}
                          >
                            <CreditCard className="w-4 h-4" />
                            {brand === 'Unknown' ? 'Card type: —' : `Card type: ${brand}`}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="cardNumber">
                            Card number
                          </label>
                          <input
                            id="cardNumber"
                            required
                            value={card.number}
                            onChange={(e) =>
                              setCard((p) => ({
                                ...p,
                                number: formatCardNumber(e.target.value),
                              }))
                            }
                            className="ykb-field"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="cardName">
                              Name on card
                            </label>
                            <input
                              id="cardName"
                              required
                              value={card.name}
                              onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                              className="ykb-field"
                              autoComplete="cc-name"
                              placeholder="e.g., Jean Paul"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="cardEmail">
                              Email (receipt)
                            </label>
                            <input
                              id="cardEmail"
                              type="email"
                              value={card.email}
                              onChange={(e) => setCard((p) => ({ ...p, email: e.target.value }))}
                              className="ykb-field"
                              autoComplete="email"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="expiry">
                              Expiry (MM/YY)
                            </label>
                            <input
                              id="expiry"
                              required
                              value={card.expiry}
                              onChange={(e) => {
                                const cleaned = e.target.value.replace(/[^0-9/]/g, '').slice(0, 5);
                                setCard((p) => ({ ...p, expiry: cleaned }));
                              }}
                              className="ykb-field"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              placeholder="MM/YY"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="cvv">
                              CVV
                            </label>
                            <input
                              id="cvv"
                              required
                              value={card.cvv}
                              onChange={(e) => setCard((p) => ({ ...p, cvv: onlyDigits(e.target.value).slice(0, 4) }))}
                              className="ykb-field"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <p className="text-sm text-textSecondary">
                          Note: This is a mocked UI — no real payment is processed yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Mobile Money</h3>

                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="network">
                            Network
                          </label>
                          <select
                            id="network"
                            value={mobileMoney.network}
                            onChange={(e) => setMobileMoney((p) => ({ ...p, network: e.target.value }))}
                            className="ykb-field"
                          >
                            <option value="MTN MoMo">MTN MoMo</option>
                            <option value="Airtel Money">Airtel Money</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="mmName">
                              Full name
                            </label>
                            <input
                              id="mmName"
                              required
                              value={mobileMoney.name}
                              onChange={(e) => setMobileMoney((p) => ({ ...p, name: e.target.value }))}
                              className="ykb-field"
                              placeholder="e.g., Aline"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="mmEmail">
                              Email (optional)
                            </label>
                            <input
                              id="mmEmail"
                              type="email"
                              value={mobileMoney.email}
                              onChange={(e) => setMobileMoney((p) => ({ ...p, email: e.target.value }))}
                              className="ykb-field"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="mmPhone">
                            Mobile Money phone number
                          </label>
                          <input
                            id="mmPhone"
                            required
                            value={mobileMoney.phone}
                            onChange={(e) => setMobileMoney((p) => ({ ...p, phone: e.target.value }))}
                            className="ykb-field"
                            placeholder="e.g., 0798 891 543"
                          />
                        </div>

                        <p className="text-sm text-textSecondary">
                          Note: This is mocked — later we can integrate a real MoMo payment provider/API.
                        </p>
                      </div>
                    )}

                    <button type="submit" className="w-full ykb-button-solid">
                      Subscribe (Mock)
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-5">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Subscription submitted</h2>
                      <p className="text-textSecondary">
                        This is a mocked confirmation screen. No real charge happened.
                      </p>
                      <p className="mt-2 text-sm text-textSecondary">
                        Method: {method === 'card' ? 'Card' : 'Mobile Money'} · Amount: {amountRwf || '0'} RWF
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="ykb-button-outline"
                  >
                    Make another payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
