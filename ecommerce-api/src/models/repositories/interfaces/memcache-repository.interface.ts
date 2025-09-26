export interface IConfigsSetProps {
  EX: number;
}

export interface ISetProps {
  key: string;
  value: string;
  configs: IConfigsSetProps | null;
}

export interface IMemcacheRepository {
  set(props: ISetProps): Promise<void>;
  get(key: string): Promise<string | null>;
}
