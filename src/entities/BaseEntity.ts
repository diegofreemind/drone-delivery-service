import { v4 } from 'uuid';

export abstract class BaseEntity {
  constructor(private id?: string) {
    if (!id) {
      this.id = v4();
    }
  }

  get getId() {
    return this.id;
  }
}
