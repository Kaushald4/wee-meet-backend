export const generateMeetingLink = () => {
    let meetingLink = [];
    let templateStr = "abcdefghijklmnopqrstuvwxyz";

    Array(10)
        .fill(0)
        .forEach(() => {
            meetingLink.push(
                templateStr[Math.floor(Math.random() * templateStr.length)]
            );
        });

    return meetingLink.reduce((prev, curr, i) => {
        if (i <= 2) {
            return prev + curr;
        } else if (i === 3) {
            return prev + "-" + curr;
        } else if (i <= 6) {
            return prev + curr;
        } else if (i === 7) {
            return prev + "-" + curr;
        }
        return prev + curr;
    }, "");
};
