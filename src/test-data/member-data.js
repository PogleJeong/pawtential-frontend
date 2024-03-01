const generateRandomId = () => Math.floor(Math.random() * 1000) + 1;

const generateRandomName = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomNickname = () => {
  const nicknames = ['CoolDude', 'AwesomeCoder', 'StarGazer', 'TechGeek', 'Smiley'];
  return nicknames[Math.floor(Math.random() * nicknames.length)];
};

const generateRandomSex = () => (Math.random() < 0.5 ? 'Male' : 'Female');

const generateRandomBirth = () => {
    let year = Math.floor(Math.random() * 40) + 1970;
    let month = Math.floor(Math.random() * 11) + 1;
    let day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day).toLocaleDateString("ko-kr");
}

const generateRandomStatus = () => {
    const statuses = ['정상', '정지', '삭제', '휴면'];
    return statuses[Math.floor(Math.random() * statuses.length)]
}


const generateRandomEmail = (name, domain) => `${name.toLowerCase()}@${domain}`;

export const memberTestData = (count) => {
  const testData = [];
  const emailDomain = 'example.com';

  for (let i = 1; i <= count; i++) {
    const id = generateRandomId();
    const name = generateRandomName();
    const nickname = generateRandomNickname();
    const sex = generateRandomSex();
    const birth = generateRandomBirth();
    const email = generateRandomEmail(name, emailDomain);
    const status = generateRandomStatus();

    testData.push({ id, name, nickname, sex, birth, email, status });
  }

  return testData;
};
