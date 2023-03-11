export function getMonthsSince(startDateStr: string): string[] {
    const startDate = new Date(startDateStr);
    const currentDate = new Date();
    const monthsDiff = monthDifference(startDate, currentDate);

    return Array.from({ length: monthsDiff }, (_, i) =>
        formatYearMonth(addMonths(startDate, i))
    );
}



//// helpers 
function monthDifference(date1: Date, date2: Date): number {
    return (date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth();
}

function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setUTCMonth(newDate.getUTCMonth() + months);
    return newDate;
}

function formatYearMonth(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const monthString = month.toString().padStart(2, "0");
    return `${monthString}_${year}`;
}