const fs = require('fs');

// 读取文件
let content = fs.readFileSync('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'utf8');

// 找到所有在模板字符串中的反引号并转义
// 策略:在 content: ` 和匹配的 ` 之间的所有反引号都需要转义

// 先统计有多少个 content: ` 开始的模板字符串
const matches = content.match(/content: `/g);
console.log('找到模板字符串数量:', matches ? matches.length : 0);

// 简单粗暴的方法:将 content 字段内的所有反引号转义
// 1. 找到 "content: `" 的位置
// 2. 找到对应的结束反引号（在 },或文件末尾前）
// 3. 在这个范围内转义所有反引号

// 更简单的方法:替换文件中 HTML 形式的反引号
content = content.replace(/```/g, '```');  // 代码块标记保持
content = content.replace(/`([^`\n]+)`/g, '\\`$1\\`');  // 内联代码

// 保存
fs.writeFileSync('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2-fixed2.js', content);

console.log('已生成修复文件: add-strategies-6-1-and-6-2-fixed2.js');
console.log('请测试该文件...');
