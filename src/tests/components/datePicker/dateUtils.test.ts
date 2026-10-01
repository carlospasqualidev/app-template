import {
  clampMonth,
  getDefaultDateRange,
  isSameDay,
  maskDateDraft,
  parseDateInput,
} from "@/components/form/datePicker/utils";

describe("getDefaultDateRange", () => {
  it("vai de 100 anos antes a 50 anos depois do ano atual, inclusive", () => {
    const { minimumDate, maximumDate } = getDefaultDateRange(
      new Date(2026, 9, 1),
    );
    expect(minimumDate).toEqual(new Date(1926, 0, 1));
    expect(maximumDate).toEqual(new Date(2076, 11, 31));
  });

  it("acompanha o ano corrente quando chamado sem argumento", () => {
    const year = new Date().getFullYear();
    const { minimumDate, maximumDate } = getDefaultDateRange();
    expect(minimumDate.getFullYear()).toBe(year - 100);
    expect(maximumDate.getFullYear()).toBe(year + 50);
  });
});

describe("clampMonth", () => {
  const minimumDate = new Date(1926, 0, 1);
  const maximumDate = new Date(2076, 11, 31);

  it("mantém o mês dentro da faixa", () => {
    expect(clampMonth(new Date(2024, 5, 15), minimumDate, maximumDate)).toEqual(
      new Date(2024, 5, 1),
    );
  });

  it("prende o salto de ano nos meses-limite da faixa", () => {
    expect(clampMonth(new Date(1925, 5, 1), minimumDate, maximumDate)).toEqual(
      new Date(1926, 0, 1),
    );
    expect(clampMonth(new Date(2077, 5, 1), minimumDate, maximumDate)).toEqual(
      new Date(2076, 11, 1),
    );
  });
});

describe("maskDateDraft", () => {
  it("aplica a máscara DD/MM/AAAA conforme digita", () => {
    expect(maskDateDraft("1")).toBe("1");
    expect(maskDateDraft("0101")).toBe("01/01");
    expect(maskDateDraft("01012024")).toBe("01/01/2024");
  });

  it("ignora não-dígitos e limita a 8 dígitos", () => {
    expect(maskDateDraft("01/01/2024999")).toBe("01/01/2024");
  });
});

describe("parseDateInput", () => {
  it("converte uma data completa e válida", () => {
    const result = parseDateInput("15/03/2024", null);
    expect(result).not.toBeNull();
    expect(result?.getFullYear()).toBe(2024);
    expect(result?.getMonth()).toBe(2);
    expect(result?.getDate()).toBe(15);
  });

  it("rejeita data incompleta ou inexistente", () => {
    expect(parseDateInput("15/03", null)).toBeNull();
    expect(parseDateInput("31/02/2024", null)).toBeNull();
    expect(parseDateInput("00/00/2024", null)).toBeNull();
  });
});

describe("isSameDay", () => {
  it("compara apenas o dia, ignorando a hora", () => {
    expect(
      isSameDay(new Date(2024, 0, 1, 8, 0), new Date(2024, 0, 1, 23, 30)),
    ).toBe(true);
    expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
    expect(isSameDay(null, new Date())).toBe(false);
  });
});
