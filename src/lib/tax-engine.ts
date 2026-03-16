// === PARÁMETROS GLOBALES ===
export const UVT = 52374;
export const SMLV = 1750905;
export const MINIMO_INT = 22761765;
export const SALARIO_TOPE = SMLV * 25;
export const TOPE_FE = 240 * UVT;

export const TRAMOS_RENTA = [
  { desde: 0, hasta: 1090, tarifa: 0.00, base: 0 },
  { desde: 1090, hasta: 1700, tarifa: 0.19, base: 0 },
  { desde: 1700, hasta: 4100, tarifa: 0.28, base: 116 },
  { desde: 4100, hasta: 8670, tarifa: 0.33, base: 788 },
  { desde: 8670, hasta: 18970, tarifa: 0.35, base: 2296 },
  { desde: 18970, hasta: 31000, tarifa: 0.37, base: 5901 },
  { desde: 31000, hasta: null as number | null, tarifa: 0.39, base: 10352 },
];

export const TABLA_FSP = [
  { desde: 0, hasta: 6986110.95 * 12, tarifa: 0.000 },
  { desde: 7003620 * 12, hasta: 27996970.95 * 12, tarifa: 0.010 },
  { desde: 28014480 * 12, hasta: 29747875.95 * 12, tarifa: 0.012 },
  { desde: 29765385 * 12, hasta: 31498780.95 * 12, tarifa: 0.014 },
  { desde: 31516290 * 12, hasta: 33249685.95 * 12, tarifa: 0.016 },
  { desde: 33267195 * 12, hasta: 35000590.95 * 12, tarifa: 0.018 },
  { desde: 35018100 * 12, hasta: null as number | null, tarifa: 0.020 },
];

export const formatCOP = (n: number) => Math.round(n).toLocaleString('es-CO');

// === FUNCIONES ===
export function calcularSalarioAnual(salario: number, tipo: 'Ordinario' | 'Integral'): number {
  return tipo === 'Integral' ? salario * 12 : salario * 14.12;
}

export function calcularBaseSegSocial(salAnual: number, variable: number, tipo: string): number {
  return tipo === 'Integral' ? (salAnual + variable) * 0.70 : salAnual + variable;
}

export function calcularBaseSSBono(bono: number, tipo: string, esSalarial: boolean): number {
  if (!esSalarial) return 0;
  return tipo === 'Integral' ? bono * 0.70 : bono;
}

export function calcularAporteEPS(baseSS: number, baseBono: number): number {
  const epsBase = baseSS * 0.04 > SALARIO_TOPE ? SALARIO_TOPE : baseSS * 0.04;
  return epsBase + baseBono * 0.04;
}

export function calcularAportePension(eps: number): number { return eps; }

export function calcularFSP(baseSS: number): number {
  for (const tramo of TABLA_FSP) {
    if (tramo.hasta === null && baseSS >= tramo.desde) return baseSS * tramo.tarifa;
    if (tramo.hasta !== null && baseSS >= tramo.desde && baseSS < tramo.hasta) return baseSS * tramo.tarifa;
  }
  return 0;
}

export function calcularDependientes(numDep: number, salMensual: number): number {
  if (numDep === 0) return 0;
  const topeMensual = UVT * 32;
  return (salMensual * 0.10 > topeMensual ? topeMensual : salMensual) * 12;
}

export function calcularCesantias(salMensual: number, tipo: string): number {
  return tipo === 'Integral' ? 0 : salMensual;
}

export function calcularRentaExentaSinLimite(
  rentaLiquida: number, dep: number, hip: number,
  salud: number, ces: number, afc: number
): number {
  return (rentaLiquida - dep - hip - salud - ces - afc) * 0.25;
}

export function calcularRentaExentaLaboral(reSinLimite: number): number {
  return Math.min(reSinLimite, UVT * 790);
}

export function calcularImpuesto(baseUVT: number): number {
  for (const tramo of TRAMOS_RENTA) {
    if (tramo.hasta === null && baseUVT >= tramo.desde)
      return ((baseUVT - tramo.desde) * tramo.tarifa + tramo.base) * UVT;
    if (tramo.hasta !== null && baseUVT >= tramo.desde && baseUVT < tramo.hasta)
      return ((baseUVT - tramo.desde) * tramo.tarifa + tramo.base) * UVT;
  }
  return 0;
}

export function calcularTopup(
  totalIngresos: number, afcActual: number,
  totalDeducciones: number, maxBeneficio: number
): number {
  const limPct = totalIngresos * 0.30;
  const limUVT = 3800 * UVT;
  const maxAFC = Math.min(limPct, limUVT);
  return Math.min(
    Math.max(maxAFC - afcActual, 0),
    Math.max(maxBeneficio - totalDeducciones, 0)
  );
}

