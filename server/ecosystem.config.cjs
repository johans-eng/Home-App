module.exports = {
  apps: [{
    name: 'home-app-server',
    script: 'npx',
    args: 'tsx src/index.ts',
    cwd: __dirname,
    watch: false,
    autorestart: true,
    restart_delay: 1000,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
