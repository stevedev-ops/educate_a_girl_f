import init from './init.js';

// Initialize database, then start server
init().then(() => {
    import('./server.js');
}).catch(err => {
    console.error('Failed to initialize:', err);
    process.exit(1);
});

