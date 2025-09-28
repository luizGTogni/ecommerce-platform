import dayjs from "dayjs";
import {
  IMemcacheRepository,
  ISetProps,
} from "../interfaces/memcache-repository.interface.js";

type Items = {
  key: string;
  value: string;
  expiresAt: Date | null;
};

export class InMemoryMemcacheRepository implements IMemcacheRepository {
  private items: Items[] = [];

  async #refresh() {
    this.items = this.items.filter(
      (item) =>
        !item.expiresAt ||
        (item.expiresAt && dayjs(new Date()).isBefore(item.expiresAt)),
    );
  }

  async set({ key, value, expireAt }: ISetProps) {
    let item: Items = {
      key,
      value,
      expiresAt: expireAt
        ? dayjs(new Date()).add(expireAt, "second").toDate()
        : null,
    };

    this.items.push(item);
  }

  async get(key: string) {
    this.#refresh();
    const item = this.items.find((item) => item.key === key);

    if (!item) {
      return null;
    }

    return item.value;
  }
}
