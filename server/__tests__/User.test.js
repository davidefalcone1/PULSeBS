"use strict"
import User from "../dao/User"

describe("User costructor test", () => {
it('works', () => {
    const obj = new User('275330', 'John Doe', 'john@poltesto.test', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1);
    expect(obj.userID).toBe('275330');
    expect(obj.fullName).toBe('John Doe');
    expect(obj.username).toBe('john@poltesto.test');
    expect(obj.passwordHash).toBe('$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S');
    expect(obj.accessLevel).toBe(1);
  })
});