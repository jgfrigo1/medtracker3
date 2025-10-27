
export interface Medication {
  id: string;
  name: string;
}

export interface HourlyRecord {
  time: string;
  value: number | null;
  medications: string[]; // Array of medication IDs
  comment: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD format
  records: HourlyRecord[];
}
