import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast6MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ months: string[]; counts: number[] }> {
  const months: string[] = [];
  const counts: number[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 5; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      0
    ); // Last day of the month
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // First day of the month
    const monthYear = endDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    months.push(monthYear);
    counts.push(count);
  }
  return { months, counts };
}