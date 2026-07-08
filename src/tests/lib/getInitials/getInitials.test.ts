import { getInitials } from "@/lib/getInitials";

describe("getInitials", () => {
  it("usa a primeira e a última palavra", () => {
    expect(getInitials("Maria Silva Souza")).toBe("MS");
  });

  it("usa só a inicial quando há um nome", () => {
    expect(getInitials("Ana")).toBe("A");
  });

  it("normaliza espaços extras", () => {
    expect(getInitials("  joão   pereira  ")).toBe("JP");
  });

  it("retorna vazio para string vazia", () => {
    expect(getInitials("   ")).toBe("");
  });
});
