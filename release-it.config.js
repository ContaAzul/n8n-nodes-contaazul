/* eslint-disable no-template-curly-in-string */
module.exports = {
  git: {
    tagName: 'v${version}',
    commitMessage: 'chore: release v${version}',
    pushRepo: 'git@github.com:ContaAzul/n8n-nodes-contaazul.git',
    tagAnnotation: 'v${version}',
  },
  github: {
    release: true,
    releaseName: 'v${version}',
    tokenRef: 'GH_TOKEN',
  },
  npm: {
    publish: false,
  },
  // plugins: {
  //   './.github/workflows/scripts/conventional-changelog.js': {},
  // },
};
