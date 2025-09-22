import { compare, hash } from "bcryptjs";
import {
  CompareProps,
  HashProps,
  IHasher,
} from "../interfaces/hasher.interface.js";

export class BcryptHasherDriver implements IHasher {
  async hash({ plain, salt }: HashProps) {
    return await hash(plain, (salt = salt ? salt : 6));
  }

  async compare({ plain, hashed }: CompareProps) {
    return await compare(plain, hashed);
  }
}
