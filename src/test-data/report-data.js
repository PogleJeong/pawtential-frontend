// 테스트 데이터 생성 함수
export function reportTestData(count) {
    const borders = ['market', 'pawtens'];
    const categories = ['욕설 및 부적절', '광고', '기타'];
    const testData = [];

    for (let i = 1; i <= count; i++) {
        testData.push({
            report_id: i,
            reporter: `Reporter${i}`,
            border: borders[i % borders.length],
            border_id: i,
            writer: `Writer${i}`,
            category: categories[i % categories.length], // "a", "b", "c", "d"로 순환하면서 설정
            title: `Report Title ${i}`,
            content: `Report Content ${i}`,
            wdate: new Date().toLocaleDateString("ko-kr"),
        });
    }

    return testData;
};

// 테스트 데이터 생성 함수
export function reportResultTestData(count) {
    const borders = ['market', 'pawtens'];
    const categories = ['욕설 및 부적절', '광고', '기타'];
    const statuses = ['삭제', '취소'];
    const managers = ['manager1', 'manager2', 'manager3'];
    const testData = [];

    for (let i = 1; i <= count; i++) {
        testData.push({
            report_id: i,
            reporter: `Reporter${i}`,
            border: borders[i % borders.length],
            border_id: i,
            category: categories[i % categories.length], // "a", "b", "c", "d"로 순환하면서 설정
            title: `Report Title ${i}`,
            content: `Report Content ${i}`,
            wdate: new Date().toLocaleDateString("ko-kr"),
            status: statuses[i % statuses.length],
            manager: managers[i % managers.length],

        });
    }

    return testData;
};
