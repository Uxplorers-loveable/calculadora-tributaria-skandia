export interface FormData {
  acceptedPolicy: boolean;
  documentType: string;
  documentNumber: string;
  salMensual: number;
  tipo: 'Ordinario' | 'Integral';
  hasAuxilios: boolean;
  auxMensual: number;
  hasVariable: boolean;
  variableAnual: number;
  hasBono: boolean;
  bonoAnual: number;
  bonoEsSalarial: boolean;
  fondoTipo: string;
  hasVolOblig: boolean;
  volObligAnual: number;
  numDep: number;
  hasHip: boolean;
  interesesVivienda: number;
  hasSalud: boolean;
  pagosSalud: number;
  comprasFE: number;
  hasPAC: boolean;
  pacEmpresa: number;
  pacPropio: number;
  pacSaldo: number;
  usePACK: boolean;
  hasFVP: boolean;
  fvpTotal: number;
  afcTotal: number;
  selectedContract: string;
}

export const defaultFormData: FormData = {
  documentType: '',
  documentNumber: '',
  salMensual: 0,
  tipo: 'Ordinario',
  hasAuxilios: false,
  auxMensual: 0,
  hasVariable: false,
  variableAnual: 0,
  hasBono: false,
  bonoAnual: 0,
  bonoEsSalarial: false,
  fondoTipo: 'Fondo privado',
  hasVolOblig: false,
  volObligAnual: 0,
  numDep: 0,
  hasHip: false,
  interesesVivienda: 0,
  hasSalud: false,
  pagosSalud: 0,
  comprasFE: 0,
  hasPAC: false,
  pacEmpresa: 0,
  pacPropio: 0,
  pacSaldo: 0,
  usePACK: false,
  hasFVP: false,
  fvpTotal: 0,
  afcTotal: 0,
  selectedContract: '',
};
