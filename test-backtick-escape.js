// 测试在模板字符串中使用反引号的正确方法

const test1 = `这是一个测试: \`app.compound.finance\` 使用转义的反引号`;

const test2 = String.raw`这是代码块:
\`\`\`
代码示例
\`\`\`
`;

console.log('Test 1:', test1);
console.log('Test 2:', test2);
