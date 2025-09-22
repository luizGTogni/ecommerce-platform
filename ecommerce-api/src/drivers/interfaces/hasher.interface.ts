export type HashProps = {
  plain: string;
  salt?: number;
};

export type CompareProps = {
  plain: string;
  hashed: string;
};

export interface IHasher {
  hash(props: HashProps): Promise<string>;
  compare(props: CompareProps): Promise<boolean>;
}
