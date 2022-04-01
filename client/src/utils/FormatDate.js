const FormatDate = timestamp => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
}

export default FormatDate;