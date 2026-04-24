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
  return 'border-white/10 bg-white/5 text-gray-300';
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
    <main className="pt-16">
      <section className="bg-black border-b border-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="ykb-container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
            Service Provider Subscription
          </h1>
          <p className="text-lg text-gray-400">
            Mocked subscription checkout. Choose Card (Visa/Mastercard) or Mobile Money.
          </p>
        </div>
      </section>

      <section className="ykb-section px-4 sm:px-6 lg:px-8 bg-dark-light">
        <div className="ykb-container">
          <div className="max-w-3xl mx-auto">
            <div className="ykb-card">
              {!submitted ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Checkout</h2>
                      <p className="text-gray-300/80">Complete subscription payment (mocked).</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Amount (RWF)</span>
                      <input
                        value={amountRwf}
                        onChange={(e) => setAmountRwf(onlyDigits(e.target.value).slice(0, 8))}
                        className="ykb-field w-40"
                        inputMode="numeric"
                        aria-label="Subscription amount in RWF"
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                        method === 'card'
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Card (Visa/Mastercard)
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('mobileMoney')}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                        method === 'mobileMoney'
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Mobile Money
                    </button>
                  </div>

                  <form onSubmit={submit} className="mt-7 space-y-6">
                    {method === 'card' ? (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-white">Card payment</h3>
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
                          <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cardNumber">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cardName">
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
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cardEmail">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="expiry">
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
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cvv">
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

                        <p className="text-sm text-gray-400">
                          Note: This is a mocked UI — no real payment is processed yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <h3 className="text-lg font-bold text-white">Mobile Money</h3>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="network">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="mmName">
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
                            <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="mmEmail">
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
                          <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="mmPhone">
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

                        <p className="text-sm text-gray-400">
                          Note: This is mocked — later we can integrate a real MoMo payment provider/API.
                        </p>
                      </div>
                    )}

                    <button type="submit" className="w-full ykb-button-solid py-3 px-6">
                      Subscribe (Mock)
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-6">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">Subscription submitted</h2>
                      <p className="text-gray-300/80">
                        This is a mocked confirmation screen. No real charge happened.
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Method: {method === 'card' ? 'Card' : 'Mobile Money'} · Amount: {amountRwf || '0'} RWF
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="ykb-button-outline px-6 py-3"
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
