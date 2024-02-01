export const dateFormat = (dateObject) => {
    const current = new Date();
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth();
    const currentDay = current.getDay();

    const isSameDay = currentYear === dateObject.getFullYear() && currentMonth === dateObject.getMonth() && currentDay === dateObject.getDay();
    if (isSameDay) {
        return dateObject.getHours() + ":" + dateObject.getMinutes();
    } else {
        if (currentYear === dateObject.getFullYear()) {
            return `${dateObject.getMonth}-${dateObject.getDay()}`;
        }
        return `${dateObject.getFullYear()}-${dateObject.getMonth}-${dateObject.getDay()}`;
    }
}