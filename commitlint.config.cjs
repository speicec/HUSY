module.exports = {
    ignores: [(commit) => commit.includes('init')],
    // 继承的规则
    extends: ['@commitlint/config-conventional'],
    // 自定义规则
    rules: {
        // @see: https://commitlint.js.org/#/reference-rules
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 108],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'subject-case': [0],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'wip',
                'types',
                'bug',
                'fix',
                'style',
                'perf',
                'refactor',
                'test',
                'ui',
                'docs',
                'merge',
                'revert',
                'chore',
                'workflow',
                'build',
                'release',
                'deploy',
                'ci'
            ]
        ]

    },

};
