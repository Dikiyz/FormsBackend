const system = {
    // CONSOLE
    debugOn: true,
    infoOn: true,
    debug: debug,
    error: error,
    success: successful,

    // TIME
    formatTime: formatTime,
    formatDate: formatDate,
    getTime: getTime
}

function debug(text, ...args) {
    try {
        if (!system.debugOn) return;
        if (args.length > 0) console.log(
            `\x1b[36m[SERVER_DEBUG] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`, args
        );
        else console.log(
            `\x1b[36m[SERVER_DEBUG] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`
        );
    } catch (err) { /* TODO */ }
}

function error(text, ...args) {
    try {
        if (args.length > 0) console.log(
            `\x1b[31m[SERVER_ERROR] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`, args
        );
        else console.log(
            `\x1b[31m[SERVER_ERROR] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`
        );
        // TODO: MySQL write.
    } catch (err) { /* TODO */ }
}

function successful(text, ...args) {
    try {
        if (!system.infoOn) return;
        if (args.length > 0) console.log(
            `\x1b[32m[SERVER_SUCCESSFUL] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`, args
        );
        else console.log(
            `\x1b[32m[SERVER_SUCCESSFUL] ` +
            `\x1b[33m[${getTime()}]` +
            `\x1b[0m: ${text}`
        );
    } catch (err) { /* TODO */ }
}

function getTime() {
    try {
        const date = new Date();
        return `${formatTime(date.getHours(), date.getMinutes())} ${formatDate(date)}`;
    } catch (err) { error(`Time getting error: ` + err); }
}

function formatDate(date) {
    try {
        const day = String(date.getDate());
        const month = String(date.getMonth() + 1);
        return `${day.length === 1 ? `0${day}` : `${day}`}-${month.length === 1 ? `0${month}` : `${month}`}-${date.getFullYear()}`;
    } catch (err) { error(`Time formating error: ` + err); }
}

function formatTime(hours = 0, minutes = 0) {
    try {
        hours = String(hours);
        minutes = String(minutes);
        return `${hours.length === 1 ? `0${hours}` : `${hours}`}:${minutes.length === 1 ? `0${minutes}` : `${minutes}`}`;
    } catch (err) { error(`Time formating error: ` + err); }
}

export default system;