export interface Filter {
  column: string;
  value: string | number | boolean | null;
  operator?:
    | 'eq'
    | 'not'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte'
    | 'like'
    | 'ilike'
    | 'is';
}
