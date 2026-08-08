// Manual grouping rather than Intl.NumberFormat("es-ES") — some runtimes
// ship without full ICU locale data and silently skip thousands grouping
// (e.g. "1560" instead of "1.560"). This is dependency-free and always
// correct: "." for thousands, "," for decimals, matching es-ES.
export function formatPrice(amount: number): string {
  const [integer, decimal] = amount.toFixed(2).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimal === "00" ? `${grouped} €` : `${grouped},${decimal} €`;
}