// === TIPOS ===
export interface SimulatorInputs {
  salMensual: number;
  tipo: 'Ordinario' | 'Integral';
  auxMensual: number;
  variableAnual: number;
  bonoAnual: number;
  bonoEsSalarial: boolean;
  volObligAnual: number;
  numDep: number;
  interesesVivienda: number;
  pagosSalud: number;
  comprasFE: number;
  afcTotal: number; // FVP + AFC + PAC (empresa + propio)
}

export interface SimulatorResults {
  totalIngresos: number;
  salAnual: number;
  auxAnual: number;
  variable: number;
  bono: number;
  baseSS: number;
  baseBono: number;
  eps: number;
  pension: number;
  fsp: number;
  incNoCons: number;
  rentaLiq: number;
  rentaLiqPAC: number;
  maxBeneficio: number;
  dep: number;
  hip: number;
  salud: number;
  ces: number;
  afc: number;
  reSinLim: number;
  reLaboral: number;
  totalDed: number;
  dedAdmis: number;
  baseGrav: number;
  baseGravPAC: number;
  baseGravTU: number;
  topeFVP: number;
  topup: number;
  comprasFE: number;
  dedFE1: number;
  dedFE5: number;
  impNormal: number;
  impPAC: number;
  impTopup: number;
  impFE1: number;
  impFE5: number;
  ahorroTopup: number;
  ahorroPAC: number;
  ahorroFE1: number;
  ahorroFE5: number;
}

export function ejecutarSimulador(inputs: SimulatorInputs): SimulatorResults {
  const salAnual = calcularSalarioAnual(inputs.salMensual, inputs.tipo);
  const auxAnual = inputs.auxMensual * 12;
  const variable = inputs.variableAnual;
  const bono = inputs.bonoAnual;
  const totalIng = salAnual + auxAnual + variable + bono;

  const baseSS = calcularBaseSegSocial(salAnual, variable, inputs.tipo);
  const baseBono = calcularBaseSSBono(bono, inputs.tipo, inputs.bonoEsSalarial);
  const eps = calcularAporteEPS(baseSS, baseBono);
  const pension = calcularAportePension(eps);
  const fsp = calcularFSP(baseSS);
  const incNoCons = eps + pension + fsp + inputs.volObligAnual;

  const rentaLiq = totalIng - incNoCons;
  const rentaLiqPAC = totalIng - bono - incNoCons;

  const maxBeneficio = UVT * 1340;

  const dep = calcularDependientes(inputs.numDep, inputs.salMensual);
  const hip = inputs.interesesVivienda;
  const salud = inputs.pagosSalud;
  const ces = calcularCesantias(inputs.salMensual, inputs.tipo);
  const afc = inputs.afcTotal;

  const reSinLim = calcularRentaExentaSinLimite(rentaLiq, dep, hip, salud, ces, afc);
  const reLaboral = calcularRentaExentaLaboral(reSinLim);

  const totalDed = dep + hip + salud + ces + afc + reLaboral;
  const dedAdmis = Math.min(totalDed, maxBeneficio);

  const baseGrav = Math.max(0, totalIng - incNoCons - dedAdmis);
  const baseGravPAC = Math.max(0, totalIng - bono - incNoCons - dedAdmis);

  const impNormal = calcularImpuesto(baseGrav / UVT);
  const impPAC = calcularImpuesto(baseGravPAC / UVT);

  const topup = calcularTopup(totalIng, afc, totalDed, maxBeneficio);
  const dedOptima = Math.min(totalDed + topup, maxBeneficio);
  const baseGravTU = Math.max(0, totalIng - incNoCons - dedOptima);
  const impTopup = calcularImpuesto(baseGravTU / UVT);

  const comprasFE = inputs.comprasFE;
  const dedFE1 = Math.min(comprasFE * 0.01, TOPE_FE);
  const dedFE5 = Math.min(comprasFE * 0.05, TOPE_FE);
  const impFE1 = calcularImpuesto(Math.max(0, baseGravTU - dedFE1) / UVT);
  const impFE5 = calcularImpuesto(Math.max(0, baseGravTU - dedFE5) / UVT);

  const topeFVP = Math.min(totalIng * 0.30, 3800 * UVT);

  return {
    totalIngresos: totalIng,
    salAnual, auxAnual, variable, bono,
    baseSS, baseBono, eps, pension, fsp, incNoCons,
    rentaLiq, rentaLiqPAC, maxBeneficio,
    dep, hip, salud, ces, afc,
    reSinLim, reLaboral, totalDed, dedAdmis,
    baseGrav, baseGravPAC, baseGravTU, topeFVP, topup,
    comprasFE, dedFE1, dedFE5,
    impNormal: Math.round(impNormal),
    impPAC: Math.round(impPAC),
    impTopup: Math.round(impTopup),
    impFE1: Math.round(impFE1),
    impFE5: Math.round(impFE5),
    ahorroTopup: Math.round(impNormal - impTopup),
    ahorroPAC: Math.round(impNormal - impPAC),
    ahorroFE1: Math.round(impTopup - impFE1),
    ahorroFE5: Math.round(impTopup - impFE5),
  };
}
