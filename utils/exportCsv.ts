import Papa from "papaparse";

export function exportToCsv<T extends object>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) return;

  const csv = Papa.unparse(data, {
    delimiter: ";", 
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}