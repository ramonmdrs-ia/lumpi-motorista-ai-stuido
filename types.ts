
export interface Trip {
  id: string;
  destination: string;
  platform: 'Uber' | '99' | 'iFood' | 'Indriver';
  type: string;
  time: string;
  distance: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Combustível' | 'Manutenção' | 'Alimentação' | 'Seguro';
  time: string;
  date: string;
  amount: number;
  hasReceipt?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  deadline?: string;
  icon: string;
  color: string;
}
