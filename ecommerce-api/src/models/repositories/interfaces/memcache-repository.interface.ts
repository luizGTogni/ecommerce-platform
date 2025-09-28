export interface ISetProps {
  key: string;
  value: string;
  expireAt: number | null;
}

export interface IMemcacheRepository {
  set(props: ISetProps): Promise<void>;
  get(key: string): Promise<string | null>;
}
