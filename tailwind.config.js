/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        // 内边距
        padding: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = `${index}px`;
            return map;
        }, {}),
        // 外边距
        spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = `${index}px`;
            return map;
        }, {}),
        // 圆角
        borderRadius: Array.from({ length: 100 }).reduce((map, _, index) => {
            map[index] = `${index}px`;
            return map;
        }, {}),
        extend: {
            // 宽度
            width: Array.from({ length: 1500 }).reduce((map, _, index) => {
                map[index] = `${index}px`;
                return map;
            }, {}),
            // 高度
            height: Array.from({ length: 1500 }).reduce((map, _, index) => {
                map[index] = `${index}px`;
                return map;
            }, {}),
            // 字体大小
            fontSize: Array.from({ length: 100 }).reduce((map, _, index) => {
                map[index] = `${index}px`;
                return map;
            }, {}),
            // 行高
            lineHeight: Array.from({ length: 1000 }).reduce((map, _, index) => {
                map[index] = `${index}px`;
                return map;
            }, {})
        }
    },
    plugins: []
};

